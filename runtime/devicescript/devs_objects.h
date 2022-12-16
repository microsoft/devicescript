#pragma once
#include <stdint.h>

#define DEVS_MAX_ALLOC 0xf000

typedef uint16_t devs_small_size_t;

typedef struct {
    uintptr_t header;
    // ...
} devs_gc_object_t;

typedef struct {
    devs_gc_object_t gc;
} devs_map_or_proto_t;

typedef struct {
    devs_gc_object_t gc;
    devs_map_or_proto_t *proto;
    devs_small_size_t length;
    devs_small_size_t capacity;
    value_t *data;
} devs_map_t;

typedef struct {
    devs_gc_object_t gc;
    // ...
} devs_builtin_proto_t;

typedef struct {
    devs_gc_object_t gc;
    devs_small_size_t length;
    devs_map_t *attached; // make sure data[] is aligned - put pointer last
    uint8_t data[0];
} devs_buffer_t;

typedef struct {
    devs_gc_object_t gc;
    devs_small_size_t length;
    char data[0];
} devs_string_t;

typedef struct {
    devs_gc_object_t gc;
    devs_map_t *attached;
    devs_small_size_t length;
    devs_small_size_t capacity;
    value_t *data;
} devs_array_t;

typedef struct {
    devs_gc_object_t gc;
    value_t this_val;
    value_t func;
} devs_bound_function_t;

void devs_map_set(devs_ctx_t *ctx, devs_map_t *map, value_t key, value_t v);
value_t devs_map_get(devs_ctx_t *ctx, devs_map_t *map, value_t key);
void devs_map_clear(devs_ctx_t *ctx, devs_map_t *map);

value_t devs_seq_get(devs_ctx_t *ctx, value_t seq, unsigned idx);
void devs_array_set(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, value_t v);
void devs_seq_set(devs_ctx_t *ctx, value_t seq, unsigned idx, value_t v);
int devs_array_insert(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, int count);

value_t devs_object_get(devs_ctx_t *ctx, value_t obj, value_t key);

// works on objects (including going up the proto chain), arrays, buffers, ...
value_t devs_any_get(devs_ctx_t *ctx, value_t obj, value_t key);
void devs_any_set(devs_ctx_t *ctx, value_t obj, value_t key, value_t v);

devs_map_or_proto_t *devs_object_get_attached(devs_ctx_t *ctx, value_t v, bool create);
devs_map_or_proto_t *devs_object_get_built_in(devs_ctx_t *ctx, unsigned idx);
value_t devs_proto_lookup(devs_ctx_t *ctx, devs_builtin_proto_t *proto, value_t key);
value_t devs_function_bind(devs_ctx_t *ctx, value_t obj, value_t v);

// GC

typedef struct _devs_gc_t devs_gc_t;

devs_map_t *devs_map_try_alloc(devs_gc_t *gc);
devs_array_t *devs_array_try_alloc(devs_gc_t *gc, unsigned size);
devs_buffer_t *devs_buffer_try_alloc(devs_gc_t *gc, unsigned size);
devs_string_t *devs_string_try_alloc(devs_gc_t *gc, unsigned size);

// result has to be casted to one of devs_gc_object_t objects
void *devs_any_try_alloc(devs_gc_t *gc, unsigned tag, unsigned size);

devs_gc_t *devs_gc_create(void);
void devs_gc_set_ctx(devs_gc_t *gc, devs_ctx_t *ctx);
void devs_gc_destroy(devs_gc_t *gc);

#if JD_64
#define DEVS_GC_TAG_POS (24 + 32)
#else
#define DEVS_GC_TAG_POS 24
#endif

#define DEVS_GC_TAG_MASK_PENDING 0x80
#define DEVS_GC_TAG_MASK_SCANNED 0x20
#define DEVS_GC_TAG_MASK_PINNED 0x40
#define DEVS_GC_TAG_MASK 0xf

// update devs_gc_tag_name() when adding/reordering
#define DEVS_GC_TAG_FREE 0x1
#define DEVS_GC_TAG_BYTES 0x2
#define DEVS_GC_TAG_ARRAY 0x3
#define DEVS_GC_TAG_MAP 0x4
#define DEVS_GC_TAG_BUFFER 0x5
#define DEVS_GC_TAG_STRING 0x6
#define DEVS_GC_TAG_BOUND_FUNCTION 0x7
#define DEVS_GC_TAG_BUILTIN_PROTO 0xf // these are not in GC heap!
#define DEVS_GC_TAG_FINAL (0xf | DEVS_GC_TAG_MASK_PINNED)

static inline int devs_gc_tag(void *ptr) {
    return ptr == NULL ? 0
                       : (((devs_gc_object_t *)ptr)->header >> DEVS_GC_TAG_POS) & DEVS_GC_TAG_MASK;
}

static inline bool devs_is_map(void *ptr) {
    return devs_gc_tag(ptr) == DEVS_GC_TAG_MAP;
}

static inline bool devs_is_proto(void *ptr) {
    return devs_gc_tag(ptr) == DEVS_GC_TAG_BUILTIN_PROTO;
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
