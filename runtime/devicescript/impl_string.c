#include "devs_internal.h"

// ignore UTF8 decoding for now

value_t prop_String_length(devs_ctx_t *ctx, value_t self) {
    unsigned sz;
    if (!devs_string_get_utf8(ctx, self, &sz))
        return devs_error;
    return devs_value_from_int(sz);
}

value_t fun_String_charCodeAt(devs_ctx_t *ctx, value_t self, value_t idxv) {
    unsigned sz;
    const char *data = devs_string_get_utf8(ctx, self, &sz);
    if (!data)
        return devs_error;
    unsigned idx = devs_value_to_int(idxv);
    if (idx >= sz)
        return devs_nan;
    return devs_value_from_int((uint8_t)data[idx]);
}

value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self) {
    unsigned sz;
    if (!devs_is_buffer(ctx, self))
        return devs_undefined;
    if (!devs_buffer_data(ctx, self, &sz))
        return devs_undefined;
    return devs_value_from_int(sz);
}

