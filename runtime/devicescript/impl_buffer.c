#include "devs_internal.h"

static const void *buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    if (!devs_is_buffer(ctx, v)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_BUFFER, v);
        return NULL;
    }
    return devs_buffer_data(ctx, v, sz);
}

static void *wr_buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    if (!devs_buffer_is_writable(ctx, v)) {
        devs_throw_expecting_error_ext(ctx, "mutable Buffer", v);
        return NULL;
    }
    return devs_buffer_data(ctx, v, sz);
}

void fun1_Buffer_alloc(devs_ctx_t *ctx) {
    unsigned sz = devs_arg_int(ctx, 0);
    devs_ret_gc_ptr(ctx, devs_buffer_try_alloc(ctx, sz));
}

void fun1_Buffer_from(devs_ctx_t *ctx) {
    value_t v = devs_arg(ctx, 0);
    unsigned sz;
    const uint8_t *d = devs_bufferish_data(ctx, v, &sz);
    devs_buffer_t *buf = NULL;

    if (d) {
        buf = devs_buffer_try_alloc_init(ctx, d, sz);
    } else {
        if (devs_is_array(ctx, v)) {
            devs_array_t *arr = devs_value_to_gc_obj(ctx, v);
            buf = devs_buffer_try_alloc(ctx, arr->length);
            if (buf)
                for (unsigned i = 0; i < arr->length; ++i)
                    buf->data[i] = devs_value_to_int(ctx, arr->data[i]);
        } else {
            devs_throw_type_error(ctx, "Expecting string, buffer or array");
        }
    }

    devs_ret_gc_ptr(ctx, buf);
}

value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self) {
    unsigned sz;
    if (buffer_data(ctx, self, &sz))
        return devs_value_from_int(sz);
    else
        return devs_undefined;
}

void meth1_Buffer_toString(devs_ctx_t *ctx) {
    unsigned sz;
    value_t enc = devs_arg(ctx, 0);
    const uint8_t *data = buffer_data(ctx, devs_arg_self(ctx), &sz);

    if (data) {
        if (devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_HEX)) {
            devs_string_t *s = devs_string_try_alloc(ctx, sz * 2);
            if (s)
                jd_to_hex(s->data, data, sz);
            devs_ret_gc_ptr(ctx, s);
        } else if (devs_is_null_or_undefined(enc) ||
                   devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_UTF8) ||
                   devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_UTF_8)) {
            devs_ret(ctx, devs_string_from_utf8(ctx, data, sz));
        } else {
            devs_throw_type_error(ctx, "Unknown encoding: %s", devs_show_value(ctx, enc));
        }
    }
}

void meth3_Buffer_fillAt(devs_ctx_t *ctx) {
    unsigned dlen;
    uint8_t *dst = wr_buffer_data(ctx, devs_arg_self(ctx), &dlen);
    if (dst == NULL)
        return;
    unsigned dst_offset = devs_arg_int(ctx, 0);
    unsigned len = devs_arg_int(ctx, 1);
    unsigned val = devs_arg_int(ctx, 2);

    if (dst_offset >= dlen)
        return;
    dlen -= dst_offset;
    if (dlen < len)
        len = dlen;

    memset(dst + dst_offset, val, len);
}

void meth4_Buffer_blitAt(devs_ctx_t *ctx) {
    unsigned slen, dlen;

    uint8_t *dst = wr_buffer_data(ctx, devs_arg_self(ctx), &dlen);
    if (dst == NULL)
        return;
    uint32_t dst_offset = devs_arg_int(ctx, 0);

    value_t src_ = devs_arg(ctx, 1);
    const uint8_t *src = devs_is_string(ctx, src_) ? devs_string_get_utf8(ctx, src_, &slen)
                                                   : buffer_data(ctx, src_, &slen);
    if (src == NULL)
        return;
    uint32_t src_offset = devs_arg_int(ctx, 2);
    uint32_t len = devs_arg_int(ctx, 3);

    if (src_offset >= slen)
        return;
    slen -= src_offset;
    if (slen < len)
        len = slen;

    if (dst_offset >= dlen)
        return;
    dlen -= dst_offset;
    if (dlen < len)
        len = dlen;

    memcpy(dst + dst_offset, src + src_offset, len);
}
