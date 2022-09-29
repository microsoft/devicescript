#pragma once
#include <stdint.h>

#define JACS_MAX_ALLOC 0xf000

typedef uint16_t jacs_small_size_t;
typedef uint16_t jacs_key_id_t;

typedef struct {
    uintptr_t header;
    // ...
} jacs_gc_object_t;

typedef struct {
    jacs_gc_object_t gc;
    jacs_small_size_t length;
    jacs_small_size_t capacity;
    value_t *data;
} jacs_map_t;

typedef struct {
    jacs_gc_object_t gc;
    jacs_small_size_t length;
    jacs_map_t *attached; // make sure data[] is aligned - put pointer last
    uint8_t data[0];
} jacs_buffer_t;

static inline jacs_key_id_t *jacs_map_keys(jacs_map_t *m) {
    return (jacs_key_id_t *)(void *)(m->data + m->length);
}

typedef struct {
    jacs_gc_object_t gc;
    jacs_map_t *attached;
    jacs_small_size_t length;
    jacs_small_size_t capacity;
    value_t *data;
} jacs_array_t;

void jacs_map_set(jacs_ctx_t *ctx, jacs_map_t *map, jacs_key_id_t key, value_t v);
value_t jacs_map_get(jacs_ctx_t *ctx, jacs_map_t *map, jacs_key_id_t key);
void jacs_map_clear(jacs_ctx_t *ctx, jacs_map_t *map);

value_t jacs_index(jacs_ctx_t *ctx, value_t seq, unsigned idx);
int jacs_array_set(jacs_ctx_t *ctx, jacs_array_t *arr, unsigned idx, value_t v);
int jacs_index_set(jacs_ctx_t *ctx, value_t seq, unsigned idx, value_t v);

// GC

typedef struct _jacs_gc_t jacs_gc_t;

jacs_map_t *jacs_map_try_alloc(jacs_gc_t *gc);
jacs_array_t *jacs_array_try_alloc(jacs_gc_t *gc, unsigned size);
jacs_buffer_t *jacs_buffer_try_alloc(jacs_gc_t *gc, unsigned size);

jacs_gc_t *jacs_gc_create(void);
void jacs_gc_destroy(jacs_gc_t *gc);

#if JD_64
#define JACS_GC_TAG_POS (24 + 32)
#else
#define JACS_GC_TAG_POS 24
#endif

#define JACS_GC_TAG_MASK_PENDING 0x80
#define JACS_GC_TAG_MASK_SCANNED 0x20
#define JACS_GC_TAG_MASK_PINNED 0x40
#define JACS_GC_TAG_MASK 0xf

#define JACS_GC_TAG_FREE 0x1
#define JACS_GC_TAG_BYTES 0x2
#define JACS_GC_TAG_ARRAY 0x3
#define JACS_GC_TAG_MAP 0x4
#define JACS_GC_TAG_BUFFER 0x5
#define JACS_GC_TAG_FINAL (0xf | JACS_GC_TAG_MASK_PINNED)

static inline uint8_t jacs_gc_tag(void *ptr) {
    return ptr == NULL ? 0
                       : (((jacs_gc_object_t *)ptr)->header >> JACS_GC_TAG_POS) & JACS_GC_TAG_MASK;
}

void *jd_gc_try_alloc(jacs_gc_t *gc, uint32_t size);
void jd_gc_free(jacs_gc_t *gc, void *ptr);
#if JD_64
void *jacs_gc_base_addr(jacs_gc_t *gc);
#else
static inline void *jacs_gc_base_addr(jacs_gc_t *gc) {
    return NULL;
}
#endif

void *jacs_value_to_gc_obj(jacs_ctx_t *ctx, value_t v);
