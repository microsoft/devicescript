#include "devs_internal.h"

value_t prop_Role_isConnected(devs_ctx_t *ctx, value_t self) {
    if (devs_handle_type(self) != DEVS_HANDLE_TYPE_ROLE) {
        devs_runtime_failure(ctx, 60163);
        return devs_undefined;
    }

    uint32_t roleidx = devs_handle_value(self);
    return devs_value_from_bool(devs_role(ctx, roleidx)->service != NULL);
}
