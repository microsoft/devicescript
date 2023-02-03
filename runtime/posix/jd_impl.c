#include "jd_sdk.h"

#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>
#include <pthread.h>
#include <sys/stat.h>

#include "interfaces/jd_hw.h"

const char app_fw_version[] = "0.0.0";

uint32_t now;

void hw_panic(void) {
    abort();
}

STATIC_ASSERT(sizeof(char) == 1);

// TODO expose these somehow?
uint8_t jd_connected_blink = JD_BLINK_CONNECTED;
void jd_blink(uint8_t encoded) {}
void jd_glow(uint32_t glow) {}

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

void pwr_enter_no_sleep(void) {}

static pthread_mutex_t irq_mut = PTHREAD_MUTEX_INITIALIZER;

int target_in_irq(void) {
    return 0;
}

void target_disable_irq(void) {
    pthread_mutex_lock(&irq_mut);
}

void target_enable_irq(void) {
    pthread_mutex_unlock(&irq_mut);
}

uint64_t jd_device_id_from_string(const char *str) {
    uint64_t devid;
    if (strlen(str) == 16 && jd_from_hex(&devid, str) == 8) {
        // set directly
        return devid;
    } else {
        int bufsz = strlen(str);
        return ((uint64_t)jd_hash_fnv1a(str, bufsz) << 32) |
               ((uint64_t)jd_hash_fnv1a(str + 1, bufsz - 1));
    }
}
