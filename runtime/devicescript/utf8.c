#include "devs_internal.h"

// inspired by https://www.cl.cam.ac.uk/~mgk25/ucs/utf8_check.c

// https://en.wikipedia.org/wiki/Specials_(Unicode_block)#Replacement_character
static const uint8_t repl_ch[3] = {0xef, 0xbf, 0xbd};

int devs_string_jmp_index(const devs_utf8_string_t *dst, unsigned idx) {
    if (idx >= dst->length)
        return -1;
    unsigned joff = idx >> DEVS_UTF8_TABLE_SHIFT;
    unsigned off = joff == 0 ? 0 : dst->jmp_table[joff - 1];
    uint8_t *p = (uint8_t *)devs_utf8_string_data(dst);
    unsigned num = idx & DEVS_STRING_JMP_TABLE_MASK;
    while (num--) {
        off++;
        while (devs_utf8_is_cont(p[off]))
            off++;
    }
    return off;
}

int devs_string_index(devs_ctx_t *ctx, value_t s, unsigned idx) {
    const devs_utf8_string_t *u = devs_string_get_utf8_struct(ctx, s);
    if (u)
        return devs_string_jmp_index(u, idx);
    unsigned sz;
    const char *data = devs_string_get_utf8(ctx, s, &sz);
    if (data) {
        if (idx >= sz)
            return -1;
        else
            return idx;
    } else {
        return -1;
    }
}

int devs_string_length(devs_ctx_t *ctx, value_t s) {
    const devs_utf8_string_t *u = devs_string_get_utf8_struct(ctx, s);
    if (u)
        return u->length;
    unsigned sz;
    if (devs_string_get_utf8(ctx, s, &sz))
        return sz;
    return -1;
}

unsigned devs_utf8_from_code_point(unsigned ch, char buf[4]) {
    if (ch < 0x80) {
        buf[0] = ch;
        return 1;
    } else if (ch < 0x800) {
        buf[0] = (ch >> 6) | 0xC0;
        buf[1] = (ch & 0x3F) | 0x80;
        return 2;
    } else if (ch < 0x10000) {
        buf[0] = (ch >> 12) | 0xE0;
        buf[1] = ((ch >> 6) & 0x3F) | 0x80;
        buf[2] = (ch & 0x3F) | 0x80;
        return 3;
    } else if (ch < 0x110000) {
        buf[0] = (ch >> 18) | 0xF0;
        buf[1] = ((ch >> 12) & 0x3F) | 0x80;
        buf[2] = ((ch >> 6) & 0x3F) | 0x80;
        buf[3] = (ch & 0x3F) | 0x80;
        return 4;
    } else {
        memcpy(buf, repl_ch, 3);
        return 3;
    }
}

unsigned devs_utf8_code_point_length(const char *data) {
    const uint8_t *sp = (const uint8_t *)data;
    if (sp[0] < 0x80)
        return 1;
    else if ((sp[0] & 0xe0) == 0xc0)
        return 2;
    else if ((sp[0] & 0xf0) == 0xe0)
        return 3;
    else if ((sp[0] & 0xf8) == 0xf0)
        return 4;
    JD_PANIC();
    return 1;
}

unsigned devs_utf8_code_point(const char *data) {
    const uint8_t *sp = (const uint8_t *)data;
    if (sp[0] < 0x80) {
        return sp[0];
    } else if ((sp[0] & 0xe0) == 0xc0) {
#define M(idx, sh) ((sp[idx] & 0x3f) << (sh))
        return ((sp[0] & 0x1f) << 6) | M(1, 0);
    } else if ((sp[0] & 0xf0) == 0xe0) {
        return ((sp[0] & 0x0F) << 12) | M(1, 6) | M(2, 0);
    } else if ((sp[0] & 0xf8) == 0xf0) {
        return ((sp[0] & 0x07) << 18) | M(1, 12) | M(2, 6) | M(3, 0);
    } else {
        JD_PANIC();
        return 0xFFFD; // replacement character
    }
}

