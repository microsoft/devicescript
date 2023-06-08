#include "devs_internal.h"

#ifndef JD_USER_SOCKET
#define JD_USER_SOCKET JD_NETWORK
#endif

#if JD_USER_SOCKET
static bool inside_sock;
static void tcpsock_on_event(unsigned event, const void *data, unsigned size) {
    int ev = 0;
    value_t arg = devs_undefined;
    devs_ctx_t *ctx = devsmgr_get_ctx();

    if (!ctx || ctx->error_code)
        return;

    value_t fn = devs_maplike_get_no_bind(
        ctx, devs_get_builtin_object(ctx, DEVS_BUILTIN_OBJECT_DEVICESCRIPT),
        devs_builtin_string(DEVS_BUILTIN_STRING__SOCKETONEVENT));

    if (devs_is_undefined(fn))
        return;

    switch (event) {
    case JD_CONN_EV_OPEN:
        ev = DEVS_BUILTIN_STRING_OPEN;
        break;
    case JD_CONN_EV_MESSAGE:
        ev = DEVS_BUILTIN_STRING_DATA;
        arg = devs_value_from_gc_obj(ctx, devs_buffer_try_alloc_init(ctx, data, size));
        break;
    case JD_CONN_EV_CLOSE:
        jd_tcpsock_on_event_override = NULL;
        ev = DEVS_BUILTIN_STRING_CLOSE;
        break;
    case JD_CONN_EV_ERROR:
        jd_tcpsock_on_event_override = NULL;
        ev = DEVS_BUILTIN_STRING_ERROR_;
        jd_tcpsock_close();
        if (data)
            arg = devs_value_from_gc_obj(ctx, devs_string_try_alloc_init(ctx, data, size));
        break;
    default:
        JD_PANIC();
        return;
    }

    if (!inside_sock)
        DEVS_CHECK_CTX_FREE(ctx);

    ctx->stack_top_for_gc = 3;
    ctx->the_stack[0] = fn;
    ctx->the_stack[1] = devs_builtin_string(ev);
    ctx->the_stack[2] = arg;
    devs_fiber_start(ctx, 2, DEVS_OPCALL_BG);
}
#endif

void fun2_DeviceScript__socketOpen(devs_ctx_t *ctx) {
#if JD_USER_SOCKET
    const char *host = devs_string_get_utf8(ctx, devs_arg(ctx, 0), NULL);
    int port = devs_arg_int(ctx, 1);

    if (dcfg_get_bool("devNetwork")) {
        devs_throw_range_error(ctx, "devNetwork enabled");
        return;
    }

    if (!jd_tcpsock_is_available()) {
        devs_throw_range_error(ctx, "network not available");
        return;
    }

    if (!host || !port) {
        devs_throw_type_error(ctx, "host or port invalid");
        return;
    }

    jd_tcpsock_on_event_override = tcpsock_on_event;
    devs_ret(ctx, devs_arg(ctx, 0)); // make sure host argument is not GC-ed
    inside_sock = true;
    int r = jd_tcpsock_new(host, port);
    inside_sock = false;
    if (r != 0) {
        jd_tcpsock_on_event_override = NULL;
        devs_ret_int(ctx, -1);
    }

    devs_ret_int(ctx, 0);

#else
    devs_throw_not_supported_error(ctx, "Networking");
#endif
}

void fun0_DeviceScript__socketClose(devs_ctx_t *ctx) {
#if JD_USER_SOCKET
    if (jd_tcpsock_on_event_override) {
        jd_tcpsock_close();
        jd_tcpsock_on_event_override = NULL;
        devs_ret_int(ctx, 0);
    } else {
        devs_ret_int(ctx, -1);
    }
#else
    devs_throw_not_supported_error(ctx, "Networking");
#endif
}

void fun1_DeviceScript__socketWrite(devs_ctx_t *ctx) {
#if JD_USER_SOCKET
    if (!jd_tcpsock_on_event_override) {
        devs_ret_int(ctx, -100);
    } else {
        unsigned sz;
        const void *buf = devs_bufferish_data(ctx, devs_arg(ctx, 0), &sz);
        if (buf == NULL)
            devs_ret_int(ctx, -101);
        else {
            devs_ret(ctx, devs_arg(ctx, 0)); // "pin" it
            inside_sock = true;
            int r = jd_tcpsock_write(buf, sz);
            inside_sock = false;
            devs_ret_int(ctx, r);
        }
    }
#else
    devs_throw_not_supported_error(ctx, "Networking");
#endif
}
