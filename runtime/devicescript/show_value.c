#include "devs_internal.h"

void devs_log_value(devs_ctx_t *ctx, const char *lbl, value_t v) {
    DMESG("%s: %s", lbl, devs_show_value(ctx, v));
}

static char buf[64];

const char *devs_show_value0(devs_ctx_t *ctx, value_t v) {

    if (devs_is_tagged_int(v)) {
        jd_sprintf(buf, sizeof(buf), "%d", (int)v.val_int32);
        return buf;
    }

    const char *fmt = NULL;
    uint32_t hv;

    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_FLOAT64:
        jd_sprintf(buf, sizeof(buf), "%f", devs_value_to_double(ctx, v));
        return buf;

    case DEVS_HANDLE_TYPE_SPECIAL:
        switch ((hv = devs_handle_value(v))) {
        case DEVS_SPECIAL_NULL:
            return "null";
        case DEVS_SPECIAL_FALSE:
            return "false";
        case DEVS_SPECIAL_TRUE:
            return "true";
        case DEVS_SPECIAL_PKT_BUFFER:
            return "packet";
        case DEVS_SPECIAL_INF:
            return "Infinity";
        case DEVS_SPECIAL_MINF:
            return "-Infinity";
        case DEVS_SPECIAL_NAN:
            return "NaN";
        default:
            if (devs_handle_is_builtin(hv)) {
                jd_sprintf(buf, sizeof(buf), "builtin:%d",
                           (int)hv - DEVS_SPECIAL_BUILTIN_OBJ_FIRST);
                return buf;
            }
            return "?special";
        }

    case DEVS_HANDLE_TYPE_FIBER:
        fmt = "fib";
        break;
    case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
        fmt = "fun";
        break;
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        fmt = devs_bufferish_is_buffer(v) ? "buf" : "str";
        break;
    case DEVS_HANDLE_TYPE_ROLE:
        fmt = "role";
        break;
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION:
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC:
        jd_sprintf(buf, sizeof(buf), "method:%d:%x", (int)devs_handle_high_value(v),
                   (unsigned)devs_handle_value(v));
        return buf;
    case DEVS_HANDLE_TYPE_CLOSURE:
        jd_sprintf(buf, sizeof(buf), "closure:%d:%x", (int)devs_handle_high_value(v),
                   (unsigned)devs_handle_value(v));
        return buf;
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        switch (devs_gc_tag(devs_handle_ptr_value(ctx, v))) {
        case DEVS_GC_TAG_ARRAY:
            fmt = "array";
            break;
        case DEVS_GC_TAG_BUFFER:
            fmt = "buffer";
            break;
        case DEVS_GC_TAG_STRING:
            fmt = "string";
            break;
        case DEVS_GC_TAG_MAP:
            fmt = "map";
            break;
        case DEVS_GC_TAG_FREE:
            fmt = "?free";
            break;
        case DEVS_GC_TAG_BYTES:
            fmt = "bytes";
            break;
        case DEVS_GC_TAG_BOUND_FUNCTION:
            fmt = "bound";
            break;
        default:
            fmt = "???";
            break;
        }
        jd_sprintf(buf, sizeof(buf), "%s:%x", fmt, (unsigned)devs_handle_value(v));
        return buf;
    }

    if (fmt)
        jd_sprintf(buf, sizeof(buf), "%s:%u", fmt, (unsigned)devs_handle_value(v));
    else
        return "?value";

    return buf;
}

const char *devs_show_value(devs_ctx_t *ctx, value_t v) {
    bool isFun = false;

    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION:
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC:
    case DEVS_HANDLE_TYPE_CLOSURE:
        isFun = true;
        break;
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        isFun = devs_gc_tag(devs_handle_ptr_value(ctx, v)) == DEVS_GC_TAG_BOUND_FUNCTION;
        break;
    }

    if (!isFun)
        return devs_show_value0(ctx, v);

    value_t this_val;
    devs_activation_t *closure;
    int fnidx = devs_get_fnidx(ctx, v, &this_val, &closure);
    unsigned off = 0;
    if (!devs_is_null(this_val)) {
        const char *tmp = devs_show_value0(ctx, this_val);
        if (tmp != buf)
            jd_sprintf(buf, sizeof(buf), "%s", tmp);
        off = strlen(buf);
        if (off >= sizeof(buf) - 25) {
            strcpy(buf, "?.");
            off = 2;
        } else {
            buf[off++] = '.';
        }
    }
    if (closure != NULL) {
        uint32_t clo = devs_handle_value(devs_value_from_gc_obj(ctx, closure));
        jd_sprintf(buf + off, sizeof(buf) - off, "%x", clo);
        off = strlen(buf);
        buf[off++] = '@';
    }
    jd_sprintf(buf + off, sizeof(buf) - off, "fun:%d", fnidx);

    return buf;
}
