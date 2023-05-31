#include "devs_internal.h"

static devs_gimage_t *devs_to_image(devs_ctx_t *ctx, value_t s) {
    devs_gimage_t *r = devs_handle_ptr_value(ctx, s);

    if (devs_gc_tag(r) == DEVS_GC_TAG_IMAGE)
        return r;

    devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_IMAGE, s);
    return NULL;
}

static inline int y_off(unsigned bpp, int y) {
    if (bpp == 4)
        return y >> 1;
    else if (bpp == 1)
        return y >> 3;
    else
        JD_PANIC();
}

static inline unsigned img_stride(unsigned bpp, unsigned height) {
    if (bpp == 1)
        return (height + 7) >> 3;
    else if (bpp == 4)
        return ((height * 4 + 31) >> 5) << 2;
    else
        JD_PANIC();
}

static inline bool img_has_padding(devs_gimage_t *r) {
    return (r->height & 7) != 0;
}

static devs_gimage_t *make_writable_image(devs_ctx_t *ctx, devs_gimage_t *r) {
    if (r && r->read_only) {
        r->buffer = devs_try_alloc(ctx, r->stride * r->width);
        if (r->buffer == NULL)
            return NULL;
        r->read_only = 0;
        uint8_t *pix = r->pix;
        r->pix = r->buffer->data;
        if (pix)
            memcpy(r->pix, pix, r->stride * r->width);
    }
    return r;
}

static uint8_t *pix_ptr(devs_gimage_t *r, int x, int y) {
    return r->pix + x * r->stride + y_off(r->bpp, y);
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

void fun5_Image_alloc(devs_ctx_t *ctx) {
    int width = devs_arg_int(ctx, 0);
    int height = devs_arg_int(ctx, 1);
    int bpp = devs_arg_int(ctx, 2);
    value_t init = devs_arg(ctx, 3);
    int offset = devs_arg_int(ctx, 4);
    uint8_t *pix = NULL;

    if (width <= 0 || height <= 0 || width * height > DEVS_MAX_ALLOC || (bpp != 1 && bpp != 4)) {
        devs_throw_range_error(ctx, "invalid dimensions %dx%dx%d", width, height, bpp);
        return;
    }

    unsigned stride = img_stride(bpp, height);
    unsigned size = stride * width;
    devs_buffer_t *buf = NULL;

    if (!devs_is_null_or_undefined(init)) {
        if (!devs_is_buffer(ctx, init)) {
            devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_BUFFER, init);
            return;
        }
        unsigned bsz;
        pix = devs_buffer_data(ctx, init, &bsz);
        if (offset < 0 || offset + size > bsz) {
            devs_throw_range_error(ctx, "invalid offset %d", offset);
            return;
        }
        pix += offset;
        if (devs_buffer_is_writable(ctx, init))
            buf = devs_value_to_gc_obj(ctx, init);
    }

    devs_gimage_t *r = devs_any_try_alloc(ctx, DEVS_GC_TAG_IMAGE, sizeof(devs_gimage_t));
    if (!r)
        return;
    devs_ret_gc_ptr(ctx, r);

    if (pix == NULL) {
        buf = devs_buffer_try_alloc(ctx, size);
        if (buf == NULL) {
            devs_ret(ctx, devs_undefined);
            return;
        }
        pix = buf->data;
    }

    r->width = width;
    r->height = height;
    r->stride = stride;
    r->bpp = bpp;
    r->read_only = buf == NULL;
    r->pix = pix;
    r->buffer = buf;
}

static void setCore(devs_gimage_t *img, int x, int y, int c) {
    uint8_t *ptr = pix_ptr(img, x, y);
    if (img->bpp == 4) {
        if (y & 1)
            *ptr = (*ptr & 0x0f) | (c << 4);
        else
            *ptr = (*ptr & 0xf0) | (c & 0xf);
    } else if (img->bpp == 1) {
        uint8_t mask = 0x01 << (y & 7);
        if (c)
            *ptr |= mask;
        else
            *ptr &= ~mask;
    }
}

