#pragma once

#include "jacs_exec.h"
#include <assert.h>
#include "jacdac/dist/c/jacscriptcondition.h"

// this can't be more than a week; unit = ms
#define JACS_MAX_REG_VALIDITY (15 * 60 * 1000)

typedef struct jacs_activation jacs_activation_t;

typedef struct {
    jd_device_service_t *service;
} jacs_role_t;

#define JACS_FIBER_FLAG_SLEEPING_ON_REG 0x01
#define JACS_FIBER_FLAG_SLEEPING_ON_ROLE 0x02
#define JACS_FIBER_FLAG_PENDING 0x04

typedef struct jacs_fiber {
    struct jacs_fiber *next;

    uint8_t *payload;
    uint8_t payload_size;

    uint8_t flags;

    uint16_t role_idx;
    uint16_t service_command;
    uint16_t command_arg;

    uint16_t bottom_function_idx; // the id of function at the bottom of the stack

    uint32_t wake_time;
    uint16_t resend_timeout;

    jacs_activation_t *activation;
    struct jacs_ctx *ctx;
} jacs_fiber_t;

typedef struct jacs_ctx {
    value_t registers[JACS_NUM_REGS];
    union {
        uint16_t a, b, c, d;
        uint16_t params[4];
    };
    value_t *globals;

    uint16_t error_code;

    uint8_t wake_times_updated;

    jacs_img_t img;

    jacs_activation_t *curr_fn;
    jacs_fiber_t *curr_fiber;

    jacs_fiber_t *fibers;
    jacs_role_t *roles;

    union {
        jd_frame_t frame;
        jd_packet_t packet;
    };
} jacs_ctx_t;

struct jacs_activation {
    jacs_activation_t *caller;
    jacs_fiber_t *fiber;
    const jacs_function_desc_t *func;
    uint16_t saved_regs;
    uint16_t pc;
    value_t locals[0];
};

static inline jd_device_service_t *jacs_ctx_role_binding(jacs_ctx_t *ctx,
                                                         const jacs_role_desc_t *role) {
    uint32_t idx = role - jacs_img_get_role(&ctx->img, 0);
    return ctx->roles[idx].service;
}

#define oops() assert(false)

void jacs_fiber_set_wake_time(jacs_fiber_t *fiber, unsigned time);
void jacs_fiber_sleep(jacs_fiber_t *fiber, unsigned time);
void jacs_ctx_yield(jacs_ctx_t *ctx);
void jacs_ctx_send_cmd(jacs_ctx_t *ctx, unsigned role_idx, unsigned code);
void jacs_ctx_get_jd_register(jacs_ctx_t *ctx, unsigned role_idx, unsigned code, unsigned timeout,
                              unsigned arg);
void jacs_fiber_call_function(jacs_fiber_t *fiber, unsigned fidx, unsigned numargs);
void jacs_act_return_from_call(jacs_activation_t *act);
void jacs_ctx_start_fiber(jacs_ctx_t *ctx, unsigned fidx, unsigned numargs, unsigned op);
void jacs_ctx_panic(jacs_ctx_t *ctx, unsigned code);
void jacs_act_activate(jacs_activation_t *act);
void jacs_wake_role(jacs_ctx_t *ctx, unsigned role_idx);

void jacs_act_step(jacs_activation_t *frame);
void jacs_act_restore_regs(jacs_activation_t *act);

#include "jacs_regcache.h"
