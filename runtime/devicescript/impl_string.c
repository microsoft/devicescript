#include "devs_internal.h"

// ignore UTF8 decoding for now

void prop_String_length(devs_ctx_t *ctx) {
    unsigned sz;
    if (devs_string_get_utf8(ctx, devs_arg_self(ctx), &sz))
        devs_ret_int(ctx, sz);
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
