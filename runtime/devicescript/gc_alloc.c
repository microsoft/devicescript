// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "devs_internal.h"

// #define LOG_TAG "gc"
// #define VLOGGING 1
#include "devs_logging.h"

void devs_gc_obj_check_core(devs_gc_t *gc, const void *ptr);

// we run GC when allocation size since last GC reaches (JD_GC_STEP_SIZE+LAST)
// where LAST is used size upon last GC
#define JD_GC_STEP_SIZE 1024

#define ROOT_SCAN_DEPTH 10

#define GET_TAG(p) ((p) >> DEVS_GC_TAG_POS)
#define BASIC_TAG(p) (GET_TAG(p) & DEVS_GC_TAG_MASK)

#define IS_FREE(header) (BASIC_TAG(header) == DEVS_GC_TAG_FREE)

// in words
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
    uint32_t last_used;
    uint32_t curr_alloc;
    devs_ctx_t *ctx;
};

static inline void mark_block(devs_gc_t *gc, block_t *block, unsigned tag, unsigned size) {
    JD_ASSERT(tag <= 0xff);
    block->header = DEVS_GC_MK_TAG_WORDS(tag, size);
    if (tag == DEVS_GC_TAG_FREE) {
        JD_ASSERT(size >= 2);
        LOG("fill %p %u", block->free.data, (unsigned)((size - 2) * sizeof(uintptr_t)));
        memset(block->free.data, FREE_FILL, (size - 2) * sizeof(uintptr_t));
    }
    devs_gc_obj_check_core(gc, block);
}

static inline uintptr_t *block_ptr(block_t *block) {
    return (uintptr_t *)block;
}

void devs_gc_add_chunk(devs_gc_t *gc, void *start, unsigned size) {
    JD_ASSERT(size > sizeof(chunk_t) + 128);
    chunk_t *ch = start;
    ch->end =
        (block_t *)(((uintptr_t)((uint8_t *)start + size) & ~(JD_PTRSIZE - 1)) - sizeof(uintptr_t));

    ch->next = NULL;
    if (gc->first_chunk == NULL) {
        gc->first_chunk = ch;
    } else {
        for (chunk_t *p = gc->first_chunk; p; p = p->next) {
            JD_ASSERT(p < ch); // addresses have to be in order
            if (p->next == NULL) {
                p->next = ch;
                break;
            }
        }
    }
    ch->end->header = DEVS_GC_MK_TAG_WORDS(DEVS_GC_TAG_FINAL, 1);
    mark_block(gc, ch->start, DEVS_GC_TAG_FREE, block_ptr(ch->end) - block_ptr(ch->start));
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
    JD_ASSERT((GET_TAG(b->header) & (DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_MASK_SCANNED)) == 0);
    JD_ASSERT(BASIC_TAG(b->header) == DEVS_GC_TAG_BYTES);
    b->header |= (uintptr_t)DEVS_GC_TAG_MASK_SCANNED << DEVS_GC_TAG_POS;
}

