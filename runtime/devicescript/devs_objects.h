#pragma once
#include <stdint.h>

#include "devs_proto.h"

#define DEVS_MAX_ALLOC 0xe000

#if JD_64
#define DEVS_GC_TAG_POS (24 + 32)
#else
#define DEVS_GC_TAG_POS 24
#endif

typedef uint16_t devs_small_size_t;

typedef struct {
    union {
        uintptr_t header;
        struct {
            uintptr_t size : DEVS_GC_TAG_POS;
            uintptr_t tag : 8;
        };
    };
    // ...
} devs_gc_object_t;

struct devs_maplike {
    devs_gc_object_t _gc;
};
typedef const struct devs_maplike devs_maplike_t;

typedef struct {
    devs_gc_object_t gc;
    devs_maplike_t *proto;
    devs_small_size_t length;
    devs_small_size_t capacity;
    value_t *data;
} devs_map_t;

// same structure as devs_map_t but data[] field is different
typedef struct {
    devs_gc_object_t gc;
    devs_maplike_t *proto;
    devs_small_size_t length;
    devs_small_size_t capacity;
    value_t *short_data;
} devs_short_map_t;

typedef struct devs_builtin_proto {
    devs_gc_object_t gc;
    const struct devs_builtin_proto *parent;
    const devs_builtin_proto_entry_t *entries;
} devs_builtin_proto_t;
extern const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1];

static inline bool devs_is_builtin_proto(const void *ptr) {
    return (uintptr_t)((const devs_builtin_proto_t *)ptr - devs_builtin_protos) <
           DEVS_BUILTIN_OBJECT___MAX + 1;
}

typedef struct {
    devs_gc_object_t gc;
    devs_small_size_t length;
    devs_map_t *attached; // make sure data[] is aligned - put pointer last
    uint8_t data[0];
} devs_buffer_t;

// ASCII string, length==size
typedef struct {
    devs_gc_object_t gc; // DEVS_GC_TAG_STRING
    devs_small_size_t length;
    char data[0];
} devs_string_t;

typedef struct {
    devs_gc_object_t gc; // DEVS_GC_TAG_STRING_JMP
    devs_utf8_string_t inner;
} devs_string_jmp_t;

typedef struct {
    devs_gc_object_t gc;
} devs_any_string_t;

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

typedef struct {
    devs_gc_object_t gc;
    uint64_t device_id;
    uint16_t service_command;
    uint16_t roleidx;
    uint8_t flags;
    uint8_t service_index;
    uint16_t crc;
    devs_map_t *attached;
    devs_buffer_t *payload;
} devs_packet_t;

void devs_map_set(devs_ctx_t *ctx, devs_map_t *map, value_t key, value_t v);
value_t devs_map_get(devs_ctx_t *ctx, devs_map_t *map, value_t key);
int devs_map_delete(devs_ctx_t *ctx, devs_map_t *map, value_t key);
void devs_map_clear(devs_ctx_t *ctx, devs_map_t *map);
void devs_map_copy_into(devs_ctx_t *ctx, devs_map_t *dst, devs_maplike_t *src);
void devs_map_set_string_field(devs_ctx_t *ctx, devs_map_t *m, unsigned builtin_str, value_t msg);

typedef void (*devs_map_iter_cb_t)(devs_ctx_t *ctx, void *userdata, value_t k, value_t v);
unsigned devs_maplike_iter(devs_ctx_t *ctx, devs_maplike_t *src, void *userdata,
                           devs_map_iter_cb_t cb);
void devs_maplike_keys_or_values(devs_ctx_t *ctx, devs_maplike_t *src, devs_array_t *arr,
                                 bool keys);
bool devs_maplike_is_map(devs_ctx_t *ctx, devs_maplike_t *src);

value_t devs_short_map_get(devs_ctx_t *ctx, devs_short_map_t *map, uint16_t key);
void devs_short_map_set(devs_ctx_t *ctx, devs_short_map_t *map, uint16_t key, value_t v);
devs_maplike_t *devs_maplike_get_proto(devs_ctx_t *ctx, devs_maplike_t *obj);
value_t devs_maplike_get_no_bind(devs_ctx_t *ctx, devs_maplike_t *proto, value_t key);
value_t devs_maplike_to_value(devs_ctx_t *ctx, devs_maplike_t *obj);

value_t devs_seq_get(devs_ctx_t *ctx, value_t seq, unsigned idx);
void devs_array_set(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, value_t v);
void devs_seq_set(devs_ctx_t *ctx, value_t seq, unsigned idx, value_t v);
int devs_array_insert(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, int count);
void devs_array_pin_push(devs_ctx_t *ctx, devs_array_t *arr, value_t v);

