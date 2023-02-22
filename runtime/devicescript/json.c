#include "devs_internal.h"
#include <stdlib.h>

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

typedef struct {
    devs_ctx_t *ctx;
    const char *ptr0;
    const char *ptr;
    unsigned size;
    int16_t ch;
    bool error;
} parser_t;

inline static int get_ch(parser_t *state) {
    if (state->error)
        return -1;
    if (state->size == 0)
        return (state->ch = -1);
    state->size--;
    return (state->ch = *state->ptr++);
}

static int get_non_ws(parser_t *state) {
    for (;;) {
        int c = get_ch(state);
        if (c == ' ' || c == '\n' || c == '\t' || c == '\r')
            continue;
        return c;
    }
}

static void unget(parser_t *state) {
    if (!state->error) {
        state->ptr--;
        state->size++;
    }
}

static value_t error(parser_t *state) {
    state->error = true;
    return devs_undefined;
}

static value_t json_value(parser_t *state);

static int parse_hex(parser_t *state) {
    char buf[5];
    uint8_t dst[2];
    for (int i = 0; i < 4; ++i) {
        int c = get_ch(state);
        if (c == -1)
            return -1;
        buf[i] = c;
    }
    buf[4] = 0;
    int r = jd_from_hex(dst, buf);
    if (r != 4)
        return -1;
    return (dst[0] << 8) | dst[1];
}

static int parse_string_core(parser_t *state, char *dst) {
    int p = 0;
    for (;;) {
        int c = get_ch(state);
        if (c == -1)
            return -1;
        if (c == '"')
            break;
        if (c == '\\') {
            c = get_ch(state);
            switch (c) {
            case 'n':
                c = '\n';
                break;
            case 't':
                c = '\t';
                break;
            case 'r':
                c = '\r';
                break;
            case 'b':
                c = '\b';
                break;
            case 'f':
                c = '\f';
                break;
            case '"':
            case '/':
            case '\\':
                // c = c;
                break;
            case 'u':
                c = parse_hex(state);
                if (c == -1)
                    return -1;
                break;
            default:
                return -1;
            }
        }
        if (dst)
            *dst++ = c;
        p++;
    }

    return p;
}

static value_t parse_string(parser_t *state) {
    const char *p = state->ptr;
    unsigned sz = state->size;
    int slen = parse_string_core(state, NULL);
    if (slen == -1)
        return error(state);
    if (slen == 0)
        return devs_builtin_string(DEVS_BUILTIN_STRING__EMPTY);
    state->ptr = p;
    state->size = sz;
    devs_string_t *s = devs_string_try_alloc(state->ctx, slen);
    if (s != NULL)
        parse_string_core(state, s->data);
    return devs_value_from_gc_obj(state->ctx, s);
}

static value_t parse_array(parser_t *state) {
    devs_ctx_t *ctx = state->ctx;
    devs_array_t *arr = devs_array_try_alloc(ctx, 0);
    if (!arr)
        return devs_undefined;
    value_t ret = devs_value_from_gc_obj(ctx, arr);

    if (get_non_ws(state) == ']')
        return ret;
    else
        unget(state);

    devs_value_pin(ctx, ret);

    for (;;) {
        value_t e = json_value(state);
        if (state->error)
            goto fail;
        devs_array_pin_push(ctx, arr, e);
        int c = get_non_ws(state);
        if (c == ',')
            continue;
        if (c == ']')
            break;
        goto fail;
    }

    devs_value_unpin(ctx, ret);
    return ret;

fail:
    devs_value_unpin(ctx, ret);
    return error(state);
}

static value_t parse_object(parser_t *state) {
    devs_ctx_t *ctx = state->ctx;
    devs_map_t *arr = devs_map_try_alloc(ctx, 0);
    if (!arr)
        return devs_undefined;
    value_t ret = devs_value_from_gc_obj(ctx, arr);

    if (get_non_ws(state) == '}')
        return ret;
    else
        unget(state);

    devs_value_pin(ctx, ret);

    for (;;) {
        if (get_non_ws(state) != '"')
            goto fail;
        value_t key = parse_string(state);
        if (state->error)
            goto fail;
        if (get_non_ws(state) != ':')
            goto fail;

        devs_value_pin(ctx, key);
        value_t val = json_value(state);
        if (!state->error) {
            devs_value_pin(ctx, val);
            devs_map_set(ctx, arr, key, val);
            devs_value_unpin(ctx, val);
        }
        devs_value_unpin(ctx, key);
        if (state->error)
            goto fail;

        int c = get_non_ws(state);
        if (c == ',')
            continue;
        if (c == '}')
            break;
        goto fail;
    }

    devs_value_unpin(ctx, ret);
    return ret;

fail:
    devs_value_unpin(ctx, ret);
    return error(state);
}

static int istoken(parser_t *state, const char *name) {
    if (name[0] == state->ch) {
        unsigned len = strlen(name + 1);
        if (state->size >= len && memcmp(state->ptr, name + 1, len) == 0) {
            state->ptr += len;
            state->size -= len;
            return true;
        }
    }
    return false;
}

static value_t json_value(parser_t *state) {
    if (state->error)
        return devs_undefined;
    int c = get_non_ws(state);
    if (c == '{')
        return parse_object(state);
    else if (c == '[')
        return parse_array(state);
    else if (c == '"')
        return parse_string(state);
    else if (istoken(state, "null"))
        return devs_null;
    else if (istoken(state, "true"))
        return devs_true;
    else if (istoken(state, "false"))
        return devs_false;
    else if (c == '-' || ('0' <= c && c <= '9')) {
        char *endp;
        double v = strtod(state->ptr - 1, &endp);
        if (endp == state->ptr - 1)
            return error(state);
        int sz = state->size - (endp - state->ptr);
        JD_ASSERT(sz >= 0);
        state->size = sz;
        state->ptr = endp;
        return devs_value_from_double(v);
    } else
        return error(state);
}

static value_t throw_err(parser_t *state) {
    if (state->ch == -1)
        return devs_throw_syntax_error(state->ctx, "Unexpected end of JSON input");
    return devs_throw_syntax_error(state->ctx, "Unexpected token '%c' in JSON at position %d",
                                   state->ch, state->ptr - state->ptr0 - 1);
}

value_t devs_json_parse(devs_ctx_t *ctx, const char *str, unsigned sz, bool do_throw) {
    JD_ASSERT(str[sz] == 0); // strtod requires this
    parser_t state = {
        .ctx = ctx,
        .ptr = str,
        .ptr0 = str,
        .size = sz,
    };
    value_t r = json_value(&state);
    if (!state.error) {
        if (get_non_ws(&state) != -1)
            error(&state);
    }
    if (state.error) {
        if (do_throw)
            throw_err(&state);
        return devs_undefined;
    } else {
        return r;
    }
}