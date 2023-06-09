#include "devs_internal.h"

#ifndef JD_I2C
#define JD_I2C 0
#endif

void fun3_DeviceScript__i2cTransaction(devs_ctx_t *ctx) {
#if JD_I2C
    int addr = devs_arg_int(ctx, 0);
    value_t buf = devs_arg(ctx, 1);
    unsigned wrsize;
    const uint8_t *data = devs_bufferish_data(ctx, buf, &wrsize);
    value_t rdbuf = devs_arg(ctx, 2);
    unsigned num_read = 0;
    uint8_t *rdata = NULL;

    if (addr <= 0 || addr > 0x7f) {
        devs_throw_type_error(ctx, "invalid I2C address: %d", addr);
        return;
    }

    if (!devs_is_null_or_undefined(buf) && data == NULL) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_BUFFER, buf);
        return;
    }

    if (!devs_is_null_or_undefined(rdbuf)) {
        if (!devs_buffer_is_writable(ctx, rdbuf)) {
            devs_throw_expecting_error_ext(ctx, "mutable Buffer", rdbuf);
            return;
        }
        rdata = (uint8_t *)devs_buffer_data(ctx, rdbuf, &num_read);
    }

    if (wrsize > 0) {
        if (i2c_write_ex(addr, data, wrsize, num_read > 0) != 0) {
            devs_ret_int(ctx, -1);
            return;
        }
    }

    if (num_read) {
        if (i2c_read_ex(addr, rdata, num_read) != 0) {
            devs_ret_int(ctx, -2);
            return;
        }
    }

    devs_ret_int(ctx, 0);

#else
    devs_throw_not_supported_error(ctx, "I2C");
#endif
}
