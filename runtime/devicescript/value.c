#include "jacs_internal.h"

#include <math.h>
#include <limits.h>

const value_t jacs_zero = {.exp_sign = JACS_INT_TAG, .val_int32 = 0};
const value_t jacs_one = {.exp_sign = JACS_INT_TAG, .val_int32 = 1};
const value_t jacs_nan = {.exp_sign = JACS_NAN_TAG, .val_int32 = 0};
const value_t jacs_int_min = {.exp_sign = JACS_INT_TAG, .val_int32 = INT_MIN};
const value_t jacs_max_int_1 = {._f = 0x80000000U};

#define SPECIAL(n)                                                                                 \
    { .exp_sign = JACS_HANDLE_TAG + JACS_HANDLE_TYPE_SPECIAL, .val_int32 = n }

const value_t jacs_null = SPECIAL(JACS_SPECIAL_NULL);
const value_t jacs_true = SPECIAL(JACS_SPECIAL_TRUE);
const value_t jacs_false = SPECIAL(JACS_SPECIAL_FALSE);
const value_t jacs_pkt_buffer = SPECIAL(JACS_SPECIAL_PKT_BUFFER);

value_t jacs_value_from_double(double v) {
    value_t t;
    value_t r;
    t._f = v;
    int m32z = t.mantisa32 == 0;

    if (isnan(v)) {
        // normalize NaNs -- they are very likely all already normalized
        return jacs_nan;
    }

    r.exp_sign = JACS_INT_TAG;

    if (m32z && t.exp_sign == 0)
        return jacs_zero;

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
                    return jacs_int_min;
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

value_t jacs_value_from_int(int v) {
    value_t r;
    r.exp_sign = JACS_INT_TAG;
    r.val_int32 = v;
    return r;
}

value_t jacs_value_from_bool(int v) {
    return v ? jacs_true : jacs_false;
}

value_t jacs_value_from_pointer(jacs_ctx_t *ctx, int type, void *ptr) {
    uint32_t v;

    if (ptr == NULL)
        return jacs_null;

    JD_ASSERT(type & (JACS_HANDLE_GC_MASK | JACS_HANDLE_IMG_MASK));

#if JD_64
    if (type & JACS_HANDLE_IMG_MASK)
        v = (uintptr_t)ptr - (uintptr_t)ctx->img.data;
    else
        v = (uintptr_t)ptr - (uintptr_t)jacs_gc_base_addr(ctx->gc);
    JD_ASSERT((v >> 24) == 0);
#else
    v = (uintptr_t)ptr;
#endif

    return jacs_value_from_handle(type, v);
}

#if JD_64
void *jacs_handle_ptr_value(jacs_ctx_t *ctx, value_t t) {
    int tp = jacs_handle_type(t);

    if (tp & JACS_HANDLE_GC_MASK)
        return (void *)((uintptr_t)jacs_gc_base_addr(ctx->gc) + t.mantisa32);

    if (tp & JACS_HANDLE_IMG_MASK)
        return (void *)((uintptr_t)ctx->img.data + t.mantisa32);

    JD_ASSERT(0);
    return NULL;
}
#endif

int32_t jacs_value_to_int(value_t v) {
    if (jacs_is_tagged_int(v))
        return v.val_int32;
    if (jacs_is_handle(v)) {
        if (jacs_is_special(v) && jacs_handle_value(v) >= JACS_SPECIAL_TRUE)
            return 1;
        else
            return 0;
    }
    // TODO check semantics
    return (int32_t)v._f;
}

double jacs_value_to_double(value_t v) {
    if (jacs_is_tagged_int(v))
        return (double)v.val_int32;

    if (jacs_is_handle(v)) {
        if (jacs_is_special(v))
            switch (jacs_handle_value(v)) {
            case JACS_SPECIAL_FALSE:
                return 0;
            case JACS_SPECIAL_TRUE:
                return 1;
            }
        return NAN;
    }

    return v._f;
}

bool jacs_value_to_bool(value_t v) {
    if (jacs_is_tagged_int(v))
        return !!v.val_int32;
    if (jacs_is_special(v))
        return jacs_handle_value(v) >= JACS_SPECIAL_TRUE;
    if (jacs_is_handle(v))
        return 0;
    return v._f == 0.0 ? 1 : 0;
}

bool jacs_is_buffer(jacs_ctx_t *ctx, value_t v) {
    switch (jacs_handle_type(v)) {
    case JACS_HANDLE_TYPE_SPECIAL:
        return jacs_handle_value(v) == JACS_SPECIAL_PKT_BUFFER;
    case JACS_HANDLE_TYPE_GC_OBJECT:
        return jacs_gc_tag(jacs_handle_ptr_value(ctx, v)) == JACS_GC_TAG_BUFFER;
    case JACS_HANDLE_TYPE_IMG_BUFFER:
        return true;
    default:
        return false;
    }
}

bool jacs_buffer_is_writable(jacs_ctx_t *ctx, value_t v) {
    return jacs_is_buffer(ctx, v) && jacs_handle_type(v) != JACS_HANDLE_TYPE_IMG_BUFFER;
}

void *jacs_buffer_data(jacs_ctx_t *ctx, value_t v, unsigned *sz) {
    JD_ASSERT(jacs_is_buffer(ctx, v));
    switch (jacs_handle_type(v)) {
    case JACS_HANDLE_TYPE_SPECIAL: {
        if (sz)
            *sz = ctx->packet.service_size;
        return ctx->packet.data;
    }
    case JACS_HANDLE_TYPE_GC_OBJECT: {
        jacs_buffer_t *buf = jacs_handle_ptr_value(ctx, v);
        if (sz)
            *sz = buf->length;
        return buf->data;
    }
    case JACS_HANDLE_TYPE_IMG_BUFFER: {
        unsigned idx = jacs_handle_value(v);
        JD_ASSERT(idx < jacs_img_num_strings(&ctx->img));
        if (sz)
            *sz = jacs_img_get_string_len(&ctx->img, idx);
        return (void *)jacs_img_get_string_ptr(&ctx->img, idx);
    }
    default:
        JD_ASSERT(0);
        return NULL;
    }
}

jacs_gc_object_t *jacs_value_to_gc_obj(jacs_ctx_t *ctx, value_t v) {
    if (jacs_handle_type(v) == JACS_HANDLE_TYPE_GC_OBJECT)
        return jacs_handle_ptr_value(ctx, v);
    return NULL;
}

unsigned jacs_value_typeof(jacs_ctx_t *ctx, value_t v) {
    if (jacs_is_tagged_int(v))
        return JACS_OBJECT_TYPE_NUMBER;

    switch (jacs_handle_type(v)) {
    case JACS_HANDLE_TYPE_FLOAT64:
        return JACS_OBJECT_TYPE_NUMBER;
    case JACS_HANDLE_TYPE_SPECIAL:
        switch (jacs_handle_value(v)) {
        case JACS_SPECIAL_FALSE:
        case JACS_SPECIAL_TRUE:
            return JACS_OBJECT_TYPE_BOOLEAN;
        case JACS_SPECIAL_NULL:
            return JACS_OBJECT_TYPE_NULL;
        case JACS_SPECIAL_PKT_BUFFER:
            return JACS_OBJECT_TYPE_BUFFER;
        default:
            JD_ASSERT(0);
            return 0;
        }
    case JACS_HANDLE_TYPE_FIBER:
        return JACS_OBJECT_TYPE_FIBER;
    case JACS_HANDLE_TYPE_GC_OBJECT:
    case JACS_HANDLE_TYPE_IMG_BUFFER:
        return JACS_OBJECT_TYPE_BUFFER;
    case JACS_HANDLE_TYPE_ROLE:
        return JACS_OBJECT_TYPE_ROLE;
    default:
        JD_ASSERT(0);
        return 0;
    }
}
