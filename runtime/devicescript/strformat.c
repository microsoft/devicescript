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
        if (numskip == 0)                                                                          \
            dst[dp++] = tmp;                                                                       \
        else                                                                                       \
            numskip--;                                                                             \
    } while (0)

size_t devs_strformat(const char *fmt, size_t fmtlen, char *dst, size_t dstlen, value_t *args,
                      size_t numargs, size_t numskip) {
    size_t fp = 0;
    size_t dp = 0;
    while (fp < fmtlen && dp < dstlen) {
        char c = fmt[fp++];
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

        char buf[64];
        jd_print_double(buf, devs_value_to_double(args[pos]), precision + 1);

        char *s = buf;
        while (*s && dp < dstlen)
            WR(*s++);
        continue;

    write_c:
        WR(c);
    }

    if (dp < dstlen) {
        dst[dp] = 0;
        return dp;
    } else {
        dst[dstlen - 1] = 0;
        return dstlen;
    }
}

#if 0
static void test_fmt1(const char *fmt) {
    char buf[256];
    value_t args[] = {
        0, 42, -108, 0.000198, 1e30, 1e-10, 2.0f / 3,
        123456789123,
    };
    devs_strformat(fmt, strlen(fmt), buf, sizeof(buf) - 1, args, sizeof(args) / sizeof(args[0]));
    printf("'%s' -> '%s'\n", fmt, buf);
}

void test_fmt(void) {
    test_fmt1("hello world");
    test_fmt1("hello{0}world");
    test_fmt1("{0} {1} {2} {3} {4} {5}");
    test_fmt1("{6} {7} {79} {74}");
    test_fmt1("{Q} {Z} {!}");
    test_fmt1("{{{5}}}");
    test_fmt1("q}x");
    test_fmt1("q}}x");
}
#endif
