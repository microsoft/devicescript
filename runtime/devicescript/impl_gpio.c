#include "devs_internal.h"

#include "services/interfaces/jd_pins.h"
#include "services/interfaces/jd_hw_pwr.h"
#include "jacdac/dist/c/gpio.h"
#include "services/interfaces/jd_adc.h"

#define LOG_TAG "GPIO"
// #define VLOGGING 1
#include "devs_logging.h"

#ifndef JD_MAX_PIN_NUM
#define JD_MAX_PIN_NUM 64
#endif

static uint8_t usedpins[JD_MAX_PIN_NUM / 8];
#define MAX_PIN (sizeof(usedpins) * 8 - 1)

static void init_used(void) {
    const dcfg_entry_t *info = NULL;
    memset(usedpins, 0, sizeof(usedpins));
    for (;;) {
        info = dcfg_get_next_entry("", info);
        if (info == NULL)
            break;
        const char *p = strstr(info->key, "pin");
        if (p && p > info->key && (p[-1] == '.' || (uint8_t)p[-1] >= 0x80)) {
            unsigned pin = dcfg_get_pin(info->key);
            if (pin != NO_PIN && pin < (sizeof(usedpins) * 8)) {
                usedpins[pin / 8] |= 1 << (pin & 7);
            }
        }
    }
    LOG("init used done");
}

static bool is_pin_used(int gpio) {
    if (gpio == NO_PIN || gpio < 0 || gpio >= (int)MAX_PIN)
        return false;
    return (usedpins[gpio / 8] & (1 << (gpio & 7))) != 0;
}

static bool valid_pin(const char *name) {
    if (name[5] == '@')
        return false;
    int gpio = dcfg_get_pin(name);
    return gpio != NO_PIN && !is_pin_used(gpio);
}

void devs_gpio_init_dcfg(devs_ctx_t *ctx) {
    if (ctx != NULL) {
        if (ctx->pin_state)
            return;

        init_used();

        unsigned num_pins = 0;
        const dcfg_entry_t *info = NULL;
        for (;;) {
            info = dcfg_get_next_entry("pins.", info);
            if (info == NULL)
                break;
            if (valid_pin(info->key))
                num_pins++;
        }

        LOG("init: %d pins", num_pins);
        ctx->pin_state = devs_try_alloc(ctx, num_pins * sizeof(devs_pin_state_t));
        if (!ctx->pin_state)
            return;
        ctx->num_pins = num_pins;

    } else {
        init_used();
    }

    unsigned idx = 0;
    const dcfg_entry_t *info = NULL;
    for (;;) {
        info = dcfg_get_next_entry("pins.", info);
        if (info == NULL)
            break;

        int gpio = dcfg_get_pin(info->key);

        char keybuf[DCFG_KEYSIZE + 1];
        memcpy(keybuf, info->key, sizeof(keybuf));
        memcpy(keybuf, "sPin", 4);
        int init_val = dcfg_get_i32(keybuf, -1);

        if (init_val == 0 || init_val == 1) {
            LOG("%s(%d) set to %d", keybuf, gpio, init_val);
#if !JD_HOSTED
            pin_set(gpio, init_val);
            pin_setup_output(gpio);
#endif
        } else if (is_pin_used(gpio)) {
            LOG("skip %s -> %d (used)", info->key + 5, gpio);
        }

        if (!valid_pin(info->key))
            continue;

        if (ctx && ctx->pin_state) {
            JD_ASSERT(idx <= ctx->num_pins);
            devs_pin_state_t *p = &ctx->pin_state[idx];
            p->label = info->key + 5;
            p->id = idx;
            p->gpio = gpio;

            LOG("init[%u] %s -> %d (=%d)", p->id, p->label, p->gpio, init_val);

            p->capabilities = JD_GPIO_CAPABILITIES_PULL_UP | JD_GPIO_CAPABILITIES_PULL_DOWN |
                              JD_GPIO_CAPABILITIES_INPUT | JD_GPIO_CAPABILITIES_OUTPUT;

#if JD_ANALOG
            if (adc_can_read_pin(gpio))
                p->capabilities |= JD_GPIO_CAPABILITIES_ANALOG;
#endif

            if (init_val == -1) {
#if !JD_HOSTED
                pin_setup_analog_input(gpio);
#endif
                p->mode = JD_GPIO_MODE_OFF;
            } else {
                p->mode = init_val ? JD_GPIO_MODE_OUTPUT_HIGH : JD_GPIO_MODE_OUTPUT_LOW;
            }
        }

        idx++;
    }

    if (ctx == NULL)
        return;

    devs_map_t *map = (devs_map_t *)devs_get_builtin_object(ctx, DEVS_BUILTIN_OBJECT_GPIO);
    JD_ASSERT(devs_is_map(map));
    for (idx = 0; idx < ctx->num_pins; ++idx) {
        devs_pin_state_t *p = &ctx->pin_state[idx];
        p->obj = devs_value_from_gc_obj(
            ctx, devs_map_try_alloc(
                     ctx, devs_get_builtin_object(ctx, DEVS_BUILTIN_OBJECT_GPIO_PROTOTYPE)));
        // set fields for nicer debug output
        devs_any_set(ctx, p->obj, devs_builtin_string(DEVS_BUILTIN_STRING_GPIO),
                     devs_value_from_int(p->gpio));
        value_t lbl = devs_value_from_gc_obj(
            ctx, devs_string_try_alloc_init(ctx, p->label, strlen(p->label)));
        devs_value_pin(ctx, lbl);
        devs_any_set(ctx, p->obj, devs_builtin_string(DEVS_BUILTIN_STRING_LABEL), lbl);
        // store it in GPIO object
        devs_map_set(ctx, map, lbl, p->obj);
        devs_value_unpin(ctx, lbl);
    }
}