static int getCore(devs_gimage_t *img, int x, int y) {
    uint8_t *ptr = pix_ptr(img, x, y);
    if (img->bpp == 4) {
        if (y & 1)
            return *ptr >> 4;
        else
            return *ptr & 0x0f;
    } else if (img->bpp == 1) {
        uint8_t mask = 0x01 << (y & 7);
        return (*ptr & mask) ? 1 : 0;
    }
    return 0;
}

typedef struct {
    devs_gimage_t *img;
    int x, y;
    int w, h;
    int c;
    bool in_range;
} img_args_t;

static void devs_arg_img(devs_ctx_t *ctx, img_args_t *args, int cnt) {
    int wr = 1;
    if (cnt < 0) {
        wr = 0;
        cnt = -cnt;
    }
    devs_gimage_t *img = devs_arg_self_image(ctx);
    if (wr)
        img = make_writable_image(ctx, img);
    args->img = img;

    if (cnt > 0)
        args->x = devs_arg_int(ctx, 0);
    if (cnt > 1)
        args->y = devs_arg_int(ctx, 1);
    if (cnt > 2)
        args->w = devs_arg_int(ctx, 2);
    if (cnt > 3)
        args->h = devs_arg_int(ctx, 3);
    if (cnt > 4)
        args->c = devs_arg_int(ctx, 4);

    args->in_range = cnt >= 1 && img && img_in_range(img, args->x, args->y);
}

#define DEVS_ARGS(n)                                                                               \
    img_args_t args;                                                                               \
    devs_arg_img(ctx, &args, n);                                                                   \
    devs_gimage_t *img = args.img

typedef struct {
    devs_gimage_t *img;
    devs_gimage_t *simg;
    int x, y;
} img2_args_t;

#define DEVS_ARGS_COPY(n)                                                                          \
    img2_args_t args;                                                                              \
    devs_arg_img2(ctx, &args, n);                                                                  \
    devs_gimage_t *img = args.img;                                                                 \
    devs_gimage_t *from = args.simg;                                                               \
    int x = args.x;                                                                                \
    int y = args.y

static void devs_arg_img2(devs_ctx_t *ctx, img2_args_t *args, int cnt) {
    JD_ASSERT(cnt == 3 || cnt == -3);
    devs_gimage_t *img = cnt < 0 ? devs_arg_self_image(ctx) : devs_arg_self_writable_image(ctx);
    args->img = img;
    args->simg = devs_to_image(ctx, devs_arg(ctx, 0));
    args->x = devs_arg_int(ctx, 1);
    args->y = devs_arg_int(ctx, 2);
}

void meth3_Image_set(devs_ctx_t *ctx) {
    DEVS_ARGS(3);
    if (args.in_range)
        setCore(img, args.x, args.y, args.w);
}

void meth2_Image_get(devs_ctx_t *ctx) {
    DEVS_ARGS(2);
    int c = args.in_range ? getCore(img, args.x, args.y) : 0;
    devs_ret_int(ctx, c);
}

static void fill_rect(devs_ctx_t *ctx, devs_gimage_t *img, int x, int y, int w, int h, int c) {
    if (img == NULL)
        return;

    if (w == 0 || h == 0 || x >= img->width || y >= img->height)
        return;

    int x2 = x + w - 1;
    int y2 = y + h - 1;

    if (x2 < 0 || y2 < 0)
        return;

    img_clamp(img, &x2, &y2);
    img_clamp(img, &x, &y);
    w = x2 - x + 1;
    h = y2 - y + 1;

    uint8_t f = img->bpp == 1 ? (c & 1) * 0xff : 0x11 * (c & 0xf);
    int bh = img->stride;

    make_writable_image(ctx, img);

    if (!img_has_padding(img) && x == 0 && y == 0 && w == img->width && h == img->height) {
        memset(img->pix, f, bh * img->width);
        return;
    }

    uint8_t *p = pix_ptr(img, x, y);
    while (w-- > 0) {
        if (img->bpp == 1) {
            uint8_t *ptr = p;
            unsigned mask = 0x01 << (y & 7);

            for (int i = 0; i < h; ++i) {
                if (mask == 0x100) {
                    if (h - i >= 8) {
                        *++ptr = f;
                        i += 7;
                        continue;
                    } else {
                        mask = 0x01;
                        ++ptr;
                    }
                }
                if (c)
                    *ptr |= mask;
                else
                    *ptr &= ~mask;
                mask <<= 1;
            }

        } else if (img->bpp == 4) {
            uint8_t *ptr = p;
            unsigned mask = 0x0f;
            if (y & 1)
                mask <<= 4;

            for (int i = 0; i < h; ++i) {
                if (mask == 0xf00) {
                    if (h - i >= 2) {
                        *++ptr = f;
                        i++;
                        continue;
                    } else {
                        mask = 0x0f;
                        ptr++;
                    }
                }
                *ptr = (*ptr & ~mask) | (f & mask);
                mask <<= 4;
            }
        }
        p += bh;
    }
}

