#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <pthread.h>
#include <assert.h>
#include <sys/stat.h>

#include "jd_sdk.h"
#include "services/interfaces/jd_flash.h"
#include "devicescript.h"

static uint8_t *flash_base;
#define FLASH_SIZE JD_FSTOR_TOTAL_SIZE

int settings_in_files = 1;

#define FLASH_DIR "tmp"
#define FLASH_FILE "flash.bin"
#define FLASH_PATH FLASH_DIR "/" FLASH_FILE

uintptr_t flash_base_addr(void) {
    JD_ASSERT(flash_base != NULL);
    return (uintptr_t)flash_base;
}

void flash_program(void *dst, const void *src, uint32_t len) {
    JD_ASSERT(flash_base != NULL);
    ptrdiff_t diff = (uint8_t *)dst - (uint8_t *)flash_base;
    JD_ASSERT(((uintptr_t)src & 3) == 0);
    JD_ASSERT(0 <= diff && diff + len <= FLASH_SIZE);
    JD_ASSERT((diff & 7) == 0);
    for (unsigned i = 0; i < len; ++i)
        JD_ASSERT(((uint8_t *)dst)[i] == 0xff);
    memcpy(dst, src, len);
}

void flash_erase(void *page_addr) {
    JD_ASSERT(flash_base != NULL);
    ptrdiff_t diff = (uint8_t *)page_addr - (uint8_t *)flash_base;
    JD_ASSERT(0 <= diff && diff <= FLASH_SIZE - JD_FLASH_PAGE_SIZE);
    JD_ASSERT((diff & (JD_FLASH_PAGE_SIZE - 1)) == 0);
    memset(page_addr, 0xff, JD_FLASH_PAGE_SIZE);
}

void flash_sync() {
#ifndef __EMSCRIPTEN__
    if (settings_in_files) {
        mkdir(FLASH_DIR, 0777);
        FILE *f = fopen(FLASH_PATH, "w");
        if (f) {
            fwrite(flash_base, FLASH_SIZE, 1, f);
            fclose(f);
        } else {
            DMESG("can't write to %s", FLASH_PATH);
        }
    }
#endif
}

void flash_init(void) {
    flash_base = malloc(FLASH_SIZE);
    memset(flash_base, 0x37, FLASH_SIZE);
#ifndef __EMSCRIPTEN__
    if (settings_in_files) {
        FILE *f = fopen(FLASH_PATH, "r");
        if (f) {
            fread(flash_base, FLASH_SIZE, 1, f);
            fclose(f);
        }
    }
#endif
}
