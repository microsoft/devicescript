#include "devs_internal.h"

static int devs_json_escape_core(const char *str, unsigned sz, char *dst) {
    int len = 1;

    if (dst)
        *dst++ = '"';

    for (unsigned i = 0; i < sz; ++i) {
        char c = str[i];
        int q = 0;
        switch (c) {
        case '"':
        case '\\':
            q = 1;
            break;
        case '\n':
            c = 'n';
            q = 1;
            break;
        case '\r':
            c = 'r';
            q = 1;
            break;
        case '\t':
            c = 't';
            q = 1;
            break;
        default:
            if (c >= 32) {
                len++;
                if (dst)
                    *dst++ = c;
            } else {
                len += 6;
                if (dst) {
                    *dst++ = '\\';
                    *dst++ = 'u';
                    *dst++ = '0';
                    *dst++ = '0';
                    jd_to_hex(dst, &c, 1);
                    dst += 2;
                }
            }
            break;
        }
        if (q == 1) {
            len += 2;
            if (dst) {
                *dst++ = '\\';
                *dst++ = c;
            }
        }
    }

    len += 2;
    if (dst) {
        *dst++ = '"';
        *dst++ = '\0';
    }

    return len;
}

char *devs_json_escape(const char *str, unsigned sz) {
    int len = devs_json_escape_core(str, sz, NULL);
    char *r = jd_alloc(len);
    devs_json_escape_core(str, sz, r);
    return r;
}