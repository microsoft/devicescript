#pragma once

#if defined(__GNUC__) && __GNUC__ >= 10
#pragma GCC diagnostic ignored "-Wzero-length-bounds"
#endif

#include "devicescript.h"

#include "jd_protocol.h"
#include "jd_client.h"
#include "jacdac/dist/c/devicescriptcondition.h"
#include "jacdac/dist/c/devicescriptmanager.h"

#include "devs_format.h"
#include "devs_img.h"
#include "devs_regcache.h"
#include "devs_pack.h"
#include "devs_trace.h"
#include "devs_objects.h"

// this can't be more than a week; unit = ms
#define JACS_MAX_REG_VALIDITY (15 * 60 * 1000)
#define JACS_MAX_STEPS (128 * 1024)
#define JACS_NO_ROLE 0xffff

typedef struct devs_activation devs_activation_t;

#define JACS_PKT_KIND_NONE 0
#define JACS_PKT_KIND_REG_GET 1
#define JACS_PKT_KIND_SEND_PKT 2
#define JACS_PKT_KIND_LOGMSG 3

typedef struct devs_fiber {
    struct devs_fiber *next;

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
            uint16_t localsidx;
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

    uint32_t handle_tag;

    value_t ret_val;

    devs_activation_t *activation;
    struct devs_ctx *ctx;
} devs_fiber_t;

#define JACS_CTX_FLAG_BUSY 0x0001
#define JACS_CTX_LOGGING_ENABLED 0x0002
#define JACS_CTX_FREEING_ROLES 0x0004
#define JACS_CTX_TRACE_DISABLED 0x0008

struct devs_ctx {
    value_t *globals;
    uint16_t opstack;
    uint16_t flags;
    uint16_t error_code;
    uint16_t error_pc;

    value_t binop[2];
    double binop_f[2];

    uint16_t jmp_pc;

    uint8_t stack_top;
    uint8_t stack_top_for_gc;
    uint32_t literal_int;
    value_t the_stack[JACS_MAX_STACK_DEPTH];

    devs_img_t img;

    devs_activation_t *curr_fn;
    devs_fiber_t *curr_fiber;

    devs_fiber_t *fibers;
    jd_role_t **roles;

    uint32_t *buffers;

    uint64_t _now_long;
    uint32_t _logged_now;

    uint32_t log_counter;
    uint32_t log_counter_to_send;

    uint32_t fiber_handle_tag;

    devs_gc_t *gc;

    devs_cfg_t cfg;

    union {
        jd_frame_t frame;
        jd_packet_t packet;
    };

    devs_regcache_t regcache;
};

struct devs_activation {
    uint16_t pc;
    uint16_t maxpc;
    devs_activation_t *caller;
    devs_fiber_t *fiber;
    const devs_function_desc_t *func;
    value_t *params;
    uint8_t num_params;
    uint8_t params_is_copy : 1;
    value_t locals[0];
};

static inline uint32_t devs_now(devs_ctx_t *ctx) {
    return (uint32_t)ctx->_now_long;
}
static inline bool devs_trace_enabled(devs_ctx_t *ctx) {
    return (ctx->flags & JACS_CTX_TRACE_DISABLED) == 0;
}

void devs_panic(devs_ctx_t *ctx, unsigned code);
value_t _devs_runtime_failure(devs_ctx_t *ctx, unsigned code);
// next error 60140
static inline value_t devs_runtime_failure(devs_ctx_t *ctx, unsigned code) {
    return _devs_runtime_failure(ctx, code - 60000);
}

// strformat.c
size_t devs_strformat(const char *fmt, size_t fmtlen, char *dst, size_t dstlen, value_t *args,
                      size_t numargs, size_t numskip);

// jdiface.c
bool devs_jd_should_run(devs_fiber_t *fiber);
void devs_jd_wake_role(devs_ctx_t *ctx, unsigned role_idx);
void devs_jd_send_cmd(devs_ctx_t *ctx, unsigned role_idx, unsigned code);
void devs_jd_get_register(devs_ctx_t *ctx, unsigned role_idx, unsigned code, unsigned timeout,
                          unsigned arg);
void devs_jd_process_pkt(devs_ctx_t *ctx, jd_device_service_t *serv, jd_packet_t *pkt);
void devs_jd_reset_packet(devs_ctx_t *ctx);
void devs_jd_init_roles(devs_ctx_t *ctx);
void devs_jd_free_roles(devs_ctx_t *ctx);
void devs_jd_role_changed(devs_ctx_t *ctx, jd_role_t *role);
void devs_jd_clear_pkt_kind(devs_fiber_t *fib);
void devs_jd_send_logmsg(devs_ctx_t *ctx, unsigned string_idx, unsigned localsidx,
                         unsigned num_args);

// fibers.c
void devs_fiber_set_wake_time(devs_fiber_t *fiber, unsigned time);
void devs_fiber_sleep(devs_fiber_t *fiber, unsigned time);
void devs_fiber_termiante(devs_fiber_t *fiber);
void devs_fiber_yield(devs_ctx_t *ctx);
void devs_fiber_copy_params(devs_activation_t *frame);
void devs_fiber_call_function(devs_fiber_t *fiber, unsigned fidx, value_t *params,
                              unsigned numargs);
void devs_fiber_return_from_call(devs_activation_t *act);
devs_fiber_t *devs_fiber_start(devs_ctx_t *ctx, unsigned fidx, value_t *params, unsigned numargs,
                               unsigned op);
devs_fiber_t *devs_fiber_by_tag(devs_ctx_t *ctx, unsigned tag);
devs_fiber_t *devs_fiber_by_fidx(devs_ctx_t *ctx, unsigned fidx);
void devs_fiber_run(devs_fiber_t *fiber);
void devs_fiber_poke(devs_ctx_t *ctx);
void devs_fiber_sync_now(devs_ctx_t *ctx);
void devs_fiber_free_all_fibers(devs_ctx_t *ctx);

// vm_main.c
void devs_vm_exec_opcodes(devs_ctx_t *ctx);

value_t devs_buffer_op(devs_activation_t *frame, uint32_t fmt0, uint32_t offset, value_t buffer,
                       value_t *setv);
double devs_read_number(void *data, unsigned bufsz, uint16_t fmt0);

void *devs_try_alloc(devs_ctx_t *ctx, uint32_t size);
void devs_free(devs_ctx_t *ctx, void *ptr);
void devs_oom(devs_ctx_t *ctx, unsigned size);

#define TODO() JD_ASSERT(0)
