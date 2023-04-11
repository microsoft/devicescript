#pragma once

#if defined(__GNUC__) && __GNUC__ >= 10
#pragma GCC diagnostic ignored "-Wzero-length-bounds"
#endif

#include "devicescript.h"

#include "jd_protocol.h"
#include "jd_client.h"
#include "jacdac/dist/c/devicescriptcondition.h"
#include "jacdac/dist/c/devicescriptmanager.h"
#include "jacdac/dist/c/devicescriptdebugger.h"

#include "devs_format.h"
#include "devs_img.h"
#include "devs_regcache.h"
#include "devs_pack.h"
#include "devs_trace.h"
#include "devs_objects.h"

// this can't be more than a week; unit = ms
#define DEVS_MAX_REG_VALIDITY (15 * 60 * 1000)
#define DEVS_MAX_STEPS (128 * 1024)
#define DEVS_NO_ROLE 0xffff

#define DEVS_MAX_STACK_TRACE_FRAMES 16

typedef struct devs_activation devs_activation_t;

#define DEVS_PKT_KIND_NONE 0
#define DEVS_PKT_KIND_REG_GET 1
#define DEVS_PKT_KIND_SEND_PKT 2
#define DEVS_PKT_KIND_ROLE_WAIT 3
#define DEVS_PKT_KIND_SUSPENDED 4
#define DEVS_PKT_KIND_SEND_RAW_PKT 5

typedef void (*devs_resume_cb_t)(devs_ctx_t *ctx, void *userdata);

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
        value_t v;
    } pkt_data;

    uint8_t pkt_kind : 4;

    uint8_t pending : 1;
    uint8_t role_wkp : 1;
    uint8_t reserved_flag : 2;

    uint8_t stack_depth;

    uint16_t role_idx;
    uint16_t service_command;

    uint16_t bottom_function_idx; // the id of function at the bottom of the stack

    uint32_t wake_time;

    uint32_t handle_tag;

    value_t ret_val;

    devs_activation_t *activation;
    struct devs_ctx *ctx;

    devs_resume_cb_t resume_cb;
    void *resume_data;
} devs_fiber_t;

static inline bool devs_fiber_uses_pkt_data_v(devs_fiber_t *fib) {
    // return fib->pkt_kind == DEVS_PKT_KIND_SEND_RAW_PKT;
    return false;
}

#define DEVS_CTX_FLAG_BUSY 0x01
#define DEVS_CTX_LOGGING_ENABLED 0x02
#define DEVS_CTX_FREEING_ROLES 0x04
#define DEVS_CTX_TRACE_DISABLED 0x08
#define DEVS_CTX_PENDING_RESUME 0x10

#define DEVS_CTX_STEP_EN 0x01
#define DEVS_CTX_STEP_BRK 0x02
#define DEVS_CTX_STEP_IN 0x04
#define DEVS_CTX_STEP_OUT 0x08
#define DEVS_CTX_STEP_HALT 0x80

typedef struct {
    jd_role_t *role;
    devs_map_t *dynproto;
    devs_map_t *attached;
} devs_role_t;

#define DEVS_BRK_FLAG_STEP 0x01
typedef struct {
    devs_pc_t pc;
    uint8_t flags;
    uint8_t reserved;
} devs_brk_t;

// has to be power of 2
#define DEVS_BRK_HASH_SIZE 32
// has to be under 0xff
#define DEVS_BRK_MAX_COUNT 0xf0

#define DEVS_DBG_BRK_UNHANDLED_EXN 0x01
#define DEVS_DBG_BRK_HANDLED_EXN 0x02

struct devs_ctx {
    value_t *globals;
    uint16_t opstack;
    uint8_t flags;
    uint8_t step_flags;
    uint16_t error_code;
    devs_pc_t error_pc;

    value_t binop[2];
    double binop_f[2];

    value_t diag_field;
    value_t exn_val;

    devs_pc_t jmp_pc;

    uint8_t stack_top;
    uint8_t stack_top_for_gc;
    uint8_t _num_builtin_protos;
    uint8_t in_throw;
    uint8_t suspension;
    uint8_t dbg_en;
    uint8_t ignore_brk;
    uint8_t dbg_flags;

    uint32_t literal_int;
    value_t the_stack[DEVS_MAX_STACK_DEPTH];

    devs_short_map_t *fn_protos;

    devs_img_t img;

    devs_activation_t *curr_fn;
    devs_fiber_t *curr_fiber;

    devs_fiber_t *fibers;
    devs_role_t *roles;

    // use devs_get_builtin_object()
    devs_map_t **_builtin_protos;

    uint32_t *buffers;

    uint64_t _now_long;
    uint32_t _logged_now;

    uint32_t fiber_handle_tag;

    devs_gc_t *gc;

