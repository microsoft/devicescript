#include "jacs_exec.h"

#include <math.h>

#define NUMBER value_t

static inline void itoa(int v, char *dst) {
    // TODO reimplement
    snprintf(dst, 30, "%d", v);
}

#define p10(v) __builtin_powi(10, v)

static const uint64_t pows[] = {
    1LL,           10LL,           100LL,           1000LL,           10000LL,
    100000LL,      1000000LL,      10000000LL,      100000000LL,      1000000000LL,
    10000000000LL, 100000000000LL, 1000000000000LL, 10000000000000LL, 100000000000000LL,
};

// The basic idea is we convert d to a 64 bit integer with numdigits
// digits, and then print it out, putting dot in the right place.

static void mycvt(NUMBER d, char *buf, int numdigits) {
    if (d < 0) {
        *buf++ = '-';
        d = -d;
    }

    if (!d) {
        *buf++ = '0';
        *buf++ = 0;
        return;
    }

    if (numdigits < 4)
        numdigits = 4;
    int maxdigits = sizeof(NUMBER) == 4 ? 8 : 15;
    if (numdigits > maxdigits)
        numdigits = maxdigits;

    int pw = sizeof(NUMBER) == 4 ? (int)log10f(d) : (int)log10(d);
    int e = 1;

    // if outside 1e-6 -- 1e21 range, we use the e-notation
    if (d < 1e-6 || d > 1e21) {
        // normalize number to 1.XYZ, save e, and reset pw
        if (pw < 0)
            d *= p10(-pw);
        else
            d /= p10(pw);
        e = pw;
        pw = 0;
    }

    int trailingZ = 0;
    int dotAfter = pw + 1; // at which position the dot should be in the number

    uint64_t dd;

    // normalize number to be integer with exactly numdigits digits
    if (pw >= numdigits) {
        // if the number is larger than numdigits, we need trailing zeroes
        trailingZ = pw - numdigits + 1;
        dd = (uint64_t)(d / p10(trailingZ) + 0.5);
    } else {
        dd = (uint64_t)(d * p10(numdigits - pw - 1) + 0.5);
    }

    // if number is less than 1, we need 0.00...00 at the beginning
    if (dotAfter < 1) {
        *buf++ = '0';
        *buf++ = '.';
        int n = -dotAfter;
        while (n--)
            *buf++ = '0';
    }

    // now print out the actual number
    for (int i = numdigits - 1; i >= 0; i--) {
        uint64_t q = pows[i];
        // this may be faster than fp-division and fmod(); or maybe not
        // anyways, it works
        int k = '0';
        while (dd >= q) {
            dd -= q;
            k++;
        }
        *buf++ = k;
        // if we're after dot, and what's left is zeroes, stop
        if (dd == 0 && (numdigits - i) >= dotAfter)
            break;
        // print the dot, if we arrived at it
        if ((numdigits - i) == dotAfter)
            *buf++ = '.';
    }

    // print out remaining trailing zeroes if any
    while (trailingZ-- > 0)
        *buf++ = '0';

    // if we used e-notation, handle that
    if (e != 1) {
        *buf++ = 'e';
        if (e > 0)
            *buf++ = '+';
        itoa(e, buf);
    } else {
        *buf = 0;
    }
}

static int numvalue(char c) {
    if ('0' <= c && c <= '9')
        return c - '0';
    c |= 0x20;
    if ('a' <= c && c <= 'z')
        return c - 'a' + 10;
    return -1;
}

size_t jacs_strformat(const char *fmt, size_t fmtlen, char *dst, size_t dstlen, value_t *args,
                      size_t numargs) {
    size_t fp = 0;
    size_t dp = 0;
    while (fp < fmtlen && dp < dstlen) {
        char c = fmt[fp++];
        if (c != '{' || fp >= fmtlen) {
            dst[dp++] = c;
            // if we see "}}" we treat it as a single "}"
            if (c == '}' && fp < fmtlen && fmt[fp] == '}')
                fp++;
            continue;
        }

        c = fmt[fp++];
        if (c == '{') {
            dst[dp++] = c;
            continue;
        }
        int pos = numvalue(c);
        if (pos < 0) {
            dst[dp++] = '!';
            continue;
        }

        size_t nextp = fp;
        while (nextp < fmtlen && fmt[nextp] != '}')
            nextp++;

        int precision = -1;
        if (fp < nextp)
            precision = numvalue(fmt[fp++]);

        fp = nextp + 1;

        if (pos >= (int)numargs) {
            dst[dp++] = '?';
            continue;
        }

        if (precision < 0)
            precision = 6;

        char buf[64];
        mycvt(args[pos], buf, precision + 1);
        char *s = buf;
        while (*s && dp < dstlen)
            dst[dp++] = *s++;
    }

    if (dp < dstlen)
        dst[dp] = 0;

    return dp;
}

#if 0
static void test_fmt1(const char *fmt) {
    char buf[256];
    value_t args[] = {
        0, 42, -108, 0.000198, 1e30, 1e-10, 2.0f / 3,
        123456789123,
    };
    jacs_strformat(fmt, strlen(fmt), buf, sizeof(buf) - 1, args, sizeof(args) / sizeof(args[0]));
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
