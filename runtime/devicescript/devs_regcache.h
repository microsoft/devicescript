#define JACS_QUERY_MAX_INLINE 9
typedef struct devs_regcache_entry {
    uint16_t role_idx;
    uint16_t service_command;
    uint32_t last_refresh_time;
    union {
        uint32_t u32;
        uint8_t data[JACS_QUERY_MAX_INLINE];
        uint8_t *buffer;
    } value;
    uint8_t resp_size;
    uint16_t argument;
} devs_regcache_entry_t;

#define JACS_REGCACHE_NUM_ENTRIES 20

typedef struct devs_regcache {
    devs_regcache_entry_t entries[JACS_REGCACHE_NUM_ENTRIES];
    uint16_t latest_idx;
} devs_regcache_t;

static inline void *devs_regcache_data(devs_regcache_entry_t *q) {
    return q->resp_size > JACS_QUERY_MAX_INLINE ? q->value.buffer : q->value.data;
}

void devs_regcache_free(devs_regcache_t *cache, devs_regcache_entry_t *q);
devs_regcache_entry_t *devs_regcache_mark_used(devs_regcache_t *cache, devs_regcache_entry_t *q);
devs_regcache_entry_t *devs_regcache_lookup(devs_regcache_t *cache, unsigned role_idx,
                                            unsigned service_command, unsigned argument);
devs_regcache_entry_t *devs_regcache_alloc(devs_regcache_t *cache, unsigned role_idx,
                                           unsigned service_command, unsigned resp_size);
void devs_regcache_age(devs_regcache_t *cache, unsigned role_idx, uint32_t min_time);
void devs_regcache_free_role(devs_regcache_t *cache, unsigned role_idx);
devs_regcache_entry_t *devs_regcache_next(devs_regcache_t *cache, unsigned role_idx,
                                          unsigned service_command, devs_regcache_entry_t *prev);
void devs_regcache_free_all(devs_regcache_t *cache);
