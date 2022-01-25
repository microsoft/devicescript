
#define JACS_QUERY_MAX_INLINE 4
typedef struct jacs_regcache_query {
    struct jacs_regcache_query *next;
    uint16_t reg_code;
    uint8_t service_index;
    uint8_t resp_size;
    uint32_t last_query;
    union {
        uint32_t u32;
        uint8_t data[JACS_QUERY_MAX_INLINE];
        uint8_t *buffer;
    } value;
} jacs_regcache_query_t;

static inline bool jacs_regcache_not_implemented(const jacs_regcache_query_t *q) {
    return (q->service_index & 0x80) != 0;
}

static inline const void *jacs_regcache_data(const jacs_regcache_query_t *q) {
    return q->resp_size > JACS_QUERY_MAX_INLINE ? q->value.buffer : q->value.data;
}

const jacs_regcache_query_t *jacs_regcache_lookup(jd_device_service_t *serv, int reg_code,
                                            int refresh_ms);
void jd_device_clear_queries(jd_device_t *d, uint8_t service_idx);
