#include "jacs_internal.h"

void jacs_regcache_free(jacs_regcache_t *cache, jacs_regcache_entry_t *q) {
    if (q->resp_size > JACS_QUERY_MAX_INLINE)
        jd_free(q->value.buffer);
    q->resp_size = 0;
    q->service_command = 0;
}

void jacs_regcache_free_all(jacs_regcache_t *cache) {
    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        jacs_regcache_free(cache, &cache->entries[i]);
    }
}

void jacs_regcache_mark_used(jacs_regcache_t *cache, jacs_regcache_entry_t *q) {
    unsigned idx = cache->latest_idx;
    if (q == &cache->entries[idx])
        return; // already latest
    idx++;
    if (idx >= JACS_REGCACHE_NUM_ENTRIES)
        idx = 0;
    if (q != &cache->entries[idx]) {
        jacs_regcache_entry_t tmp;
        memcpy(&tmp, q, sizeof(tmp));
        memcpy(q, &cache->entries[idx], sizeof(tmp));
        memcpy(&cache->entries[idx], &tmp, sizeof(tmp));
    }
    cache->latest_idx = idx;
}

jacs_regcache_entry_t *jacs_regcache_alloc(jacs_regcache_t *cache, unsigned role_idx,
                                           unsigned service_command, unsigned resp_size) {
    jacs_regcache_entry_t *q = NULL;

    assert(service_command > 0);

    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        if (cache->entries[i].service_command == 0) {
            q = &cache->entries[i];
            break;
        }
    }

    if (!q) {
        unsigned idx = cache->latest_idx + 1;
        if (idx >= JACS_REGCACHE_NUM_ENTRIES)
            idx = 0;
        q = &cache->entries[idx];
        jacs_regcache_free(cache, q);
    }

    q->role_idx = role_idx;
    q->service_command = service_command;
    q->argument = 0;
    q->resp_size = resp_size;
    if (resp_size > JACS_QUERY_MAX_INLINE)
        q->value.buffer = jd_alloc(resp_size);

    jacs_regcache_mark_used(cache, q);

    return q;
}

jacs_regcache_entry_t *jacs_regcache_lookup(jacs_regcache_t *cache, unsigned role_idx,
                                            unsigned service_command, unsigned argument) {
    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        jacs_regcache_entry_t *q = &cache->entries[i];
        if (q->role_idx == role_idx && q->service_command == service_command &&
            q->argument == argument)
            return q;
    }
    return NULL;
}

void jacs_regcache_age(jacs_regcache_t *cache, unsigned role_idx, uint32_t min_time) {
    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        jacs_regcache_entry_t *q = &cache->entries[i];
        if (q->role_idx == role_idx && q->last_refresh_time > min_time)
            q->last_refresh_time = min_time;
    }
}

jacs_regcache_entry_t *jacs_regcache_next(jacs_regcache_t *cache, unsigned role_idx,
                                          unsigned service_command, jacs_regcache_entry_t *prev) {
    jacs_regcache_entry_t *end = &cache->entries[JACS_REGCACHE_NUM_ENTRIES];
    if (!prev)
        prev = &cache->entries[0];
    while (prev < end) {
        if (prev->service_command == service_command && prev->role_idx == role_idx)
            return prev;
        prev++;
    }
    return NULL;
}