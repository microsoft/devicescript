#include "devs_internal.h"
#include <math.h>

bool devs_is_string(devs_ctx_t *ctx, value_t v) {
    unsigned tag;
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        tag = devs_gc_tag(devs_handle_ptr_value(ctx, v));
        return tag == DEVS_GC_TAG_STRING || tag == DEVS_GC_TAG_STRING_JMP;
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        return !devs_bufferish_is_buffer(v);
    default:
        return false;
    }
}

bool devs_is_number(value_t v) {
    return devs_is_tagged_int(v) || devs_handle_type(v) == DEVS_HANDLE_TYPE_FLOAT64;
}

const devs_utf8_string_t *devs_string_get_utf8_struct(devs_ctx_t *ctx, value_t v) {
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_GC_OBJECT: {
        void *ptr = devs_handle_ptr_value(ctx, v);
        if (devs_gc_tag(ptr) == DEVS_GC_TAG_STRING_JMP) {
            devs_string_jmp_t *s = ptr;
            return &s->inner;
        }
        return NULL;
    }
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH: {
        unsigned idx = devs_handle_value(v);
        unsigned tp = (uint16_t)idx >> DEVS_STRIDX__SHIFT;
        idx &= (1 << DEVS_STRIDX__SHIFT) - 1;
        if (tp == DEVS_STRIDX_UTF8)
            return devs_img_get_string_jmp(ctx->img, idx);
        return NULL;
    }
    default:
        return NULL;
    }
}

const char *devs_string_get_utf8(devs_ctx_t *ctx, value_t v, unsigned *size) {
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_GC_OBJECT: {
        void *ptr = devs_handle_ptr_value(ctx, v);
        if (devs_gc_tag(ptr) == DEVS_GC_TAG_STRING) {
            devs_string_t *s = ptr;
            if (size)
                *size = s->length;
            return s->data;
        } else if (devs_gc_tag(ptr) == DEVS_GC_TAG_STRING_JMP) {
            devs_string_jmp_t *s = ptr;
            if (size)
                *size = s->inner.size;
            return devs_utf8_string_data(&s->inner);
        }
        return NULL;
    }
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        return devs_bufferish_is_buffer(v) ? NULL
                                           : devs_get_static_utf8(ctx, devs_handle_value(v), size);
    default:
        return NULL;
    }
}

value_t devs_builtin_string(unsigned idx) {
    return devs_value_from_handle(DEVS_HANDLE_TYPE_IMG_BUFFERISH,
                                  (DEVS_STRIDX_BUILTIN << DEVS_STRIDX__SHIFT) | idx);
}

value_t devs_string_vsprintf(devs_ctx_t *ctx, const char *format, va_list ap) {
    if (strstr(format, "%-s"))
        JD_PANIC();
    va_list ap2;
    va_copy(ap2, ap);
    unsigned len;
    int sz = jd_vsprintf_ext(NULL, 0, format, &len, ap);
    // len includes final NUL; devs_string_try_alloc() allocates the final NUL, but doesn't count it
    // in its len
    len--;
    sz--;
    value_t r;
    char *d = devs_string_prep(ctx, &r, sz, len);
    if (d) {
        sz = jd_vsprintf_ext(d, sz + 1, format, &len, ap2);
        len--;
        sz--;
        devs_string_finish(ctx, &r, sz, len);
    }
    return r;
}

value_t devs_string_sprintf(devs_ctx_t *ctx, const char *format, ...) {
    va_list arg;
    va_start(arg, format);
    value_t r = devs_string_vsprintf(ctx, format, arg);
    va_end(arg);
    return r;
}

value_t devs_string_from_utf8(devs_ctx_t *ctx, const uint8_t *utf8, unsigned len) {
    devs_any_string_t *s = devs_string_try_alloc_init(ctx, (const char *)utf8, len);
    if (s == NULL) {
        return devs_undefined;
    } else {
        return devs_value_from_gc_obj(ctx, s);
    }
}

static value_t buffer_to_string(devs_ctx_t *ctx, value_t v) {
    unsigned sz;
    const void *data = devs_bufferish_data(ctx, v, &sz);
    JD_ASSERT(data != NULL);
    unsigned maxbuf = 32;
    if (sz > maxbuf) {
        return devs_string_sprintf(ctx, "[Buffer[%u] %*p...]", sz, maxbuf, data);
    } else {
        return devs_string_sprintf(ctx, "[Buffer[%u] %*p]", sz, sz, data);
    }
}

