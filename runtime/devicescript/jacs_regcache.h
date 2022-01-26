
#define JACS_QUERY_MAX_INLINE 9
typedef struct jacs_regcache_entry {
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
} jacs_regcache_entry_t;

static inline const void *jacs_regcache_data(const jacs_regcache_entry_t *q) {
    return q->resp_size > JACS_QUERY_MAX_INLINE ? q->value.buffer : q->value.data;
}

void jacs_regcache_free(jacs_regcache_entry_t *q);
void jacs_regcache_mark_used(jacs_regcache_entry_t *q);
jacs_regcache_entry_t *jacs_regcache_lookup(jacs_ctx_t *ctx, unsigned role_idx,
                                            unsigned service_command, unsigned argument);
