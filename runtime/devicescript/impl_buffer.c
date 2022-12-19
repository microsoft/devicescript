#include "devs_internal.h"

static const void *buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    if (!devs_is_buffer(ctx, v)) {
        devs_runtime_failure(ctx, 60158);
        return NULL;
    }
    return devs_buffer_data(ctx, v, sz);
}

static void *wr_buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    if (!devs_buffer_is_writable(ctx, v)) {
        devs_runtime_failure(ctx, 60159);
        return NULL;
    }
    return devs_buffer_data(ctx, v, sz);
}

value_t fun_Buffer_alloc(devs_ctx_t *ctx, value_t sz) {
    return devs_value_from_gc_obj(ctx, devs_buffer_try_alloc(ctx, devs_value_to_int(sz)));
}

value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self) {
    unsigned sz;
    if (!buffer_data(ctx, self, &sz))
        return devs_undefined;
    return devs_value_from_int(sz);
}

value_t fun_Buffer_toString(devs_ctx_t *ctx, value_t self) {
    unsigned sz;
    const uint8_t *data = buffer_data(ctx, self, &sz);
    if (data == NULL)
        return devs_undefined;
    return devs_string_from_utf8(ctx, data, sz);
}

void fun_Buffer_fillAt(devs_ctx_t *ctx, value_t self, value_t offset, value_t length,
                       value_t pattern) {
    unsigned dlen;
    uint8_t *dst = wr_buffer_data(ctx, self, &dlen);
    if (dst == NULL)
        return;
    unsigned dst_offset = devs_value_to_int(offset);
    unsigned len = devs_value_to_int(length);
    unsigned val = devs_value_to_int(pattern);

    if (dst_offset >= dlen)
        return;
    dlen -= dst_offset;
    if (dlen < len)
        len = dlen;

    memset(dst + dst_offset, val, len);
}

void fun_Buffer_blitAt(devs_ctx_t *ctx, value_t self, value_t offset, value_t src_,
                       value_t src_offset_, value_t length) {
    unsigned slen, dlen;

    uint32_t len = devs_value_to_int(length);
    uint32_t src_offset = devs_value_to_int(src_offset_);
    const uint8_t *src = devs_is_string(ctx, src_) ? devs_string_get_utf8(ctx, src_, &slen)
                                                   : buffer_data(ctx, src_, &slen);
    uint32_t dst_offset = devs_value_to_int(offset);
    uint8_t *dst = wr_buffer_data(ctx, self, &dlen);

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
