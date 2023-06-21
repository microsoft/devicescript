#include "services/jd_services.h"
#include "services/interfaces/jd_flash.h"
#include "jd_client.h"
#include "devicescript.h"

uint8_t *jd_settings_get_bin_a(const char *key, unsigned *sizep) {
    uint8_t tmp[32];
    int size = jd_settings_get_bin(key, tmp, sizeof(tmp));
    if (size < 0) {
        if (sizep)
            *sizep = 0;
        return NULL;
    }

    uint8_t *r = jd_alloc(size + 1);
    if (size <= (int)sizeof(tmp)) {
        memcpy(r, tmp, size);
    } else {
        jd_settings_get_bin(key, r, size);
    }
    if (sizep)
        *sizep = size;
    return r;
}

__attribute__((weak)) char *jd_settings_get(const char *key) {
    return (char *)jd_settings_get_bin_a(key, NULL);
}

__attribute__((weak)) int jd_settings_set(const char *key, const char *val) {
    return jd_settings_set_bin(key, val, val ? strlen(val) : 0);
}