static devs_pin_state_t *get_pin(devs_ctx_t *ctx, value_t self) {
    for (unsigned i = 0; i < ctx->num_pins; ++i) {
        if (ctx->pin_state[i].obj.u64 == self.u64)
            return &ctx->pin_state[i];
    }
    devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_GPIO, self);
    return NULL;
}

value_t prop_GPIO_mode(devs_ctx_t *ctx, value_t self) {
    devs_pin_state_t *p = get_pin(ctx, self);
    return p ? devs_value_from_int(p->mode) : devs_undefined;
}

value_t prop_GPIO_capabilities(devs_ctx_t *ctx, value_t self) {
    devs_pin_state_t *p = get_pin(ctx, self);
    return p ? devs_value_from_int(p->capabilities) : devs_undefined;
}

value_t prop_GPIO_value(devs_ctx_t *ctx, value_t self) {
    devs_pin_state_t *p = get_pin(ctx, self);
    if (!p)
        return devs_undefined;
#if JD_HOSTED
    return devs_undefined;
#else
    int m = p->mode & JD_GPIO_MODE_BASE_MODE_MASK;
    if (m == JD_GPIO_MODE_INPUT) {
        return devs_value_from_int(pin_get(p->gpio));
#if JD_ANALOG
    } else if (m == JD_GPIO_MODE_ANALOG_IN) {
        int v = adc_read_pin(p->gpio);
        return devs_value_from_double(v / 65536.0);
#endif
    } else {
        return devs_undefined;
    }
#endif
}

#if !JD_HOSTED
static inline int pull_from_mode(int mode) {
    switch (mode & 0xf0) {
    case JD_GPIO_MODE_OFF_PULL_UP:
        return PIN_PULL_UP;
    case JD_GPIO_MODE_OFF_PULL_DOWN:
        return PIN_PULL_DOWN;
    default:
        return PIN_PULL_NONE;
    }
}
#endif

void meth1_GPIO_setMode(devs_ctx_t *ctx) {
    devs_pin_state_t *p = get_pin(ctx, devs_arg_self(ctx));
    if (!p)
        return;
    int m = devs_arg_int_defl(ctx, 0, -1);
    int gpio = p->gpio;
    (void)gpio;

    switch (m) {
#if !JD_HOSTED
    case JD_GPIO_MODE_OFF:
    case JD_GPIO_MODE_OFF_PULL_DOWN:
    case JD_GPIO_MODE_OFF_PULL_UP:
        pin_setup_analog_input(gpio);
        pin_set_pull(gpio, pull_from_mode(m));
        break;
    case JD_GPIO_MODE_INPUT:
    case JD_GPIO_MODE_INPUT_PULL_DOWN:
    case JD_GPIO_MODE_INPUT_PULL_UP:
        pin_setup_input(gpio, pull_from_mode(m));
        break;
    case JD_GPIO_MODE_OUTPUT:
    case JD_GPIO_MODE_OUTPUT_HIGH:
    case JD_GPIO_MODE_OUTPUT_LOW:
        pin_set(gpio, pull_from_mode(m) == PIN_PULL_UP);
        pin_setup_output(gpio);
        break;
#endif
#if JD_ANALOG
    case JD_GPIO_MODE_ANALOG_IN:
        if (!adc_can_read_pin(gpio)) {
            devs_throw_expecting_error_ext(ctx, "analog pin", devs_arg_self(ctx));
            return;
        }
        pin_setup_analog_input(gpio);
        break;
#endif
    default:
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_MODE, devs_arg(ctx, 0));
        return;
    }
    p->mode = m;
}
