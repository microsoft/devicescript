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

void funX_String_fromCharCode(devs_ctx_t *ctx) {
    unsigned size = 0;
    char buf[4];
    int len = ctx->stack_top_for_gc - 1;

    if (len == 0) {
        devs_ret(ctx, devs_builtin_string(DEVS_BUILTIN_STRING__EMPTY));
        return;
    }

    for (int i = 0; i < len; ++i) {
        int ch = devs_arg_int(ctx, i);
        size += devs_utf8_from_code_point(ch, buf);
    }

    value_t r;
    char *d = devs_string_prep(ctx, &r, size, len);
    if (d) {
        unsigned off = 0;
        for (int i = 0; i < len; ++i) {
            int ch = devs_arg_int(ctx, i);
            off += devs_utf8_from_code_point(ch, d + off);
        }
        devs_string_finish(ctx, &r, size, len);
    }
    devs_ret(ctx, r);
}
