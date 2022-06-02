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

int target_in_irq(void) {
    return 0;
}

void target_enable_irq(void) {}
void target_disable_irq(void) {}
