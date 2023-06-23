#include "devs_internal.h"

value_t prop_Array_length(devs_ctx_t *ctx, value_t self) {
    if (!devs_is_array(ctx, self))
        return devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ARRAY, self);
    devs_array_t *arr = devs_handle_ptr_value(ctx, self);
    return devs_value_from_int(arr->length);
}

static devs_array_t *devs_arg_self_array(devs_ctx_t *ctx) {
    value_t s = devs_arg_self(ctx);
    if (devs_is_array(ctx, s))
        return (devs_array_t *)devs_handle_ptr_value(ctx, s);
    devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ARRAY, s);
    return NULL;
}

void meth2_Array_insert(devs_ctx_t *ctx) {
    devs_array_t *self = devs_arg_self_array(ctx);
    if (self) {
        uint32_t idx = devs_arg_int(ctx, 0);
        int32_t count = devs_arg_int(ctx, 1);
        devs_array_insert(ctx, self, idx, count);
    }
}

void fun1_Array_isArray(devs_ctx_t *ctx) {
    devs_ret_bool(ctx, devs_is_array(ctx, devs_arg(ctx, 0)));
}

void meth1_Array___ctor__(devs_ctx_t *ctx) {
    // this is somewhat inefficient - the runtime allocates a map
    value_t ignored = devs_arg_self(ctx);
    (void)ignored;
    uint32_t sz = devs_arg_int(ctx, 0);
    devs_ret_gc_ptr(ctx, devs_array_try_alloc(ctx, sz));
}

void methX_Array_push(devs_ctx_t *ctx) {
    devs_array_t *self = devs_arg_self_array(ctx);
    if (!self)
        return;
    for (int i = 0; i < ctx->stack_top_for_gc - 1; ++i) {
        devs_array_set(ctx, self, self->length, devs_arg(ctx, i));
    }
    devs_ret_int(ctx, self->length);
}

void meth1_Array_pushRange(devs_ctx_t *ctx) {
    devs_array_t *self = devs_arg_self_array(ctx);
    if (!self)
        return;
    value_t other = devs_arg(ctx, 0);
    if (!devs_is_array(ctx, other)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ARRAY, other);
        return;
    }

    devs_array_t *src = devs_value_to_gc_obj(ctx, other);
    if (src->length) {
        // note that self and src can alias
        unsigned len_src = src->length;
        unsigned len0 = self->length;
        if (devs_array_insert(ctx, self, self->length, len_src) == 0) {
            memcpy(self->data + len0, src->data, len_src * sizeof(value_t));
        }
    }

    devs_ret_int(ctx, self->length);
}

void methX_Array_slice(devs_ctx_t *ctx) {
    devs_array_t *self = devs_arg_self_array(ctx);
    unsigned numargs = ctx->stack_top_for_gc - 1;
    int32_t len = self->length;
    int32_t start = numargs > 0 ? devs_arg_int(ctx, 0) : 0;
    if (start < 0)
        start = len + start;
    if (start < 0)
        start = 0;

    int32_t end = numargs > 1 ? devs_arg_int_defl(ctx, 1, len) : len;

    if (end < 0)
        end = len + end;
    if (end > len)
        end = len;

    if (start > end)
        start = end;

    devs_array_t *res = devs_array_try_alloc(ctx, end - start);
    if (res)
        memcpy(res->data, self->data + start, (end - start) * sizeof(value_t));

    devs_ret_gc_ptr(ctx, res);
}

void meth1_Array_join(devs_ctx_t *ctx) {
    devs_array_t *self = devs_arg_self_array(ctx);
    if (!self)
        return;

    value_t sep = devs_arg(ctx, 0);
    unsigned sepsz;
    unsigned seplen;
    const char *sepch;
    if (devs_is_undefined(sep)) {
        seplen = sepsz = 1;
        sepch = ",";
    } else {
        sep = devs_value_to_string(ctx, sep);
        sepch = devs_string_get_utf8(ctx, sep, &sepsz);
        if (sepch == NULL)
            return;
        seplen = devs_string_length(ctx, sep);
        devs_value_pin(ctx, sep);
    }

    unsigned sz = 0, len = 0;

    for (unsigned i = 0; i < self->length; ++i) {
        value_t v = devs_value_to_string(ctx, self->data[i]);
        if (i > 0) {
            len += seplen;
            sz += sepsz;
        }

        unsigned tsz;
        if (devs_string_get_utf8(ctx, v, &tsz) == NULL)
            goto error;
        sz += tsz;
        len += devs_string_length(ctx, v);
    }

    value_t r;
    char *d = devs_string_prep(ctx, &r, sz, len);
    if (!d)
        goto error;

    unsigned off = 0;
    for (unsigned i = 0; i < self->length; ++i) {
        value_t v = devs_value_to_string(ctx, self->data[i]);
        if (i > 0) {
            memcpy(d + off, sepch, sepsz);
            off += sepsz;
        }

        unsigned tsz;
        const char *ss = devs_string_get_utf8(ctx, v, &tsz);
        if (ss == NULL)
            goto error;

        memcpy(d + off, ss, tsz);
        off += tsz;
    }

    devs_string_finish(ctx, &r, off, len);
    devs_ret(ctx, r);

error:
    devs_value_unpin(ctx, sep);
}
