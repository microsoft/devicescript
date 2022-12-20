#include "devs_internal.h"
#include "devs_objects.h"

void devs_map_clear(devs_ctx_t *ctx, devs_map_t *map) {
    if (map->data) {
        devs_free(ctx, map->data);
        map->data = NULL;
        map->capacity = 0;
        map->length = 0;
    }
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

    if (!devs_is_string(ctx, key))
        devs_runtime_failure(ctx, 60149);

    JD_ASSERT(map->capacity <= map->length);

    if (map->capacity == map->length) {
        int newlen = grow_len(map->capacity);
        map->capacity = newlen;
        tmp = devs_try_alloc(ctx, newlen * (2 * sizeof(value_t)));
        if (!tmp)
            return;
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

value_t devs_map_get(devs_ctx_t *ctx, devs_map_t *map, value_t key) {
    value_t *tmp = lookup(ctx, map, key);
    if (tmp == NULL)
        return devs_undefined;
    return *tmp;
}

const devs_builtin_proto_t *devs_object_get_static_built_in(devs_ctx_t *ctx, unsigned idx) {
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
};
#define MAX_PROTO 4

const devs_map_or_proto_t *devs_object_get_built_in(devs_ctx_t *ctx, unsigned idx) {
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
                m = devs_map_try_alloc(ctx);
                if (m != NULL) {
                    ctx->_builtin_protos[midx] = m;
                    m->proto =
                        (const devs_map_or_proto_t *)devs_object_get_static_built_in(ctx, idx);
                }
            }
            return (const devs_map_or_proto_t *)m;
        }
    }

    return (const devs_map_or_proto_t *)devs_object_get_static_built_in(ctx, idx);
}

value_t devs_proto_lookup(devs_ctx_t *ctx, const devs_builtin_proto_t *proto, value_t key) {
    const devs_builtin_proto_entry_t *p = proto->entries;

    if (devs_handle_type(key) == DEVS_HANDLE_TYPE_IMG_BUFFERISH &&
        (devs_handle_value(key) >> DEVS_STRIDX__SHIFT) == DEVS_STRIDX_BUILTIN) {
        unsigned kidx = devs_handle_value(key) & ((1 << DEVS_STRIDX__SHIFT) - 1);
        while (p->builtin_string_id) {
            if (p->builtin_string_id == kidx)
                return devs_value_from_handle(DEVS_HANDLE_TYPE_STATIC_FUNCTION,
                                              p->builtin_function_idx);
            p++;
        }
    } else {
        unsigned ksz;
        const char *kptr = devs_string_get_utf8(ctx, key, &ksz);
        if (ksz != strlen(kptr))
            return devs_undefined;
        while (p->builtin_string_id) {
            if (strcmp(devs_builtin_string_by_idx(p->builtin_string_id), kptr) == 0)
                return devs_value_from_handle(DEVS_HANDLE_TYPE_STATIC_FUNCTION,
                                              p->builtin_function_idx);
            p++;
        }
    }

    return devs_undefined;
}

#define PACK_SHIFT 24

// if `fn` is a static function, return `(obj, fn)` tuple
// otherwise return `obj`
// it may allocate an object for the tuple, but typically it doesn't
value_t devs_function_bind(devs_ctx_t *ctx, value_t obj, value_t fn) {
    if (devs_handle_type(fn) != DEVS_HANDLE_TYPE_STATIC_FUNCTION)
        return obj;

    unsigned fidx = devs_handle_value(fn);

    int bltin = fidx - DEVS_FIRST_BUILTIN_FUNCTION;
    if (bltin >= 0) {
        JD_ASSERT(bltin < devs_num_builtin_functions);
        const devs_builtin_function_t *h = &devs_builtin_functions[bltin];
        if (h->flags & DEVS_BUILTIN_FLAG_IS_PROPERTY) {
            JD_ASSERT(h->num_args == 0);
            return h->handler.prop(ctx, obj);
        }
    }

    int otp = devs_handle_type(obj);

    if (fidx <= 0xffff)
        switch (otp) {
        case DEVS_HANDLE_TYPE_SPECIAL:
        case DEVS_HANDLE_TYPE_FIBER:
        case DEVS_HANDLE_TYPE_ROLE:
        case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
        case DEVS_HANDLE_TYPE_IMG_BUFFERISH: {
            uint32_t hv = devs_handle_value(obj);
            JD_ASSERT((hv >> PACK_SHIFT) == 0);
            JD_ASSERT(devs_handle_high_value(obj) == 0);
            return devs_value_from_handle(DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC | (fidx << 4),
                                          (otp << PACK_SHIFT) | hv);
        }

        case DEVS_HANDLE_TYPE_GC_OBJECT:
            JD_ASSERT(devs_handle_high_value(obj) == 0);
            return devs_value_from_handle(DEVS_HANDLE_TYPE_BOUND_FUNCTION | (fidx << 4),
                                          devs_handle_value(obj));
        }

    devs_bound_function_t *res =
        devs_any_try_alloc(ctx, DEVS_GC_TAG_BOUND_FUNCTION, sizeof(devs_bound_function_t));
    if (res == NULL)
        return devs_undefined;

    res->this_val = obj;
    res->func = fn;
    return devs_value_from_gc_obj(ctx, res);
}

