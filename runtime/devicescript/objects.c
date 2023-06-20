#include "devs_internal.h"
#include "devs_objects.h"

// #define LOG_TAG "obj"
#include "devs_logging.h"

void devs_map_clear(devs_ctx_t *ctx, devs_map_t *map) {
    if (map->data) {
        devs_free(ctx, map->data);
        map->data = NULL;
        map->capacity = 0;
        map->length = 0;
    }
}

static inline uint16_t *short_keys(devs_short_map_t *map) {
    return (uint16_t *)(map->short_data + map->capacity);
}

static value_t *lookup_short(devs_ctx_t *ctx, devs_short_map_t *map, uint16_t key) {
    unsigned len = map->length;
    uint16_t *keys = short_keys(map);
    for (unsigned i = 0; i < len; i++) {
        if (keys[i] == key) {
            return &map->short_data[i];
        }
    }
    return NULL;
}

static value_t *lookup(devs_ctx_t *ctx, devs_map_t *map, value_t key) {
    if (!devs_is_string(ctx, key))
        return NULL;

    value_t *data = map->data;
    uint32_t kh = devs_handle_value(key);
    unsigned len2 = map->length * 2;

    // do a quick reference-only check
    for (unsigned i = 0; i < len2; i += 2) {
        // check the low bits first, since they are more likely to be different
        if (devs_handle_value(data[i]) == kh && data[i].u64 == key.u64) {
            return &data[i + 1];
        }
    }

    // slow path - compare strings
    unsigned ksz, csz;
    const char *cp, *kp = devs_string_get_utf8(ctx, key, &ksz);
    for (unsigned i = 0; i < len2; i += 2) {
        cp = devs_string_get_utf8(ctx, data[i], &csz);
        if (csz == ksz && memcmp(kp, cp, ksz) == 0)
            return &data[i + 1];
    }

    // nothing found...
    return NULL;
}

static value_t proto_value(devs_ctx_t *ctx, const devs_builtin_proto_entry_t *p) {
    unsigned idx = p->builtin_idx;
    if (idx <= DEVS_BUILTIN_OBJECT___MAX)
        return devs_builtin_object_value(ctx, idx);
    JD_ASSERT(idx >= DEVS_FIRST_BUILTIN_FUNCTION);
    return devs_value_from_handle(DEVS_HANDLE_TYPE_STATIC_FUNCTION, idx);
}

unsigned devs_maplike_iter(devs_ctx_t *ctx, devs_maplike_t *src, void *userdata,
                           devs_map_iter_cb_t cb) {
    if (devs_is_service_spec(ctx, src)) {
        // Object.keys() etc or debugger inspection on compiled spec
        // return empty for now, do not crash
        return 0;
    } else if (devs_is_builtin_proto(src)) {
        const devs_builtin_proto_t *proto = (const devs_builtin_proto_t *)src;
        const devs_builtin_proto_entry_t *p = proto->entries;
        while (p->builtin_string_id) {
            if (cb)
                cb(ctx, userdata, devs_builtin_string(p->builtin_string_id), proto_value(ctx, p));
            p++;
        }
        return p - proto->entries;
    } else {
        JD_ASSERT(devs_is_map(src));
        devs_map_t *srcmap = (devs_map_t *)src;
        unsigned len = srcmap->length;

        if (cb != NULL) {
            unsigned len2 = srcmap->length * 2;
            value_t *data = srcmap->data;
            for (unsigned i = 0; i < len2; i += 2) {
                cb(ctx, userdata, data[i], data[i + 1]);
            }
        }

        if (devs_gc_tag(srcmap) == DEVS_GC_TAG_HALF_STATIC_MAP)
            len += devs_maplike_iter(ctx, srcmap->proto, userdata, cb);

        return len;
    }
}

void devs_map_copy_into(devs_ctx_t *ctx, devs_map_t *dst, devs_maplike_t *src) {
    devs_maplike_iter(ctx, src, dst, (devs_map_iter_cb_t)devs_map_set);
}

struct kv_ctx {
    unsigned dp;
    bool keys;
    devs_array_t *arr;
};

static void kv_add(devs_ctx_t *ctx, void *userdata, value_t k, value_t v) {
    struct kv_ctx *acc = userdata;
    acc->arr->data[acc->dp++] = acc->keys ? k : v;
}

bool devs_maplike_is_map(devs_ctx_t *ctx, devs_maplike_t *src) {
    if (src == NULL || devs_is_builtin_proto(src) || devs_is_service_spec(ctx, src))
        return false;
    JD_ASSERT(devs_is_map(src));
    return true;
}

void devs_maplike_keys_or_values(devs_ctx_t *ctx, devs_maplike_t *src, devs_array_t *arr,
                                 bool keys) {
    struct kv_ctx acc = {
        .dp = arr->length,
        .arr = arr,
        .keys = keys,
    };

    unsigned len = devs_maplike_iter(ctx, src, NULL, NULL);

    if (devs_array_insert(ctx, arr, acc.dp, len) != 0)
        return;

    devs_maplike_iter(ctx, src, &acc, kv_add);
}

static int grow_len(int capacity) {
    int newlen = capacity * 10 / 8;
    if (newlen < 4)
        newlen = 4;
    return newlen;
}

void devs_map_set(devs_ctx_t *ctx, devs_map_t *map, value_t key, value_t v) {
    value_t *tmp = lookup(ctx, map, key);
    if (tmp != NULL) {
        *tmp = v;
        return;
    }

    if (!devs_is_string(ctx, key)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_STRING, key);
        return;
    }

    JD_ASSERT(map->capacity >= map->length);

    if (map->capacity == map->length) {
        int newlen = grow_len(map->capacity);
        tmp = devs_try_alloc(ctx, newlen * (2 * sizeof(value_t)));
        if (!tmp)
            return;
        map->capacity = newlen;
        if (map->length) {
            memcpy(tmp, map->data, map->length * sizeof(value_t) * 2);
        }
        map->data = tmp;
        jd_gc_unpin(ctx->gc, tmp);
    }

    map->data[map->length * 2] = key;
    map->data[map->length * 2 + 1] = v;
    map->length++;
}

