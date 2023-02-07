#pragma once

#include "jd_config.h"
#include <stdint.h>

#define DCFG_MAGIC0 0x47464344 // DCFG
#define DCFG_MAGIC1 0xcab49b0a // '\n' + random

#define DCFG_KEYSIZE 15

#define DCFG_TYPE_BITS 2
#define DCFG_TYPE_MASK ((1 << DCFG_TYPE_BITS) - 1)
#define DCFG_SIZE_BITS (16 - DCFG_TYPE_BITS)

#define DCFG_HASH_BITS 16
#define DCFG_HASH_JUMP_BITS 5
#define DCFG_HASH_JUMP_ENTRIES (1 << DCFG_HASH_JUMP_BITS)
#define DCFG_HASH_SHIFT (DCFG_HASH_BITS - DCFG_HASH_JUMP_BITS)

#define DCFG_TYPE_U32 0
#define DCFG_TYPE_I32 1
#define DCFG_TYPE_STRING 2
#define DCFG_TYPE_BLOB 3
#define DCFG_TYPE_INVALID 0xff

#define DCFG_HEADER_HASH_JUMP_OFFSET (6 * 4)
#define DCFG_HEADER_SIZE (DCFG_HEADER_HASH_JUMP_OFFSET + 2 * DCFG_HASH_JUMP_ENTRIES)
#define DCFG_ENTRY_SIZE (DCFG_KEYSIZE + 1 + 2 * 4)

typedef struct {
    char key[DCFG_KEYSIZE + 1];
    uint16_t hash;
    uint16_t type_size;
    uint32_t value;
} dcfg_entry_t;

static inline unsigned dcfg_entry_type(const dcfg_entry_t *e) {
    return e ? (e->type_size & DCFG_TYPE_MASK) : DCFG_TYPE_INVALID;
}
static inline unsigned dcfg_entry_size(const dcfg_entry_t *e) {
    return e->type_size >> DCFG_TYPE_BITS;
}

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint32_t total_bytes; // including the header the data after entries[]
    uint16_t num_entries;
    uint16_t reserved[5];
    // entries are ordered by hash
    // hash_jump[x] points to first entry where (entry.hash >> DCFG_HASH_SHIFT) >= x
    uint16_t hash_jump[DCFG_HASH_JUMP_ENTRIES];
    dcfg_entry_t entries[];
} dcfg_header_t;

#ifdef JD_DCFG_BASE_ADDR
void dcfg_validate(void);
unsigned dcfg_num_entries(void);
const dcfg_entry_t *dcfg_get_nth_entry(unsigned idx);
const dcfg_entry_t *dcfg_get_entry(const char *key);
int32_t dcfg_get_i32(const char *key, int32_t defl);
uint32_t dcfg_get_u32(const char *key, uint32_t defl);
const char *dcfg_get_string(const char *key, unsigned *sizep);
static inline const uint8_t *dcfg_get_blob(const char *key, unsigned *sizep) {
    return (const uint8_t *)dcfg_get_string(key, sizep);
}
#endif
