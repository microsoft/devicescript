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
#define TAG_FINAL 0xf

#define GET_TAG(p) ((p) >> TAG_POS)
#define BASIC_TAG(p) (GET_TAG(p) & TAG_MASK)
#define IS_FREE(header) (BASIC_TAG(header) == TAG_FREE)

#define BLOCK_SIZE(p) ((p)&0xffffff)

typedef struct _free_block_t {
    jacs_gc_object_t gc;
    struct _block_t *next;
} free_block_t;

typedef struct _block_t {
    union {
        struct {
            uintptr_t header;
            uint8_t data[0];
        };
        free_block_t free;
        jacs_gc_object_t gc;
        jacs_array_t array;
        jacs_map_t map;
    };
} block_t;

typedef struct _chunk_t {
    struct _chunk_t *next;
    block_t *end; // GET_TAG(end) == TAG_FINAL
    block_t start[0];
} chunk_t;

static block_t *first_free;
static chunk_t *first_chunk;
static uint32_t num_alloc;

static void mark_block(block_t *block, uint8_t tag, unsigned size) {
    block->header = size | ((uintptr_t)tag << TAG_POS);
}

void jd_alloc_add_chunk(void *start, unsigned size) {
    JD_ASSERT(size > sizeof(chunk_t) + 128);
    chunk_t *ch = start;
    ch->end =
        (block_t *)((uintptr_t)((uint8_t *)start + size) & ~(JD_PTRSIZE - 1) - sizeof(uintptr_t));
    mark_block(ch->end, TAG_FINAL, 1);
    ch->next = first_chunk;
    first_chunk = ch;
}

static void scan(block_t *block, int depth);

static void scan_value(value_t v, int depth) {
    if (jacs_handle_type(v) & JACS_HANDLE_IS_GC_POINTER_MASK) {
        block_t *b = jacs_handle_ptr_value(v);
        if (b)
            scan(b, depth);
    }
}

static void scan_array(value_t *vals, unsigned length, int depth) {
    for (unsigned i = 0; i < length; ++i) {
        scan_value(vals[i], depth);
    }
}

static void scan(block_t *block, int depth) {
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
        scan_array(block->array.data, block->array.length, depth);
        break;
    default:
        oops();
        break;
    }
}

static void mark_roots(jacs_ctx_t *ctx) {
    if (ctx == NULL)
        return;
    scan_array(ctx->globals, ctx->img.header->num_globals, ROOT_SCAN_DEPTH);
    for (jacs_fiber_t *fib = ctx->fibers; fib; fib = fib->next) {
        scan_value(fib->ret_val, ROOT_SCAN_DEPTH);
        for (jacs_activation_t *act = fib->activation; act; act = act->caller) {
            if (act->params_is_copy)
                scan_array(act->params, act->num_params, ROOT_SCAN_DEPTH);
            scan_array(act->locals, act->func->num_locals, ROOT_SCAN_DEPTH);
        }
    }
}

static inline uintptr_t *block_ptr(block_t *block) {
    return (uintptr_t *)block;
}

static inline unsigned block_size(block_t *b) {
    return BLOCK_SIZE(b->header);
}

static inline block_t *next_block(block_t *block) {
    return (block_t *)(block_ptr(block) + block_size(block));
}

static inline bool can_free(uintptr_t header) {
    uint8_t tag = GET_TAG(header);
    return tag == TAG_FREE || (tag & (TAG_MASK_SCANNED | TAG_MASK_PINNED)) == 0;
}

static void sweep(void) {
    int sweep = 0;
    block_t *prev = NULL;
    first_free = NULL;

    for (;;) {
        int had_pending = 0;
        for (chunk_t *chunk = first_chunk; chunk; chunk = chunk->next) {
            for (block_t *block = chunk->start;; block = next_block(block)) {
                uintptr_t header = block->header;
                if (GET_TAG(header) == TAG_FINAL)
                    break;
                JD_ASSERT(block < chunk->end);
                if (GET_TAG(header) & TAG_MASK_PENDING) {
                    JD_ASSERT(!sweep);
                    had_pending = 1;
                    scan(block, ROOT_SCAN_DEPTH);
                } else if (sweep) {
                    block_t *p = block;
                    while (can_free(p->header))
                        p = next_block(p);
                    if (p != block) {
                        mark_block(block, TAG_FREE, block_ptr(p) - block_ptr(block));
                        memset(block->data, 0x37, (block_size(block) - 1) * sizeof(uintptr_t));
                        if (prev == NULL) {
                            first_free = block;
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

static void jacs_gc(jacs_ctx_t *ctx) {
    mark_roots(ctx);
    sweep();
}

static block_t *find_free_block(uint8_t tag, uint32_t words) {
    block_t *prev = NULL;
    for (block_t *b = first_free; b; prev = b, b = b->free.next) {
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
            first_free = next;
        } else {
            prev->free.next = next;
        }

        return b;
    }

    return NULL;
}

static block_t *alloc_block(uint8_t tag, uint32_t size) {
    unsigned words = (size + JD_PTRSIZE - 1) / JD_PTRSIZE;

    // if jd_free() is supported we check stack often at the beginning and less often later
    num_alloc++;
    if (num_alloc < 32 || (num_alloc & 31) == 0)
        jd_alloc_stack_check();

    block_t *b = find_free_block(tag, words);
    if (!b) {
        jacs_gc(_jacs_ctx);
        b = find_free_block(tag, words);
    }

    return b;
}

static void *try_alloc(uint8_t tag, uint32_t size) {
    block_t *b = alloc_block(tag, size);
    if (!b)
        return NULL;
    memset(b->data, 0x00, size);
    return b->data;
}

void *jd_gc_try_alloc(uint32_t size) {
    return try_alloc(TAG_MASK_PINNED | TAG_BUFFER, size);
}

void jd_gc_free(void *ptr) {
    if (ptr == NULL)
        return;
    JD_ASSERT(((uintptr_t)ptr & (JD_PTRSIZE - 1)) == 0);
    block_t *b = (block_t *)((uintptr_t *)ptr - 1);
    JD_ASSERT(GET_TAG(b->header) == (TAG_MASK_PINNED | TAG_BUFFER));
    mark_block(b, TAG_FREE, block_size(b));
    memset(b->data, 0x47, (block_size(b) - 1) * sizeof(uintptr_t));
}

jacs_map_t *jacs_map_try_alloc(void) {
    return try_alloc(TAG_MAP, sizeof(jacs_map_t));
}

jacs_map_t *jacs_array_try_alloc(void) {
    return try_alloc(TAG_ARRAY, sizeof(jacs_array_t));
}

#if JD_GC_ALLOC

void *jd_alloc(uint32_t size) {
    void *r = jd_gc_try_alloc(size);
    if (!r)
        jd_panic();
    return r;
}

void jd_free(void *ptr) {
    jd_gc_free(ptr);
}

#endif