void devs_short_map_set(devs_ctx_t *ctx, devs_short_map_t *map, uint16_t key, value_t v) {
    value_t *tmp = lookup_short(ctx, map, key);
    if (tmp != NULL) {
        *tmp = v;
        return;
    }

    JD_ASSERT(map->capacity >= map->length);

    if (map->capacity == map->length) {
        int newlen = grow_len(map->capacity);
        tmp = devs_try_alloc(ctx, newlen * (sizeof(value_t) + sizeof(uint16_t)));
        if (!tmp)
            return;
        uint16_t *srckeys = short_keys(map);
        map->capacity = newlen;
        if (map->length) {
            memcpy(tmp, map->short_data, map->length * sizeof(value_t));
            memcpy(tmp + newlen, srckeys, map->length * sizeof(uint16_t));
        }
        map->short_data = tmp;
        jd_gc_unpin(ctx->gc, tmp);
    }

    map->short_data[map->length] = v;
    short_keys(map)[map->length] = key;
    map->length++;
}

int devs_map_delete(devs_ctx_t *ctx, devs_map_t *map, value_t key) {
    value_t *tmp = lookup(ctx, map, key);
    if (tmp == NULL) {
        return -1;
    }

    tmp--;
    unsigned off = tmp - map->data;
    unsigned trailing = map->length - off / 2 - 1;
    map->length--;
    if (trailing)
        memmove(tmp, tmp + 2, trailing * 2 * sizeof(value_t));
    return 0;
}

bool devs_is_service_spec(devs_ctx_t *ctx, const void *ptr) {
    return (uintptr_t)((const uint8_t *)ptr -
                       (const uint8_t *)devs_img_get_service_spec(ctx->img, 0)) <
           (sizeof(devs_service_spec_t) * ctx->img.header->num_service_specs);
}

value_t devs_map_get(devs_ctx_t *ctx, devs_map_t *map, value_t key) {
    value_t *tmp = lookup(ctx, map, key);
    if (tmp == NULL)
        return devs_undefined;
    return *tmp;
}

value_t devs_short_map_get(devs_ctx_t *ctx, devs_short_map_t *map, uint16_t key) {
    value_t *tmp = lookup_short(ctx, map, key);
    if (tmp == NULL)
        return devs_undefined;
    return *tmp;
}

static const devs_builtin_proto_t *get_static_built_in_proto(devs_ctx_t *ctx, unsigned idx) {
    JD_ASSERT(idx <= DEVS_BUILTIN_OBJECT___MAX);
    if (devs_builtin_protos[idx].entries == NULL)
        return NULL; // not there?
    return &devs_builtin_protos[idx];
}

static const uint8_t builtin_proto_idx[] = {
    [DEVS_BUILTIN_OBJECT_MATH] = 1,
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = 2,
    [DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE] = 3,
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = 4,
    [DEVS_BUILTIN_OBJECT_DSREGISTER_PROTOTYPE] = 5,
    [DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE] = 6,
    [DEVS_BUILTIN_OBJECT_DSEVENT_PROTOTYPE] = 7,
    [DEVS_BUILTIN_OBJECT_DEVICESCRIPT] = 8,
    [DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE] = 9,
    [DEVS_BUILTIN_OBJECT_BUFFER] = 10,
    [DEVS_BUILTIN_OBJECT_GPIO_PROTOTYPE] = 11,
};
#define MAX_PROTO 11

devs_maplike_t *devs_get_builtin_object(devs_ctx_t *ctx, unsigned idx) {
    if (idx < sizeof(builtin_proto_idx)) {
        unsigned midx = builtin_proto_idx[idx];
        if (midx > 0) {
            midx--;
            if (ctx->_builtin_protos == NULL) {
                ctx->_builtin_protos = devs_try_alloc(ctx, sizeof(void *) * MAX_PROTO);
                ctx->_num_builtin_protos = MAX_PROTO;
                if (ctx->_builtin_protos == NULL)
                    return NULL; // whoops
            }
            JD_ASSERT(midx < MAX_PROTO);
            devs_map_t *m = ctx->_builtin_protos[midx];
            if (m == NULL) {
                m = devs_any_try_alloc(ctx, DEVS_GC_TAG_HALF_STATIC_MAP, sizeof(devs_map_t));
                if (m != NULL) {
                    ctx->_builtin_protos[midx] = m;
                    m->proto = (devs_maplike_t *)get_static_built_in_proto(ctx, idx);
                }
            }
            return (devs_maplike_t *)m;
        }
    }

    return (devs_maplike_t *)get_static_built_in_proto(ctx, idx);
}

bool devs_static_streq(devs_ctx_t *ctx, unsigned stridx, const char *other, unsigned other_len) {
    unsigned size;
    const char *r = devs_img_get_utf8(ctx->img, stridx, &size);
    if (other_len != size)
        return false;
    return memcmp(r, other, size) == 0;
}

#define MAX_OFF_BITS (DEVS_PACK_SHIFT - DEVS_ROLE_BITS)

value_t devs_value_from_service_spec_idx(devs_ctx_t *ctx, unsigned idx) {
    return devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE_MEMBER,
                                  DEVS_ROLE_INVALID | (idx << DEVS_ROLE_BITS));
}

value_t devs_value_from_service_spec(devs_ctx_t *ctx, const devs_service_spec_t *spec) {
    unsigned idx = spec - devs_img_get_service_spec(ctx->img, 0);
    JD_ASSERT(idx < ctx->img.header->num_service_specs);
    return devs_value_from_service_spec_idx(ctx, idx);
}

value_t devs_value_from_packet_spec(devs_ctx_t *ctx, const devs_packet_spec_t *pkt) {
    if (pkt == NULL)
        return devs_undefined;
    const uint32_t *baseoff = (const void *)devs_img_get_service_spec(ctx->img, 0);
    uintptr_t off = (const uint32_t *)pkt - baseoff;
    JD_ASSERT(off < (1 << MAX_OFF_BITS));
    return devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE_MEMBER,
                                  DEVS_ROLE_INVALID | (off << DEVS_ROLE_BITS));
}

