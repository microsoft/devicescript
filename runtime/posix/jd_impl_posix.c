#ifndef __EMSCRIPTEN__

#include "jd_sdk.h"

#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <time.h>
#include <sys/time.h>

#include "interfaces/jd_hw.h"

#define LOG(msg, ...) DMESG("%s: " msg, __func__, ##__VA_ARGS__)

uint64_t cached_devid;
uint64_t hw_device_id(void) {
    if (!cached_devid) {
        char buf[100];
        unsigned bufsz = 0;

#if defined(__APPLE__)
        extern int gethostuuid(uuid_t id, const struct timespec *wait);
        uuid_t uuid;
        struct timespec timeout = {1, 0}; // 1sec
        memset(uuid, 0, sizeof(uuid));
        gethostuuid(uuid, &timeout);
        bufsz = sizeof(uuid);
        memcpy(buf, uuid, bufsz);
#elif defined(__linux__)
        FILE *f = fopen("/sys/class/dmi/id/product_uuid", "r");
        if (f != NULL) {
            int len = fread(buf, 1, sizeof buf, f);
            if (len >= 10)
                bufsz = len;
            fclose(f);
        }
#endif

        if (bufsz == 0) {
            buf[0] = 0;
            gethostname(buf, sizeof buf);
            bufsz = strlen(buf);
            if (bufsz > 0 && bufsz < 5) {
                strcpy(buf + bufsz, "+padding");
                bufsz = strlen(buf);
            }
        }

        if (bufsz < 5)
            JD_PANIC();

        cached_devid = ((uint64_t)jd_hash_fnv1a(buf, bufsz) << 32) |
                       ((uint64_t)jd_hash_fnv1a(buf + 4, bufsz - 4));
    }

    return cached_devid;
}

void target_reset(void) {
    DMESG("target reset");
    exit(0);
}

void target_wait_us(uint32_t us) {
    struct timespec ts;
    ts.tv_sec = us / 1000000;
    ts.tv_nsec = (us % 1000000) * 1000;
    while (nanosleep(&ts, &ts))
        ;
}

static uint64_t getmicros(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000000LL + tv.tv_usec;
}

uint64_t tim_get_micros(void) {
    static uint64_t starttime;
    if (!starttime) {
        starttime = getmicros() - 23923;
    }
    return getmicros() - starttime;
}

#define MAX_FILES 3
#define MAX_SIZE_SHIFT (27) // bytes
#define MAX_FILE_SIZE (1 << MAX_SIZE_SHIFT)
#define SECTOR_SHIFT 9

typedef struct {
    FILE *f;
    uint32_t num_sectors;
    uint32_t sector_off;
} jd_file_t;

static jd_file_t files[MAX_FILES];

int jd_f_create(const char *name, uint32_t *size, uint32_t *sector_off) {
    if (strchr(name, '/') || strchr(name, '\\'))
        return -1;
    if (*size > MAX_FILE_SIZE)
        return -2;
    int i;
    for (i = 0; i < MAX_FILES; ++i) {
        if (!files[i].f)
            break;
    }
    if (i >= MAX_FILES)
        return -3;
    FILE *f = fopen(name, "rb+");
    if (!f)
        f = fopen(name, "wb+");
    if (!f) {
        LOG("err: can't open '%s'", name);
        return -4;
    }

    fseek(f, 0, SEEK_END);
    unsigned sz = ftell(f);
    if (sz < *size) {
        int block = 64 * 1024;
        char *tmp = jd_alloc(block);
        while (sz < *size) {
            if (fwrite(tmp, block, 1, f) != 1) {
                fclose(f);
                LOG("err: write");
                return -5;
            }
            sz += block;
        }
        jd_free(tmp);
    }

    fflush(f);

    sz = ftell(f);
    if (sz < *size) {
        LOG("err: pos!");
        fclose(f);
        return -6;
    }

    *size = sz;
    *sector_off = i << (MAX_SIZE_SHIFT - SECTOR_SHIFT);
    files[i].f = f;
    files[i].num_sectors = *size >> SECTOR_SHIFT;
    files[i].sector_off = *sector_off;

    return 0;
}

#include "storage/ff/ff.h"
#include "storage/ff/diskio.h"

DRESULT ff_disk_read(BYTE pdrv, BYTE *buff, LBA_t sector, UINT count) {
    (void)pdrv;
    unsigned fd = sector >> (MAX_SIZE_SHIFT - SECTOR_SHIFT);
    if (fd >= MAX_FILES) {
        LOG("err: fd=%d", fd);
        return RES_PARERR;
    }

    sector -= files[fd].sector_off;
    if (sector > files[fd].num_sectors) {
        LOG("err: sector=%d", fd);
        return RES_PARERR;
    }

    FILE *f = files[fd].f;
    if (fseek(f, sector << SECTOR_SHIFT, SEEK_SET) != 0) {
        LOG("err: seek");
        return RES_ERROR;
    }
    int r = fread(buff, count << SECTOR_SHIFT, 1, f);
    if (r != 1) {
        LOG("err: read %d", r);
        return RES_ERROR;
    }
    return RES_OK;
}

DRESULT ff_disk_write(BYTE pdrv, const BYTE *buff, LBA_t sector, UINT count) {
    (void)pdrv;
    unsigned fd = sector >> (MAX_SIZE_SHIFT - SECTOR_SHIFT);
    if (fd >= MAX_FILES)
        return RES_PARERR;

    sector -= files[fd].sector_off;
    if (sector > files[fd].num_sectors)
        return RES_PARERR;

    FILE *f = files[fd].f;
    if (fseek(f, sector << SECTOR_SHIFT, SEEK_SET) != 0)
        return RES_ERROR;
    if (fwrite(buff, count << SECTOR_SHIFT, 1, f) != 1)
        return RES_ERROR;
    if (fflush(f) != 0)
        return RES_ERROR;
    return RES_OK;
}

#endif