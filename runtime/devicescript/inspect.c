#include "devs_internal.h"
#include <stdlib.h>

#define LOG_TAG "inspect"
#include "devs_logging.h"

typedef struct {
    devs_ctx_t *ctx;
    unsigned off;
    unsigned size;
    char *dst;
    uint8_t overflow;
} inspect_t;

static void add_str(inspect_t *state, const char *s) {
    if (state->overflow)
        return;
    unsigned space = state->size - state->off;
    unsigned sz = strlen(s);
    if (sz > space) {
        sz = space;
        state->overflow = 1;
    }
    if (state->dst)
        memcpy(state->dst + state->off, s, sz);
    state->off += sz;
}

static void add_ch(inspect_t *state, char c) {
    char s[2] = {c, 0};
    add_str(state, s);
}

static void inspect_obj(inspect_t *state, value_t v);

static bool is_id(const char *p, unsigned sz) {
    for (unsigned i = 0; i < sz; ++i) {
        char c = p[i];
        if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || (i > 0 && '0' <= c && c <= '9') ||
            c == '_')
            continue;
        return false;
    }
    return true;
}

static void inspect_field(devs_ctx_t *ctx, void *state_, value_t k, value_t v) {
    inspect_t *state = state_;

    if (state->overflow)
        return;

    int id = 0;
    if (devs_is_string(ctx, k)) {
        unsigned size;
        const char *d = devs_string_get_utf8(ctx, k, &size);
        if (is_id(d, size)) {
            id = 1;
            add_str(state, d);
        }
    }
    if (!id)
        inspect_obj(state, k);
    add_ch(state, ':');
    inspect_obj(state, v);
    add_ch(state, ',');
}

static bool is_complex(int type_of) {
    switch (type_of) {
    case DEVS_OBJECT_TYPE_MAP:
    case DEVS_OBJECT_TYPE_ARRAY:
        return true;
    }
    return false;
}

static void inspect_obj(inspect_t *state, value_t v) {
    devs_ctx_t *ctx = state->ctx;

    // LOG_VAL("str", v);
    LOGV("off=%d", state->off);

    if (state->overflow)
        return;

    if (devs_value_is_pinned(ctx, v)) {
        add_str(state, "[Circular]");
        return;
    }

    unsigned type_of = devs_value_typeof(ctx, v);

    unsigned sz;
    const char *data = NULL;

    if (type_of == DEVS_OBJECT_TYPE_STRING) {
        data = devs_string_get_utf8(ctx, v, &sz);
        char *p = devs_json_escape(data, sz);
        add_str(state, p);
        jd_free(p);
        return;
    }

    if (!is_complex(type_of) || devs_handle_type(v) == DEVS_HANDLE_TYPE_ROLE_MEMBER) {
        v = devs_value_to_string(ctx, v);
        data = devs_string_get_utf8(ctx, v, &sz);
        add_str(state, data);
        return;
    }

    devs_value_pin(ctx, v);

    if (devs_is_array(ctx, v)) {
        devs_array_t *arr = devs_value_to_gc_obj(ctx, v);
        add_ch(state, '[');
        for (unsigned i = 0; i < arr->length; ++i) {
            inspect_obj(state, arr->data[i]);
            if (state->overflow)
                break;
            if ((int)i != arr->length - 1)
                add_ch(state, ',');
        }
        add_ch(state, ']');
    } else {
        devs_maplike_t *map = devs_object_get_attached_enum(ctx, v);
        add_ch(state, '{');
        if (map != NULL) {
            unsigned off0 = state->off;
            devs_maplike_iter(ctx, map, state, inspect_field);
            if (off0 != state->off) {
                state->off--; // eat final comma
            }
        }
        add_ch(state, '}');
    }

    devs_value_unpin(ctx, v);
}

int devs_inspect_to(devs_ctx_t *ctx, value_t v, char *dst, unsigned size) {
    if (size < 5)
        return -1;

    inspect_t state = {
        .ctx = ctx,
        .dst = dst,
        .off = 0,
        .size = size - 1 // space for final '\0'
    };
    inspect_obj(&state, v);
    JD_ASSERT(state.off < size);
    if (dst) {
        dst[state.off] = '\0';
        if (state.overflow) {
            dst[state.off - 1] = '.';
            dst[state.off - 2] = '.';
            dst[state.off - 3] = '.';
        }
    }
    return state.off + 1;
}

value_t devs_inspect(devs_ctx_t *ctx, value_t v, unsigned size) {
    unsigned type_of = devs_value_typeof(ctx, v);
    if (!is_complex(type_of))
        return devs_value_to_string(ctx, v);

    int sz = devs_inspect_to(ctx, v, NULL, size);
    if (sz == -1)
        return devs_undefined;

    sz--; // ignore trailing '\0'

    devs_string_t *s = devs_string_try_alloc(ctx, sz);
    value_t r = devs_value_from_gc_obj(ctx, s);
    devs_value_pin(ctx, r);
    if (s != NULL) {
        sz = devs_inspect_to(ctx, v, s->data, size);
        JD_ASSERT(sz - 1 == s->length);
    }
    devs_value_unpin(ctx, r);
    return r;
}