int devs_value_to_service_spec_idx(devs_ctx_t *ctx, value_t v) {
    if (devs_handle_type(v) != DEVS_HANDLE_TYPE_ROLE_MEMBER)
        return -1;
    unsigned off = devs_handle_value(v) >> DEVS_ROLE_BITS;
    if (off < ctx->img.header->num_service_specs)
        return off;
    return -1;
}

const devs_service_spec_t *devs_value_to_service_spec(devs_ctx_t *ctx, value_t v) {
    int off = devs_value_to_service_spec_idx(ctx, v);
    if (off < 0)
        return NULL;
    return devs_img_get_service_spec(ctx->img, off);
}

const devs_packet_spec_t *devs_decode_role_packet(devs_ctx_t *ctx, value_t v, unsigned *roleidx) {
    if (roleidx)
        *roleidx = DEVS_ROLE_INVALID;
    if (devs_handle_type(v) != DEVS_HANDLE_TYPE_ROLE_MEMBER)
        return NULL;
    if (devs_value_to_service_spec(ctx, v))
        return NULL;
    uint32_t h = devs_handle_value(v);
    if (roleidx)
        *roleidx = h & DEVS_ROLE_MASK;
    return devs_img_get_packet_spec(ctx->img, h >> DEVS_ROLE_BITS);
}

int devs_spec_idx(devs_ctx_t *ctx, const devs_service_spec_t *spec) {
    if (spec == NULL)
        return -1;
    unsigned idx = spec - devs_img_get_service_spec(ctx->img, 0);
    JD_ASSERT(idx < ctx->img.header->num_service_specs);
    return idx;
}

const devs_service_spec_t *devs_role_spec_for_class(devs_ctx_t *ctx, uint32_t cls) {
    for (unsigned i = 0; i < ctx->img.header->num_service_specs; ++i) {
        const devs_service_spec_t *spec = devs_img_get_service_spec(ctx->img, i);
        if (spec->service_class == cls)
            return spec;
    }
    return NULL;
}

int devs_packet_spec_parent(devs_ctx_t *ctx, const devs_packet_spec_t *pspec) {
    int off = (uint8_t *)pspec - ctx->img.data - ctx->img.header->service_specs.start;
    for (unsigned i = 0; i < ctx->img.header->num_service_specs; ++i) {
        const devs_service_spec_t *spec = devs_img_get_service_spec(ctx->img, i);
        int idx = off - 4 * spec->packets_offset;
        if (0 <= idx && idx < (int)(spec->num_packets * sizeof(devs_packet_spec_t)))
            return i;
    }
    JD_PANIC();
    return -1;
}

const devs_service_spec_t *devs_role_spec(devs_ctx_t *ctx, unsigned roleidx) {
    if (roleidx >= DEVS_ROLE_FIRST_SPEC) {
        unsigned specidx = roleidx - DEVS_ROLE_FIRST_SPEC;
        if (specidx >= ctx->img.header->num_service_specs)
            return NULL;
        return devs_img_get_service_spec(ctx->img, specidx);
    }

    devs_role_t *r = devs_role(ctx, roleidx);

    if (!r)
        return NULL;

    return devs_role_spec_for_class(ctx, r->jdrole->service_class);
}

devs_role_t *devs_role_or_fail(devs_ctx_t *ctx, unsigned roleidx) {
    devs_role_t *r = devs_role(ctx, roleidx);
    if (r == NULL)
        devs_invalid_program(ctx, 60130);
    return r;
}

jd_device_service_t *devs_role_service(devs_ctx_t *ctx, unsigned roleidx) {
    devs_role_t *r = devs_role(ctx, roleidx);
    if (r == NULL)
        return NULL;
    return r->jdrole->service;
}

const char *devs_role_name(devs_ctx_t *ctx, unsigned idx) {
    devs_role_t *r = devs_role(ctx, idx);
    if (r == NULL)
        return "???";
    return r->jdrole->name;
}

const devs_service_spec_t *devs_get_base_spec(devs_ctx_t *ctx, const devs_service_spec_t *spec) {
    if (spec->service_class == JD_SERVICE_CLASS_BASE)
        return NULL;
    int idx = spec->flags & DEVS_SERVICESPEC_FLAG_DERIVE_MASK;
    JD_ASSERT(idx <= DEVS_SERVICESPEC_FLAG_DERIVE_LAST);
    return devs_img_get_service_spec(ctx->img, idx);
}

value_t devs_spec_lookup(devs_ctx_t *ctx, const devs_service_spec_t *spec, value_t key) {
    while (spec) {
        JD_ASSERT(devs_is_service_spec(ctx, spec));
        const devs_packet_spec_t *pkts = devs_img_get_packet_spec(ctx->img, spec->packets_offset);
        unsigned num_packets = spec->num_packets;

        if (devs_handle_type(key) == DEVS_HANDLE_TYPE_IMG_BUFFERISH) {
            unsigned kidx = devs_handle_value(key);
            for (unsigned i = 0; i < num_packets; ++i) {
                if (pkts[i].name_idx == kidx)
                    return devs_value_from_packet_spec(ctx, &pkts[i]);
            }
        }

        unsigned ksz;
        const char *kptr = devs_string_get_utf8(ctx, key, &ksz);
        if (ksz == 0)
            return devs_undefined;

        for (unsigned i = 0; i < num_packets; ++i) {
            if (devs_static_streq(ctx, pkts[i].name_idx, kptr, ksz))
                return devs_value_from_packet_spec(ctx, &pkts[i]);
        }

        spec = devs_get_base_spec(ctx, spec);
    }

    return devs_undefined;
}

static value_t devs_proto_lookup(devs_ctx_t *ctx, const devs_builtin_proto_t *proto, value_t key) {
    JD_ASSERT(devs_is_proto(proto));

    while (proto) {
        const devs_builtin_proto_entry_t *p = proto->entries;

        if (devs_handle_type(key) == DEVS_HANDLE_TYPE_IMG_BUFFERISH &&
            (devs_handle_value(key) >> DEVS_STRIDX__SHIFT) == DEVS_STRIDX_BUILTIN) {
            unsigned kidx = devs_handle_value(key) & ((1 << DEVS_STRIDX__SHIFT) - 1);
            while (p->builtin_string_id) {
                if (p->builtin_string_id == kidx)
                    return proto_value(ctx, p);
                p++;
            }
        } else {
            unsigned ksz;
            const char *kptr = devs_string_get_utf8(ctx, key, &ksz);
            if (ksz != strlen(kptr))
                return devs_undefined;
            while (p->builtin_string_id) {
                if (strcmp(devs_builtin_string_by_idx(p->builtin_string_id), kptr) == 0)
                    return proto_value(ctx, p);
                p++;
            }
        }

        proto = proto->parent;
    }

    return devs_undefined;
}

