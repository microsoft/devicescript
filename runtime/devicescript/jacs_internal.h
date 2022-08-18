#pragma once

#include "jacscript.h"

#include "jd_protocol.h"
#include "jd_client.h"
#include "jacdac/dist/c/jacscriptcondition.h"
#include "jacdac/dist/c/jacscriptmanager.h"

#include "jacs_format.h"
#include "jacs_img.h"
#include "jacs_regcache.h"
#include "jacs_pack.h"
#include "jacs_trace.h"

// this can't be more than a week; unit = ms
#define JACS_MAX_REG_VALIDITY (15 * 60 * 1000)
#define JACS_MAX_STEPS (128 * 1024)
#define JACS_NO_ROLE 0xffff

typedef struct jacs_activation jacs_activation_t;

#define JACS_PKT_KIND_NONE 0
#define JACS_PKT_KIND_REG_GET 1
#define JACS_PKT_KIND_SEND_PKT 2
#define JACS_PKT_KIND_LOGMSG 3

typedef struct jacs_fiber {
    struct jacs_fiber *next;

    union {
        struct {
            uint8_t *data;
            uint8_t size;
        } send_pkt;
        struct {
            uint16_t string_idx;
            uint16_t resend_timeout;
        } reg_get;
        struct {
            uint16_t string_idx;
            uint8_t num_args;
        } logmsg;
    } pkt_data;

    uint8_t pkt_kind : 4;

    uint8_t pending : 1;
    uint8_t role_wkp : 1;
    uint8_t reserved_flag : 2;

    uint16_t role_idx;
    uint16_t service_command;

    uint16_t bottom_function_idx; // the id of function at the bottom of the stack

    uint32_t wake_time;

    value_t ret_val;

    jacs_activation_t *activation;
    struct jacs_ctx *ctx;
} jacs_fiber_t;

#define JACS_CTX_FLAG_BUSY 0x0001
#define JACS_CTX_LOGGING_ENABLED 0x0002
#define JACS_CTX_FREEING_ROLES 0x0004
#define JACS_CTX_TRACE_DISABLED 0x0008

struct jacs_ctx {
    value_t *globals;

    uint16_t flags;
    uint16_t error_code;
    uint16_t error_pc;

    jacs_img_t img;

    jacs_activation_t *curr_fn;
    jacs_fiber_t *curr_fiber;

    jacs_fiber_t *fibers;
    jd_role_t **roles;

    uint32_t *buffers;

    uint32_t _now;
    uint32_t _logged_now;

    uint32_t log_counter;
    uint32_t log_counter_to_send;

    jacs_cfg_t cfg;

    union {
        jd_frame_t frame;
        jd_packet_t packet;
    };

    jacs_regcache_t regcache;
};

struct jacs_activation {
    uint16_t pc;
    uint16_t maxpc;
    jacs_activation_t *caller;
    jacs_fiber_t *fiber;
    const jacs_function_desc_t *func;
    value_t *params;
    uint8_t num_params;
    uint8_t params_is_copy : 1;
    value_t locals[0];
};

#define oops() jd_panic()

static inline uint32_t jacs_now(jacs_ctx_t *ctx) {
    return ctx->_now;
}
static inline bool jacs_trace_enabled(jacs_ctx_t *ctx) {
    return (ctx->flags & JACS_CTX_TRACE_DISABLED) == 0;
}

void jacs_panic(jacs_ctx_t *ctx, unsigned code);
value_t jacs_runtime_failure(jacs_ctx_t *ctx);

// strformat.c
size_t jacs_strformat(const char *fmt, size_t fmtlen, char *dst, size_t dstlen, value_t *args,
                      size_t numargs, size_t numskip);

// jdiface.c
bool jacs_jd_should_run(jacs_fiber_t *fiber);
void jacs_jd_wake_role(jacs_ctx_t *ctx, unsigned role_idx);
void jacs_jd_send_cmd(jacs_ctx_t *ctx, unsigned role_idx, unsigned code);
void jacs_jd_get_register(jacs_ctx_t *ctx, unsigned role_idx, unsigned code, unsigned timeout,
                          unsigned arg);
void jacs_jd_process_pkt(jacs_ctx_t *ctx, jd_device_service_t *serv, jd_packet_t *pkt);
void jacs_jd_reset_packet(jacs_ctx_t *ctx);
void jacs_jd_init_roles(jacs_ctx_t *ctx);
void jacs_jd_free_roles(jacs_ctx_t *ctx);
void jacs_jd_role_changed(jacs_ctx_t *ctx, jd_role_t *role);
void jacs_jd_clear_pkt_kind(jacs_fiber_t *fib);
void jacs_jd_send_logmsg(jacs_ctx_t *ctx, unsigned string_idx, unsigned num_args);

// fibers.c
void jacs_fiber_set_wake_time(jacs_fiber_t *fiber, unsigned time);
void jacs_fiber_sleep(jacs_fiber_t *fiber, unsigned time);
void jacs_fiber_yield(jacs_ctx_t *ctx);
void jacs_fiber_call_function(jacs_fiber_t *fiber, unsigned fidx, value_t *params, unsigned numargs);
void jacs_fiber_return_from_call(jacs_activation_t *act);
void jacs_fiber_start(jacs_ctx_t *ctx, unsigned fidx, value_t *params, unsigned numargs, unsigned op);
void jacs_fiber_run(jacs_fiber_t *fiber);
void jacs_fiber_poke(jacs_ctx_t *ctx);
void jacs_fiber_sync_now(jacs_ctx_t *ctx);
void jacs_fiber_free_all_fibers(jacs_ctx_t *ctx);

// step.c
void jacs_act_step(jacs_activation_t *frame);
value_t *jacs_act_saved_regs_ptr(jacs_activation_t *act);

// math.c
value_t jacs_step_unop(int op, value_t v);
value_t jacs_step_binop(int op, value_t a, value_t b);
value_t jacs_step_opmath1(int op, value_t a);
value_t jacs_step_opmath2(int op, value_t a, value_t b);

value_t jacs_buffer_op(jacs_activation_t *frame, uint16_t fmt0, uint16_t offset, uint16_t buffer,
                       value_t *setv);
void *jacs_buffer_ptr(jacs_ctx_t *ctx, unsigned idx);
double jacs_read_number(void *data, unsigned bufsz, uint16_t fmt0);

// aggbuffer.c
void aggbuffer_init(const jacscloud_api_t *api);
int aggbuffer_flush(void);
int aggbuffer_upload(const char *label, jd_device_service_t *service,
                     jd_timeseries_aggregator_stored_report_t *data);
