// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "devs_internal.h"

#define LOG_TAG "cfg"
#include "devs_logging.h"

STATIC_ASSERT(sizeof(dcfg_entry_t) == DCFG_ENTRY_SIZE);
STATIC_ASSERT(sizeof(dcfg_header_t) == DCFG_HEADER_SIZE);
STATIC_ASSERT(offsetof(dcfg_header_t, hash_jump) == DCFG_HEADER_HASH_JUMP_OFFSET);
STATIC_ASSERT(offsetof(dcfg_header_t, entries) == DCFG_HEADER_SIZE);

#ifdef JD_DCFG_BASE_ADDR

static bool dcfg_inited;
static const dcfg_header_t *dcfg_header;

typedef const dcfg_entry_t entry_t;

static bool dcfg_ok(void) {
    if (dcfg_inited)
        return dcfg_header != NULL;
    dcfg_inited = true;

    JD_ASSERT(!target_in_irq());

    const dcfg_header_t *hd = (void *)(JD_DCFG_BASE_ADDR);
    if (!hd || ((uintptr_t)hd) & 3) {
        LOG("invalid ptr");
        return false;
    }

    if (hd->magic0 != DCFG_MAGIC0 || hd->magic1 != DCFG_MAGIC1) {
        LOG("invalid magic");
        return false;
    }

    LOG("inited, %d entries, %u bytes", hd->num_entries, hd->total_bytes);

    dcfg_header = hd;
    return true;
}

static uint16_t keyhash(const void *key, unsigned klen) {
    uint32_t h = jd_hash_fnv1a(key, klen);
    return h ^ (h >> 16);
}

void dcfg_validate(void) {
    if (!dcfg_ok())
        JD_PANIC();

    unsigned num = dcfg_header->num_entries;
    entry_t *entries = dcfg_header->entries;
    const uint8_t *data_base = (const uint8_t *)dcfg_header;

    unsigned data_start = sizeof(dcfg_header_t) + sizeof(dcfg_entry_t) * (num + 1);
    unsigned total_bytes = dcfg_header->total_bytes;
    JD_ASSERT(data_start <= total_bytes);

    JD_ASSERT(entries[num].hash == 0xffff);
    JD_ASSERT(entries[num].type_size == 0xffff);

    for (unsigned i = 0; i < DCFG_HASH_JUMP_ENTRIES; ++i) {
        unsigned idx = dcfg_header->hash_jump[i];
        JD_ASSERT(idx <= num);
        JD_ASSERT((entries[idx].hash >> DCFG_HASH_SHIFT) >= i);
        JD_ASSERT(idx == 0 || (entries[idx - 1].hash >> DCFG_HASH_SHIFT) < i);
    }

    if (num == 0)
        return;

    for (unsigned i = 0; i < num; ++i) {
        entry_t *e = &entries[i];
        unsigned klen = strlen(e->key);
        JD_ASSERT(klen <= DCFG_KEYSIZE);
        JD_ASSERT(keyhash(e->key, klen) == e->hash);
        JD_ASSERT(i == 0 || entries[i - 1].hash <= entries[i].hash);

        unsigned size = dcfg_entry_size(e);
        switch (dcfg_entry_type(e)) {
        case DCFG_TYPE_U32:
        case DCFG_TYPE_I32:
            JD_ASSERT(size == 0);
            break;
        case DCFG_TYPE_STRING:
        case DCFG_TYPE_BLOB:
            JD_ASSERT(e->value >= data_start);
            JD_ASSERT(e->value < total_bytes);
            JD_ASSERT(e->value + size < total_bytes);
            JD_ASSERT(data_base[size] == 0x00);
            break;
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

    unsigned hash = keyhash(key, len);
    unsigned hidx = hash >> DCFG_HASH_SHIFT;
    unsigned idx = dcfg_header->hash_jump[hidx];
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
    switch (dcfg_entry_type(e)) {
    case DCFG_TYPE_U32:
        return e->value > 0x7fffffff ? defl : (int32_t)e->value;
    case DCFG_TYPE_I32:
        return (int32_t)e->value;
    default:
        return defl;
    }
}

uint32_t dcfg_get_u32(const char *key, uint32_t defl) {
    entry_t *e = dcfg_get_entry(key);
    switch (dcfg_entry_type(e)) {
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
    switch (dcfg_entry_type(e)) {
    case DCFG_TYPE_BLOB:
    case DCFG_TYPE_STRING: {
        if (sizep)
            *sizep = dcfg_entry_size(e);
        return (const char *)dcfg_header + e->value;
    }
    default:
        if (sizep)
            *sizep = 0;
        return NULL;
    }
}

char *dcfg_idx_key(const char *prefix, unsigned idx, const char *suffix) {
    static char keybuf[DCFG_KEYSIZE + 1];

    unsigned ptr = 0;
    unsigned len;

    if (prefix) {
        len = strlen(prefix);
        if (len > DCFG_KEYSIZE - 1)
            return NULL;
        if (prefix != keybuf)
            memcpy(keybuf, prefix, len);
        ptr += len;
    }

    if (idx > 100)
        return NULL;

    keybuf[ptr++] = 0x80 + idx;

    if (suffix) {
        len = strlen(suffix);
        if (ptr + len > DCFG_KEYSIZE)
            return NULL;
        memcpy(keybuf + ptr, suffix, len);
        ptr += len;
    }

    keybuf[ptr] = 0;
    return keybuf;
}

#endif
