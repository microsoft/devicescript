#include "devs_internal.h"

void fun2_JSON_parse(devs_ctx_t *ctx) {
    value_t str = devs_arg(ctx, 0);
    value_t reviver = devs_arg(ctx, 1);

    if (!devs_is_nullish(reviver))
        devs_throw_not_supported_error(ctx, "JSON.parse reviver");

    str = devs_value_to_string(ctx, str);

    devs_value_pin(ctx, str);
    unsigned sz;
    const char *data = devs_string_get_utf8(ctx, str, &sz);
    if (data != NULL)
        devs_ret(ctx, devs_json_parse(ctx, data, sz, true));
    devs_value_unpin(ctx, str);
}

void fun3_JSON_stringify(devs_ctx_t *ctx) {
    value_t obj = devs_arg(ctx, 0);
    value_t repl = devs_arg(ctx, 1);
    int indent = devs_arg_int(ctx, 2);

    if (!devs_is_nullish(repl))
        devs_throw_not_supported_error(ctx, "JSON.stringify replacer");

    devs_ret(ctx, devs_json_stringify(ctx, obj, indent, true));
}