    devs_cfg_t cfg;

    devs_activation_t *step_fn;
    devs_brk_t *brk_list;
    uint16_t brk_count;
    uint8_t brk_jump_tbl[DEVS_BRK_HASH_SIZE];

    uint8_t program_hash[JD_SHA256_HASH_BYTES];

    union {
        jd_frame_t frame;
        jd_packet_t packet;
    };

    devs_regcache_t regcache;
};

struct devs_activation {
    devs_gc_object_t gc;
    devs_pc_t pc;
    devs_pc_t maxpc;
    devs_activation_t *closure;
    devs_activation_t *caller;
    const devs_function_desc_t *func;
    value_t slots[0];
};

static inline uint32_t devs_now(devs_ctx_t *ctx) {
    return (uint32_t)ctx->_now_long;
}
static inline bool devs_trace_enabled(devs_ctx_t *ctx) {
    return (ctx->flags & DEVS_CTX_TRACE_DISABLED) == 0;
}

static inline bool devs_is_suspended(devs_ctx_t *ctx) {
    return ctx->suspension != JD_DEVS_DBG_SUSPENSION_TYPE_NONE;
}

void devs_panic(devs_ctx_t *ctx, unsigned code);
value_t _devs_invalid_program(devs_ctx_t *ctx, unsigned code);

/**
 * Indicates an invalid bytecode program.
 * The compiler should never generate code that triggers this.
 * Next free error: 60129
 */
static inline value_t devs_invalid_program(devs_ctx_t *ctx, unsigned code) {
    return _devs_invalid_program(ctx, code - 60000);
}

// strformat.c
size_t devs_strformat(devs_ctx_t *ctx, const char *fmt, size_t fmtlen, char *dst, size_t dstlen,
                      value_t *args, size_t numargs, size_t numskip);

// jdiface.c
bool devs_jd_should_run(devs_fiber_t *fiber);
value_t devs_jd_pkt_capture(devs_ctx_t *ctx, unsigned role_idx);
void devs_jd_wake_role(devs_ctx_t *ctx, unsigned role_idx);
void devs_jd_send_cmd(devs_ctx_t *ctx, unsigned role_idx, unsigned code);
void devs_jd_send_raw(devs_ctx_t *ctx);
void devs_jd_get_register(devs_ctx_t *ctx, unsigned role_idx, unsigned code, unsigned timeout,
                          unsigned arg);
void devs_jd_process_pkt(devs_ctx_t *ctx, jd_device_service_t *serv, jd_packet_t *pkt);
void devs_jd_reset_packet(devs_ctx_t *ctx);
void devs_jd_init_roles(devs_ctx_t *ctx);
void devs_jd_free_roles(devs_ctx_t *ctx);
void devs_jd_role_changed(devs_ctx_t *ctx, jd_role_t *role);
void devs_jd_clear_pkt_kind(devs_fiber_t *fib);
void devs_jd_send_logmsg(devs_ctx_t *ctx, char lev, value_t str);
uint64_t devs_jd_server_device_id(void);

// fibers.c
void devs_fiber_set_wake_time(devs_fiber_t *fiber, unsigned time);
void devs_fiber_sleep(devs_fiber_t *fiber, unsigned time);
void devs_fiber_termiante(devs_fiber_t *fiber);
void devs_fiber_yield(devs_ctx_t *ctx);
// if `args` is passed, `numparams==0`
// otherwise, `numparams` arguments are sought on the_stack
int devs_fiber_call_function(devs_fiber_t *fiber, unsigned numparams, devs_array_t *args);
void devs_fiber_return_from_call(devs_fiber_t *fiber, devs_activation_t *act);
devs_fiber_t *devs_fiber_start(devs_ctx_t *ctx, unsigned numargs, unsigned op);
devs_fiber_t *devs_fiber_by_tag(devs_ctx_t *ctx, unsigned tag);
devs_fiber_t *devs_fiber_by_fidx(devs_ctx_t *ctx, unsigned fidx);
void devs_fiber_run(devs_fiber_t *fiber);
void devs_fiber_poke(devs_ctx_t *ctx);
void devs_fiber_sync_now(devs_ctx_t *ctx);
void devs_fiber_free_all_fibers(devs_ctx_t *ctx);

// vm_main.c
void devs_vm_exec_opcodes(devs_ctx_t *ctx);
uint8_t devs_fetch_opcode(devs_activation_t *frame, devs_ctx_t *ctx);

int devs_vm_set_breakpoint(devs_ctx_t *ctx, unsigned pc, unsigned flags);
bool devs_vm_clear_breakpoint(devs_ctx_t *ctx, unsigned pc);
void devs_vm_clear_breakpoints(devs_ctx_t *ctx);
void devs_vm_suspend(devs_ctx_t *ctx, unsigned cause);
void devs_vm_halt(devs_ctx_t *ctx);
int devs_vm_resume(devs_ctx_t *ctx);
void devs_vm_set_debug(devs_ctx_t *ctx, bool en);

