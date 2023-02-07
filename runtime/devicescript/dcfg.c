// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "devs_internal.h"

#define LOG_TAG "cfg"
#include "devs_logging.h"

#ifdef JD_DCFG_BASE_ADDR

static bool dcfg_inited;
static const dcfg_header_t *dcfg_header;

typedef const dcfg_entry_t entry_t;

static inline const void *data_ptr(entry_t *e) {
    if (e->type == 0 || e->type == DCFG_TYPE_EMPTY)
        return NULL;
    if (e->type & DCFG_TYPE_OFFSET_MASK)
        return (const uint8_t *)dcfg_header + e->value;
    else
        return &e->value;
}

static bool dcfg_ok(void) {
    if (dcfg_inited)
        return dcfg_header != NULL;
    dcfg_inited = true;

    const dcfg_header_t *hd = (void *)(JD_DCFG_BASE_ADDR);
    if (!hd || ((uintptr_t)hd) & 3) {
        LOG("invalid ptr");
        return false;
    }

    if (hd->magic0 != DCFG_MAGIC0 || hd->magic1 != DCFG_MAGIC1) {
        LOG("invalid magic");
        return false;
    }

    LOG("inited, %d entries", hd->num_entries);

    dcfg_header = hd;
    return true;
}

void dcfg_validate(void) {
    if (!dcfg_ok())
        JD_PANIC();

    unsigned num = dcfg_header->num_entries;
    entry_t *entries = dcfg_header->entries;

    JD_ASSERT(entries[num].hash == 0xff);
    JD_ASSERT(entries[num].type == 0xff);

    if (num == 0)
        return;

    int prev_hash_idx = -1;

    for (unsigned i = 0; i < num; ++i) {
        unsigned klen = strlen(entries[i].key);
        JD_ASSERT(klen <= DCFG_KEYSIZE);
        JD_ASSERT((jd_hash_fnv1a(entries[i].key, klen) & 0xff) == entries[i].hash);

        JD_ASSERT(i == 0 || entries[i - 1].hash <= entries[i].hash);

        int curr_hidx = entries[i].hash >> DCFG_HASH_SHIFT;
        if (i == 0 || (entries[i - 1].hash >> DCFG_HASH_SHIFT) != curr_hidx) {
            for (prev_hash_idx++; prev_hash_idx < curr_hidx; prev_hash_idx++)
                JD_ASSERT(dcfg_header->hash_jump[prev_hash_idx] == 0);
            JD_ASSERT(dcfg_header->hash_jump[prev_hash_idx] == i + 1);
        }
    }

    LOG("validated OK");
}

unsigned dcfg_num_entries(void) {
    if (dcfg_ok())
        return dcfg_header->num_entries;
    return 0;
}

const dcfg_entry_t *dcfg_get_nth_entry(unsigned idx) {
    if (!dcfg_ok() || idx >= dcfg_header->num_entries)
        return NULL;
    return &dcfg_header->entries[idx];
}

const dcfg_entry_t *dcfg_get_entry(const char *key) {
    if (!key || !dcfg_ok())
        return NULL;
    unsigned len = strlen(key);
    if (len > DCFG_KEYSIZE)
        return NULL;

    unsigned hash = jd_hash_fnv1a(key, len) & 0xff;
    unsigned hidx = hash >> DCFG_HASH_SHIFT;
    unsigned idx = dcfg_header->hash_jump[hidx];
    if (idx == 0)
        return NULL;
    idx--;
    unsigned num = dcfg_header->num_entries;
    entry_t *entries = dcfg_header->entries;
    while (idx < num && entries[idx].hash <= hash) {
        if (entries[idx].hash == hash && memcmp(entries[idx].key, key, len) == 0)
            return &entries[idx];
        idx++;
    }
    return NULL;
}

int32_t dcfg_get_i32(const char *key, int32_t defl) {
    entry_t *e = dcfg_get_entry(key);
    switch (e ? e->type : 0) {
    case DCFG_TYPE_U32:
        return e->value > 0x7fffffff ? defl : e->value;
    case DCFG_TYPE_I32:
        return (int32_t)e->value;
    default:
        return defl;
    }
}

uint32_t dcfg_get_u32(const char *key, uint32_t defl) {
    entry_t *e = dcfg_get_entry(key);
    switch (e ? e->type : 0) {
    case DCFG_TYPE_I32:
        return (int32_t)e->value < 0 ? defl : e->value;
    case DCFG_TYPE_U32:
        return e->value;
    default:
        return defl;
    }
}

const char *dcfg_get_string(const char *key, unsigned *sizep) {
    entry_t *e = dcfg_get_entry(key);
    switch (e ? e->type : 0) {
    case DCFG_TYPE_BLOB:
    case DCFG_TYPE_STRING: {
        if (sizep)
            *sizep = e->size;
        return (const char *)dcfg_header + e->value;
    }
    default:
        if (sizep)
            *sizep = 0;
        return NULL;
    }
}

#endif
