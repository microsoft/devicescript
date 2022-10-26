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

typedef struct setting {
    struct setting *next;
    char *key;
    char *value;
} setting_t;
static setting_t *settings;

static setting_t *find_entry(const char *key, int create) {
    setting_t *p;
    for (p = settings; p; p = p->next) {
        if (strcmp(p->key, key) == 0)
            return p;
    }
    if (!create)
        return NULL;
    p = jd_alloc(sizeof(setting_t));
    p->next = settings;
    p->key = jd_strdup(key);
    settings = p;
    return p;
}

char *jd_settings_get(const char *key) {
    setting_t *s = find_entry(key, 0);
    return s ? s->value : NULL;
}

int jd_settings_set(const char *key, const char *val) {
    setting_t *s = find_entry(key, 1);
    jd_free(s->value);
    if (val == NULL)
        s->value = NULL;
    else
        s->value = jd_strdup(val);
    return 0;
}