value_t devs_value_to_string(devs_ctx_t *ctx, value_t v) {
    if (devs_is_string(ctx, v))
        return v;

    uint32_t hv;
    switch (devs_handle_type(v)) {
    case DEVS_HANDLE_TYPE_FLOAT64: {
        char buf[64];
        jd_print_double(buf, devs_value_to_double(ctx, v), 7);
        return devs_string_sprintf(ctx, "%s", buf);
    }
    case DEVS_HANDLE_TYPE_SPECIAL:
        switch ((hv = devs_handle_value(v))) {
        case DEVS_SPECIAL_NULL:
            return devs_builtin_string(DEVS_BUILTIN_STRING_NULL);
        case DEVS_SPECIAL_UNDEFINED:
            return devs_builtin_string(DEVS_BUILTIN_STRING_UNDEFINED);
        case DEVS_SPECIAL_FALSE:
            return devs_builtin_string(DEVS_BUILTIN_STRING_FALSE);
        case DEVS_SPECIAL_TRUE:
            return devs_builtin_string(DEVS_BUILTIN_STRING_TRUE);
        case DEVS_SPECIAL_NAN:
            return devs_builtin_string(DEVS_BUILTIN_STRING_NAN);
        case DEVS_SPECIAL_INF:
            return devs_builtin_string(DEVS_BUILTIN_STRING_INFINITY);
        case DEVS_SPECIAL_MINF:
            return devs_builtin_string(DEVS_BUILTIN_STRING_MINFINITY);
        default: {
            if (devs_handle_is_builtin(hv))
                return devs_string_sprintf(ctx, "[Static Obj: %d]",
                                           (int)hv - DEVS_SPECIAL_BUILTIN_OBJ_FIRST);
            else if (devs_handle_is_throw_jmp(hv)) {
                return devs_string_sprintf(ctx, "[Throw: %x]", (unsigned)devs_handle_value(v));
            } else
                JD_PANIC();
        }
        }
    case DEVS_HANDLE_TYPE_FIBER:
        return devs_string_sprintf(ctx, "[Fiber: %x]", (unsigned)devs_handle_value(v));
    case DEVS_HANDLE_TYPE_STATIC_FUNCTION:
        return devs_string_sprintf(ctx, "[Function: %s]",
                                   devs_img_fun_name(ctx->img, devs_handle_value(v)));
    case DEVS_HANDLE_TYPE_CLOSURE:
        return devs_string_sprintf(ctx, "[Closure: %s]",
                                   devs_img_fun_name(ctx->img, devs_handle_high_value(v)));
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION:
    case DEVS_HANDLE_TYPE_BOUND_FUNCTION_STATIC:
        return devs_string_sprintf(ctx, "[Method: %s]",
                                   devs_img_fun_name(ctx->img, devs_handle_high_value(v)));
    case DEVS_HANDLE_TYPE_GC_OBJECT:
        switch (devs_gc_tag(devs_handle_ptr_value(ctx, v))) {
        case DEVS_GC_TAG_ARRAY:
            return devs_builtin_string(DEVS_BUILTIN_STRING_ARRAY); // TODO stringify array?
        case DEVS_GC_TAG_BOUND_FUNCTION:
            return devs_builtin_string(DEVS_BUILTIN_STRING_FUNCTION); // TODO?
        case DEVS_GC_TAG_BUFFER:
            return buffer_to_string(ctx, v);
        case DEVS_GC_TAG_PACKET: {
            devs_packet_t *pkt = devs_handle_ptr_value(ctx, v);
            return devs_string_sprintf(ctx, "[Packet: %s cmd=%x sz=%d]",
                                       devs_role_name(ctx, pkt->roleidx), pkt->service_command,
                                       pkt->payload->length);
        }
        case DEVS_GC_TAG_SHORT_MAP:
        case DEVS_GC_TAG_HALF_STATIC_MAP:
        case DEVS_GC_TAG_MAP:
            return devs_builtin_string(DEVS_BUILTIN_STRING_MAP);
        case DEVS_GC_TAG_BUILTIN_PROTO: // can't happen
        case DEVS_GC_TAG_STRING_JMP:    // handled on top
        case DEVS_GC_TAG_STRING:        // handled on top
        default:
            JD_PANIC();
        }
    case DEVS_HANDLE_TYPE_IMG_BUFFERISH:
        JD_ASSERT(devs_bufferish_is_buffer(v));
        return buffer_to_string(ctx, v);
    case DEVS_HANDLE_TYPE_ROLE:
        return devs_string_sprintf(ctx, "[Role: %s]", devs_role_name(ctx, devs_handle_value(v)));
    case DEVS_HANDLE_TYPE_ROLE_MEMBER: {
        unsigned roleidx;
        const devs_service_spec_t *spec = devs_value_to_service_spec(ctx, v);
        if (spec)
            return devs_string_sprintf(ctx, "[ServiceSpec: %s]",
                                       devs_img_get_utf8(ctx->img, spec->name_idx, NULL));
        const devs_packet_spec_t *pkt = devs_decode_role_packet(ctx, v, &roleidx);
        if (roleidx == DEVS_ROLE_INVALID) {
            spec = devs_img_get_service_spec(ctx->img, devs_packet_spec_parent(ctx, pkt));
            return devs_string_sprintf(ctx, "[PacketSpec: %s.%s]",
                                       devs_img_get_utf8(ctx->img, spec->name_idx, NULL),
                                       devs_img_get_utf8(ctx->img, pkt->name_idx, NULL));
        } else
            return devs_string_sprintf(ctx, "[Role: %s.%s]", devs_role_name(ctx, roleidx),
                                       devs_img_get_utf8(ctx->img, pkt->name_idx, NULL));
    }
    default:
        JD_PANIC();
    }
}