value_t devs_object_get(devs_ctx_t *ctx, value_t obj, value_t key);
value_t devs_object_get_built_in_field(devs_ctx_t *ctx, value_t obj, unsigned idx);
bool devs_instance_of(devs_ctx_t *ctx, value_t obj, devs_maplike_t *cls_proto);
devs_maplike_t *devs_get_prototype_field(devs_ctx_t *ctx, value_t cls);

// works on objects (including going up the proto chain), arrays, buffers, ...
value_t devs_any_get(devs_ctx_t *ctx, value_t obj, value_t key);
void devs_any_set(devs_ctx_t *ctx, value_t obj, value_t key, value_t v);

bool devs_can_attach(devs_ctx_t *ctx, value_t v);
devs_map_t *devs_object_get_attached_rw(devs_ctx_t *ctx, value_t v);
devs_maplike_t *devs_object_get_attached_ro(devs_ctx_t *ctx, value_t v);
devs_maplike_t *devs_object_get_attached_enum(devs_ctx_t *ctx, value_t v);

// DEVS_BUILTIN_OBJECT_*
devs_maplike_t *devs_get_builtin_object(devs_ctx_t *ctx, unsigned idx);
value_t devs_function_bind(devs_ctx_t *ctx, value_t obj, value_t v);
bool devs_is_service_spec(devs_ctx_t *ctx, const void *ptr);
const devs_packet_spec_t *devs_decode_role_packet(devs_ctx_t *ctx, value_t v, unsigned *roleidx);
const devs_service_spec_t *devs_value_to_service_spec(devs_ctx_t *ctx, value_t v);
int devs_value_to_service_spec_idx(devs_ctx_t *ctx, value_t v);
const devs_service_spec_t *devs_role_spec_for_class(devs_ctx_t *ctx, uint32_t service_class);
const devs_service_spec_t *devs_role_spec(devs_ctx_t *ctx, unsigned roleidx);
const devs_service_spec_t *devs_get_base_spec(devs_ctx_t *ctx, const devs_service_spec_t *spec);
int devs_packet_spec_parent(devs_ctx_t *ctx, const devs_packet_spec_t *pspec);
value_t devs_spec_lookup(devs_ctx_t *ctx, const devs_service_spec_t *spec, value_t key);
const devs_packet_spec_t *devs_pkt_spec_by_code(devs_ctx_t *ctx, const devs_service_spec_t *spec,
                                                uint16_t code);
uint16_t devs_get_spec_code(uint8_t frame_flags, uint16_t service_command);

value_t devs_builtin_object_value(devs_ctx_t *ctx, unsigned idx);
value_t devs_value_from_packet_spec(devs_ctx_t *ctx, const devs_packet_spec_t *pkt);
value_t devs_value_from_service_spec_idx(devs_ctx_t *ctx, unsigned idx);
value_t devs_value_from_service_spec(devs_ctx_t *ctx, const devs_service_spec_t *spec);
void devs_packet_encode(devs_ctx_t *ctx, const devs_packet_spec_t *pkt);

devs_packet_t *devs_value_to_packet_or_throw(devs_ctx_t *ctx, value_t self);

// GC

typedef struct _devs_gc_t devs_gc_t;

devs_map_t *devs_map_try_alloc(devs_ctx_t *ctx, devs_maplike_t *proto);
devs_short_map_t *devs_short_map_try_alloc(devs_ctx_t *ctx);
devs_array_t *devs_array_try_alloc(devs_ctx_t *ctx, unsigned size);
devs_buffer_t *devs_buffer_try_alloc(devs_ctx_t *ctx, unsigned size);
devs_string_t *devs_string_try_alloc(devs_ctx_t *ctx, unsigned size);
devs_string_jmp_t *devs_string_jmp_try_alloc(devs_ctx_t *ctx, unsigned size, unsigned length);
devs_any_string_t *devs_string_try_alloc_init(devs_ctx_t *ctx, const char *str, unsigned size);
char *devs_string_prep(devs_ctx_t *ctx, value_t *v, unsigned sz, unsigned len);
void devs_string_finish(devs_ctx_t *ctx, value_t *v, unsigned sz, unsigned len);

int devs_string_length(devs_ctx_t *ctx, value_t s);
int devs_string_index(devs_ctx_t *ctx, value_t s, unsigned idx);
int devs_string_jmp_index(const devs_utf8_string_t *dst, unsigned idx);
// assumes valid UTF8 input
unsigned devs_utf8_code_point_length(const char *data);
// assumes valid UTF8 input
unsigned devs_utf8_code_point(const char *data);
int devs_string_jmp_init(devs_ctx_t *ctx, devs_string_jmp_t *dst);
unsigned devs_utf8_from_code_point(unsigned ch, char buf[4]);
static inline bool devs_utf8_is_cont(int c) {
    return (c & 0xc0) == 0x80;
}