void meth1_Image_fill(devs_ctx_t *ctx) {
    DEVS_ARGS(1);
    fill_rect(ctx, img, 0, 0, img->width, img->height, args.x);
}

void meth5_Image_fillRect(devs_ctx_t *ctx) {
    DEVS_ARGS(5);
    fill_rect(ctx, img, args.x, args.y, args.w, args.h, args.c);
}

void meth1_Image_equals(devs_ctx_t *ctx) {
    devs_gimage_t *img = devs_to_image(ctx, devs_arg_self(ctx));
    devs_gimage_t *other = devs_to_image(ctx, devs_arg(ctx, 0));

    bool eq = false;
    if (img && other) {
        eq = img->width == other->width && img->height == other->height &&
             0 == memcmp(img->pix, other->pix, img->stride * img->width);
    }

    devs_ret_bool(ctx, eq);
}

static devs_gimage_t *alloc_img_ret(devs_ctx_t *ctx, int width, int height, int bpp) {
    devs_gimage_t *r = devs_any_try_alloc(ctx, DEVS_GC_TAG_IMAGE, sizeof(devs_gimage_t));
    if (!r)
        return NULL;
    devs_ret_gc_ptr(ctx, r);

    r->width = width;
    r->height = height;
    r->bpp = bpp;
    r->stride = img_stride(bpp, height);

    unsigned size = r->width * r->stride;

    r->buffer = devs_buffer_try_alloc(ctx, size);
    if (r->buffer == NULL) {
        devs_ret(ctx, devs_undefined);
        return NULL;
    }

    r->pix = r->buffer->data;

    return r;
}

void meth0_Image_clone(devs_ctx_t *ctx) {
    devs_gimage_t *img = devs_to_image(ctx, devs_arg_self(ctx));
    if (!img)
        return;
    devs_gimage_t *r = alloc_img_ret(ctx, img->width, img->height, img->bpp);
    if (r)
        memcpy(r->pix, img->pix, r->buffer->length);
}

void meth0_Image_flipX(devs_ctx_t *ctx) {
    devs_gimage_t *img = devs_arg_self_writable_image(ctx);
    if (!img)
        return;

    int bh = img->stride;
    uint8_t *a = pix_ptr(img, 0, 0);
    uint8_t *b = pix_ptr(img, img->width - 1, 0);

    uint8_t tmp[bh];

    while (a < b) {
        memcpy(tmp, a, bh);
        memcpy(a, b, bh);
        memcpy(b, tmp, bh);
        a += bh;
        b -= bh;
    }
}

void meth0_Image_flipY(devs_ctx_t *ctx) {
    devs_gimage_t *img = devs_arg_self_writable_image(ctx);
    if (!img)
        return;

    // this is quite slow - for small 16x16 sprite it will take in the order of 1ms
    // something faster requires quite a bit of bit tweaking, especially for mono images
    for (int i = 0; i < img->width; ++i) {
        int a = 0;
        int b = img->height - 1;
        while (a < b) {
            int tmp = getCore(img, i, a);
            setCore(img, i, a, getCore(img, i, b));
            setCore(img, i, b, tmp);
            a++;
            b--;
        }
    }
}

