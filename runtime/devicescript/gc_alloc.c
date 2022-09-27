// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "jacs_internal.h"

STATIC_ASSERT(sizeof(jacs_array_t) == sizeof(jacs_map_t));

extern jacs_ctx_t *_jacs_ctx;

#define ROOT_SCAN_DEPTH 10

#if JD_64
#define TAG_POS (24 + 32)
#else
#define TAG_POS 24
#endif

#define TAG_MASK_PENDING 0x80
#define TAG_MASK_SCANNED 0x20
#define TAG_MASK_PINNED 0x40
#define TAG_MASK 0xf

#define TAG_FREE 0x1
#define TAG_BUFFER 0x2
#define TAG_ARRAY 0x3
#define TAG_MAP 0x4
#define TAG_FINAL (0xf | TAG_MASK_PINNED)

#define GET_TAG(p) ((p) >> TAG_POS)
#define BASIC_TAG(p) (GET_TAG(p) & TAG_MASK)
#define IS_FREE(header) (BASIC_TAG(header) == TAG_FREE)

#define BLOCK_SIZE(p) ((p)&0xffffff)

typedef struct _free_jacs_gc_block_t {
    jacs_gc_object_t gc;
    struct _jacs_gc_block_t *next;
} free_jacs_gc_block_t;

typedef struct _jacs_gc_block_t {
    union {
        struct {
            uintptr_t header;
            uint8_t data[0];
        };
        free_jacs_gc_block_t free;
        jacs_gc_object_t gc;
        jacs_array_t array;
        jacs_map_t map;
    };
} block_t;

typedef struct _jacs_gc_chunk_t {
    struct _jacs_gc_chunk_t *next;
    block_t *end; // GET_TAG(end) == TAG_FINAL
    block_t start[0];
} chunk_t;

struct _jacs_gc_t {
    block_t *first_free;
    chunk_t *first_chunk;
    uint32_t num_alloc;
    jacs_ctx_t *ctx;
};

static void mark_block(block_t *block, uint8_t tag, unsigned size) {
    block->header = size | ((uintptr_t)tag << TAG_POS);
}

static inline uintptr_t *block_ptr(block_t *block) {
    return (uintptr_t *)block;
}

void jacs_gc_add_chunk(jacs_gc_t *gc, void *start, unsigned size) {
    JD_ASSERT(size > sizeof(chunk_t) + 128);
    chunk_t *ch = start;
    ch->end =
        (block_t *)((uintptr_t)((uint8_t *)start + size) & ~(JD_PTRSIZE - 1) - sizeof(uintptr_t));
    mark_block(ch->end, TAG_FINAL, 1);
    mark_block(ch->start, TAG_FREE, block_ptr(ch->end) - block_ptr(ch->start));
    ch->next = gc->first_chunk;
    gc->first_chunk = ch;
}

static void scan(jacs_ctx_t *ctx, block_t *block, int depth);

static void scan_value(jacs_ctx_t *ctx, value_t v, int depth) {
    if (jacs_handle_type(v) & JACS_HANDLE_IS_GC_POINTER_MASK) {
        block_t *b = jacs_handle_ptr_value(ctx, v);
        if (b)
            scan(ctx, b, depth);
    }
}

static void scan_array(jacs_ctx_t *ctx, value_t *vals, unsigned length, int depth) {
    for (unsigned i = 0; i < length; ++i) {
        scan_value(ctx, vals[i], depth);
    }
}

static void scan(jacs_ctx_t *ctx, block_t *block, int depth) {
    uintptr_t header = block->header;

    if (IS_FREE(header) || GET_TAG(header) & TAG_MASK_SCANNED)
        return;

    if (depth <= 0) {
        block->header |= (uintptr_t)TAG_MASK_PENDING << TAG_POS;
        return;
    }

    block->header |= (uintptr_t)TAG_MASK_SCANNED << TAG_POS;
    block->header &= ~((uintptr_t)TAG_MASK_PENDING << TAG_POS);

    depth--;

    switch (BASIC_TAG(header)) {
    case TAG_BUFFER:
        break;
    case TAG_ARRAY:
    case TAG_MAP:
        scan_array(ctx, block->array.data, block->array.length, depth);
        break;
    default:
        oops();
        break;
    }
}

static void mark_roots(jacs_gc_t *gc) {
    if (gc->ctx == NULL)
        return;
    jacs_ctx_t *ctx = gc->ctx;
    scan_array(ctx, ctx->globals, ctx->img.header->num_globals, ROOT_SCAN_DEPTH);
    for (jacs_fiber_t *fib = ctx->fibers; fib; fib = fib->next) {
        scan_value(ctx, fib->ret_val, ROOT_SCAN_DEPTH);
        for (jacs_activation_t *act = fib->activation; act; act = act->caller) {
            if (act->params_is_copy)
                scan_array(ctx, act->params, act->num_params, ROOT_SCAN_DEPTH);
            scan_array(ctx, act->locals, act->func->num_locals, ROOT_SCAN_DEPTH);
        }
    }
}

static inline unsigned block_size(block_t *b) {
    unsigned sz = BLOCK_SIZE(b->header);
    JD_ASSERT(sz > 0);
    return sz;
}

static inline block_t *next_block(block_t *block) {
    return (block_t *)(block_ptr(block) + block_size(block));
}

static inline bool can_free(uintptr_t header) {
    uint8_t tag = GET_TAG(header);
    return tag == TAG_FREE || (tag & (TAG_MASK_SCANNED | TAG_MASK_PINNED)) == 0;
}

