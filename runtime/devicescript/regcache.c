#include "devs_internal.h"

void devs_regcache_free(devs_regcache_t *cache, devs_regcache_entry_t *q) {
    if (q->resp_size > JACS_QUERY_MAX_INLINE)
        jd_free(q->value.buffer);
    q->resp_size = 0;
    q->service_command = 0;
}

void devs_regcache_free_all(devs_regcache_t *cache) {
    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        devs_regcache_free(cache, &cache->entries[i]);
    }
}

devs_regcache_entry_t *devs_regcache_mark_used(devs_regcache_t *cache, devs_regcache_entry_t *q) {
    unsigned idx = cache->latest_idx;
    if (q == &cache->entries[idx])
        return q; // already latest
    idx++;
    if (idx >= JACS_REGCACHE_NUM_ENTRIES)
        idx = 0;
    if (q != &cache->entries[idx]) {
        devs_regcache_entry_t tmp;
        memcpy(&tmp, q, sizeof(tmp));
        memcpy(q, &cache->entries[idx], sizeof(tmp));
        memcpy(&cache->entries[idx], &tmp, sizeof(tmp));
    }
    cache->latest_idx = idx;
    return &cache->entries[idx];
}

devs_regcache_entry_t *devs_regcache_alloc(devs_regcache_t *cache, unsigned role_idx,
                                           unsigned service_command, unsigned resp_size) {
    devs_regcache_entry_t *q = NULL;

    JD_ASSERT(service_command > 0);

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
        devs_regcache_free(cache, q);
    }

    q->role_idx = role_idx;
    q->service_command = service_command;
    q->argument = 0;
    q->resp_size = resp_size;
    if (resp_size > JACS_QUERY_MAX_INLINE)
        q->value.buffer = jd_alloc(resp_size);

    q = devs_regcache_mark_used(cache, q);

    return q;
}

devs_regcache_entry_t *devs_regcache_lookup(devs_regcache_t *cache, unsigned role_idx,
                                            unsigned service_command, unsigned argument) {
    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        devs_regcache_entry_t *q = &cache->entries[i];
        if (q->role_idx == role_idx && q->service_command == service_command &&
            q->argument == argument)
            return q;
    }
    return NULL;
}

void devs_regcache_age(devs_regcache_t *cache, unsigned role_idx, uint32_t min_time) {
    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        devs_regcache_entry_t *q = &cache->entries[i];
        if (q->role_idx == role_idx && q->last_refresh_time > min_time)
            q->last_refresh_time = min_time;
    }
}

void devs_regcache_free_role(devs_regcache_t *cache, unsigned role_idx) {
    for (unsigned i = 0; i < JACS_REGCACHE_NUM_ENTRIES; ++i) {
        devs_regcache_entry_t *q = &cache->entries[i];
        if (q->role_idx == role_idx)
            devs_regcache_free(cache, q);
    }
}

devs_regcache_entry_t *devs_regcache_next(devs_regcache_t *cache, unsigned role_idx,
                                          unsigned service_command, devs_regcache_entry_t *prev) {
    if (!service_command)
        return NULL;
    devs_regcache_entry_t *end = &cache->entries[JACS_REGCACHE_NUM_ENTRIES];
    if (!prev)
        prev = &cache->entries[0];
    while (prev < end) {
        if (prev->service_command == service_command && prev->role_idx == role_idx)
            return prev;
        prev++;
    }
    return NULL;
}