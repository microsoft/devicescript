#include "devs_internal.h"
#include <math.h>

uint32_t devs_compute_timeout(devs_ctx_t *ctx, value_t t) {
    uint32_t max = 0xffffffff;
    if (devs_is_null_or_undefined(t))
        return max;
    if (devs_is_tagged_int(t))
        return t.val_int32 < 0 ? 0 : t.val_int32;
    if (devs_is_special(t) && devs_handle_value(t) == DEVS_SPECIAL_INF)
        return max;
    double v = devs_value_to_double(ctx, t);
    if (v > max)
        return max;
    if (v < 0)
        return 0;
    return (uint32_t)v;
}

void fun1_DeviceScript_sleep(devs_ctx_t *ctx) {
    unsigned time = devs_compute_timeout(ctx, devs_arg(ctx, 0));
    devs_fiber_sleep(ctx->curr_fiber, time);
}

void fun1_DeviceScript_delay(devs_ctx_t *ctx) {
    fun1_DeviceScript_sleep(ctx);
}

void fun1_DeviceScript__panic(devs_ctx_t *ctx) {
    unsigned code = devs_arg_int(ctx, 0);
    if (code == 0xab04711) {
        DMESG("! User-requested JD_PANIC()");
        JD_PANIC();
    }
    if (code == 0 || code >= 60000)
        code = 59999;
    devs_panic(ctx, code);
}

void fun0_DeviceScript_reboot(devs_ctx_t *ctx) {
    target_reset();
}

void fun0_DeviceScript_restart(devs_ctx_t *ctx) {
    devs_panic(ctx, 0);
}

void funX_DeviceScript_format(devs_ctx_t *ctx) {
    if (ctx->stack_top_for_gc < 2)
        return;

    value_t fmtv = devs_arg(ctx, 0);
    unsigned len;
    const char *fmt = devs_string_get_utf8(ctx, fmtv, &len);
    if (fmt == NULL)
        return;

    unsigned numargs = ctx->stack_top_for_gc - 2;
    value_t *argp = ctx->the_stack + 2;

    char tmp[64];
    size_t length;
    unsigned sz = devs_strformat(ctx, fmt, len, tmp, sizeof(tmp), argp, numargs, &length);
    sz--;
    length--;

    value_t r;
    char *d = devs_string_prep(ctx, &r, sz, length);
    if (d) {
        if (sz < sizeof(tmp) - 1) {
            memcpy(d, tmp, sz);
        } else {
            sz = devs_strformat(ctx, fmt, len, d, sz + 1, argp, numargs, &length);
            length--;
            sz--;
        }
        devs_string_finish(ctx, &r, sz, length);
    }

    devs_ret(ctx, r);
}

void fun2_DeviceScript_print(devs_ctx_t *ctx) {
    int lev = devs_arg_int(ctx, 0);
    if (lev <= 0 || lev > 0x80)
        lev = '>';
    value_t s = devs_arg(ctx, 1);
    s = devs_value_to_string(ctx, s);
    devs_jd_send_logmsg(ctx, lev, s);
}

void fun1_DeviceScript_parseFloat(devs_ctx_t *ctx) {
    devs_ret_double(ctx, devs_arg_double(ctx, 0));
}

void fun1_DeviceScript_parseInt(devs_ctx_t *ctx) {
    devs_ret_double(ctx, trunc(devs_arg_double(ctx, 0)));
}

void fun2_DeviceScript__logRepr(devs_ctx_t *ctx) {
    value_t v = devs_arg(ctx, 0);
    value_t lbl = devs_arg(ctx, 1);
    if (devs_is_nullish(lbl)) {
        DMESG("> %s", devs_show_value(ctx, v));
    } else {
        lbl = devs_value_to_string(ctx, lbl);
        devs_value_pin(ctx, lbl);
        const char *p = devs_string_get_utf8(ctx, lbl, NULL);
        DMESG("> %s: %s", p, devs_show_value(ctx, v));
        devs_value_unpin(ctx, lbl);
    }
}

void fun1_DeviceScript__dcfgString(devs_ctx_t *ctx) {
    value_t lbl = devs_arg(ctx, 0);
    lbl = devs_value_to_string(ctx, lbl);
    const char *key = devs_string_get_utf8(ctx, lbl, NULL);
    if (key) {
        unsigned sz;
        const char *v = dcfg_get_string(key, &sz);
        if (v)
            devs_ret(ctx, devs_value_from_gc_obj(ctx, devs_string_try_alloc_init(ctx, v, sz)));
    }
}

void fun0_DeviceScript_millis(devs_ctx_t *ctx) {
    devs_ret(ctx, devs_value_from_double((double)ctx->_now_long));
}

void fun1_DeviceScript_deviceIdentifier(devs_ctx_t *ctx) {
    value_t tp = devs_arg(ctx, 0);
    uint64_t id;
    if (devs_value_eq_builtin_string(ctx, tp, DEVS_BUILTIN_STRING_SELF))
        id = jd_device_id();
    else if (devs_value_eq_builtin_string(ctx, tp, DEVS_BUILTIN_STRING_SERVER))
        id = devs_jd_server_device_id();
    else
        return;

    devs_ret(ctx, devs_string_sprintf(ctx, "%*p", 8, &id));
}

void fun2_DeviceScript__serverSend(devs_ctx_t *ctx) {
    unsigned service_idx = devs_arg_int(ctx, 0);
    devs_packet_t *pkt = devs_value_to_packet_or_throw(ctx, devs_arg(ctx, 1));
    if (pkt == NULL)
        return;

    if (service_idx > 0x30) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_SERVICEINDEX);
        return;
    }

    pkt->service_index = service_idx;

    unsigned sz = pkt->payload->length;

    if (sz > JD_SERIAL_PAYLOAD_SIZE) {
        devs_throw_too_big_error(ctx, DEVS_BUILTIN_STRING_PACKET);
        return;
    }

    ctx->packet.service_index = pkt->service_index;
    ctx->packet.service_command = pkt->service_command;
    ctx->packet.device_identifier = pkt->device_id;
    ctx->packet.flags = pkt->flags;

    ctx->packet.service_size = sz;
    memcpy(ctx->packet.data, pkt->payload->data, sz);

    devs_jd_send_raw(ctx);
}

void fun2_DeviceScript__allocRole(devs_ctx_t *ctx) {
    unsigned service_cls = devs_arg_int(ctx, 0);
    value_t name = devs_arg(ctx, 1);
    if (!devs_is_undefined(name) && !devs_is_string(ctx, name)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_STRING, name);
        return;
    }
    if (service_cls && (service_cls & 0xF0000000) != 0x10000000) {
        devs_throw_range_error(ctx, "0x1xxxxxxx expected for service class");
        return;
    }
    int r = devs_jd_alloc_role(ctx, name, service_cls);
    if (r == -2) {
        devs_throw_type_error(ctx, "spec missing: %x", service_cls);
        return;
    }
    if (r == -3) {
        devs_throw_range_error(ctx, "role name '%s' already used",
                               devs_string_get_utf8(ctx, name, NULL));
        return;
    }
    if (r < 0)
        return; // OOM
    devs_ret(ctx, devs_value_from_handle(DEVS_HANDLE_TYPE_ROLE, r));
}

void fun0_DeviceScript_notImplemented(devs_ctx_t *ctx) {
    devs_throw_generic_error(ctx, "body missing");
}
