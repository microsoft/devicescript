#include "devs_internal.h"

#include <math.h>
#include <limits.h>

const value_t devs_zero = {.exp_sign = DEVS_INT_TAG, .val_int32 = 0};
const value_t devs_one = {.exp_sign = DEVS_INT_TAG, .val_int32 = 1};
const value_t devs_nan = {.exp_sign = DEVS_NAN_TAG, .val_int32 = 0};
const value_t devs_int_min = {.exp_sign = DEVS_INT_TAG, .val_int32 = INT_MIN};
const value_t devs_max_int_1 = {._f = 0x80000000U};

#define SPECIAL(n)                                                                                 \
    { .exp_sign = DEVS_HANDLE_TAG + DEVS_HANDLE_TYPE_SPECIAL, .val_int32 = n }

const value_t devs_null = {.u64 = 0};
const value_t devs_true = SPECIAL(DEVS_SPECIAL_TRUE);
const value_t devs_false = SPECIAL(DEVS_SPECIAL_FALSE);
const value_t devs_pkt_buffer = SPECIAL(DEVS_SPECIAL_PKT_BUFFER);

value_t devs_value_from_double(double v) {
    value_t t;
    value_t r;
    t._f = v;
    int m32z = t.mantisa32 == 0;

    if (isnan(v)) {
        // normalize NaNs -- they are very likely all already normalized
        return devs_nan;
    }

    r.exp_sign = DEVS_INT_TAG;

    if (m32z && t.exp_sign == 0)
        return devs_zero;

    int e = t.exponent - 0x3ff;
    if (e >= 0) {
        if (e <= 20) {
            if (m32z && (e == 20 || (t.mantisa20 << (e + 12)) == 0)) {
                r.val_int32 = (t.mantisa20 | (1 << 20)) >> (20 - e);
                goto int_sign;
            }
        } else {
            if (e > 30) {
                if (m32z && t.exp_sign == 0xc1e00000)
                    return devs_int_min;
            } else {
                if ((t.mantisa32 << (e - 20)) == 0) {
                    r.val_int32 =
                        ((t.mantisa20 | (1 << 20)) << (e - 20)) | (t.mantisa32 >> (32 - (e - 20)));
                    goto int_sign;
                }
            }
        }
    }

    return t;

int_sign:
    if (t.sign)
        r.val_int32 = -r.val_int32;
    return r;
}

value_t devs_value_from_int(int v) {
    value_t r;
    r.exp_sign = DEVS_INT_TAG;
    r.val_int32 = v;
    return r;
}

value_t devs_value_from_bool(int v) {
    return v ? devs_true : devs_false;
}

value_t devs_value_from_pointer(devs_ctx_t *ctx, int type, void *ptr) {
    uint32_t v;

    if (ptr == NULL)
        return devs_null;

    JD_ASSERT(type & (DEVS_HANDLE_GC_MASK | DEVS_HANDLE_IMG_MASK));

#if JD_64
    if (type & DEVS_HANDLE_IMG_MASK)
        v = (uintptr_t)ptr - (uintptr_t)ctx->img.data;
    else
        v = (uintptr_t)ptr - (uintptr_t)devs_gc_base_addr(ctx->gc);
    JD_ASSERT((v >> 24) == 0);
#else
    v = (uintptr_t)ptr;
#endif

    return devs_value_from_handle(type, v);
}

#if JD_64
void *devs_handle_ptr_value(devs_ctx_t *ctx, value_t t) {
    int tp = devs_handle_type(t);

    if (tp & DEVS_HANDLE_GC_MASK)
        return (void *)((uintptr_t)devs_gc_base_addr(ctx->gc) + t.mantisa32);

    if (tp & DEVS_HANDLE_IMG_MASK)
        return (void *)((uintptr_t)ctx->img.data + t.mantisa32);

    JD_ASSERT(0);
    return NULL;
}
#endif

int32_t devs_value_to_int(value_t v) {
    if (devs_is_tagged_int(v))
        return v.val_int32;
    if (devs_is_handle(v)) {
        if (devs_is_special(v) && devs_handle_value(v) >= DEVS_SPECIAL_TRUE)
            return 1;
        else
            return 0;
    }
    // TODO check semantics
    return (int32_t)v._f;
}

double devs_value_to_double(value_t v) {
    if (devs_is_tagged_int(v))
        return (double)v.val_int32;

    if (devs_is_handle(v)) {
        if (devs_is_special(v))
            switch (devs_handle_value(v)) {
            case DEVS_SPECIAL_FALSE:
                return 0;
            case DEVS_SPECIAL_TRUE:
                return 1;
            }
        return NAN;
    }

    return v._f;
}

bool devs_value_to_bool(value_t v) {
    if (devs_is_tagged_int(v))
        return !!v.val_int32;
    if (devs_is_special(v))
        return devs_handle_value(v) >= DEVS_SPECIAL_TRUE;
    if (devs_is_handle(v))
        return 0;
    return v._f == 0.0 ? 1 : 0;
}

bool devs_is_buffer(devs_ctx_t *ctx, value_t v) {
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_SPECIAL:
        return devs_handle_value(v) == DEVS_SPECIAL_PKT_BUFFER;
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        return devs_gc_tag(devs_handle_ptr_value(ctx, v)) == DEVS_GC_TAG_BUFFER;
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        return devs_bufferish_is_buffer(v);
    default:
        return false;
    }
}

bool devs_buffer_is_writable(devs_ctx_t *ctx, value_t v) {
    return devs_is_buffer(ctx, v) && devs_handle_type(v) != DEVS_HANDLE_TYPE_IMG_BUFFERISH;
}