static value_t devs_function_bind_alloc(devs_ctx_t *ctx, value_t obj, value_t fn) {
    devs_bound_function_t *res =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_BOUND_FUNCTION, sizeof(devs_bound_function_t));
    if (res == NULL)
        return devs_undefined;

    res->this_val = obj;
    res->func = fn;
    return devs_value_from_gc_obj(ctx, res);
}

static const devs_builtin_function_t *devs_get_property_desc(devs_ctx_t *ctx, value_t fn) {
    int htp = devs_handle_type(fn);

    if (htp != DEVS_HANDLE_TYPE_STATIC_FUNCTION)
        return NULL;

    unsigned fidx = devs_handle_value(fn);

    int bltin = fidx - DEVS_FIRST_BUILTIN_FUNCTION;
    if (bltin >= 0) {
        JD_ASSERT(bltin < devs_num_builtin_functions);
        const devs_builtin_function_t *h = &devs_builtin_functions[bltin];
        if (h->flags & DEVS_BUILTIN_FLAG_IS_PROPERTY) {
            JD_ASSERT(h->num_args == 0);
            return h;
        }
    }

    return NULL;
}

// if `fn` is a static function, return `(obj, fn)` tuple
// if `fn` is a role member and `obj` is role, return (a different) `(obj, fn)` tuple
// otherwise return `obj`
// it may allocate an object for the tuple, but typically it doesn't
value_t devs_function_bind(devs_ctx_t *ctx, value_t obj, value_t fn) {
    int htp = devs_handle_type(fn);

    if (htp == DEVS_HANDLE_TYPE_ROLE_MEMBER && devs_handle_type(obj) == DEVS_HANDLE_TYPE_ROLE &&
        !devs_value_to_service_spec(ctx, fn)) {
        uint32_t role = devs_handle_value(obj);
        JD_ASSERT((role & DEVS_ROLE_MASK) == role);
        role |= devs_handle_value(fn) & ~DEVS_ROLE_MASK;
        return devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE_MEMBER, role);
    }

    if (htp == DEVS_HANDLE_TYPE_CLOSURE)
        return devs_function_bind_alloc(ctx, obj, fn);

    if (htp != DEVS_HANDLE_TYPE_STATIC_FUNCTION)
        return fn;

    const devs_builtin_function_t *h = devs_get_property_desc(ctx, fn);
    if (h)
        return h->handler.prop(ctx, obj);

    unsigned fidx = devs_handle_value(fn);
    int otp = devs_handle_type(obj);

    if (fidx <= 0xffff)
        switch (otp) {
        case DEVS_HANDLE_TYPE_SPECIAL:
        case DEVS_HANDLE_TYPE_FIBER:
        case DEVS_HANDLE_TYPE_ROLE:
        case DEVS_HANDLE_TYPE_ROLE_MEMBER:
        case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
        case DEVS_HANDLE_TYPE_IMG_BUFFERISH: {
            uint32_t hv = devs_handle_value(obj);
            JD_ASSERT((((uint32_t)otp << DEVS_PACK_SHIFT) >> DEVS_PACK_SHIFT) == (uint32_t)otp);
            JD_ASSERT((hv >> DEVS_PACK_SHIFT) == 0);
            JD_ASSERT(devs_handle_high_value(obj) == 0);
            return devs_value_from_handle(DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC | (fidx << 4),
                                          (otp << DEVS_PACK_SHIFT) | hv);
        }

        case DEVS_HANDLE_TYPE_GC_OBJECT:
            JD_ASSERT(devs_handle_high_value(obj) == 0);
            return devs_value_from_handle(DEVS_HANDLE_TYPE_BOUND_FUNCTION | (fidx << 4),
                                          devs_handle_value(obj));
        }

    return devs_function_bind_alloc(ctx, obj, fn);
}

value_t devs_make_closure(devs_ctx_t *ctx, devs_activation_t *closure, unsigned fnidx) {
    JD_ASSERT(fnidx <= 0xffff);
    return devs_value_from_pointer(ctx, DEVS_HANDLE_TYPE_CLOSURE | (fnidx << 4), closure);
}

static int devs_get_fnidx_core(devs_ctx_t *ctx, value_t src, value_t *this_val,
                               devs_activation_t **closure, int depth) {
    *closure = NULL;
    *this_val = devs_undefined;

    if (depth > 2)
        return -1;

    uint32_t hv = devs_handle_value(src);
    switch (devs_handle_type(src)) {
    case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
        *this_val = devs_undefined;
        return hv;
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC:
        *this_val =
            devs_value_from_handle(hv >> DEVS_PACK_SHIFT, hv & ((1 << DEVS_PACK_SHIFT) - 1));
        return devs_handle_high_value(src);
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION:
        *this_val = devs_value_from_handle(DEVS_HANDLE_TYPE_GC_OBJECT, hv);
        return devs_handle_high_value(src);
    case DEVS_HANDLE_TYPE_CLOSURE:
        *closure = devs_handle_ptr_value(ctx, src);
        return devs_handle_high_value(src);
    case DEVS_HANDLE_TYPE_GC_OBJECT: {
        devs_bound_function_t *bnd = devs_handle_ptr_value(ctx, src);
        if (devs_gc_tag(bnd) == DEVS_GC_TAG_BOUND_FUNCTION) {
            int r = devs_get_fnidx_core(ctx, bnd->func, this_val, closure, depth + 1);
            *this_val = bnd->this_val;
            return r;
        } else {
            return -1;
        }
    }
    default: {
        if (devs_is_nullish(src))
            return -1;
        value_t f = devs_object_get_built_in_field(ctx, src, DEVS_BUILTIN_STRING___FUNC__);
        if (devs_is_undefined(f))
            return -1;
        else {
            int r = devs_get_fnidx_core(ctx, f, this_val, closure, depth + 1);
            *this_val = src;
            return r;
        }
    }
    }
}

