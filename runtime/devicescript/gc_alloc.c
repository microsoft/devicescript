// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "devs_internal.h"

// #define LOG_TAG "gc"
// #define VLOGGING 1
#include "devs_logging.h"

#define ROOT_SCAN_DEPTH 10

#define GET_TAG(p) ((p) >> DEVS_GC_TAG_POS)
#define BASIC_TAG(p) (GET_TAG(p) & DEVS_GC_TAG_MASK)

#define IS_FREE(header) (BASIC_TAG(header) == DEVS_GC_TAG_FREE)

#define BLOCK_SIZE(p) ((p)&0xffffff)

#if JD_64
#define ZERO_MASK 0x00ffffffff000000
#else
#define ZERO_MASK 0
#endif

#define FREE_FILL 0x37

typedef struct _free_devs_gc_block_t {
    devs_gc_object_t gc;
    struct _devs_gc_block_t *next;
    uint8_t data[0];
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
        devs_short_map_t short_map;
        devs_activation_t act;
        devs_bound_function_t bound_function;
        devs_packet_t pkt;
    };
} block_t;

typedef struct _devs_gc_chunk_t {
    struct _devs_gc_chunk_t *next;
    block_t *end; // GET_TAG(end) == DEVS_GC_TAG_FINAL
    block_t start[0];
} chunk_t;

struct _devs_gc_t {
    block_t *first_free;
    chunk_t *first_chunk;
    uint32_t num_alloc;
    devs_ctx_t *ctx;
};

static inline void mark_block(block_t *block, unsigned tag, unsigned size) {
    JD_ASSERT(tag <= 0xff);
    block->header = DEVS_GC_MK_TAG_WORDS(tag, size);
    if (tag == DEVS_GC_TAG_FREE) {
        JD_ASSERT(size >= 2);
        memset(block->free.data, FREE_FILL, (size - 2) * sizeof(uintptr_t));
    }
}

static inline uintptr_t *block_ptr(block_t *block) {
    return (uintptr_t *)block;
}

void devs_gc_add_chunk(devs_gc_t *gc, void *start, unsigned size) {
    JD_ASSERT(size > sizeof(chunk_t) + 128);
    chunk_t *ch = start;
    ch->end =
        (block_t *)(((uintptr_t)((uint8_t *)start + size) & ~(JD_PTRSIZE - 1)) - sizeof(uintptr_t));
    mark_block(ch->end, DEVS_GC_TAG_FINAL, 1);
    mark_block(ch->start, DEVS_GC_TAG_FREE, block_ptr(ch->end) - block_ptr(ch->start));
    ch->next = gc->first_chunk;
    gc->first_chunk = ch;
}

static void scan_gc_obj(devs_ctx_t *ctx, block_t *block, int depth);

