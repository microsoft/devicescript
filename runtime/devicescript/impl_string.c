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
    int endp = devs_arg_int_defl(ctx, 1, 0x7fffffff);
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

void meth3_String_indexOf(devs_ctx_t *ctx) {
    value_t str = devs_arg_self(ctx);
    unsigned size;
    const char *data = devs_string_get_utf8(ctx, str, &size);

    value_t search = devs_arg(ctx, 0);
    unsigned search_size;
    const char *search_data = devs_string_get_utf8(ctx, search, &search_size);

    int len = devs_string_length(ctx, str);
    int start_ch = devs_arg_int(ctx, 1);
    int end_ch = devs_arg_int_defl(ctx, 2, len);
    int rev = 0;
    if (end_ch < 0) {
        end_ch = -end_ch;
        rev = 1;
    }

    int r = -1;
    int ptr = devs_string_index(ctx, str, start_ch);

    if (search_data && ptr >= 0) {
        while (start_ch < end_ch) {
            if (ptr + search_size > size)
                break;
            if (memcmp(data + ptr, search_data, search_size) == 0) {
                r = start_ch;
                if (!rev)
                    break;
            }
            start_ch++;
            ptr++;
            while (ptr < (int)size && devs_utf8_is_cont(data[ptr]))
                ptr++;
        }
    }

    devs_ret_int(ctx, r);
}

static void meth0_String_toCase(devs_ctx_t *ctx, int lower) {
    value_t str = devs_arg_self(ctx);
    unsigned size;
    const char *data = devs_string_get_utf8(ctx, str, &size);

    if (!data)
        return;

    value_t r = devs_string_from_utf8(ctx, (const uint8_t *)data, size);
    char *dp = (char *)devs_string_get_utf8(ctx, r, &size);
    if (!dp)
        return;

    for (unsigned i = 0; i < size; ++i) {
        char c = dp[i];
        if (lower) {
            if ('A' <= c && c <= 'Z')
                c += 32;
        } else {
            if ('a' <= c && c <= 'z')
                c -= 32;
        }
        dp[i] = c;
    }

    devs_ret(ctx, r);
}

void meth0_String_toLowerCase(devs_ctx_t *ctx) {
    meth0_String_toCase(ctx, 1);
}

void meth0_String_toUpperCase(devs_ctx_t *ctx) {
    meth0_String_toCase(ctx, 0);
}