int devs_get_fnidx(devs_ctx_t *ctx, value_t src, value_t *this_val, devs_activation_t **closure) {
    return devs_get_fnidx_core(ctx, src, this_val, closure, 0);
}

#define ATTACH_RW 0x01
#define ATTACH_ENUM 0x02
#define ATTACH_DIRECT 0x04

static void throw_field_error_str(devs_ctx_t *ctx, unsigned attach_flags, const char *objdesc) {
    const char *op = attach_flags & ATTACH_RW ? "setting" : "getting";
    char *objd = jd_strdup(objdesc);

    if (devs_is_undefined(ctx->diag_field))
        devs_throw_type_error(ctx, "%s fields of %s", op, objd);
    else
        devs_throw_type_error(ctx, "%s field '%s' of %s", op, devs_show_value(ctx, ctx->diag_field),
                              objd);

    jd_free(objd);
}

static void throw_field_error(devs_ctx_t *ctx, unsigned attach_flags, value_t v) {
    throw_field_error_str(ctx, attach_flags, devs_show_value(ctx, v));
}

static devs_maplike_t *devs_get_static_proto(devs_ctx_t *ctx, int tp, unsigned attach_flags) {
    if ((attach_flags & (ATTACH_DIRECT | ATTACH_ENUM)) == ATTACH_ENUM)
        return NULL;

    devs_maplike_t *r = devs_get_builtin_object(ctx, tp);

    // accessing prototype on static object - can't attach properties
    if (attach_flags & ATTACH_RW) {
        if (attach_flags & ATTACH_DIRECT) {
            if (devs_is_builtin_proto(r)) {
                throw_field_error_str(ctx, attach_flags, "a builtin frozen object");
                return NULL;
            } else {
                JD_ASSERT(devs_is_map(r));
                return r;
            }
        } else {
            // note that in ES writing to string/... properties is no-op
            // we make it an error
            throw_field_error_str(ctx, attach_flags, "a primitive");
            return NULL;
        }
    } else {
        return r;
    }
}

devs_map_t *devs_get_spec_proto(devs_ctx_t *ctx, uint32_t spec_idx) {
    value_t r = devs_short_map_get(ctx, ctx->spec_protos, spec_idx);
    if (!devs_is_undefined(r))
        return devs_value_to_gc_obj(ctx, r);

    devs_map_t *m = devs_any_try_alloc(ctx, DEVS_GC_TAG_HALF_STATIC_MAP, sizeof(devs_map_t));
    if (m == NULL)
        return NULL;
    value_t v = devs_value_from_gc_obj(ctx, m);
    devs_value_pin(ctx, v);
    m->proto = (const void *)devs_img_get_service_spec(ctx->img, spec_idx);
    devs_short_map_set(ctx, ctx->spec_protos, spec_idx, v);
    devs_value_unpin(ctx, v);
    return m;
}

devs_map_t *devs_get_role_proto(devs_ctx_t *ctx, unsigned roleidx) {
    devs_role_t *r = devs_role(ctx, roleidx);
    if (!r)
        return NULL;

    const devs_service_spec_t *spec = devs_role_spec_for_class(ctx, r->jdrole->service_class);
    int idx = devs_spec_idx(ctx, spec);
    if (idx < 0)
        return NULL; // ???

    return devs_get_spec_proto(ctx, idx);
}

