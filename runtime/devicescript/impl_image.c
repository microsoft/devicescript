#include "devs_internal.h"

static devs_gimage_t *devs_to_image(devs_ctx_t *ctx, value_t s) {
    devs_gimage_t *r = devs_handle_ptr_value(ctx, s);

    if (devs_gc_tag(r) == DEVS_GC_TAG_IMAGE)
        return r;

    devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_IMAGE, s);
    return NULL;
}

static inline unsigned x_off(unsigned bpp, unsigned x) {
    if (bpp == 4)
        return x >> 1;
    else if (bpp == 1)
        return x >> 3;
    else
        JD_PANIC();
}

static devs_gimage_t *make_writable_image(devs_ctx_t *ctx, devs_gimage_t *r) {
    if (r && r->read_only) {
        unsigned stride = x_off(r->bpp, r->width - 1) + 1;
        r->buffer = devs_try_alloc(ctx, stride * r->height);
        if (r->buffer == NULL)
            return NULL;
        r->read_only = 0;
        uint8_t *pix = r->pix;
        unsigned ss = r->stride;
        JD_ASSERT(stride <= ss);
        r->stride = stride;
        r->pix = r->buffer->data;
        if (pix) {
            if (stride == ss) {
                memcpy(r->pix, pix, stride * r->height);
            } else {
                for (unsigned i = 0; i < r->height; ++i)
                    memcpy(r->pix + i * stride, pix + i * ss, stride);
            }
        }
    }
    return r;
}

static uint8_t *pix_ptr(devs_gimage_t *r, unsigned x, unsigned y) {
    return r->pix + y * r->stride + x_off(r->bpp, x);
}

static devs_gimage_t *devs_to_writable_image(devs_ctx_t *ctx, value_t s) {
    return make_writable_image(ctx, devs_to_image(ctx, s));
}

value_t prop_Image_width(devs_ctx_t *ctx, value_t self) {
    devs_gimage_t *r = devs_to_image(ctx, self);
    return devs_value_from_int(r ? r->width : 0);
}

value_t prop_Image_height(devs_ctx_t *ctx, value_t self) {
    devs_gimage_t *r = devs_to_image(ctx, self);
    return devs_value_from_int(r ? r->height : 0);
}

value_t prop_Image_bpp(devs_ctx_t *ctx, value_t self) {
    devs_gimage_t *r = devs_to_image(ctx, self);
    return devs_value_from_int(r ? r->bpp : 0);
}

static devs_gimage_t *devs_arg_self_image(devs_ctx_t *ctx) {
    return devs_to_image(ctx, devs_arg_self(ctx));
}

static devs_gimage_t *devs_arg_self_writable_image(devs_ctx_t *ctx) {
    return devs_to_writable_image(ctx, devs_arg_self(ctx));
}

static void img_clamp(devs_gimage_t *r, int *x, int *y) {
    if (*x < 0)
        *x = 0;
    if (*x >= r->width)
        *x = r->width - 1;
    if (*y < 0)
        *y = 0;
    if (*y >= r->height)
        *x = r->height - 1;
}

static bool img_in_range(devs_gimage_t *r, int x, int y) {
    return (0 <= x && x < r->width) && (0 <= y && y < r->height);
}

// void fun1_Image_alloc(devs_ctx_t *ctx) {}