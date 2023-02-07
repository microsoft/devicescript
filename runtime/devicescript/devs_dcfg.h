#pragma once

#include "jd_config.h"
#include <stdint.h>

#define DCFG_MAGIC0 0x47464344 // DCFG
#define DCFG_MAGIC1 0xcab49b0a // '\n' + random

#define DCFG_KEYSIZE 15

#define DCFG_HASH_BITS 5
#define DCFG_HASH_SHIFT (8 - DCFG_HASH_BITS)

#define DCFG_TYPE_OFFSET_MASK 0x80
#define DCFG_TYPE_EMPTY 0xff
#define DCFG_TYPE_U32 0x01
#define DCFG_TYPE_I32 0x02
// #define DCFG_TYPE_F32 0x03
#define DCFG_TYPE_STRING 0x81
#define DCFG_TYPE_BLOB 0x82
// #define DCFG_TYPE_F64 0x83

typedef struct {
    char key[DCFG_KEYSIZE + 1];
    uint8_t hash;
    uint8_t type;
    uint16_t size;
    uint32_t value;
} dcfg_entry_t;

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint16_t num_entries;
    uint16_t reserved[3];
    // entries are ordered by hash
    // hash_jump[x] points to first entry (plus one) where (entry.hash >> DCFG_HASH_SHIFT) == x
    // or 0 if there is no such entry
    uint8_t hash_jump[1 << DCFG_HASH_BITS];
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