static devs_maplike_t *devs_object_get_attached(devs_ctx_t *ctx, value_t v, unsigned attach_flags) {
    static const uint8_t proto_by_object_type[] = {
        [DEVS_OBJECT_TYPE_NUMBER] = DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE,
        [DEVS_OBJECT_TYPE_FIBER] = DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE,
        [DEVS_OBJECT_TYPE_ROLE] = DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE,
        [DEVS_OBJECT_TYPE_FUNCTION] = DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE,
        [DEVS_OBJECT_TYPE_STRING] = DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE,
        [DEVS_OBJECT_TYPE_BUFFER] = DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE,
        [DEVS_OBJECT_TYPE_IMAGE] = DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE,
        [DEVS_OBJECT_TYPE_BOOL] = DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE,
        [DEVS_OBJECT_TYPE_EXOTIC] = DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE,
    };

    if (devs_is_null_or_undefined(v)) {
        throw_field_error(ctx, attach_flags, v);
        return NULL;
    }

    int htp = devs_handle_type(v);

    if (htp == DEVS_HANDLE_TYPE_ROLE_MEMBER) {
        unsigned roleidx;
        int pt;
        const devs_packet_spec_t *spec = devs_decode_role_packet(ctx, v, &roleidx);
        if (roleidx == DEVS_ROLE_INVALID)
            pt = devs_value_to_service_spec(ctx, v) ? DEVS_BUILTIN_OBJECT_DSSERVICESPEC_PROTOTYPE
                                                    : DEVS_BUILTIN_OBJECT_DSPACKETSPEC_PROTOTYPE;
        else
            switch (spec->code & DEVS_PACKETSPEC_CODE_MASK) {
            case DEVS_PACKETSPEC_CODE_REGISTER:
                pt = DEVS_BUILTIN_OBJECT_DSREGISTER_PROTOTYPE;
                break;
            case DEVS_PACKETSPEC_CODE_EVENT:
                pt = DEVS_BUILTIN_OBJECT_DSEVENT_PROTOTYPE;
                break;
            case DEVS_PACKETSPEC_CODE_COMMAND:
                pt = DEVS_BUILTIN_OBJECT_DSCOMMAND_PROTOTYPE;
                break;
            case DEVS_PACKETSPEC_CODE_REPORT:
                pt = DEVS_BUILTIN_OBJECT_DSREPORT_PROTOTYPE;
                break;
            default:
                JD_PANIC();
            }
        return devs_get_static_proto(ctx, pt, attach_flags);
    }

    if (htp == DEVS_HANDLE_TYPE_ROLE) {
        unsigned roleidx = devs_handle_value(v);
        devs_role_t *rl = devs_role(ctx, roleidx);
        if (!rl)
            return NULL;
        const void *r = rl->attached;
        if (r || (attach_flags & ATTACH_ENUM))
            return r;
        r = devs_get_role_proto(ctx, roleidx);
        if (!r)
            return NULL;
        if (attach_flags & ATTACH_RW) {
            devs_map_t *m = devs_map_try_alloc(ctx, r);
            rl->attached = m;
            r = m;
        }
        return r;
    }

    if (htp != DEVS_HANDLE_TYPE_GC_OBJECT) {
        int pt = 0;
        int tp = devs_value_typeof(ctx, v);
        if (tp == DEVS_OBJECT_TYPE_MAP && devs_is_special(v)) {
            uint32_t hv = devs_handle_value(v);
            if (devs_handle_is_builtin(hv))
                return devs_get_static_proto(ctx, hv - DEVS_SPECIAL_BUILTIN_OBJ_FIRST,
                                             attach_flags | ATTACH_DIRECT);
        }
        if (tp == DEVS_OBJECT_TYPE_FUNCTION) {
            value_t this_val;
            devs_activation_t *closure;
            int fidx = devs_get_fnidx(ctx, v, &this_val, &closure);
            if (fidx >= 0) {
                value_t r = devs_short_map_get(ctx, ctx->fn_values, fidx);
                if (devs_is_undefined(r) && attach_flags) {
                    r = devs_value_from_gc_obj(
                        ctx,
                        devs_map_try_alloc(ctx, devs_get_builtin_object(
                                                    ctx, DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE)));
                    if (!devs_is_undefined(r)) {
                        devs_value_pin(ctx, r);
                        devs_short_map_set(ctx, ctx->fn_values, fidx, r);
                        devs_value_unpin(ctx, r);
                    }
                }
                if (!devs_is_undefined(r))
                    return devs_value_to_gc_obj(ctx, r);
            }
        }
        if (tp < (int)sizeof(proto_by_object_type)) {
            pt = proto_by_object_type[tp];
        }
        JD_ASSERT(pt != 0);
        return devs_get_static_proto(ctx, pt, attach_flags);
    }

    devs_gc_object_t *obj = devs_handle_ptr_value(ctx, v);

    devs_map_t **attached;
    int builtin;

    switch (devs_gc_tag(obj)) {
    case DEVS_GC_TAG_BUFFER:
        attached = &((devs_buffer_t *)obj)->attached;
        builtin = DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE;
        break;
    case DEVS_GC_TAG_IMAGE:
        attached = &((devs_gimage_t *)obj)->attached;
        builtin = DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE;
        break;
    case DEVS_GC_TAG_ARRAY:
        attached = &((devs_array_t *)obj)->attached;
        builtin = DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE;
        break;
    case DEVS_GC_TAG_PACKET:
        attached = &((devs_packet_t *)obj)->attached;
        builtin = DEVS_BUILTIN_OBJECT_DSPACKET_PROTOTYPE;
        break;
    case DEVS_GC_TAG_HALF_STATIC_MAP:
    case DEVS_GC_TAG_MAP:
        return (devs_maplike_t *)obj;
    case DEVS_GC_TAG_STRING_JMP:
    case DEVS_GC_TAG_STRING:
        return devs_get_static_proto(ctx, DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE, attach_flags);
    case DEVS_GC_TAG_BOUND_FUNCTION:
        return devs_get_static_proto(ctx, DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE, attach_flags);
    case DEVS_GC_TAG_BUILTIN_PROTO:
    case DEVS_GC_TAG_SHORT_MAP:
    default:
        JD_PANIC();
        break;
    }

    devs_map_t *map = *attached;

    if (!map && (attach_flags & ATTACH_RW)) {
        map = *attached = devs_map_try_alloc(ctx, devs_get_builtin_object(ctx, builtin));
        if (map == NULL)
            return NULL;
    }

    if (map || (attach_flags & ATTACH_ENUM))
        return (devs_maplike_t *)map;
    else
        return devs_get_builtin_object(ctx, builtin);
}

devs_map_t *devs_object_get_attached_rw(devs_ctx_t *ctx, value_t v) {
    const void *r = devs_object_get_attached(ctx, v, ATTACH_RW);
    JD_ASSERT(r == NULL || devs_is_map(r));
    ctx->diag_field = devs_undefined;
    return (void *)r;
}

devs_maplike_t *devs_object_get_attached_ro(devs_ctx_t *ctx, value_t v) {
    devs_maplike_t *r = devs_object_get_attached(ctx, v, 0);
    ctx->diag_field = devs_undefined;
    return r;
}

devs_maplike_t *devs_object_get_attached_enum(devs_ctx_t *ctx, value_t v) {
    devs_maplike_t *r = devs_object_get_attached(ctx, v, ATTACH_ENUM);
    ctx->diag_field = devs_undefined;
    return r;
}

devs_maplike_t *devs_maplike_get_proto(devs_ctx_t *ctx, devs_maplike_t *obj) {
    const void *res;

    if (devs_is_builtin_proto(obj)) {
        res = ((const devs_builtin_proto_t *)obj)->parent;
    } else if (devs_is_service_spec(ctx, obj)) {
        res = devs_get_builtin_object(ctx, DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE);
    } else {
        JD_ASSERT(devs_is_map(obj));
        devs_map_t *map = (devs_map_t *)obj;
        return map->proto;
    }

    if (res == NULL)
        res = devs_get_builtin_object(ctx, DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE);
    if (obj == res) // Object.prototype.__proto__ == NULL
        return NULL;
    return res;
}

devs_maplike_t *devs_get_prototype_field(devs_ctx_t *ctx, value_t cls) {
    value_t cls_proto_val = devs_object_get_built_in_field(ctx, cls, DEVS_BUILTIN_STRING_PROTOTYPE);
    if (devs_is_undefined(cls_proto_val)) {
        if (!ctx->in_throw)
            devs_throw_type_error(ctx, "no .prototype");
        return NULL;
    } else {
        devs_maplike_t *cls_proto = devs_object_get_attached_enum(ctx, cls_proto_val);
        if (cls_proto == NULL)
            devs_throw_type_error(ctx, "invalid .prototype");
        return cls_proto;
    }
}

