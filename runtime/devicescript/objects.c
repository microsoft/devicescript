#include "jacs_internal.h"

void jacs_map_clear(jacs_ctx_t *ctx, jacs_map_t *map) {
    if (map->data) {
        jacs_free(ctx, map->data);
        map->data = NULL;
        map->capacity = 0;
        map->length = 0;
    }
}

static value_t *lookup(jacs_map_t *map, jacs_key_id_t key) {
    jacs_key_id_t *keys = jacs_map_keys(map);
    for (unsigned i = 0; i < map->length; ++i) {
        if (keys[i] == key)
            return &map->data[i];
    }
    return NULL;
}

static int grow_len(int capacity) {
    int newlen = capacity * 10 / 8;
    if (newlen < 4)
        newlen = 4;
    return newlen;
}

void jacs_map_set(jacs_ctx_t *ctx, jacs_map_t *map, jacs_key_id_t key, value_t v) {
    value_t *tmp = lookup(map, key);
    if (tmp != NULL) {
        *tmp = v;
        return;
    }

    JD_ASSERT(map->capacity <= map->length);

    if (map->capacity == map->length) {
        int newlen = grow_len(map->capacity);
        map->capacity = newlen;
        tmp = jacs_try_alloc(ctx, newlen * (sizeof(value_t) + sizeof(jacs_key_id_t)));
        if (!tmp)
            return;
        if (map->length) {
            memcpy(tmp, map->data, map->length * sizeof(value_t));
            memcpy(tmp + newlen, jacs_map_keys(map), map->length * sizeof(jacs_key_id_t));
        }
        map->data = tmp;
        jd_gc_unpin(ctx->gc, tmp);
    }
    map->data[map->length] = v;
    jacs_map_keys(map)[map->length] = key;
    map->length++;
}

value_t jacs_map_get(jacs_ctx_t *ctx, jacs_map_t *map, jacs_key_id_t key) {
    value_t *tmp = lookup(map, key);
    if (tmp == NULL)
        return jacs_undefined;
    return *tmp;
}

value_t jacs_index(jacs_ctx_t *ctx, value_t seq, unsigned idx) {
    if (idx > JACS_MAX_ALLOC)
        return jacs_undefined;
    if (jacs_is_buffer(ctx, seq)) {
        unsigned len;
        uint8_t *p = jacs_buffer_data(ctx, seq, &len);
        if (idx < len)
            return jacs_value_from_int(p[idx]);
    } else {
        jacs_array_t *arr = jacs_value_to_gc_obj(ctx, seq);
        if (jacs_gc_tag(arr) == JACS_GC_TAG_ARRAY) {
            if (idx < arr->length)
                return arr->data[idx];
        }
    }
    return jacs_undefined;
}

static int array_ensure_len(jacs_ctx_t *ctx, jacs_array_t *arr, unsigned newlen) {
    if (arr->capacity < newlen) {
        newlen = grow_len(newlen);
        value_t *newarr = jacs_try_alloc(ctx, newlen * sizeof(value_t));
        if (newarr == NULL)
            return -1;
        if (arr->data)
            memcpy(newarr, arr->data, sizeof(value_t) * arr->length);
        arr->data = newarr;
        arr->capacity = newlen;
        jd_gc_unpin(ctx->gc, newarr);
    }
    return 0;
}

int jacs_array_set(jacs_ctx_t *ctx, jacs_array_t *arr, unsigned idx, value_t v) {
    if (idx > JACS_MAX_ALLOC / sizeof(value_t))
        return -4;

    if (array_ensure_len(ctx, arr, idx + 1))
        return -5;

    arr->data[idx] = v;
    if (idx >= arr->length)
        arr->length = idx + 1;
    return 0;
}

int jacs_index_set(jacs_ctx_t *ctx, value_t seq, unsigned idx, value_t v) {
    // DMESG("set arr=%s idx=%u", jacs_show_value(ctx, seq), idx);
    if (idx > JACS_MAX_ALLOC)
        return -1;
    if (jacs_is_buffer(ctx, seq)) {
        unsigned len;
        uint8_t *p = jacs_buffer_data(ctx, seq, &len);
        if (idx < len) {
            p[idx] = jacs_value_to_int(v) & 0xff;
            return 0;
        } else {
            return -3;
        }
    } else {
        jacs_array_t *arr = jacs_value_to_gc_obj(ctx, seq);
        if (jacs_gc_tag(arr) == JACS_GC_TAG_ARRAY) {
            return jacs_array_set(ctx, arr, idx, v);
        } else {
            return -2;
        }
    }
}

int jacs_array_insert(jacs_ctx_t *ctx, jacs_array_t *arr, unsigned idx, int count) {
    if (count > (int)(JACS_MAX_ALLOC / sizeof(value_t)))
        return -4;

    int newlen = arr->length + count;
    if (newlen < 0) {
        count = -arr->length;
        newlen = 0;
    }

    if (count == 0)
        return 0;

    if (newlen > (int)(JACS_MAX_ALLOC / sizeof(value_t)))
        return -6;

    if (idx > arr->length)
        idx = arr->length;

    if (array_ensure_len(ctx, arr, newlen))
        return -5;

    unsigned trailing = arr->length - idx;

    if (count < 0) {
        count = -count;
        memmove(arr->data + idx, arr->data + idx + count, trailing - count);
    } else {
        memmove(arr->data + idx + count, arr->data + idx, trailing);
        memset(arr->data + idx, 0, count * sizeof(value_t));
    }
    arr->length = newlen;

    return 0;
}