#define DEVS_UTF8_INIT_SET_DATA 0x01
#define DEVS_UTF8_INIT_SET_JMP 0x02
#define DEVS_UTF8_INIT_CHK_DATA 0x04
#define DEVS_UTF8_INIT_CHK_JMP 0x08
#define DEVS_UTF8_INIT_ERR_JMP_TBL -1
#define DEVS_UTF8_INIT_ERR_DATA -2
#define DEVS_UTF8_INIT_ERR_SIZES -3
#define DEVS_UTF8_INIT_ERR_NUL_TERM -4
int devs_utf8_init(const char *data, unsigned size, unsigned *out_len_p,
                   const devs_utf8_string_t *dst, unsigned flags);

// result has to be casted to one of devs_gc_object_t objects
void *devs_any_try_alloc(devs_ctx_t *ctx, unsigned tag, unsigned size);

devs_gc_t *devs_gc_create(void);
void devs_gc_set_ctx(devs_gc_t *gc, devs_ctx_t *ctx);
void devs_gc_destroy(devs_gc_t *gc);

#define DEVS_GC_MK_TAG_WORDS(tag, size) ((size) | ((uintptr_t)(tag) << DEVS_GC_TAG_POS))
#define DEVS_GC_MK_TAG_BYTES(tag, size)                                                            \
    DEVS_GC_MK_TAG_WORDS(tag, (size + JD_PTRSIZE - 1) / JD_PTRSIZE)

#define DEVS_BUILTIN_PROTO_INIT                                                                    \
    {                                                                                              \
        { DEVS_GC_MK_TAG_BYTES(DEVS_GC_TAG_BUILTIN_PROTO, sizeof(devs_builtin_proto_t)) }          \
    }

#define DEVS_GC_TAG_MASK_PENDING 0x80
#define DEVS_GC_TAG_MASK_SCANNED 0x20
#define DEVS_GC_TAG_MASK_PINNED 0x40
#define DEVS_GC_TAG_MASK 0xf // 0x1f should be possible

// update devs_gc_tag_name() when adding/reordering
#define DEVS_GC_TAG_NULL 0x0
#define DEVS_GC_TAG_FREE 0x1
#define DEVS_GC_TAG_BYTES 0x2
#define DEVS_GC_TAG_ARRAY 0x3
#define DEVS_GC_TAG_MAP 0x4
#define DEVS_GC_TAG_BUFFER 0x5
#define DEVS_GC_TAG_STRING 0x6
#define DEVS_GC_TAG_BOUND_FUNCTION 0x7
#define DEVS_GC_TAG_ACTIVATION 0x8
#define DEVS_GC_TAG_HALF_STATIC_MAP 0x9
#define DEVS_GC_TAG_SHORT_MAP 0xA
#define DEVS_GC_TAG_PACKET 0xB
#define DEVS_GC_TAG_STRING_JMP 0xC
#define DEVS_GC_TAG_BUILTIN_PROTO DEVS_GC_TAG_MASK // these are not in GC heap!
#define DEVS_GC_TAG_FINAL (DEVS_GC_TAG_MASK | DEVS_GC_TAG_MASK_PINNED)

static inline int devs_gc_tag(const void *ptr) {
    return ptr == NULL ? DEVS_GC_TAG_NULL
                       : (((devs_gc_object_t *)ptr)->header >> DEVS_GC_TAG_POS) & DEVS_GC_TAG_MASK;
}

void devs_gc_obj_check(devs_ctx_t *ctx, const void *ptr);

static inline bool devs_is_map(const void *ptr) {
    int t = devs_gc_tag(ptr);
    return t == DEVS_GC_TAG_MAP || t == DEVS_GC_TAG_HALF_STATIC_MAP;
}

static inline bool devs_is_proto(const void *ptr) {
    return devs_gc_tag(ptr) == DEVS_GC_TAG_BUILTIN_PROTO;
}

const char *devs_gc_tag_name(unsigned tag);

void jd_gc_unpin(devs_gc_t *gc, void *ptr);
void jd_gc_free(devs_gc_t *gc, void *ptr);
#if JD_64
void *devs_gc_base_addr(devs_gc_t *gc);
#else
static inline void *devs_gc_base_addr(devs_gc_t *gc) {
    return NULL;
}
#endif

void *devs_value_to_gc_obj(devs_ctx_t *ctx, value_t v);

// returns pointer to a static buffer!
const char *devs_show_value(devs_ctx_t *ctx, value_t v);
void devs_log_value(devs_ctx_t *ctx, const char *lbl, value_t v);