value_t devs_make_closure(devs_ctx_t *ctx, devs_activation_t *closure, unsigned fnidx) {
    JD_ASSERT(fnidx <= 0xffff);
    return devs_value_from_pointer(ctx, DEVS_HANDLE_TYPE_CLOSURE | (fnidx << 4), closure);
}

int devs_get_fnidx(devs_ctx_t *ctx, value_t src, value_t *this_val, devs_activation_t **closure) {
    *closure = NULL;
    *this_val = devs_undefined;

    uint32_t hv = devs_handle_value(src);
    switch (devs_handle_type(src)) {
    case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
        *this_val = devs_undefined;
        return hv;
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC:
        *this_val = devs_value_from_handle(hv >> PACK_SHIFT, hv & ((1 << PACK_SHIFT) - 1));
        return devs_handle_high_value(src);
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION:
        *this_val = devs_value_from_handle(DEVS_HANDLE_TYPE_GC_OBJECT, hv);
        return devs_handle_high_value(src);
    case DEVS_HANDLE_TYPE_CLOSURE:
        *closure = devs_handle_ptr_value(ctx, src);
        return devs_handle_high_value(src);
    default:
        return -1;
    }
}

static const devs_map_or_proto_t *devs_get_static_proto(devs_ctx_t *ctx, int tp, bool create) {
    // accessing prototype on static object - can't attach properties
    if (create) {
        // note that in ES writing to string/... properties is no-op
        // we make it an error
        devs_runtime_failure(ctx, 60128);
        return NULL;
    }
    return devs_object_get_built_in(ctx, tp);
}

const devs_map_or_proto_t *devs_object_get_attached(devs_ctx_t *ctx, value_t v, bool create) {
    static const uint8_t proto_by_object_type[] = {
        [DEVS_OBJECT_TYPE_NUMBER] = DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE,
        [DEVS_OBJECT_TYPE_FIBER] = DEVS_BUILTIN_OBJECT_FIBER_PROTOTYPE,
        [DEVS_OBJECT_TYPE_ROLE] = DEVS_BUILTIN_OBJECT_ROLE_PROTOTYPE,
        [DEVS_OBJECT_TYPE_FUNCTION] = DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE,
        [DEVS_OBJECT_TYPE_STRING] = DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE,
        [DEVS_OBJECT_TYPE_BUFFER] = DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE,
        [DEVS_OBJECT_TYPE_BOOL] = DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE,
    };

    if (devs_is_null(v)) {
        devs_runtime_failure(ctx, 60165);
        return NULL;
    }

    if (devs_handle_type(v) != DEVS_HANDLE_TYPE_GC_OBJECT) {
        int pt = 0;
        int tp = devs_value_typeof(ctx, v);
        if (tp == DEVS_OBJECT_TYPE_MAP && devs_is_special(v)) {
            uint32_t hv = devs_handle_value(v);
            if (devs_handle_is_builtin(hv))
                return devs_get_static_proto(ctx, hv - DEVS_SPECIAL_BUILTIN_OBJ_FIRST, create);
        }
        if (tp < (int)sizeof(proto_by_object_type)) {
            pt = proto_by_object_type[tp];
        }
        JD_ASSERT(pt != 0);
        return devs_get_static_proto(ctx, pt, create);
    }

    devs_gc_object_t *obj = devs_handle_ptr_value(ctx, v);

    devs_map_t **attached;
    int builtin;

    switch (devs_gc_tag(obj)) {
    case DEVS_GC_TAG_BUFFER:
        attached = &((devs_buffer_t *)obj)->attached;
        builtin = DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE;
        break;
    case DEVS_GC_TAG_ARRAY:
        attached = &((devs_array_t *)obj)->attached;
        builtin = DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE;
        break;
    case DEVS_GC_TAG_MAP:
        return (devs_map_or_proto_t *)obj;
    case DEVS_GC_TAG_STRING:
        return devs_get_static_proto(ctx, DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE, create);
    case DEVS_GC_TAG_BOUND_FUNCTION:
        return devs_get_static_proto(ctx, DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE, create);
    case DEVS_GC_TAG_BUILTIN_PROTO:
    default:
        JD_PANIC();
        break;
    }

    devs_map_t *map = *attached;

    if (!map && create) {
        map = *attached = devs_map_try_alloc(ctx);
        if (map == NULL) {
            devs_runtime_failure(ctx, 60131);
            return NULL;
        }
    }

    if (map)
        return (devs_map_or_proto_t *)map;
    else
        return devs_object_get_built_in(ctx, builtin);
}

value_t devs_object_get_no_bind(devs_ctx_t *ctx, const devs_map_or_proto_t *proto, value_t key) {
    value_t ptmp, *tmp = NULL;

    while (proto) {
        devs_map_t *map;
        if (devs_is_map(proto)) {
            map = (devs_map_t *)proto;
            tmp = lookup(ctx, map, key);
            if (tmp)
                break;
        } else {
            JD_ASSERT(devs_is_proto(proto));
            ptmp = devs_proto_lookup(ctx, (const devs_builtin_proto_t *)proto, key);
            tmp = &ptmp;
            break;
        }

        proto = map->proto;
    }

    if (tmp == NULL)
        return devs_undefined;
    return *tmp;
}