int devs_string_jmp_init(devs_ctx_t *ctx, devs_string_jmp_t *dst) {
    int r = devs_utf8_init(devs_utf8_string_data(&dst->inner), dst->inner.size, NULL, &dst->inner,
                           DEVS_UTF8_INIT_SET_JMP | DEVS_UTF8_INIT_CHK_DATA);
    if (r < 0)
        devs_invalid_program(ctx, 60129); // shouldn't happen
    return r;
}

int devs_utf8_init(const char *data, unsigned size, unsigned *out_len_p,
                   const devs_utf8_string_t *dst, unsigned flags) {
    const uint8_t *sp = (const uint8_t *)data;
    const uint8_t *ep = sp + size;
    unsigned out_sz = 0;
    unsigned out_len = 0;

    uint8_t *dp = NULL;
    if (flags & DEVS_UTF8_INIT_SET_DATA)
        dp = (uint8_t *)devs_utf8_string_data(dst);

    while (sp < ep) {
        unsigned ch_len = 1;
        if (sp[0] < 0x80) {
            // 0xxxxxxx
            // OK
        } else if ((sp[0] & 0xe0) == 0xc0) {
            // 110XXXXx 10xxxxxx
            if (ep - sp < 1 || !devs_utf8_is_cont(sp[1])) {
                goto repl;
            }

            ch_len = 2;

            if ((sp[0] & 0xfe) == 0xc0)
                // overlong: C0, C1
                goto repl;

        } else if ((sp[0] & 0xf0) == 0xe0) {
            // 1110XXXX 10Xxxxxx 10xxxxxx
            if (ep - sp < 1 || !devs_utf8_is_cont(sp[1])) {
                goto repl;
            }

            if (ep - sp < 2 || !devs_utf8_is_cont(sp[2])) {
                ch_len = 2;
                goto repl;
            }

            ch_len = 3;

            if ((sp[0] == 0xe0 && (sp[1] & 0xe0) == 0x80) ||                // overlong?
                (sp[0] == 0xed && (sp[1] & 0xe0) == 0xa0) ||                // surrogate?
                (sp[0] == 0xef && sp[1] == 0xbf && (sp[2] & 0xfe) == 0xbe)) // U+FFFE or U+FFFF?
                goto repl;

        } else if ((sp[0] & 0xf8) == 0xf0) {
            // 11110XXX 10XXxxxx 10xxxxxx 10xxxxxx
            for (unsigned i = 1; i <= 3; ++i)
                if (ep - sp < (int)i || !devs_utf8_is_cont(sp[i])) {
                    ch_len = i;
                    goto repl;
                }

            ch_len = 4;

            if ((sp[0] == 0xf0 && (sp[1] & 0xf0) == 0x80) ||     // overlong?
                (sp[0] == 0xf4 && sp[1] > 0x8f) || sp[0] > 0xf4) // > U+10FFFF?
                goto repl;

        } else {
            goto repl;
        }

        const uint8_t *src = sp;
        sp += ch_len;
        goto write;

    repl:
        src = repl_ch;
        sp += ch_len;
        ch_len = 3;
        if (flags & DEVS_UTF8_INIT_CHK_DATA)
            return DEVS_UTF8_INIT_ERR_DATA;

    write:
        if (dp)
            for (unsigned i = 0; i < ch_len; ++i)
                dp[out_sz + i] = src[i];
        out_sz += ch_len;
        if ((out_len & DEVS_STRING_JMP_TABLE_MASK) == DEVS_STRING_JMP_TABLE_MASK) {
            unsigned idx = out_len >> DEVS_UTF8_TABLE_SHIFT;
            if (flags & DEVS_UTF8_INIT_SET_JMP)
                ((uint16_t *)dst->jmp_table)[idx] = out_sz;
            else if (flags & DEVS_UTF8_INIT_CHK_JMP && dst->jmp_table[idx] != out_sz)
                return DEVS_UTF8_INIT_ERR_JMP_TBL;
        }
        out_len++;
    }

    if (dst && (dst->length != out_len || dst->size != out_sz))
        return DEVS_UTF8_INIT_ERR_SIZES;
    if (dst && devs_utf8_string_data(dst)[dst->size] != 0)
        return DEVS_UTF8_INIT_ERR_NUL_TERM;

    if (out_len_p)
        *out_len_p = out_len;
    return out_sz;
}