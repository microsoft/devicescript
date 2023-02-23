#include "devs_internal.h"

// ignore UTF8 decoding for now

value_t prop_String_length(devs_ctx_t *ctx, value_t self) {
    unsigned sz;
    if (devs_string_get_utf8(ctx, self, &sz))
        return devs_value_from_int(sz);
    else
        return devs_undefined;
}

void meth1_String_charCodeAt(devs_ctx_t *ctx) {
    unsigned sz;
    const char *data = devs_string_get_utf8(ctx, devs_arg_self(ctx), &sz);
    if (data) {
        unsigned idx = devs_arg_int(ctx, 0);
        if (idx >= sz)
            devs_ret(ctx, devs_nan);
        else
            devs_ret_int(ctx, (uint8_t)data[idx]);
    }
}

void meth1_String_charAt(devs_ctx_t *ctx) {
    devs_ret(ctx, devs_seq_get(ctx, devs_arg_self(ctx), devs_arg_int(ctx, 0)));
}

void meth2_String_slice(devs_ctx_t *ctx) {
    int start = devs_arg_int(ctx, 0);
    value_t endval = devs_arg(ctx, 1);
    int endp = devs_is_null(endval) ? 0x7fffffff : devs_value_to_int(ctx, endval);
    devs_ret(ctx, devs_string_slice(ctx, devs_arg_self(ctx), start, endp));
}