value_t devs_buffer_op(devs_ctx_t *ctx, uint32_t fmt0, uint32_t offset, value_t buffer,
                       value_t *setv);
double devs_read_number(void *data, unsigned bufsz, uint16_t fmt0);
value_t devs_buffer_decode(devs_ctx_t *ctx, uint32_t fmt0, uint8_t **buf, unsigned len);
unsigned devs_buffer_encode(devs_ctx_t *ctx, uint32_t fmt0, uint8_t *data, unsigned len, value_t v);
value_t devs_packet_decode(devs_ctx_t *ctx, const devs_packet_spec_t *pkt, uint8_t *dp,
                           unsigned len);

void *devs_try_alloc(devs_ctx_t *ctx, uint32_t size);
void devs_free(devs_ctx_t *ctx, void *ptr);
void devs_oom(devs_ctx_t *ctx, unsigned size);

value_t devs_make_closure(devs_ctx_t *ctx, devs_activation_t *closure, unsigned fnidx);
int devs_get_fnidx(devs_ctx_t *ctx, value_t src, value_t *this_val, devs_activation_t **closure);

devs_map_t *devs_get_role_proto(devs_ctx_t *ctx, unsigned roleidx);

#define TODO JD_PANIC

// for impl_*.c
int32_t devs_arg_int(devs_ctx_t *ctx, unsigned idx);
double devs_arg_double(devs_ctx_t *ctx, unsigned idx);
const char *devs_arg_utf8_with_conv(devs_ctx_t *ctx, unsigned idx, unsigned *sz);
static inline value_t devs_arg(devs_ctx_t *ctx, unsigned idx) {
    return ctx->the_stack[idx + 1];
}
static inline value_t devs_arg_self(devs_ctx_t *ctx) {
    return ctx->the_stack[0];
}
devs_map_t *devs_arg_self_map(devs_ctx_t *ctx);

void devs_ret_double(devs_ctx_t *ctx, double v);
void devs_ret_int(devs_ctx_t *ctx, int v);
void devs_ret_bool(devs_ctx_t *ctx, bool v);
void devs_ret_gc_ptr(devs_ctx_t *ctx, void *v);
static inline void devs_ret(devs_ctx_t *ctx, value_t v) {
    ctx->curr_fiber->ret_val = v;
}

static inline bool devs_did_yield(devs_ctx_t *ctx) {
    return ctx->curr_fiber == NULL;
}
void devs_setup_resume(devs_fiber_t *f, devs_resume_cb_t cb, void *userdata);

static inline jd_role_t *devs_role(devs_ctx_t *ctx, unsigned roleidx) {
    return ctx->roles[roleidx].role;
}

bool devs_vm_role_ok(devs_ctx_t *ctx, uint32_t a);

#define DEVS_DERIVE(cls, basecls) /* */

// try.c
void devs_push_tryframe(devs_activation_t *frame, devs_ctx_t *ctx, int pc);
int devs_pop_tryframe(devs_activation_t *frame, devs_ctx_t *ctx);
value_t devs_capture_stack(devs_ctx_t *ctx);
void devs_unhandled_exn(devs_ctx_t *ctx, value_t exn);

#define DEVS_THROW_NO_STACK 0x0001
#define DEVS_THROW_INTERNAL 0x0002
void devs_throw(devs_ctx_t *ctx, value_t exn, unsigned flags);
value_t devs_throw_type_error(devs_ctx_t *ctx, const char *format, ...);
value_t devs_throw_range_error(devs_ctx_t *ctx, const char *format, ...);
value_t devs_throw_syntax_error(devs_ctx_t *ctx, const char *format, ...);
value_t devs_throw_not_supported_error(devs_ctx_t *ctx, const char *what);
value_t devs_throw_expecting_error_ext(devs_ctx_t *ctx, const char *what, value_t v);
value_t devs_throw_expecting_error(devs_ctx_t *ctx, unsigned builtinstr, value_t v);
value_t devs_throw_too_big_error(devs_ctx_t *ctx, unsigned builtinstr);

void devs_process_throw(devs_ctx_t *ctx);
value_t devs_alloc_error(devs_ctx_t *ctx, unsigned proto_idx, const char *format, va_list arg);

const devs_function_desc_t *devs_function_by_pc(devs_ctx_t *ctx, unsigned pc);
void devs_dump_stack(devs_ctx_t *ctx, value_t stack);
void devs_dump_exception(devs_ctx_t *ctx, value_t exn);
void devs_track_exception(devs_ctx_t *ctx);
