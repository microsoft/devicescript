#include "jd_sdk.h"

#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>
#include <pthread.h>
#include <sys/stat.h>

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

typedef struct setting {
    struct setting *next;
    char *key;
    uint8_t *valptr;
    unsigned valsize;
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

#ifndef __EMSCRIPTEN__
int settings_in_files = 1;
static FILE *open_key(const char *key, int wr) {
    if (strchr(key, '/') || strchr(key, '\\') || strlen(key) > 32)
        return NULL;
    mkdir("tmp", 0777);
    mkdir("tmp/settings", 0700);
    char *path = jd_sprintf_a("tmp/settings/%s", key);
    FILE *f = NULL;
    if (wr == 2) {
        unlink(path);
    } else {
        f = fopen(path, wr ? "w" : "r");
    }
    jd_free(path);
    return f;
}
static int jd_settings_get_bin_f(const char *key, void *dst, unsigned space) {
    FILE *f = open_key(key, 0);
    if (!f)
        return -1;
    fseek(f, 0, SEEK_END);
    unsigned size = ftell(f);
    if (size > 0 && space >= size) {
        fseek(f, 0, SEEK_SET);
        int r = fread(dst, size, 1, f);
        if (r != 1)
            DMESG("rd err r=%d sz=%u", r, size);
    }
    fclose(f);
    return size;
}
static int jd_settings_set_bin_f(const char *key, const void *val, unsigned size) {
    int r = -1;
    FILE *f = open_key(key, val == NULL ? 2 : 1);
    if (val == NULL)
        return 0;
    if (f && fwrite(val, size, 1, f) == 1) {
        r = 0;
    }
    if (f)
        fclose(f);
    return r;
}
#endif

int jd_settings_get_bin(const char *key, void *dst, unsigned space) {
#ifndef __EMSCRIPTEN__
    if (settings_in_files)
        return jd_settings_get_bin_f(key, dst, space);
#endif
    setting_t *s = find_entry(key, 0);
    if (!s || !s->valptr)
        return -1;
    unsigned sz = s->valsize;
    if (space < sz)
        sz = space;
    if (sz)
        memcpy(dst, s->valptr, sz);
    return s->valsize;
}

int jd_settings_set_bin(const char *key, const void *val, unsigned size) {
#ifndef __EMSCRIPTEN__
    if (settings_in_files)
        return jd_settings_set_bin_f(key, val, size);
#endif
    setting_t *s = find_entry(key, 1);
    jd_free(s->valptr);
    if (val == NULL) {
        s->valptr = NULL;
        s->valsize = 0;
    } else {
        s->valptr = jd_memdup(val, size);
        s->valsize = size;
    }
    return 0;
}
