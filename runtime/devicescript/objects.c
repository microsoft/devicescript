#include "devs_internal.h"

void devs_map_clear(devs_ctx_t *ctx, devs_map_t *map) {
    if (map->data) {
        devs_free(ctx, map->data);
        map->data = NULL;
        map->capacity = 0;
        map->length = 0;
    }
}

static value_t *lookup(devs_map_t *map, devs_key_id_t key) {
    devs_key_id_t *keys = devs_map_keys(map);
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

void devs_map_set(devs_ctx_t *ctx, devs_map_t *map, devs_key_id_t key, value_t v) {
    value_t *tmp = lookup(map, key);
    if (tmp != NULL) {
        *tmp = v;
        return;
    }

    JD_ASSERT(map->capacity <= map->length);

    if (map->capacity == map->length) {
        int newlen = grow_len(map->capacity);
        map->capacity = newlen;
        tmp = devs_try_alloc(ctx, newlen * (sizeof(value_t) + sizeof(devs_key_id_t)));
        if (!tmp)
            return;
        if (map->length) {
            memcpy(tmp, map->data, map->length * sizeof(value_t));
            memcpy(tmp + newlen, devs_map_keys(map), map->length * sizeof(devs_key_id_t));
        }
        map->data = tmp;
        jd_gc_unpin(ctx->gc, tmp);
    }
    map->data[map->length] = v;
    devs_map_keys(map)[map->length] = key;
    map->length++;
}

value_t devs_map_get(devs_ctx_t *ctx, devs_map_t *map, devs_key_id_t key) {
    value_t *tmp = lookup(map, key);
    if (tmp == NULL)
        return devs_undefined;
    return *tmp;
}

value_t devs_index(devs_ctx_t *ctx, value_t seq, unsigned idx) {
    if (idx > JACS_MAX_ALLOC)
        return devs_undefined;
    if (devs_is_buffer(ctx, seq)) {
        unsigned len;
        uint8_t *p = devs_buffer_data(ctx, seq, &len);
        if (idx < len)
            return devs_value_from_int(p[idx]);
    } else {
        devs_array_t *arr = devs_value_to_gc_obj(ctx, seq);
        if (devs_gc_tag(arr) == JACS_GC_TAG_ARRAY) {
            if (idx < arr->length)
                return arr->data[idx];
        }
    }
    return devs_undefined;
}

static int array_ensure_len(devs_ctx_t *ctx, devs_array_t *arr, unsigned newlen) {
    if (arr->capacity < newlen) {
        newlen = grow_len(newlen);
        value_t *newarr = devs_try_alloc(ctx, newlen * sizeof(value_t));
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

int devs_array_set(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, value_t v) {
    if (idx > JACS_MAX_ALLOC / sizeof(value_t))
        return -4;

    if (array_ensure_len(ctx, arr, idx + 1))
        return -5;

    arr->data[idx] = v;
    if (idx >= arr->length)
        arr->length = idx + 1;
    return 0;
}

int devs_index_set(devs_ctx_t *ctx, value_t seq, unsigned idx, value_t v) {
    // DMESG("set arr=%s idx=%u", devs_show_value(ctx, seq), idx);
    if (idx > JACS_MAX_ALLOC)
        return -1;
    if (devs_is_buffer(ctx, seq)) {
        unsigned len;
        uint8_t *p = devs_buffer_data(ctx, seq, &len);
        if (idx < len) {
            p[idx] = devs_value_to_int(v) & 0xff;
            return 0;
        } else {
            return -3;
        }
    } else {
        devs_array_t *arr = devs_value_to_gc_obj(ctx, seq);
        if (devs_gc_tag(arr) == JACS_GC_TAG_ARRAY) {
            return devs_array_set(ctx, arr, idx, v);
        } else {
            return -2;
        }
    }
}

int devs_array_insert(devs_ctx_t *ctx, devs_array_t *arr, unsigned idx, int count) {
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
