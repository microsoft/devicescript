#include "devs_internal.h"

static int numvalue(char c) {
    if ('0' <= c && c <= '9')
        return c - '0';
    c |= 0x20;
    if ('a' <= c && c <= 'z')
        return c - 'a' + 10;
    return -1;
}

#define WR(c)                                                                                      \
    do {                                                                                           \
        char tmp = (c);                                                                            \
        if (numskip == 0) {                                                                        \
            if (dp < dstlen)                                                                       \
                dst[dp] = tmp;                                                                     \
            dp++;                                                                                  \
        } else                                                                                     \
            numskip--;                                                                             \
    } while (0)

size_t devs_strformat(devs_ctx_t *ctx, const char *fmt, size_t fmtlen, char *dst, size_t dstlen,
                      value_t *args, size_t numargs, size_t numskip) {
    size_t fp = 0;
    size_t dp = 0;

    if (dstlen)
        dst[0] = 0; // in case numskip prevents us from writing anything

    while (fp <= fmtlen) {
        char c = fp == fmtlen ? (fp++, 0) : fmt[fp++];
        if (c != '{' || fp >= fmtlen) {
            // if we see "}}" we treat it as a single "}"
            if (c == '}' && fp < fmtlen && fmt[fp] == '}')
                fp++;
            goto write_c;
        }

        c = fmt[fp++];
        if (c == '{')
            goto write_c;
        int pos = numvalue(c);
        if (pos < 0) {
            c = '!';
            goto write_c;
        }

        size_t nextp = fp;
        while (nextp < fmtlen && fmt[nextp] != '}')
            nextp++;

        int precision = -1;
        if (fp < nextp)
            precision = numvalue(fmt[fp++]);

        fp = nextp + 1;

        if (pos >= (int)numargs) {
            c = '?';
            goto write_c;
        }

        if (precision < 0)
            precision = 6;

        unsigned sz;
        const char *s;
        value_t v = args[pos];
        if (devs_is_number(v)) {
            char buf[64];
            jd_print_double(buf, devs_value_to_double(ctx, args[pos]), precision + 1);
            s = buf;
            sz = strlen(buf);
        } else {
            value_t tmp = devs_value_to_string(ctx, v);
            // note that tmp is not pinned, it may go away at next allocation, but we only use it
            // down below
            s = devs_string_get_utf8(ctx, tmp, &sz);
        }

        while (sz--)
            WR(*s++);
        continue;

    write_c:
        WR(c);
    }

    if (dstlen)
        dst[dstlen - 1] = 0; // in case we overflow

    return dp;
}
