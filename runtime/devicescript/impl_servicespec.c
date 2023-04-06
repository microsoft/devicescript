#include "devs_internal.h"

static const devs_service_spec_t *getspec(devs_ctx_t *ctx, value_t self) {
    const devs_service_spec_t *s = devs_value_to_service_spec(ctx, self);
    if (!s)
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_SERVICESPEC, self);
    return s;
}

#define SELF()                                                                                     \
    const devs_service_spec_t *spec = getspec(ctx, self);                                          \
    if (spec == NULL)                                                                              \
    return devs_undefined

value_t prop_DsServiceSpec_classIdentifier(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_int(spec->service_class);
}

value_t prop_DsServiceSpec_name(devs_ctx_t *ctx, value_t self) {
    SELF();
    return devs_value_from_handle(DEVS_HANDLE_TYPE_IMG_BUFFERISH, spec->name_idx);
}

void meth1_DsServiceSpec_lookup(devs_ctx_t *ctx) {
    const devs_service_spec_t *spec = getspec(ctx, devs_arg_self(ctx));
    if (!spec)
        return;
    devs_ret(ctx, devs_spec_lookup(ctx, spec, devs_arg(ctx, 0)));
}

void meth1_DsServiceSpec_assign(devs_ctx_t *ctx) {
    const devs_service_spec_t *spec = getspec(ctx, devs_arg_self(ctx));
    if (!spec)
        return;
    devs_packet_t *pkt = devs_value_to_packet_or_throw(ctx, devs_arg(ctx, 0));
    if (!pkt)
        return;

    devs_throw_not_supported_error(ctx, "TODO()");
}