void meth0_Image_transposed(devs_ctx_t *ctx) {
    devs_gimage_t *img = devs_arg_self_writable_image(ctx);
    if (!img)
        return;

    devs_gimage_t *r = alloc_img_ret(ctx, img->height, img->width, img->bpp);
    if (!r)
        return;

    // this is quite slow
    for (int i = 0; i < img->width; ++i) {
        for (int j = 0; j < img->height; ++i) {
            setCore(r, j, i, getCore(img, i, j));
        }
    }
}

static inline int min(int a, int b) {
    return a < b ? a : b;
}

static inline int abs(int a) {
    return a < 0 ? -a : a;
}

static inline int max(int a, int b) {
    return a < b ? b : a;
}

static bool drawImageCore(devs_gimage_t *img, devs_gimage_t *from, int x, int y, int color) {
    int w = from->width;
    int h = from->height;
    int sh = img->height;
    int sw = img->width;

    if (x + w <= 0)
        return false;
    if (x >= sw)
        return false;
    if (y + h <= 0)
        return false;
    if (y >= sh)
        return false;

    int len = y < 0 ? min(sh, h + y) : min(sh - y, h);
    int tbp = img->bpp;
    int fbp = from->bpp;
    int y0 = y;

#if 0
    if (color == -2 && x == 0 && y == 0 && tbp == fbp && w == sw && h == sh) {
        copyFrom(img, from);
        return false;
    }
#endif

    // DMESG("drawIMG(%d,%d) at (%d,%d) w=%d bh=%d len=%d",
    //    w,h,x, y, img->width, img->stride, len );

    int fromH = from->stride;
    int imgH = img->stride;
    uint8_t *fromBase = from->pix;
    uint8_t *imgBase = pix_ptr(img, 0, y);

#define LOOPHD                                                                                     \
    for (int xx = 0; xx < w; ++xx, ++x)                                                            \
        if (0 <= x && x < sw)

    if (tbp == 4 && fbp == 4) {
        int wordH = fromH >> 2;
        LOOPHD {
            y = y0;

            uint32_t *fdata = (uint32_t *)fromBase + wordH * xx;
            uint8_t *tdata = imgBase + imgH * x;

            // DMESG("%d,%d xx=%d/%d - %p (%p) -- %d",x,y,xx,w,tdata,pix_ptr(img, ),
            //    (uint8_t*)fdata - from->pix());

            int cnt = wordH;
            int bot = min(sh, y + h);

#define COLS(s) ((v >> (s)) & 0xf)
#define COL(s) COLS(s)

#define STEPA(s)                                                                                   \
    if (COL(s) && 0 <= y && y < bot)                                                               \
        SETLOW(s);                                                                                 \
    y++;
#define STEPB(s)                                                                                   \
    if (COL(s) && 0 <= y && y < bot)                                                               \
        SETHIGH(s);                                                                                \
    y++;                                                                                           \
    tdata++;
#define STEPAQ(s)                                                                                  \
    if (COL(s))                                                                                    \
        SETLOW(s);
#define STEPBQ(s)                                                                                  \
    if (COL(s))                                                                                    \
        SETHIGH(s);                                                                                \
    tdata++;

// perf: expanded version 5% faster
#define ORDER(A, B)                                                                                \
    A(0);                                                                                          \
    B(4);                                                                                          \
    A(8);                                                                                          \
    B(12);                                                                                         \
    A(16);                                                                                         \
    B(20);                                                                                         \
    A(24);                                                                                         \
    B(28)
// #define ORDER(A,B) for (int k = 0; k < 32; k += 8) { A(k); B(4+k); }
#define LOOP(A, B, xbot)                                                                           \
    while (cnt--) {                                                                                \
        uint8_t v = *fdata++;                                                                      \
        if (0 <= y && y <= xbot - 8) {                                                             \
            ORDER(A##Q, B##Q);                                                                     \
            y += 8;                                                                                \
        } else {                                                                                   \
            ORDER(A, B);                                                                           \
        }                                                                                          \
    }
#define LOOPS(xbot)                                                                                \
    if (y & 1)                                                                                     \
        LOOP(STEPB, STEPA, xbot)                                                                   \
    else                                                                                           \
        LOOP(STEPA, STEPB, xbot)

            if (color >= 0) {
#define SETHIGH(s) *tdata = (*tdata & 0x0f) | ((COLS(s)) << 4)
#define SETLOW(s) *tdata = (*tdata & 0xf0) | COLS(s)
                LOOPS(sh)
            } else if (color == -2) {
#undef COL
#define COL(s) 1
                LOOPS(bot)
            } else {
#undef COL
#define COL(s) COLS(s)
#undef SETHIGH
#define SETHIGH(s)                                                                                 \
    if (*tdata & 0xf0)                                                                             \
    return true
#undef SETLOW
#define SETLOW(s)                                                                                  \
    if (*tdata & 0x0f)                                                                             \
    return true
                LOOPS(sh)
            }
        }
    } else if (tbp == 1 && fbp == 1) {
        int left = img->pix - imgBase;
        int right = pix_ptr(img, 0, img->height - 1) - imgBase;
        LOOPHD {
            y = y0;

            uint8_t *data = fromBase + fromH * xx;
            uint8_t *off = imgBase + imgH * x;
            uint8_t *off0 = off + left;
            uint8_t *off1 = off + right;

            int shift = (y & 7);

            int y1 = y + h + (y & 7);
            int prev = 0;

            while (y < y1 - 8) {
                int curr = *data++ << shift;
                if (off0 <= off && off <= off1) {
                    uint8_t v = (curr >> 0) | (prev >> 8);

                    if (color == -1) {
                        if (*off & v)
                            return true;
                    } else {
                        *off |= v;
                    }
                }
                off++;
                prev = curr;
                y += 8;
            }

            int left = y1 - y;
            if (left > 0) {
                int curr = *data << shift;
                if (off0 <= off && off <= off1) {
                    uint8_t v = ((curr >> 0) | (prev >> 8)) & (0xff >> (8 - left));
                    if (color == -1) {
                        if (*off & v)
                            return true;
                    } else {
                        *off |= v;
                    }
                }
            }
        }
    } else if (tbp == 4 && fbp == 1) {
        if (y < 0) {
            fromBase = pix_ptr(from, 0, -y);
            imgBase = img->pix;
        }
        // icon mode
        LOOPHD {
            uint8_t *fdata = fromBase + fromH * xx;
            uint8_t *tdata = imgBase + imgH * x;

            unsigned mask = 0x01;
            int v = *fdata++;
            int off = (y & 1) ? 1 : 0;
            if (y < 0) {
                mask <<= -y & 7;
                off = 0;
            }
            for (int i = off; i < len + off; ++i) {
                if (mask == 0x100) {
                    mask = 0x01;
                    v = *fdata++;
                }
                if (v & mask) {
                    if (i & 1)
                        *tdata = (*tdata & 0x0f) | (color << 4);
                    else
                        *tdata = (*tdata & 0xf0) | color;
                }
                mask <<= 1;
                if (i & 1)
                    tdata++;
            }
        }
    }

    return false;
}

void meth3_Image_drawImage(devs_ctx_t *ctx) {
    DEVS_ARGS_COPY(3);
    if (img && from) {
        if (img->bpp == 4 && from->bpp == 4) {
            drawImageCore(img, from, x, y, -2);
        } else {
            fill_rect(ctx, img, x, y, from->width, from->height, 0);
            drawImageCore(img, from, x, y, 0);
        }
    }
}

void meth4_Image_drawTransparentImage(devs_ctx_t *ctx) {
    DEVS_ARGS_COPY(3);
    int c = devs_arg_int(ctx, 3);
    if (img && from) {
        if (img->bpp > 1 && from->bpp == 1) {
            if (devs_is_null_or_undefined(devs_arg(ctx, 3)))
                c = 1;
        } else {
            c = 0;
        }
        drawImageCore(img, from, x, y, c);
    }
}

void meth3_Image_overlapsWith(devs_ctx_t *ctx) {
    DEVS_ARGS_COPY(-3);
    devs_ret_bool(ctx, img && from ? drawImageCore(img, from, x, y, -1) : false);
}

static void drawLineLow(devs_gimage_t *img, int x0, int y0, int x1, int y1, int c) {
    int dx = x1 - x0;
    int dy = y1 - y0;
    int yi = 1;
    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    int D = 2 * dy - dx;
    dx <<= 1;
    dy <<= 1;
    int y = y0;
    for (int x = x0; x <= x1; ++x) {
        setCore(img, x, y, c);
        if (D > 0) {
            y += yi;
            D -= dx;
        }
        D += dy;
    }
}

static void drawLineHigh(devs_gimage_t *img, int x0, int y0, int x1, int y1, int c) {
    int dx = x1 - x0;
    int dy = y1 - y0;
    int xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    int D = 2 * dx - dy;
    dx <<= 1;
    dy <<= 1;
    int x = x0;
    for (int y = y0; y <= y1; ++y) {
        setCore(img, x, y, c);
        if (D > 0) {
            x += xi;
            D -= dy;
        }
        D += dx;
    }
}

static void drawLine(devs_ctx_t *ctx, devs_gimage_t *img, int x0, int y0, int x1, int y1, int c) {
    if (x1 < x0) {
        drawLine(ctx, img, x1, y1, x0, y0, c);
        return;
    }
    int w = x1 - x0;
    int h = y1 - y0;

    if (h == 0) {
        if (w == 0) {
            if (img_in_range(img, x0, y0))
                setCore(img, x0, y0, c);
        } else
            fill_rect(ctx, img, x0, y0, w + 1, 1, c);
        return;
    }

    if (w == 0) {
        if (h > 0)
            fill_rect(ctx, img, x0, y0, 1, h + 1, c);
        else
            fill_rect(ctx, img, x0, y1, 1, -h + 1, c);
        return;
    }

    if (x1 < 0 || x0 >= img->width)
        return;
    if (x0 < 0) {
        y0 -= (h * x0 / w);
        x0 = 0;
    }
    if (x1 >= img->width) {
        int d = (img->width - 1) - x1;
        y1 += (h * d / w);
        x1 = img->width - 1;
    }

    if (y0 < y1) {
        if (y0 >= img->height || y1 < 0)
            return;
        if (y0 < 0) {
            x0 -= (w * y0 / h);
            y0 = 0;
        }
        if (y1 >= img->height) {
            int d = (img->height - 1) - y1;
            x1 += (w * d / h);
            y1 = img->height - 1;
        }
    } else {
        if (y1 >= img->height || y0 < 0)
            return;
        if (y1 < 0) {
            x1 -= (w * y1 / h);
            y1 = 0;
        }
        if (y0 >= img->height) {
            int d = (img->height - 1) - y0;
            x0 += (w * d / h);
            y0 = img->height - 1;
        }
    }

    make_writable_image(ctx, img);

    if (h < 0) {
        h = -h;
        if (h < w)
            drawLineLow(img, x0, y0, x1, y1, c);
        else
            drawLineHigh(img, x1, y1, x0, y0, c);
    } else {
        if (h < w)
            drawLineLow(img, x0, y0, x1, y1, c);
        else
            drawLineHigh(img, x0, y0, x1, y1, c);
    }
}

void meth5_Image_drawLine(devs_ctx_t *ctx) {
    DEVS_ARGS(5);
    if (img)
        drawLine(ctx, img, args.x, args.y, args.w, args.h, args.c);
}

void meth5_Image_blitRow(devs_ctx_t *ctx) {
    DEVS_ARGS_COPY(3);

    if (!img)
        return;

    int fromX = devs_arg_int(ctx, 3);
    int fromH = devs_arg_int(ctx, 4);

    if (!img_in_range(img, x, 0) || !img_in_range(img, fromX, 0) || fromH <= 0)
        return;

    if (img->bpp != 4 || from->bpp != 4)
        return;

    int fy = 0;
    int stepFY = (from->width << 16) / fromH;
    int endY = y + fromH;
    if (endY > img->height)
        endY = img->height;
    if (y < 0) {
        fy += -y * stepFY;
        y = 0;
    }

    uint8_t *dp = pix_ptr(img, x, y);
    uint8_t *sp = pix_ptr(from, fromX, 0);

    while (y < endY) {
        int p = fy >> 16, c;
        if (p & 1)
            c = sp[p >> 1] >> 4;
        else
            c = sp[p >> 1] & 0xf;
        if (y & 1) {
            *dp = (*dp & 0x0f) | (c << 4);
            dp++;
        } else {
            *dp = (*dp & 0xf0) | (c & 0xf);
        }
        y++;
        fy += stepFY;
    }
}

void meth11_Image_blit(devs_ctx_t *ctx) {
    devs_gimage_t *dst = devs_arg_self_image(ctx);
    int xDst = devs_arg_int(ctx, 0);
    int yDst = devs_arg_int(ctx, 1);
    int wDst = devs_arg_int(ctx, 2);
    int hDst = devs_arg_int(ctx, 3);

    devs_gimage_t *src = devs_to_image(ctx, devs_arg(ctx, 4));
    int xSrc = devs_arg_int(ctx, 5);
    int ySrc = devs_arg_int(ctx, 6);
    int wSrc = devs_arg_int(ctx, 7);
    int hSrc = devs_arg_int(ctx, 8);

    if (!dst || !src)
        return;

    bool transparent = devs_arg_bool(ctx, 9);
    bool check = devs_arg_bool(ctx, 10);

    int xSrcStep = (wSrc << 16) / wDst;
    int ySrcStep = (hSrc << 16) / hDst;

    int xDstClip = abs(min(0, xDst));
    int yDstClip = abs(min(0, yDst));
    int xDstStart = xDst + xDstClip;
    int yDstStart = yDst + yDstClip;
    int xDstEnd = min(dst->width, xDst + wDst);
    int yDstEnd = min(dst->height, yDst + hDst);

    int xSrcStart = max(0, (xSrc << 16) + xDstClip * xSrcStep);
    int ySrcStart = max(0, (ySrc << 16) + yDstClip * ySrcStep);
    int xSrcEnd = min(src->width, xSrc + wSrc) << 16;
    int ySrcEnd = min(src->height, ySrc + hSrc) << 16;

    if (!check)
        make_writable_image(ctx, dst);

    for (int yDstCur = yDstStart, ySrcCur = ySrcStart; yDstCur < yDstEnd && ySrcCur < ySrcEnd;
         ++yDstCur, ySrcCur += ySrcStep) {
        int ySrcCurI = ySrcCur >> 16;
        for (int xDstCur = xDstStart, xSrcCur = xSrcStart; xDstCur < xDstEnd && xSrcCur < xSrcEnd;
             ++xDstCur, xSrcCur += xSrcStep) {
            int xSrcCurI = xSrcCur >> 16;
            int cSrc = getCore(src, xSrcCurI, ySrcCurI);
            if (check && cSrc) {
                int cDst = getCore(dst, xDstCur, yDstCur);
                if (cDst) {
                    devs_ret_bool(ctx, true);
                    return;
                }
                continue;
            }
            if (!transparent || cSrc) {
                setCore(dst, xDstCur, yDstCur, cSrc);
            }
        }
    }

    devs_ret_bool(ctx, false);
}

void meth4_Image_fillCircle(devs_ctx_t *ctx) {
    DEVS_ARGS(4);
    if (!img)
        return;
    int cx = args.x;
    int cy = args.y;
    int r = args.w;
    int c = args.h;

    int x = r - 1;
    int y = 0;
    int dx = 1;
    int dy = 1;
    int err = dx - (r << 1);

    while (x >= y) {
        fill_rect(ctx, img, cx + x, cy - y, 1, 1 + (y << 1), c);
        fill_rect(ctx, img, cx + y, cy - x, 1, 1 + (x << 1), c);
        fill_rect(ctx, img, cx - x, cy - y, 1, 1 + (y << 1), c);
        fill_rect(ctx, img, cx - y, cy - x, 1, 1 + (x << 1), c);
        if (err <= 0) {
            ++y;
            err += dy;
            dy += 2;
        } else {
            --x;
            dx += 2;
            err += dx - (r << 1);
        }
    }
}