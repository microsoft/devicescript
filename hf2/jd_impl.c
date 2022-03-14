#include "jd_sdk.h"

#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>

#include "interfaces/jd_hw.h"

const char app_dev_class_name[] = "jacdac-posix device";
const char app_fw_version[] = "0.0.0";
uint32_t app_get_device_class(void) {
    return 0x3fe5b46f;
}

uint32_t now;

void hw_panic(void) {
    abort();
}

STATIC_ASSERT(sizeof(char) == 1);

static uint64_t cached_devid;
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
            jd_panic();

        cached_devid = ((uint64_t)jd_hash_fnv1a(buf, bufsz) << 32) |
                       ((uint64_t)jd_hash_fnv1a(buf + 4, bufsz - 4));
    }

    return cached_devid;
}

void jd_status(int status) {}

void jd_alloc_stack_check() {}

void *jd_alloc(uint32_t size) {
    void *p = malloc(size);
    if (!p)
        abort();
    memset(p, 0, size);
    return p;
}

void jd_free(void *p) {
    free(p);
}

void target_reset() {
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

uint64_t tim_get_micros() {
    static uint64_t starttime;
    if (!starttime) {
        starttime = getmicros() - 23923;
    }
    return getmicros() - starttime;
}

void pwr_enter_no_sleep(void) {}

int target_in_irq(void) {
    return 0;
}