value_t devs_object_get(devs_ctx_t *ctx, value_t obj, value_t key) {
    value_t tmp = devs_object_get_no_bind(ctx, devs_object_get_attached(ctx, obj, 0), key);
    return devs_function_bind(ctx, obj, tmp);
}

value_t devs_seq_get(devs_ctx_t *ctx, value_t seq, unsigned idx) {
    if (idx > DEVS_MAX_ALLOC)
        return devs_undefined;

    unsigned len;
    const uint8_t *p = devs_bufferish_data(ctx, seq, &len);
    if (p && idx < len)
        return devs_value_from_int(p[idx]);

    devs_array_t *arr = devs_value_to_gc_obj(ctx, seq);
    if (devs_gc_tag(arr) == DEVS_GC_TAG_ARRAY) {
        if (idx < arr->length)
            return arr->data[idx];
    }

    return devs_undefined;
}

value_t devs_any_get(devs_ctx_t *ctx, value_t obj, value_t key) {
    if (devs_is_number(key)) {
        unsigned idx = devs_value_to_int(key);
        return devs_seq_get(ctx, obj, idx);
    } else if (devs_is_string(ctx, key)) {
        return devs_object_get(ctx, obj, key);
    } else {
        return devs_undefined;
    }
}

void devs_any_set(devs_ctx_t *ctx, value_t obj, value_t key, value_t v) {
    if (devs_is_number(key)) {
        unsigned idx = devs_value_to_int(v);
        devs_seq_set(ctx, obj, idx, v);
    } else if (devs_is_string(ctx, key)) {
        devs_map_t *map = (void *)devs_object_get_attached(ctx, obj, true);
        if (devs_is_map(map))
            devs_map_set(ctx, map, key, v);
        else
            devs_runtime_failure(ctx, 60155);
    } else {
        devs_runtime_failure(ctx, 60156);
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
        devs_runtime_failure(ctx, 60153);
    else if (array_ensure_len(ctx, arr, idx + 1) != 0)
        devs_runtime_failure(ctx, 60154); // this will be hidden by previous PANIC OOM
    else {
        arr->data[idx] = v;
        if (idx >= arr->length)
            arr->length = idx + 1;
    }
}

void devs_seq_set(devs_ctx_t *ctx, value_t seq, unsigned idx, value_t v) {
    // DMESG("set arr=%s idx=%u", devs_show_value(ctx, seq), idx);
    if (idx > DEVS_MAX_ALLOC) {
        devs_runtime_failure(ctx, 60150);
    } else if (devs_buffer_is_writable(ctx, seq)) {
        unsigned len;
        uint8_t *p = devs_buffer_data(ctx, seq, &len);
        if (idx < len) {
            p[idx] = devs_value_to_int(v) & 0xff;
        } else {
            devs_runtime_failure(ctx, 60151);
        }
    } else {
        devs_array_t *arr = devs_value_to_gc_obj(ctx, seq);
        if (devs_gc_tag(arr) == DEVS_GC_TAG_ARRAY) {
            devs_array_set(ctx, arr, idx, v);
        } else {
            devs_runtime_failure(ctx, 60152);
        }
    }
}

int devs_array_insert(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, int count) {
    if (count > (int)(DEVS_MAX_ALLOC / sizeof(value_t)))
        return -4;

    int newlen = arr->length + count;
    if (newlen < 0) {
        count = -arr->length;
        newlen = 0;
    }

    if (count == 0)
        return 0;

    if (newlen > (int)(DEVS_MAX_ALLOC / sizeof(value_t)))
        return -6;

    if (idx > arr->length)
        idx = arr->length;

    if (array_ensure_len(ctx, arr, newlen))
        return -5;

    unsigned trailing = arr->length - idx;

    if (count < 0) {
        count = -count;
        memmove(arr->data + idx, arr->data + idx + count, trailing - count);
    } else {
        memmove(arr->data + idx + count, arr->data + idx, trailing);
        memset(arr->data + idx, 0, count * sizeof(value_t));
    }
    arr->length = newlen;

    return 0;
}

int32_t devs_arg_int(devs_ctx_t *ctx, unsigned idx) {
    return devs_value_to_int(devs_arg(ctx, idx));
}

double devs_arg_double(devs_ctx_t *ctx, unsigned idx) {
    return devs_value_to_double(devs_arg(ctx, idx));
}

void devs_ret_double(devs_ctx_t *ctx, double v) {
    devs_ret(ctx, devs_value_from_double(v));
}

void devs_ret_int(devs_ctx_t *ctx, int v) {
    devs_ret(ctx, devs_value_from_int(v));
}

void devs_ret_gc_ptr(devs_ctx_t *ctx, void *v) {
    devs_ret(ctx, devs_value_from_gc_obj(ctx, v));
}