static void sweep(jacs_gc_t *gc) {
    int sweep = 0;
    block_t *prev = NULL;
    gc->first_free = NULL;

    for (;;) {
        int had_pending = 0;
        for (chunk_t *chunk = gc->first_chunk; chunk; chunk = chunk->next) {
            for (block_t *block = chunk->start;; block = next_block(block)) {
                uintptr_t header = block->header;
                if (GET_TAG(header) == TAG_FINAL)
                    break;
                JD_ASSERT(block < chunk->end);
                if (GET_TAG(header) & TAG_MASK_PENDING) {
                    JD_ASSERT(!sweep);
                    had_pending = 1;
                    scan(gc->ctx, block, ROOT_SCAN_DEPTH);
                } else if (sweep) {
                    block_t *p = block;
                    while (can_free(p->header))
                        p = next_block(p);
                    if (p != block) {
                        unsigned new_size = block_ptr(p) - block_ptr(block);
                        mark_block(block, TAG_FREE, new_size);
                        memset(block->data, 0x37, (block_size(block) - 1) * sizeof(uintptr_t));
                        if (prev == NULL) {
                            gc->first_free = block;
                        } else {
                            prev->free.next = block;
                        }
                        block->free.next = NULL;
                        prev = block;
                    } else {
                        block->header = block->header & ~((uintptr_t)TAG_MASK_SCANNED << TAG_POS);
                    }
                }
            }
        }
        if (sweep)
            break;
        if (!had_pending)
            sweep = 1;
    }
}

static void jacs_gc(jacs_gc_t *gc) {
    mark_roots(gc);
    sweep(gc);
}

static block_t *find_free_block(jacs_gc_t *gc, uint8_t tag, uint32_t words) {
    block_t *prev = NULL;
    for (block_t *b = gc->first_free; b; prev = b, b = b->free.next) {
        unsigned bsz = block_size(b);
        int left = bsz - words;
        if (left <= 0)
            continue;

        block_t *next;
        if (left > 2) {
            // split block
            mark_block(b, tag, words + 1);
            next = next_block(b);
            mark_block(next, TAG_FREE, left - 1);
            next->free.next = b->free.next;
        } else {
            mark_block(b, tag, block_size(b));
            next = b->free.next;
        }

        if (prev == NULL) {
            gc->first_free = next;
        } else {
            prev->free.next = next;
        }

        return b;
    }

    return NULL;
}

static block_t *alloc_block(jacs_gc_t *gc, uint8_t tag, uint32_t size) {
    unsigned words = (size + JD_PTRSIZE - 1) / JD_PTRSIZE;

    // if jd_free() is supported we check stack often at the beginning and less often later
    gc->num_alloc++;
    if (gc->num_alloc < 32 || (gc->num_alloc & 31) == 0)
        jd_alloc_stack_check();

    block_t *b = find_free_block(gc, tag, words);
    if (!b) {
        jacs_gc(gc);
        b = find_free_block(gc, tag, words);
    }

    return b;
}

static void *try_alloc(jacs_gc_t *gc, uint8_t tag, uint32_t size) {
    block_t *b = alloc_block(gc, tag, size);
    if (!b)
        return NULL;
    memset(b->data, 0x00, size);
    return b->data;
}

void *jd_gc_try_alloc(jacs_gc_t *gc, uint32_t size) {
    return try_alloc(gc, TAG_MASK_PINNED | TAG_BUFFER, size);
}

void jd_gc_free(jacs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return;
    JD_ASSERT(((uintptr_t)ptr & (JD_PTRSIZE - 1)) == 0);
    block_t *b = (block_t *)((uintptr_t *)ptr - 1);
    JD_ASSERT(GET_TAG(b->header) == (TAG_MASK_PINNED | TAG_BUFFER));
    mark_block(b, TAG_FREE, block_size(b));
    memset(b->data, 0x47, (block_size(b) - 1) * sizeof(uintptr_t));
}

jacs_map_t *jacs_map_try_alloc(jacs_gc_t *gc) {
    return try_alloc(gc, TAG_MAP, sizeof(jacs_map_t));
}

jacs_map_t *jacs_array_try_alloc(jacs_gc_t *gc) {
    return try_alloc(gc, TAG_ARRAY, sizeof(jacs_array_t));
}

#if JD_GC_ALLOC

static jacs_gc_t _static_gc;

#if JD_HW_ALLOC

void jd_alloc_add_chunk(void *start, unsigned size) {
    jacs_gc_add_chunk(&_static_gc, start, size);
}

#endif

void *jd_alloc(uint32_t size) {
    void *r = jd_gc_try_alloc(&_static_gc, size);
    if (!r)
        jd_panic();
    return r;
}

void jd_free(void *ptr) {
    jd_gc_free(&_static_gc, ptr);
}

jacs_gc_t *jacs_gc_create(void) {
    return &_static_gc;
}

void jacs_gc_destroy(jacs_gc_t *gc) {
    // no op
}

#else

jacs_gc_t *jacs_gc_create(void) {
    unsigned size = 64 * 1024;
    jacs_gc_t *gc = jd_alloc(sizeof(jacs_gc_t) + size);
    jacs_gc_add_chunk(gc, gc + 1, size);
    return gc;
}

void jacs_gc_destroy(jacs_gc_t *gc) {
    gc->first_chunk = NULL;
    jd_free(gc);
}

#endif

#if JD_64
void *jacs_gc_base_addr(jacs_gc_t *gc) {
    JD_ASSERT(gc && gc->first_chunk);
    return gc->first_chunk;
}
#endif