static void scan_value(devs_ctx_t *ctx, value_t v, int depth) {
    if (devs_handle_is_ptr(v)) {
        block_t *b = devs_handle_ptr_value(ctx, v);
        scan_gc_obj(ctx, b, depth);
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
    JD_ASSERT((GET_TAG(b->header) & DEVS_GC_TAG_MASK_SCANNED) == 0);
    JD_ASSERT(BASIC_TAG(b->header) == DEVS_GC_TAG_BYTES);
    b->header |= (uintptr_t)DEVS_GC_TAG_MASK_SCANNED << DEVS_GC_TAG_POS;
}

static void scan_array_and_mark(devs_ctx_t *ctx, value_t *vals, unsigned length, int depth) {
    if (vals) {
        mark_ptr(ctx, vals);
        scan_array(ctx, vals, length, depth);
    }
}

static void scan_gc_obj(devs_ctx_t *ctx, block_t *block, int depth) {
    depth--;

    while (block) {
        uintptr_t header = block->header;

        if (IS_FREE(header) || GET_TAG(header) & DEVS_GC_TAG_MASK_SCANNED)
            return;

        if (depth <= 0) {
            LOG("mark pending");
            block->header |= (uintptr_t)DEVS_GC_TAG_MASK_PENDING << DEVS_GC_TAG_POS;
            return;
        }

        block->header |= (uintptr_t)DEVS_GC_TAG_MASK_SCANNED << DEVS_GC_TAG_POS;
        block->header &= ~((uintptr_t)DEVS_GC_TAG_MASK_PENDING << DEVS_GC_TAG_POS);

        devs_map_t *map = NULL;

        switch (BASIC_TAG(header)) {
        case DEVS_GC_TAG_BUFFER:
            map = block->buffer.attached;
            break;
        case DEVS_GC_TAG_SHORT_MAP:
        case DEVS_GC_TAG_HALF_STATIC_MAP:
        case DEVS_GC_TAG_MAP:
            map = &block->map;
            break;
        case DEVS_GC_TAG_ARRAY:
            scan_array_and_mark(ctx, block->array.data, block->array.length, depth);
            map = block->array.attached;
            break;
        case DEVS_GC_TAG_PACKET:
            scan_gc_obj(ctx, (block_t *)block->pkt.payload, depth);
            map = block->pkt.attached;
            break;
        case DEVS_GC_TAG_BOUND_FUNCTION:
            scan_value(ctx, block->bound_function.this_val, depth);
            scan_value(ctx, block->bound_function.func, depth);
            break;
        case DEVS_GC_TAG_ACTIVATION:
            scan_gc_obj(ctx, (void *)block->act.closure, depth);
            scan_array(ctx, block->act.slots, block->act.func->num_slots, depth);
            break;
        case DEVS_GC_TAG_STRING:
        case DEVS_GC_TAG_BYTES:
        case DEVS_GC_TAG_BUILTIN_PROTO:
            break;
        default:
            JD_PANIC();
            break;
        }

        if (map) {
            unsigned len = map->length;
            if (BASIC_TAG(header) != DEVS_GC_TAG_SHORT_MAP)
                len *= 2;
            scan_array_and_mark(ctx, map->data, len, depth);
            if (devs_maplike_is_map(ctx, map->proto))
                block = (void *)map->proto;
            else
                break;
        } else {
            break;
        }
    }
}

static void mark_roots(devs_gc_t *gc) {
    if (gc->ctx == NULL)
        return;
    devs_ctx_t *ctx = gc->ctx;

    scan_array(ctx, ctx->globals, ctx->img.header->num_globals, ROOT_SCAN_DEPTH);
    scan_array(ctx, ctx->the_stack, ctx->stack_top_for_gc, ROOT_SCAN_DEPTH);

    for (unsigned i = 0; i < ctx->_num_builtin_protos; ++i) {
        void *p = ctx->_builtin_protos[i];
        scan_gc_obj(ctx, p, ROOT_SCAN_DEPTH);
    }

    for (unsigned i = 0; i < devs_img_num_roles(ctx->img); ++i) {
        scan_gc_obj(ctx, (block_t *)ctx->roles[i].attached, ROOT_SCAN_DEPTH);
        scan_gc_obj(ctx, (block_t *)ctx->roles[i].dynproto, ROOT_SCAN_DEPTH);
    }

    scan_gc_obj(ctx, (block_t *)ctx->fn_protos, ROOT_SCAN_DEPTH);
    scan_value(ctx, ctx->exn_val, ROOT_SCAN_DEPTH);
    scan_value(ctx, ctx->diag_field, ROOT_SCAN_DEPTH);

    for (devs_fiber_t *fib = ctx->fibers; fib; fib = fib->next) {
        scan_value(ctx, fib->ret_val, ROOT_SCAN_DEPTH);
        if (devs_fiber_uses_pkt_data_v(fib))
            scan_value(ctx, fib->pkt_data.v, ROOT_SCAN_DEPTH);
        for (devs_activation_t *act = fib->activation; act; act = act->caller) {
            scan_gc_obj(ctx, (void *)act, ROOT_SCAN_DEPTH);
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
    return tag == DEVS_GC_TAG_FREE ||
           (tag & (DEVS_GC_TAG_MASK_SCANNED | DEVS_GC_TAG_MASK_PINNED)) == 0;
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
                unsigned tag = GET_TAG(header);
                if (tag == DEVS_GC_TAG_FINAL)
                    break;
                JD_ASSERT(block < chunk->end);

                if (!sweep)
                    LOGV("p=%p tag=%x", block, (unsigned)tag);

                if ((tag & DEVS_GC_TAG_MASK_PENDING) ||
                    (tag & (DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_MASK_SCANNED)) ==
                        DEVS_GC_TAG_MASK_PINNED) {
                    JD_ASSERT(!sweep);
                    if (!had_pending)
                        LOG("set pending");
                    had_pending = 1;
                    scan_gc_obj(gc->ctx, block, ROOT_SCAN_DEPTH);
                } else if (sweep) {
                    block_t *p = block;
                    while (can_free(p->header)) {
                        if (GET_TAG(p->header) != DEVS_GC_TAG_FREE)
                            LOG("free: %p", p);
                        p = next_block(p);
                    }
                    if (p != block) {
                        unsigned new_size = block_ptr(p) - block_ptr(block);
                        mark_block(block, DEVS_GC_TAG_FREE, new_size);
                        if (prev == NULL) {
                            gc->first_free = block;
                        } else {
                            prev->free.next = block;
                        }
                        block->free.next = NULL;
                        prev = block;
                    } else {
                        block->header = block->header &
                                        ~((uintptr_t)DEVS_GC_TAG_MASK_SCANNED << DEVS_GC_TAG_POS);
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

static void validate_heap(devs_gc_t *gc) {
    for (chunk_t *chunk = gc->first_chunk; chunk; chunk = chunk->next) {
        for (block_t *block = chunk->start;; block = next_block(block)) {
            uintptr_t header = block->header;
            unsigned tag = GET_TAG(header);
            if (tag == DEVS_GC_TAG_FINAL)
                break;
            JD_ASSERT(block < chunk->end);

            if (tag == DEVS_GC_TAG_FREE) {
                unsigned size = (block_size(block) - 2) * sizeof(uintptr_t);
                for (unsigned i = 0; i < size; ++i) {
                    if (block->free.data[i] != FREE_FILL) {
                        DMESG("! block corruption: %p off=%u v=%x", block,
                              (unsigned)(i + sizeof(uintptr_t)), block->free.data[i]);
                        JD_PANIC();
                    }
                }
            }
        }
    }
}

static void devs_gc(devs_gc_t *gc) {
    LOG("*** GC");
    mark_roots(gc);
    sweep(gc);
}

static block_t *find_free_block(devs_gc_t *gc, unsigned tag, uint32_t words) {
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
            // mark_block() below can overwrite b->free.next when words==0, so do this first
            next->free.next = b->free.next;
            mark_block(next, DEVS_GC_TAG_FREE, left - 1);
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

static block_t *alloc_block(devs_gc_t *gc, unsigned tag, uint32_t size) {
    unsigned words = (size + JD_PTRSIZE - 1) / JD_PTRSIZE;

    if (words == 0)
        words = 1; // min. alloc size:60

    JD_ASSERT(tag <= 0xff);

    // if jd_free() is supported we check stack often at the beginning and less often later
    gc->num_alloc++;
    if (gc->num_alloc < 32 || (gc->num_alloc & 31) == 0)
        jd_alloc_stack_check();

    if (devs_get_global_flags() & DEVS_FLAG_GC_STRESS) {
        validate_heap(gc);
        devs_gc(gc);
    }

    block_t *b = find_free_block(gc, tag, words);
    if (!b) {
        devs_gc(gc);
        b = find_free_block(gc, tag, words);
    }

    // DMESG("b=%p %p",b,(void*)b->header);

    return b;
}

void *jd_gc_any_try_alloc(devs_gc_t *gc, unsigned tag, uint32_t size) {
    if (size > DEVS_MAX_ALLOC)
        return NULL;
    block_t *b = alloc_block(gc, tag, size);
    if (!b)
        return NULL;
    memset(b->data, 0x00, size);
    LOG("alloc: tag=%s sz=%d -> %p", devs_gc_tag_name(tag), size, b);
    return b;
}

void *devs_any_try_alloc(devs_ctx_t *ctx, unsigned tag, unsigned size) {
    void *r = jd_gc_any_try_alloc(ctx->gc, tag, size);
    if (r == NULL)
        devs_oom(ctx, size);
    return r;
}

void *devs_try_alloc(devs_ctx_t *ctx, uint32_t size) {
    uintptr_t *r = devs_any_try_alloc(ctx, DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_BYTES, size);
    if (r)
        return r + 1;
    return NULL;
}

static void unpin(devs_gc_t *gc, void *ptr, uint8_t tag) {
    JD_ASSERT(((uintptr_t)ptr & (JD_PTRSIZE - 1)) == 0);
    block_t *b = (block_t *)((uintptr_t *)ptr - 1);
    JD_ASSERT(GET_TAG(b->header) == (DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_BYTES));
    mark_block(b, tag, block_size(b));
}

void jd_gc_unpin(devs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return;
    unpin(gc, ptr, DEVS_GC_TAG_BYTES);
}

void jd_gc_free(devs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return;
    unpin(gc, ptr, DEVS_GC_TAG_FREE);
}

void devs_value_pin(devs_ctx_t *ctx, value_t v) {
    if (!devs_handle_is_ptr(v))
        return;
    block_t *b = (block_t *)((uintptr_t *)devs_handle_ptr_value(ctx, v));
    unsigned tag = GET_TAG(b->header);
    JD_ASSERT((tag & DEVS_GC_TAG_MASK_PINNED) == 0);
    JD_ASSERT((tag & DEVS_GC_TAG_MASK) >= DEVS_GC_TAG_BYTES);
    b->header |= ((uintptr_t)DEVS_GC_TAG_MASK_PINNED << DEVS_GC_TAG_POS);
}

void devs_value_unpin(devs_ctx_t *ctx, value_t v) {
    if (!devs_handle_is_ptr(v))
        return;
    block_t *b = (block_t *)((uintptr_t *)devs_handle_ptr_value(ctx, v));
    unsigned tag = GET_TAG(b->header);
    JD_ASSERT((tag & DEVS_GC_TAG_MASK_PINNED) != 0);
    JD_ASSERT((tag & DEVS_GC_TAG_MASK) >= DEVS_GC_TAG_BYTES);
    b->header &= ~((uintptr_t)DEVS_GC_TAG_MASK_PINNED << DEVS_GC_TAG_POS);
}

devs_map_t *devs_map_try_alloc(devs_ctx_t *ctx, devs_maplike_t *proto) {
    devs_map_t *m = devs_any_try_alloc(ctx, DEVS_GC_TAG_MAP, sizeof(devs_map_t));
    if (m)
        m->proto = proto;
    return m;
}

devs_short_map_t *devs_short_map_try_alloc(devs_ctx_t *ctx) {
    return devs_any_try_alloc(ctx, DEVS_GC_TAG_SHORT_MAP, sizeof(devs_map_t));
}

devs_array_t *devs_array_try_alloc(devs_ctx_t *ctx, unsigned size) {
    unsigned bytesize = size * sizeof(value_t);
    if (size > DEVS_MAX_ALLOC || bytesize > DEVS_MAX_ALLOC) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_ARRAY);
        return NULL;
    }
    devs_array_t *arr =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_ARRAY | DEVS_GC_TAG_MASK_PINNED, sizeof(devs_array_t));
    if (arr == NULL)
        return NULL;
    if (size > 0) {
        arr->data = devs_try_alloc(ctx, bytesize);
        if (arr->data == NULL) {
            arr->gc.header ^= (uintptr_t)DEVS_GC_TAG_MASK_PINNED << DEVS_GC_TAG_POS;
            return NULL;
        }
        arr->length = arr->capacity = size;
    }
    arr->gc.header ^= (uintptr_t)DEVS_GC_TAG_MASK_PINNED << DEVS_GC_TAG_POS;
    return arr;
}

devs_buffer_t *devs_buffer_try_alloc(devs_ctx_t *ctx, unsigned size) {
    if (size > DEVS_MAX_ALLOC) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_BUFFER);
        return NULL;
    }
    devs_buffer_t *buf = devs_any_try_alloc(ctx, DEVS_GC_TAG_BUFFER, sizeof(devs_buffer_t) + size);
    if (buf)
        buf->length = size;
    return buf;
}

devs_string_t *devs_string_try_alloc(devs_ctx_t *ctx, unsigned size) {
    if (size > DEVS_MAX_ALLOC) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_STRING);
        return NULL;
    }
    devs_string_t *buf =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_STRING, sizeof(devs_string_t) + size + 1);
    if (buf)
        buf->length = size;
    return buf;
}