static void scan_array_and_mark(devs_ctx_t *ctx, value_t *vals, unsigned length, int depth) {
    if (vals) {
        LOGV("arr %p %u", vals, length);
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
        case DEVS_GC_TAG_STRING_JMP:
        case DEVS_GC_TAG_STRING:
        case DEVS_GC_TAG_BYTES:
        case DEVS_GC_TAG_BUILTIN_PROTO:
            break;
        default:
            DMESG("invalid tag: %x at %p", (unsigned)header, block);
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

    for (unsigned i = 0; i < ctx->num_roles; ++i) {
        devs_role_t *r = devs_role(ctx, i);
        if (r) {
            scan_value(ctx, r->name, ROOT_SCAN_DEPTH);
            scan_gc_obj(ctx, (block_t *)r->attached, ROOT_SCAN_DEPTH);
        }
    }

    scan_gc_obj(ctx, (block_t *)ctx->fn_protos, ROOT_SCAN_DEPTH);
    scan_gc_obj(ctx, (block_t *)ctx->fn_values, ROOT_SCAN_DEPTH);
    scan_gc_obj(ctx, (block_t *)ctx->spec_protos, ROOT_SCAN_DEPTH);
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

// in words
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

static void clear_weak_pointers(devs_ctx_t *ctx) {
    if (!ctx)
        return;

    if (ctx->step_fn && can_free(ctx->step_fn->gc.header))
        ctx->step_fn = NULL;
}

static void sweep(devs_gc_t *gc) {
    int sweep = 0;
    block_t *prev = NULL;
    gc->first_free = NULL;
    gc->last_used = 0;
    gc->curr_alloc = 0;

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
                        mark_block(gc, block, DEVS_GC_TAG_FREE, new_size);
                        if (prev == NULL) {
                            gc->first_free = block;
                        } else {
                            prev->free.next = block;
                        }
                        block->free.next = NULL;
                        prev = block;
                    } else {
                        gc->last_used += block_size(block);
                        block->header = block->header &
                                        ~((uintptr_t)DEVS_GC_TAG_MASK_SCANNED << DEVS_GC_TAG_POS);
                    }
                }
            }
        }
        if (sweep)
            break;
        if (!had_pending) {
            clear_weak_pointers(gc->ctx);
            sweep = 1;
        }
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
        if (left < 0)
            continue;

        block_t *next;
        if (left > 2) {
            // split block
            mark_block(gc, b, tag, words);
            next = next_block(b);
            // mark_block() below can overwrite b->free.next when words==0, so do this first
            next->free.next = b->free.next;
            mark_block(gc, next, DEVS_GC_TAG_FREE, left);
        } else {
            mark_block(gc, b, tag, block_size(b));
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

static block_t *alloc_block(devs_gc_t *gc, unsigned tag, unsigned size) {
    JD_ASSERT(!target_in_irq());

    unsigned words = (size + JD_PTRSIZE - 1) / JD_PTRSIZE;

    if (words <= 1)
        words = 2; // min. alloc size

    JD_ASSERT(tag <= 0xff);

    // if jd_free() is supported we check stack often at the beginning and less often later
    gc->num_alloc++;
    if (gc->num_alloc < 32 || (gc->num_alloc & 31) == 0)
        jd_alloc_stack_check();

    if (devs_get_global_flags() & DEVS_FLAG_GC_STRESS) {
        validate_heap(gc);
        devs_gc(gc);
    } else if (gc->curr_alloc > gc->last_used + JD_GC_STEP_SIZE / sizeof(void *)) {
        devs_gc(gc);
    }
    gc->curr_alloc += words;

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
    memset(b->data, 0x00, size - JD_PTRSIZE);
    LOG("alloc: tag=%s sz=%d -> %p", devs_gc_tag_name(tag), (int)size, b);
    return b;
}

void *devs_any_try_alloc(devs_ctx_t *ctx, unsigned tag, unsigned size) {
    void *r = jd_gc_any_try_alloc(ctx->gc, tag, size);
    if (r == NULL)
        devs_oom(ctx, size);
    return r;
}

void *devs_try_alloc(devs_ctx_t *ctx, uint32_t size) {
    uintptr_t *r =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_BYTES, size + JD_PTRSIZE);
    if (r)
        return r + 1;
    return NULL;
}

static void unpin(devs_gc_t *gc, void *ptr, uint8_t tag) {
    JD_ASSERT(((uintptr_t)ptr & (JD_PTRSIZE - 1)) == 0);
    block_t *b = (block_t *)((uintptr_t *)ptr - 1);
    JD_ASSERT(GET_TAG(b->header) == (DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_BYTES));
    mark_block(gc, b, tag, block_size(b));
}

void jd_gc_unpin(devs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return;
    unpin(gc, ptr, DEVS_GC_TAG_BYTES);
}

void jd_gc_free(devs_gc_t *gc, void *ptr) {
    if (ptr == NULL)
        return;
    LOG("jd_gc_free %p", (uintptr_t *)ptr - 1);
    unpin(gc, ptr, DEVS_GC_TAG_FREE);
}

