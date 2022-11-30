// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "devs_internal.h"

// #define LOG JD_LOG
#define LOG JD_NOLOG

#define ROOT_SCAN_DEPTH 10

#define GET_TAG(p) ((p) >> JACS_GC_TAG_POS)
#define BASIC_TAG(p) (GET_TAG(p) & JACS_GC_TAG_MASK)

#define IS_FREE(header) (BASIC_TAG(header) == JACS_GC_TAG_FREE)

#define BLOCK_SIZE(p) ((p)&0xffffff)

typedef struct _free_devs_gc_block_t {
    devs_gc_object_t gc;
    struct _devs_gc_block_t *next;
} free_devs_gc_block_t;

typedef struct _devs_gc_block_t {
    union {
        struct {
            uintptr_t header;
            uint8_t data[0];
        };
        free_devs_gc_block_t free;
        devs_gc_object_t gc;
        devs_array_t array;
        devs_buffer_t buffer;
        devs_map_t map;
    };
} block_t;

typedef struct _devs_gc_chunk_t {
    struct _devs_gc_chunk_t *next;
    block_t *end; // GET_TAG(end) == JACS_GC_TAG_FINAL
    block_t start[0];
} chunk_t;

struct _devs_gc_t {
    block_t *first_free;
    chunk_t *first_chunk;
    uint32_t num_alloc;
    devs_ctx_t *ctx;
};

static inline void mark_block(block_t *block, uint8_t tag, unsigned size) {
    block->header = size | ((uintptr_t)tag << JACS_GC_TAG_POS);
}

static inline uintptr_t *block_ptr(block_t *block) {
    return (uintptr_t *)block;
}

void devs_gc_add_chunk(devs_gc_t *gc, void *start, unsigned size) {
    JD_ASSERT(size > sizeof(chunk_t) + 128);
    chunk_t *ch = start;
    ch->end =
        (block_t *)(((uintptr_t)((uint8_t *)start + size) & ~(JD_PTRSIZE - 1)) - sizeof(uintptr_t));
    mark_block(ch->end, JACS_GC_TAG_FINAL, 1);
    mark_block(ch->start, JACS_GC_TAG_FREE, block_ptr(ch->end) - block_ptr(ch->start));
    ch->next = gc->first_chunk;
    gc->first_chunk = ch;
}

static void scan(devs_ctx_t *ctx, block_t *block, int depth);

static void scan_value(devs_ctx_t *ctx, value_t v, int depth) {
    if (devs_handle_type(v) & JACS_HANDLE_GC_MASK) {
        block_t *b = devs_handle_ptr_value(ctx, v);
        if (b)
            scan(ctx, b, depth);
    }
}

static void scan_array(devs_ctx_t *ctx, value_t *vals, unsigned length, int depth) {
    for (unsigned i = 0; i < length; ++i) {
        scan_value(ctx, vals[i], depth);
    }
}

static void mark_ptr(devs_ctx_t *ctx, void *ptr) {
    JD_ASSERT(((uintptr_t)ptr & (JD_PTRSIZE - 1)) == 0);
    block_t *b = (block_t *)((uintptr_t *)ptr - 1);
    JD_ASSERT((GET_TAG(b->header) & JACS_GC_TAG_MASK_SCANNED) == 0);
    JD_ASSERT(BASIC_TAG(b->header) == JACS_GC_TAG_BYTES);
    b->header |= (uintptr_t)JACS_GC_TAG_MASK_SCANNED << JACS_GC_TAG_POS;
}

static void scan_array_and_mark(devs_ctx_t *ctx, value_t *vals, unsigned length, int depth) {
    if (vals) {
        mark_ptr(ctx, vals);
        scan_array(ctx, vals, length, depth);
    }
}

static void scan_map(devs_ctx_t *ctx, devs_map_t *map, int depth) {
    if (!map)
        return;
    scan_array_and_mark(ctx, map->data, map->length, depth - 1);
}

static void scan(devs_ctx_t *ctx, block_t *block, int depth) {
    uintptr_t header = block->header;

    if (IS_FREE(header) || GET_TAG(header) & JACS_GC_TAG_MASK_SCANNED)
        return;

    if (depth <= 0) {
        LOG("mark pending");
        block->header |= (uintptr_t)JACS_GC_TAG_MASK_PENDING << JACS_GC_TAG_POS;
        return;
    }

    block->header |= (uintptr_t)JACS_GC_TAG_MASK_SCANNED << JACS_GC_TAG_POS;
    block->header &= ~((uintptr_t)JACS_GC_TAG_MASK_PENDING << JACS_GC_TAG_POS);

    depth--;

    switch (BASIC_TAG(header)) {
    case JACS_GC_TAG_BUFFER:
        scan_map(ctx, block->buffer.attached, depth);
        break;
    case JACS_GC_TAG_MAP:
        scan_map(ctx, &block->map, depth);
        break;
    case JACS_GC_TAG_ARRAY:
        scan_map(ctx, block->array.attached, depth);
        scan_array_and_mark(ctx, block->array.data, block->array.length, depth);
        break;
    case JACS_GC_TAG_BYTES:
        break;
    default:
        JD_PANIC();
        break;
    }
}