bool devs_instance_of(devs_ctx_t *ctx, value_t obj, devs_maplike_t *cls_proto) {
    if (cls_proto == NULL || devs_is_nullish(obj))
        return false;

    devs_maplike_t *proto = devs_object_get_attached_ro(ctx, obj);
    devs_maplike_t *en = devs_object_get_attached_enum(ctx, obj);
    if (proto && proto == en)
        proto = devs_maplike_get_proto(ctx, proto);
    if (proto == NULL)
        return false;

    while (proto) {
        if (cls_proto == proto)
            return true;
        proto = devs_maplike_get_proto(ctx, proto);
    }

    return false;
}

value_t devs_maplike_get_no_bind(devs_ctx_t *ctx, devs_maplike_t *proto, value_t key) {
    value_t ptmp, *tmp = NULL;

    while (proto) {
        devs_map_t *map;
        if (devs_is_builtin_proto(proto)) {
            ptmp = devs_proto_lookup(ctx, (const devs_builtin_proto_t *)proto, key);
            tmp = &ptmp;
            break;
        } else if (devs_is_service_spec(ctx, proto)) {
            ptmp = devs_spec_lookup(ctx, (const devs_service_spec_t *)proto, key);
            if (!devs_is_undefined(ptmp)) {
                tmp = &ptmp;
                break;
            } else {
                proto = devs_get_builtin_object(ctx, DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE);
                continue;
            }
        } else {
            JD_ASSERT(devs_is_map(proto));
            map = (devs_map_t *)proto;
            tmp = lookup(ctx, map, key);
            if (tmp)
                break;
        }

        proto = map->proto;
    }

    if (tmp == NULL)
        return devs_undefined;
    return *tmp;
}

value_t devs_object_get(devs_ctx_t *ctx, value_t obj, value_t key) {
    ctx->diag_field = key;
    value_t tmp = devs_maplike_get_no_bind(ctx, devs_object_get_attached_ro(ctx, obj), key);
    return devs_function_bind(ctx, obj, tmp);
}

value_t devs_object_get_built_in_field(devs_ctx_t *ctx, value_t obj, unsigned idx) {
    value_t key = devs_builtin_string(idx);
    ctx->diag_field = key;
    value_t fn = devs_maplike_get_no_bind(ctx, devs_object_get_attached_ro(ctx, obj), key);
    const devs_builtin_function_t *h = devs_get_property_desc(ctx, fn);
    if (h)
        return h->handler.prop(ctx, obj);
    return fn;
}

value_t devs_seq_get(devs_ctx_t *ctx, value_t seq, unsigned idx) {
    if (idx > DEVS_MAX_ALLOC)
        return devs_undefined;

    unsigned len;
    const uint8_t *p = devs_bufferish_data(ctx, seq, &len);
    if (p && idx < len) {
        if (devs_is_string(ctx, seq)) {
            int off = devs_string_index(ctx, seq, idx);
            if (off < 0)
                return devs_undefined;
            p += off;
            unsigned len = devs_utf8_code_point_length((const char *)p);
            return devs_value_from_gc_obj(ctx,
                                          devs_string_try_alloc_init(ctx, (const char *)p, len));
        }
        return devs_value_from_int(p[idx]);
    }

    devs_array_t *arr = devs_value_to_gc_obj(ctx, seq);
    if (devs_gc_tag(arr) == DEVS_GC_TAG_ARRAY) {
        if (idx < arr->length)
            return arr->data[idx];
    }

    return devs_undefined;
}

bool devs_looks_indexable(devs_ctx_t *ctx, value_t seq) {
    return devs_is_array(ctx, seq) || devs_is_buffer(ctx, seq) || devs_is_string(ctx, seq);
}

value_t devs_any_get(devs_ctx_t *ctx, value_t obj, value_t key) {
    if (devs_is_number(key) && devs_looks_indexable(ctx, obj)) {
        unsigned idx = devs_value_to_int(ctx, key);
        return devs_seq_get(ctx, obj, idx);
    } else if (devs_is_string(ctx, key)) {
        return devs_object_get(ctx, obj, key);
    } else {
        key = devs_value_to_string(ctx, key);
        devs_value_pin(ctx, key);
        value_t res = devs_object_get(ctx, obj, key);
        devs_value_unpin(ctx, key);
        return res;
    }
}

void devs_any_set(devs_ctx_t *ctx, value_t obj, value_t key, value_t v) {
    if (devs_is_number(key) && devs_looks_indexable(ctx, obj)) {
        unsigned idx = devs_value_to_int(ctx, key);
        devs_seq_set(ctx, obj, idx, v);
    } else {
        ctx->diag_field = key;
        devs_map_t *map = devs_object_get_attached_rw(ctx, obj);
        if (!map)
            return;
        if (devs_is_string(ctx, key))
            devs_map_set(ctx, map, key, v);
        else {
            key = devs_value_to_string(ctx, key);
            devs_value_pin(ctx, key);
            devs_map_set(ctx, map, key, v);
            devs_value_unpin(ctx, key);
        }
    }
}

static int array_ensure_len(devs_ctx_t *ctx, devs_array_t *arr, unsigned newlen) {
    if (arr->capacity < newlen) {
        newlen = grow_len(newlen);
        value_t *newarr = devs_try_alloc(ctx, newlen * sizeof(value_t));
        if (newarr == NULL)
            return -1;
        if (arr->data)
            memcpy(newarr, arr->data, sizeof(value_t) * arr->length);
        arr->data = newarr;
        arr->capacity = newlen;
        jd_gc_unpin(ctx->gc, newarr);
    }
    return 0;
}

void devs_array_set(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, value_t v) {
    if (idx > DEVS_MAX_ALLOC / sizeof(value_t))
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_ARRAY);
    else {
        if (array_ensure_len(ctx, arr, idx + 1) != 0)
            return;
        arr->data[idx] = v;
        if (idx >= arr->length)
            arr->length = idx + 1;
    }
}

void devs_array_pin_push(devs_ctx_t *ctx, devs_array_t *arr, value_t v) {
    devs_value_pin(ctx, v);
    devs_array_set(ctx, arr, arr->length, v);
    devs_value_unpin(ctx, v);
}