bool devs_value_is_pinned(devs_ctx_t *ctx, value_t v) {
    if (!devs_handle_is_ptr(v))
        return false;
    block_t *b = (block_t *)((uintptr_t *)devs_handle_ptr_value(ctx, v));
    unsigned tag = GET_TAG(b->header);
    JD_ASSERT((tag & DEVS_GC_TAG_MASK) >= DEVS_GC_TAG_BYTES);
    return (tag & DEVS_GC_TAG_MASK_PINNED) != 0;
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
    return devs_any_try_alloc(ctx, DEVS_GC_TAG_SHORT_MAP, sizeof(devs_short_map_t));
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
        } else {
            // data now rooted in array
            jd_gc_unpin(ctx->gc, arr->data);
        }
        arr->length = arr->capacity = size;
    }
    arr->gc.header ^= (uintptr_t)DEVS_GC_TAG_MASK_PINNED << DEVS_GC_TAG_POS;
    return arr;
}

devs_buffer_t *devs_buffer_try_alloc_init(devs_ctx_t *ctx, const void *data, unsigned size) {
    if (size > DEVS_MAX_ALLOC) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_BUFFER);
        return NULL;
    }
    devs_buffer_t *buf = devs_any_try_alloc(ctx, DEVS_GC_TAG_BUFFER, sizeof(devs_buffer_t) + size);
    if (buf) {
        buf->length = size;
        if (data)
            memcpy(buf->data, data, size);
    }
    return buf;
}

devs_buffer_t *devs_buffer_try_alloc(devs_ctx_t *ctx, unsigned size) {
    return devs_buffer_try_alloc_init(ctx, NULL, size);
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

devs_string_jmp_t *devs_string_jmp_try_alloc(devs_ctx_t *ctx, unsigned size, unsigned length) {
    if (size > DEVS_MAX_ALLOC) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_STRING);
        return NULL;
    }
    JD_ASSERT(size >= length);
    devs_string_jmp_t *buf =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_STRING_JMP,
                           sizeof(devs_string_jmp_t) + size + 1 +
                               devs_utf8_string_jmp_entries(length) * sizeof(uint16_t));
    if (buf) {
        buf->inner.size = size;
        buf->inner.length = length;
    }
    return buf;
}

char *devs_string_prep(devs_ctx_t *ctx, value_t *v, unsigned sz, unsigned len) {
    char *r;
    if (len == sz && sz < DEVS_MAX_ASCII_STRING) {
        devs_string_t *s = devs_string_try_alloc(ctx, sz);
        *v = devs_value_from_gc_obj(ctx, s);
        r = s ? s->data : NULL;
    } else {
        devs_string_jmp_t *s = devs_string_jmp_try_alloc(ctx, sz, len);
        *v = devs_value_from_gc_obj(ctx, s);
        r = s ? (char *)devs_utf8_string_data(&s->inner) : NULL;
    }

    devs_value_pin(ctx, *v);
    return r;
}

void devs_string_finish(devs_ctx_t *ctx, value_t *v, unsigned sz, unsigned len) {
    void *p = devs_value_to_gc_obj(ctx, *v);
    unsigned tag = devs_gc_tag(p);
    if (tag == DEVS_GC_TAG_STRING) {
        devs_string_t *s = p;
        JD_ASSERT(sz == s->length);
        JD_ASSERT(sz == len && sz < DEVS_MAX_ASCII_STRING);
    } else if (tag == DEVS_GC_TAG_STRING_JMP) {
        devs_string_jmp_t *s = p;
        JD_ASSERT(sz == s->inner.size);
        JD_ASSERT(len == s->inner.length);
        int r = devs_string_jmp_init(ctx, s);
        JD_ASSERT(r >= 0);
    } else {
        JD_PANIC();
    }
    devs_value_unpin(ctx, *v);
}

