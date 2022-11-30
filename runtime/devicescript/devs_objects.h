#pragma once
#include <stdint.h>

#define JACS_MAX_ALLOC 0xf000

typedef uint16_t devs_small_size_t;
typedef uint16_t devs_key_id_t;

typedef struct {
    uintptr_t header;
    // ...
} devs_gc_object_t;

typedef struct {
    devs_gc_object_t gc;
    devs_small_size_t length;
    devs_small_size_t capacity;
    value_t *data;
} devs_map_t;

typedef struct {
    devs_gc_object_t gc;
    devs_small_size_t length;
    devs_map_t *attached; // make sure data[] is aligned - put pointer last
    uint8_t data[0];
} devs_buffer_t;

static inline devs_key_id_t *devs_map_keys(devs_map_t *m) {
    return (devs_key_id_t *)(void *)(m->data + m->length);
}

typedef struct {
    devs_gc_object_t gc;
    devs_map_t *attached;
    devs_small_size_t length;
    devs_small_size_t capacity;
    value_t *data;
} devs_array_t;

void devs_map_set(devs_ctx_t *ctx, devs_map_t *map, devs_key_id_t key, value_t v);
value_t devs_map_get(devs_ctx_t *ctx, devs_map_t *map, devs_key_id_t key);
void devs_map_clear(devs_ctx_t *ctx, devs_map_t *map);

value_t devs_index(devs_ctx_t *ctx, value_t seq, unsigned idx);
int devs_array_set(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, value_t v);
int devs_index_set(devs_ctx_t *ctx, value_t seq, unsigned idx, value_t v);
int devs_array_insert(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, int count);

// GC

typedef struct _devs_gc_t devs_gc_t;

devs_map_t *devs_map_try_alloc(devs_gc_t *gc);
devs_array_t *devs_array_try_alloc(devs_gc_t *gc, unsigned size);
devs_buffer_t *devs_buffer_try_alloc(devs_gc_t *gc, unsigned size);

devs_gc_t *devs_gc_create(void);
void devs_gc_set_ctx(devs_gc_t *gc, devs_ctx_t *ctx);
void devs_gc_destroy(devs_gc_t *gc);

#if JD_64
#define JACS_GC_TAG_POS (24 + 32)
#else
#define JACS_GC_TAG_POS 24
#endif

#define JACS_GC_TAG_MASK_PENDING 0x80
#define JACS_GC_TAG_MASK_SCANNED 0x20
#define JACS_GC_TAG_MASK_PINNED 0x40
#define JACS_GC_TAG_MASK 0xf

// update devs_gc_tag_name() when adding/reordering
#define JACS_GC_TAG_FREE 0x1
#define JACS_GC_TAG_BYTES 0x2
#define JACS_GC_TAG_ARRAY 0x3
#define JACS_GC_TAG_MAP 0x4
#define JACS_GC_TAG_BUFFER 0x5
#define JACS_GC_TAG_FINAL (0xf | JACS_GC_TAG_MASK_PINNED)

static inline int devs_gc_tag(void *ptr) {
    return ptr == NULL ? 0
                       : (((devs_gc_object_t *)ptr)->header >> JACS_GC_TAG_POS) & JACS_GC_TAG_MASK;
}

const char *devs_gc_tag_name(unsigned tag);

void *jd_gc_try_alloc(devs_gc_t *gc, uint32_t size);
void jd_gc_unpin(devs_gc_t *gc, void *ptr);
void jd_gc_free(devs_gc_t *gc, void *ptr);
#if JD_64
void *devs_gc_base_addr(devs_gc_t *gc);
unsigned devs_show_addr(devs_gc_t *gc, void *ptr);
#else
static inline void *devs_gc_base_addr(devs_gc_t *gc) {
    return NULL;
}
static inline unsigned devs_show_addr(devs_gc_t *gc, void *ptr) {
    return (unsigned)ptr;
}
#endif

void *devs_value_to_gc_obj(devs_ctx_t *ctx, value_t v);

// returns pointer to a static buffer!
const char *devs_show_value(devs_ctx_t *ctx, value_t v);
