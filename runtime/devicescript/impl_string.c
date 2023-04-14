#include "devs_internal.h"

value_t prop_String_length(devs_ctx_t *ctx, value_t self) {
    int len = devs_string_length(ctx, self);
    if (len < 0)
        return devs_undefined;
    return devs_value_from_int(len);
}

void meth1_String_charCodeAt(devs_ctx_t *ctx) {
    int off = devs_string_index(ctx, devs_arg_self(ctx), devs_arg_int(ctx, 0));

    if (off < 0)
        devs_ret(ctx, devs_nan);

    const char *data = devs_string_get_utf8(ctx, devs_arg_self(ctx), NULL);
    devs_ret_int(ctx, devs_utf8_code_point(data + off));
}

void meth1_String_charAt(devs_ctx_t *ctx) {
    devs_ret(ctx, devs_seq_get(ctx, devs_arg_self(ctx), devs_arg_int(ctx, 0)));
}

void meth2_String_slice(devs_ctx_t *ctx) {
    int start = devs_arg_int(ctx, 0);
    value_t endval = devs_arg(ctx, 1);
    int endp = devs_is_undefined(endval) ? 0x7fffffff : devs_value_to_int(ctx, endval);
    devs_ret(ctx, devs_string_slice(ctx, devs_arg_self(ctx), start, endp));
}