devs_any_string_t *devs_string_try_alloc_init(devs_ctx_t *ctx, const char *str, unsigned size) {
    unsigned len;
    unsigned sz;
    sz = devs_utf8_init(str, size, &len, NULL, 0);

    if (size == sz && len == size && size < DEVS_MAX_ASCII_STRING) {
        devs_string_t *s = devs_string_try_alloc(ctx, size);
        if (s)
            memcpy(s->data, str, size);
        return (void *)s;
    } else {
        devs_string_jmp_t *s = devs_string_jmp_try_alloc(ctx, sz, len);
        devs_utf8_init(str, size, NULL, &s->inner,
                       DEVS_UTF8_INIT_SET_DATA | DEVS_UTF8_INIT_SET_JMP);
        return (void *)s;
    }
}

void devs_gc_set_ctx(devs_gc_t *gc, devs_ctx_t *ctx) {
    gc->ctx = ctx;
}

static const char *tags[] = {
    "free",            //
    "bytes",           //
    "array",           //
    "map",             //
    "buffer",          //
    "string",          //
    "function",        //
    "activation",      //
    "half_static_map", //
    "short_map",       //
    "packet",          //
    "string_jmp"       //
};

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
    uint8_t *r = jd_gc_any_try_alloc(&_static_gc, DEVS_GC_TAG_MASK_PINNED | DEVS_GC_TAG_BYTES,
                                     size + JD_PTRSIZE);
    if (!r)
        JD_PANIC();
    return r + JD_PTRSIZE;
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

static void fail_ptr(const char *msg, const void *ptr) {
    DMESG("! GC-ptr validation error: %s ptr=%p", msg, ptr);
    JD_PANIC();
}

void devs_gc_obj_check_core(devs_gc_t *gc, const void *ptr) {
    if (ptr == NULL || ((uintptr_t)ptr & (JD_PTRSIZE - 1)))
        fail_ptr("value", ptr);

    for (chunk_t *ch = gc->first_chunk; ch; ch = ch->next) {
        if ((void *)ch->start <= ptr && ptr < (void *)ch->end) {
            block_t *b = (void *)ptr;
            if (next_block(b) > ch->end)
                fail_ptr("size", ptr);
            if (BASIC_TAG(b->header) == 0 || (b->header & ZERO_MASK)) {
                DMESG("! hd: %p", (void *)b->header);
                fail_ptr("header", ptr);
            }
            return;
        }
    }

    fail_ptr("chunk", ptr);
}

void devs_gc_obj_check(devs_ctx_t *ctx, const void *ptr) {
    devs_gc_obj_check_core(ctx->gc, ptr);
}

int devs_dump_heap(devs_ctx_t *ctx, int off, int cnt) {
    int curr = 0;
    int endoff = off + cnt;

    int numobj = 0;
    int used_size = 0;
    int free_size = 0;
    int max_free_block = 0;

    for (chunk_t *chunk = ctx->gc->first_chunk; chunk; chunk = chunk->next) {
        for (block_t *block = chunk->start;; block = next_block(block)) {
            uintptr_t header = block->header;
            unsigned tag = GET_TAG(header);
            if (tag == DEVS_GC_TAG_FINAL)
                break;
            JD_ASSERT(block < chunk->end);

            if (off == -1) {
                numobj++;
                int sz = block_size(block) * sizeof(void *);
                if (tag == DEVS_GC_TAG_FREE) {
                    free_size += sz;
                    if (sz > max_free_block)
                        max_free_block = sz;
                } else
                    used_size += sz;
                continue;
            }

            if (tag != DEVS_GC_TAG_ACTIVATION)
                continue;

            if (curr++ < off)
                continue;
            if (curr > endoff)
                return curr;
            if (tag == DEVS_GC_TAG_ACTIVATION) {
                devs_activation_t *fn = &block->act;
                int idx = fn->func - devs_img_get_function(ctx->img, 0);
                JD_LOG("act: %s_F%d (pc:%d)", devs_img_fun_name(ctx->img, idx), idx,
                       (int)(fn->pc - fn->func->start));
            } else {
                JD_LOG("%s: %p", devs_gc_tag_name(tag), block);
            }
        }
    }

    if (off == -1) {
        JD_LOG("stats: %d objects, %d B used, %d B free (%d B max block)", numobj, used_size,
               free_size, max_free_block);
    }

    return curr;
}
