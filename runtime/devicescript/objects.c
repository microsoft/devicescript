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

void jacs_map_set(jacs_ctx_t *ctx, jacs_map_t *map, jacs_key_id_t key, value_t v) {
    value_t *tmp = lookup(map, key);
    if (tmp != NULL) {
        *tmp = v;
        return;
    }

    JD_ASSERT(map->capacity <= map->length);

    if (map->capacity == map->length) {
        int newlen = map->capacity * 10 / 8;
        if (newlen < 4)
            newlen = 4;
        map->capacity = newlen;
        tmp = jacs_try_alloc(ctx, newlen * (sizeof(value_t) + sizeof(jacs_key_id_t)));
        if (!tmp)
            return;
        if (map->length) {
            memcpy(tmp, map->data, map->length * sizeof(value_t));
            memcpy(tmp + newlen, jacs_map_keys(map), map->length * sizeof(jacs_key_id_t));
            jacs_free(ctx, map->data);
        }
        map->data = tmp;
    }
    map->data[map->length] = v;
    jacs_map_keys(map)[map->length] = key;
    map->length++;
}

value_t jacs_map_get(jacs_ctx_t *ctx, jacs_map_t *map, jacs_key_id_t key) {
    value_t *tmp = lookup(map, key);
    if (tmp == NULL)
        return jacs_nan;
    return *tmp;
}
