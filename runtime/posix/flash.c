#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <pthread.h>
#include <assert.h>

#include "jd_sdk.h"
#include "services/interfaces/jd_flash.h"
#include "devicescript/devicescript.h"

static devicescriptmgr_cfg_t cfg;

void flash_program(void *dst, const void *src, uint32_t len) {
    JD_ASSERT(cfg.program_base != NULL);
    ptrdiff_t diff = (uint8_t *)dst - (uint8_t *)cfg.program_base;
    JD_ASSERT(((uintptr_t)src & 3) == 0);
    JD_ASSERT(0 <= diff && diff + len <= cfg.max_program_size);
    JD_ASSERT((diff & 7) == 0);
    for (unsigned i = 0; i < len; ++i)
        JD_ASSERT(((uint8_t *)dst)[i] == 0xff);
    memcpy(dst, src, len);
}

void flash_erase(void *page_addr) {
    JD_ASSERT(cfg.program_base != NULL);
    ptrdiff_t diff = (uint8_t *)page_addr - (uint8_t *)cfg.program_base;
    JD_ASSERT(0 <= diff && diff <= cfg.max_program_size - JD_FLASH_PAGE_SIZE);
    JD_ASSERT((diff & (JD_FLASH_PAGE_SIZE - 1)) == 0);
    memset(page_addr, 0xff, JD_FLASH_PAGE_SIZE);
}

void flash_sync() {
    // do nothing
}

void init_devicescript_manager(void) {
    cfg.max_program_size = 32 * 1024;
    cfg.program_base = jd_alloc(cfg.max_program_size);
    devicescriptmgr_init(&cfg);
}