static void mark_roots(devs_gc_t *gc) {
    if (gc->ctx == NULL)
        return;
    devs_ctx_t *ctx = gc->ctx;
    scan_array(ctx, ctx->globals, ctx->img.header->num_globals, ROOT_SCAN_DEPTH);
    scan_array(ctx, ctx->the_stack, ctx->stack_top_for_gc, ROOT_SCAN_DEPTH);
    for (devs_fiber_t *fib = ctx->fibers; fib; fib = fib->next) {
        scan_value(ctx, fib->ret_val, ROOT_SCAN_DEPTH);
        for (devs_activation_t *act = fib->activation; act; act = act->caller) {
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
    return tag == JACS_GC_TAG_FREE ||
           (tag & (JACS_GC_TAG_MASK_SCANNED | JACS_GC_TAG_MASK_PINNED)) == 0;
}

static void sweep(devs_gc_t *gc) {
    int sweep = 0;
    block_t *prev = NULL;
    gc->first_free = NULL;

    for (;;) {
        int had_pending = 0;
        for (chunk_t *chunk = gc->first_chunk; chunk; chunk = chunk->next) {
            for (block_t *block = chunk->start;; block = next_block(block)) {
                uintptr_t header = block->header;
                if (GET_TAG(header) == JACS_GC_TAG_FINAL)
                    break;
                JD_ASSERT(block < chunk->end);

                if (!sweep)
                    LOG("p=%x tag=%x", devs_show_addr(gc, block), (unsigned)GET_TAG(header));

                if (GET_TAG(header) & JACS_GC_TAG_MASK_PENDING) {
                    JD_ASSERT(!sweep);
                    if (!had_pending)
                        LOG("set pending");
                    had_pending = 1;
                    scan(gc->ctx, block, ROOT_SCAN_DEPTH);
                } else if (sweep) {
                    block_t *p = block;
                    while (can_free(p->header)) {
                        if (GET_TAG(p->header) != JACS_GC_TAG_FREE)
                            LOG("free: %x", devs_show_addr(gc, p));
                        p = next_block(p);
                    }
                    if (p != block) {
                        unsigned new_size = block_ptr(p) - block_ptr(block);
                        mark_block(block, JACS_GC_TAG_FREE, new_size);
                        memset(block->data, 0x37, (block_size(block) - 1) * sizeof(uintptr_t));
                        if (prev == NULL) {
                            gc->first_free = block;
                        } else {
                            prev->free.next = block;
                        }
                        block->free.next = NULL;
                        prev = block;
                    } else {
                        block->header = block->header &
                                        ~((uintptr_t)JACS_GC_TAG_MASK_SCANNED << JACS_GC_TAG_POS);
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

static void devs_gc(devs_gc_t *gc) {
    LOG("*** GC");
    mark_roots(gc);
    sweep(gc);
}

static block_t *find_free_block(devs_gc_t *gc, uint8_t tag, uint32_t words) {
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
            mark_block(next, JACS_GC_TAG_FREE, left - 1);
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

static block_t *alloc_block(devs_gc_t *gc, uint8_t tag, uint32_t size) {
    unsigned words = (size + JD_PTRSIZE - 1) / JD_PTRSIZE;

    // if jd_free() is supported we check stack often at the beginning and less often later
    gc->num_alloc++;
    if (gc->num_alloc < 32 || (gc->num_alloc & 31) == 0)
        jd_alloc_stack_check();

    if (devs_get_global_flags() & JACS_FLAG_GC_STRESS)
        devs_gc(gc);

    block_t *b = find_free_block(gc, tag, words);
    if (!b) {
        devs_gc(gc);
        b = find_free_block(gc, tag, words);
    }

    // DMESG("b=%p %p",b,(void*)b->header);

    return b;
}

static void *try_alloc(devs_gc_t *gc, uint8_t tag, uint32_t size) {
    if (size > JACS_MAX_ALLOC)
        return NULL;
    block_t *b = alloc_block(gc, tag, size);
    if (!b)
        return NULL;
    memset(b->data, 0x00, size);
    LOG("alloc: tag=%s sz=%d -> %x", devs_gc_tag_name(tag), size, devs_show_addr(gc, b));
    return b;
}

void *jd_gc_try_alloc(devs_gc_t *gc, uint32_t size) {
    return (uintptr_t *)try_alloc(gc, JACS_GC_TAG_MASK_PINNED | JACS_GC_TAG_BYTES, size) + 1;
}

static block_t *unpin(devs_gc_t *gc, void *ptr, uint8_t tag) {
    JD_ASSERT(((uintptr_t)ptr & (JD_PTRSIZE - 1)) == 0);
    block_t *b = (block_t *)((uintptr_t *)ptr - 1);
    JD_ASSERT(GET_TAG(b->header) == (JACS_GC_TAG_MASK_PINNED | JACS_GC_TAG_BYTES));
    mark_block(b, tag, block_size(b));
    return b;
}

void jd_gc_unpin(devs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return;
    unpin(gc, ptr, JACS_GC_TAG_BYTES);
}

void jd_gc_free(devs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return;
    block_t *b = unpin(gc, ptr, JACS_GC_TAG_FREE);
    memset(b->data, 0x47, (block_size(b) - 1) * sizeof(uintptr_t));
}

devs_map_t *devs_map_try_alloc(devs_gc_t *gc) {
    return try_alloc(gc, JACS_GC_TAG_MAP, sizeof(devs_map_t));
}

devs_array_t *devs_array_try_alloc(devs_gc_t *gc, unsigned size) {
    unsigned bytesize = size * sizeof(value_t);
    if (bytesize > JACS_MAX_ALLOC)
        return NULL;
    devs_array_t *arr =
        try_alloc(gc, JACS_GC_TAG_ARRAY | JACS_GC_TAG_MASK_PINNED, sizeof(devs_array_t));
    if (arr == NULL)
        return NULL;
    if (size > 0) {
        arr->data = jd_gc_try_alloc(gc, bytesize);
        if (arr->data == NULL) {
            arr->gc.header ^= (uintptr_t)JACS_GC_TAG_MASK_PINNED << JACS_GC_TAG_POS;
            return NULL;
        }
        arr->length = arr->capacity = size;
    }
    arr->gc.header ^= (uintptr_t)JACS_GC_TAG_MASK_PINNED << JACS_GC_TAG_POS;
    return arr;
}

devs_buffer_t *devs_buffer_try_alloc(devs_gc_t *gc, unsigned size) {
    if (size > JACS_MAX_ALLOC)
        return NULL;
    devs_buffer_t *buf = try_alloc(gc, JACS_GC_TAG_BUFFER, sizeof(devs_buffer_t) + size);
    if (buf)
        buf->length = size;
    return buf;
}

void devs_gc_set_ctx(devs_gc_t *gc, devs_ctx_t *ctx) {
    gc->ctx = ctx;
}

static const char *tags[] = {"free", "bytes", "array", "map", "buffer"};
const char *devs_gc_tag_name(unsigned tag) {
    tag &= JACS_GC_TAG_MASK;
    tag--;
    if (tag < sizeof(tags) / sizeof(tags[0]))
        return tags[tag];
    return "?tag";
}

#if JD_GC_ALLOC

static devs_gc_t _static_gc;

#if JD_HW_ALLOC

void jd_alloc_add_chunk(void *start, unsigned size) {
    devs_gc_add_chunk(&_static_gc, start, size);
}

#endif

void *jd_alloc(uint32_t size) {
    void *r = jd_gc_try_alloc(&_static_gc, size);
    if (!r)
        JD_PANIC();
    return r;
}

void jd_free(void *ptr) {
    jd_gc_free(&_static_gc, ptr);
}

devs_gc_t *devs_gc_create(void) {
    return &_static_gc;
}

void devs_gc_destroy(devs_gc_t *gc) {
    // no op
}

#else

devs_gc_t *devs_gc_create(void) {
    unsigned size = JD_GC_KB * 1024;
    devs_gc_t *gc = jd_alloc(sizeof(devs_gc_t) + size);
    devs_gc_add_chunk(gc, gc + 1, size);
    return gc;
}

void devs_gc_destroy(devs_gc_t *gc) {
    gc->first_chunk = NULL;
    jd_free(gc);
}

#endif

#if JD_64
void *devs_gc_base_addr(devs_gc_t *gc) {
    JD_ASSERT(gc && gc->first_chunk);
    return gc->first_chunk;
}

unsigned devs_show_addr(devs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return 0;
    JD_ASSERT(gc && gc->first_chunk);
    return (uintptr_t)ptr - (uintptr_t)gc->first_chunk;
}
#endif