void devs_seq_set(devs_ctx_t *ctx, value_t seq, unsigned idx, value_t v) {
    // DMESG("set arr=%s idx=%u", devs_show_value(ctx, seq), idx);
    if (idx > DEVS_MAX_ALLOC) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_ARRAY);
    } else if (devs_buffer_is_writable(ctx, seq)) {
        unsigned len;
        uint8_t *p = devs_buffer_data(ctx, seq, &len);
        if (idx < len) {
            p[idx] = devs_value_to_int(ctx, v) & 0xff;
        } else {
            devs_throw_range_error(ctx, "buffer write at %u, len=%u", idx, len);
        }
    } else {
        devs_array_t *arr = devs_value_to_gc_obj(ctx, seq);
        if (devs_gc_tag(arr) == DEVS_GC_TAG_ARRAY) {
            devs_array_set(ctx, arr, idx, v);
        } else {
            devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ARRAY, seq);
        }
    }
}

int devs_array_insert(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, int count) {
    if (count > (int)(DEVS_MAX_ALLOC / sizeof(value_t))) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_ARRAY);
        return -4;
    }

    int newlen = arr->length + count;
    if (newlen < 0) {
        count = -arr->length;
        newlen = 0;
    }

    if (count == 0)
        return 0;

    if (newlen > (int)(DEVS_MAX_ALLOC / sizeof(value_t))) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_ARRAY);
        return -6;
    }

    if (idx > arr->length)
        idx = arr->length;

    if (array_ensure_len(ctx, arr, newlen))
        return -5;

    unsigned trailing = arr->length - idx;

    if (count < 0) {
        count = -count;
        memmove(arr->data + idx, arr->data + idx + count, sizeof(value_t) * (trailing - count));
    } else {
        memmove(arr->data + idx + count, arr->data + idx, sizeof(value_t) * trailing);
        memset(arr->data + idx, 0, count * sizeof(value_t));
    }
    arr->length = newlen;

    return 0;
}

int32_t devs_arg_int_defl(devs_ctx_t *ctx, unsigned idx, int32_t defl) {
    value_t arg = devs_arg(ctx, idx);
    if (devs_is_null_or_undefined(arg))
        return defl;
    return devs_value_to_int(ctx, arg);
}

int32_t devs_arg_int(devs_ctx_t *ctx, unsigned idx) {
    return devs_value_to_int(ctx, devs_arg(ctx, idx));
}

bool devs_arg_bool(devs_ctx_t *ctx, unsigned idx) {
    return devs_value_to_bool(ctx, devs_arg(ctx, idx));
}

double devs_arg_double(devs_ctx_t *ctx, unsigned idx) {
    return devs_value_to_double(ctx, devs_arg(ctx, idx));
}

const char *devs_arg_utf8_with_conv(devs_ctx_t *ctx, unsigned idx, unsigned *sz) {
    // store it on the stack, so it doesn't get GCed
    ctx->the_stack[idx + 1] = devs_value_to_string(ctx, devs_arg(ctx, idx));
    return devs_string_get_utf8(ctx, devs_arg(ctx, idx), sz);
}

void devs_ret_double(devs_ctx_t *ctx, double v) {
    devs_ret(ctx, devs_value_from_double(v));
}

void devs_ret_int(devs_ctx_t *ctx, int v) {
    devs_ret(ctx, devs_value_from_int(v));
}

void devs_ret_bool(devs_ctx_t *ctx, bool v) {
    devs_ret(ctx, devs_value_from_bool(v));
}

void devs_ret_gc_ptr(devs_ctx_t *ctx, void *v) {
    devs_ret(ctx, devs_value_from_gc_obj(ctx, v));
}

devs_map_t *devs_arg_self_map(devs_ctx_t *ctx) {
    value_t s = devs_arg_self(ctx);
    void *p = devs_value_to_gc_obj(ctx, s);
    if (devs_is_map(p))
        return p;
    devs_throw_type_error(ctx, "object expected");
    return NULL;
}

void devs_setup_resume(devs_fiber_t *f, devs_resume_cb_t cb, void *userdata) {
    if (devs_did_yield(f->ctx)) {
        f->resume_cb = cb;
        f->resume_data = userdata;
    } else {
        cb(f->ctx, userdata);
    }
}

bool devs_can_attach(devs_ctx_t *ctx, value_t v) {
    switch (devs_value_typeof(ctx, v)) {
    case DEVS_OBJECT_TYPE_MAP:
    case DEVS_OBJECT_TYPE_ROLE:
    case DEVS_OBJECT_TYPE_ARRAY:
    case DEVS_OBJECT_TYPE_BUFFER:
    case DEVS_OBJECT_TYPE_IMAGE:
        return true;
    default:
        return false;
    }
}

value_t devs_builtin_object_value(devs_ctx_t *ctx, unsigned idx) {
    if (idx > DEVS_BUILTIN_OBJECT___MAX)
        return devs_undefined;

    devs_maplike_t *p = devs_get_builtin_object(ctx, idx);
    if (devs_is_builtin_proto(p))
        return devs_value_from_handle(DEVS_HANDLE_TYPE_SPECIAL,
                                      DEVS_SPECIAL_BUILTIN_OBJ_FIRST + idx);
    else
        return devs_value_from_gc_obj(ctx, (void *)p);
}

value_t devs_maplike_to_value(devs_ctx_t *ctx, devs_maplike_t *obj) {
    if (devs_is_builtin_proto(obj)) {
        return devs_builtin_object_value(ctx,
                                         (const devs_builtin_proto_t *)obj - devs_builtin_protos);
    } else if (devs_is_service_spec(ctx, obj)) {
        // this shouldn't happen
        return devs_undefined;
    } else {
        JD_ASSERT(devs_is_map(obj));
        devs_map_t *map = (devs_map_t *)obj;
        if (devs_gc_tag(map) == DEVS_GC_TAG_HALF_STATIC_MAP && devs_is_builtin_proto(map->proto))
            return devs_maplike_to_value(ctx, map->proto);
        return devs_value_from_gc_obj(ctx, map);
    }
}