static value_t devs_value_to_string_and_pin(devs_ctx_t *ctx, value_t a) {
    if (!devs_is_string(ctx, a)) {
        value_t tmp = devs_value_to_string(ctx, a);
        devs_value_pin(ctx, tmp);
        devs_value_unpin(ctx, a);
        return tmp;
    } else {
        return a;
    }
}

void devs_map_set_string_field(devs_ctx_t *ctx, devs_map_t *m, unsigned builtin_str, value_t msg) {
    devs_value_pin(ctx, msg);
    msg = devs_value_to_string_and_pin(ctx, msg);
    devs_map_set(ctx, m, devs_builtin_string(builtin_str), msg);
    devs_value_unpin(ctx, msg);
}

value_t devs_string_concat(devs_ctx_t *ctx, value_t a, value_t b) {
    bool dup = (a.u64 == b.u64);

    devs_value_pin(ctx, a);
    if (!dup)
        devs_value_pin(ctx, b);

    a = devs_value_to_string_and_pin(ctx, a);

    if (dup)
        b = a;
    else
        b = devs_value_to_string_and_pin(ctx, b);

    const char *ap, *bp;
    unsigned asz, bsz, alen, blen;
    ap = devs_string_get_utf8(ctx, a, &asz);
    bp = devs_string_get_utf8(ctx, b, &bsz);
    alen = devs_string_length(ctx, a);
    blen = devs_string_length(ctx, b);

    value_t r;

    if (ap == NULL || bp == NULL) {
        // strange...
        devs_invalid_program(ctx, 60126);
        r = devs_undefined;
    } else if (asz == 0) {
        r = b;
    } else if (bsz == 0) {
        r = a;
    } else {
        unsigned sz = asz + bsz;
        unsigned len = alen + blen;
        char *p = devs_string_prep(ctx, &r, sz, len);
        if (p) {
            memcpy(p, ap, asz);
            memcpy(p + asz, bp, bsz);
            devs_string_finish(ctx, &r, sz, len);
        }
    }

    devs_value_unpin(ctx, a);
    if (!dup)
        devs_value_unpin(ctx, b);

    return r;
}

static int sanitize_idx(int sz, int start) {
    if (start < 0) {
        start += sz;
        if (start < 0)
            start = 0;
    }
    if (start > sz)
        start = sz;
    return start;
}

value_t devs_string_slice(devs_ctx_t *ctx, value_t str, int start, int endp) {
    unsigned sz;
    const char *data = devs_string_get_utf8(ctx, str, &sz);
    if (!data)
        return devs_undefined;

    int slen = devs_string_length(ctx, str);
    start = sanitize_idx(slen, start);
    endp = sanitize_idx(slen, endp);

    int len = endp - start;
    if (len <= 0)
        return devs_builtin_string(DEVS_BUILTIN_STRING__EMPTY);

    if (start == 0 && len == slen)
        return str;

    start = devs_string_index(ctx, str, start);
    endp = devs_string_index(ctx, str, endp);
    if (start < 0)
        start = sz; // shouldn't happen
    if (endp < 0)
        endp = sz;

    devs_any_string_t *r = devs_string_try_alloc_init(ctx, data + start, endp - start);
    return devs_value_from_gc_obj(ctx, r);
}