void *devs_buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    JD_ASSERT(devs_is_buffer(ctx, v));
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_SPECIAL: {
        if (sz)
            *sz = ctx->packet.service_size;
        return ctx->packet.data;
    }
    case DEVS_HANDLE_TYPE_GC_OBJECT: {
        devs_buffer_t *buf = devs_handle_ptr_value(ctx, v);
        if (sz)
            *sz = buf->length;
        return buf->data;
    }
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH: {
        // TODO optimize - we know it's a buffer in range
        unsigned idx = devs_handle_value(v);
        return (void *)devs_get_utf8(ctx, idx, sz);
    }
    default:
        JD_ASSERT(0);
        return NULL;
    }
}

void *devs_value_to_gc_obj(devs_ctx_t *ctx, value_t v) {
    if (devs_handle_type(v) == DEVS_HANDLE_TYPE_GC_OBJECT)
        return devs_handle_ptr_value(ctx, v);
    return NULL;
}

bool devs_is_array(devs_ctx_t *ctx, value_t v) {
    return devs_gc_tag(devs_value_to_gc_obj(ctx, v)) == DEVS_GC_TAG_ARRAY;
}

unsigned devs_value_typeof(devs_ctx_t *ctx, value_t v) {
    if (devs_is_tagged_int(v))
        return DEVS_OBJECT_TYPE_NUMBER;

    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_FLOAT64:
        return DEVS_OBJECT_TYPE_NUMBER;
    case DEVS_HANDLE_TYPE_SPECIAL:
        switch (devs_handle_value(v)) {
        case DEVS_SPECIAL_FALSE:
        case DEVS_SPECIAL_TRUE:
            return DEVS_OBJECT_TYPE_BOOL;
        case DEVS_SPECIAL_NULL:
            return DEVS_OBJECT_TYPE_NULL;
        case DEVS_SPECIAL_PKT_BUFFER:
            return DEVS_OBJECT_TYPE_BUFFER;
        default:
            JD_ASSERT(0);
            return 0;
        }
    case DEVS_HANDLE_TYPE_FIBER:
        return DEVS_OBJECT_TYPE_FIBER;
    case DEVS_HANDLE_TYPE_FUNCTION:
        return DEVS_OBJECT_TYPE_FUNCTION;
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        switch (devs_gc_tag(devs_handle_ptr_value(ctx, v))) {
        case DEVS_GC_TAG_ARRAY:
            return DEVS_OBJECT_TYPE_ARRAY;
        case DEVS_GC_TAG_BUFFER:
            return DEVS_OBJECT_TYPE_BUFFER;
        case DEVS_GC_TAG_MAP:
            return DEVS_OBJECT_TYPE_MAP;
        default:
            JD_ASSERT(0);
            return 0;
        }
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        return devs_bufferish_is_buffer(v) ? DEVS_OBJECT_TYPE_BUFFER : DEVS_OBJECT_TYPE_STRING;
    case DEVS_HANDLE_TYPE_ROLE:
        return DEVS_OBJECT_TYPE_ROLE;
    default:
        JD_ASSERT(0);
        return 0;
    }
}

bool devs_is_nullish(value_t t) {
    if (devs_is_special(t)) {
        switch (devs_handle_value(t)) {
        case DEVS_SPECIAL_FALSE:
        case DEVS_SPECIAL_NULL:
            return true;
        }
    } else if (devs_is_nan(t)) {
        return true;
    }

    return false;
}

const char *devs_show_value(devs_ctx_t *ctx, value_t v) {
    static char buf[64];

    if (devs_is_tagged_int(v)) {
        jd_sprintf(buf, sizeof(buf), "%d", (int)v.val_int32);
        return buf;
    }

    const char *fmt = NULL;

    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_FLOAT64:
        jd_sprintf(buf, sizeof(buf), "%f", devs_value_to_double(v));
        return buf;

    case DEVS_HANDLE_TYPE_SPECIAL:
        switch (devs_handle_value(v)) {
        case DEVS_SPECIAL_FALSE:
            return "false";
        case DEVS_SPECIAL_TRUE:
            return "true";
        case DEVS_SPECIAL_NULL:
            return "null";
        case DEVS_SPECIAL_PKT_BUFFER:
            return "packet";
        default:
            return "?special";
        }

    case DEVS_HANDLE_TYPE_FIBER:
        fmt = "fib";
        break;
    case DEVS_HANDLE_TYPE_FUNCTION:
        fmt = "fun";
        break;
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        fmt = devs_bufferish_is_buffer(v) ? "buf" : "str";
        break;
    case DEVS_HANDLE_TYPE_ROLE:
        fmt = "role";
        break;

    case DEVS_HANDLE_TYPE_GC_OBJECT:
        switch (devs_gc_tag(devs_handle_ptr_value(ctx, v))) {
        case DEVS_GC_TAG_ARRAY:
            fmt = "array";
            break;
        case DEVS_GC_TAG_BUFFER:
            fmt = "buffer";
            break;
        case DEVS_GC_TAG_MAP:
            fmt = "map";
            break;
        case DEVS_GC_TAG_FREE:
            fmt = "?free";
            break;
        case DEVS_GC_TAG_BYTES:
            fmt = "bytes";
            break;
        default:
            fmt = "???";
            break;
        }
        jd_sprintf(buf, sizeof(buf), "%s:%x", fmt, (unsigned)devs_handle_value(v));
        return buf;
    }

    if (fmt)
        jd_sprintf(buf, sizeof(buf), "%s:%u", fmt, (unsigned)devs_handle_value(v));
    else
        return "?value";

    return buf;
}