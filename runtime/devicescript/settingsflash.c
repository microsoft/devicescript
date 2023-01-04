#include "services/jd_services.h"
#include "services/interfaces/jd_flash.h"
#include "jd_client.h"
#include "devicescript/devicescript.h"

#ifndef JD_FLASH_IN_SETTINGS
#define JD_FLASH_IN_SETTINGS 0
#endif

#if JD_FLASH_IN_SETTINGS

static devicescriptmgr_cfg_t cfg;
static bool is_erased;
static uint8_t *max_write;

#define KEY "devs_prog"

void flash_program(void *dst, const void *src, uint32_t len) {
    JD_ASSERT(cfg.program_base != NULL);
    ptrdiff_t diff = (uint8_t *)dst - (uint8_t *)cfg.program_base;
    JD_ASSERT(((uintptr_t)src & 3) == 0);
    JD_ASSERT(0 <= diff && diff + len <= cfg.max_program_size);
    JD_ASSERT((diff & 7) == 0);
    for (unsigned i = 0; i < len; ++i)
        JD_ASSERT(((uint8_t *)dst)[i] == 0xff);
    memcpy(dst, src, len);

    uint8_t *endp = (uint8_t *)dst + len;
    if (!max_write || endp > max_write)
        max_write = endp;
}

void flash_erase(void *page_addr) {
    JD_ASSERT(cfg.program_base != NULL);
    ptrdiff_t diff = (uint8_t *)page_addr - (uint8_t *)cfg.program_base;
    JD_ASSERT(0 <= diff && diff <= cfg.max_program_size - JD_FLASH_PAGE_SIZE);
    JD_ASSERT((diff & (JD_FLASH_PAGE_SIZE - 1)) == 0);
    memset(page_addr, 0xff, JD_FLASH_PAGE_SIZE);

    if (!is_erased) {
        is_erased = 1;
        max_write = cfg.program_base;
        DMESG("removing flash entry");
        jd_settings_set_bin(KEY, NULL, 0);
    }
}

void devicescriptmgr_init_mem(unsigned size) {
    cfg.max_program_size = size;
    cfg.program_base = jd_alloc(cfg.max_program_size);
    devicescriptmgr_init(&cfg);
    jd_settings_get_bin(KEY, cfg.program_base, cfg.max_program_size);
}

void flash_sync(void) {
    unsigned sz = max_write - (uint8_t *)cfg.program_base;
    DMESG("writing %d bytes to flash", sz);
    jd_settings_set_bin(KEY, cfg.program_base, sz);
    is_erased = 0;
}

#endif

__attribute__((weak)) char *jd_settings_get(const char *key) {
    uint8_t tmp[32];
    int size = jd_settings_get_bin(key, tmp, sizeof(tmp));
    if (size < 0)
        return NULL;
    char *r = jd_alloc(size + 1);
    if (size <= (int)sizeof(tmp)) {
        memcpy(r, tmp, size);
    } else {
        jd_settings_get_bin(key, r, size);
    }
    return r;
}

__attribute__((weak)) int jd_settings_set(const char *key, const char *val) {
    return jd_settings_set_bin(key, val, val ? strlen(val) : 0);
}