devs_string_t *devs_string_try_alloc_init(devs_ctx_t *ctx, const uint8_t *str, unsigned size) {
    devs_string_t *s = devs_string_try_alloc(ctx, size);
    if (s)
        memcpy(s->data, str, size);
    return s;
}

void devs_gc_set_ctx(devs_gc_t *gc, devs_ctx_t *ctx) {
    gc->ctx = ctx;
}

static const char *tags[] = {
    "free",     "bytes",      "array",           "map",      "buffer", "string",
    "function", "activation", "half_static_map", "short_map"};
const char *devs_gc_tag_name(unsigned tag) {
    tag &= DEVS_GC_TAG_MASK;
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
    void *r = jd_gc_any_try_alloc(&_static_gc, DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_BYTES, size);
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
#endif

bool devs_gc_obj_valid(devs_ctx_t *ctx, const void *ptr) {
    if (ptr == NULL || ((uintptr_t)ptr & (JD_PTRSIZE - 1)))
        return false;

    for (chunk_t *ch = ctx->gc->first_chunk; ch; ch = ch->next) {
        if ((void *)ch->start <= ptr && ptr < (void *)ch->end) {
            block_t *b = (void *)ptr;
            unsigned sz = block_size(b);
            if ((void **)b->data + sz > (void **)ch->end)
                return false;
            if (BASIC_TAG(b->header) == 0 || (b->header & ZERO_MASK))
                return false;
            return true;
        }
    }

    return false;
}

void devs_gc_obj_check(devs_ctx_t *ctx, const void *ptr) {
    if (!devs_gc_obj_valid(ctx, ptr)) {
        DMESG("! invalid GC obj: %p", ptr);
        JD_PANIC();
    }
}