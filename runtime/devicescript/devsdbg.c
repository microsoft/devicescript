// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include "devs_internal.h"
#include "jacdac/dist/c/devicescriptdebugger.h"

#define LOG_TAG "dbg"
#include "devs_logging.h"

struct srv_state {
    SRV_COMMON;
    uint8_t enabled;
    uint8_t break_at_unhandled_exn;
    uint8_t break_at_handled_exn;
    uint8_t suspended;

    uint8_t pipe_cmd;
    uint8_t pipe_elt_size;
    uint16_t pipe_num_elts;
    uint16_t pipe_curr_elt;
    void *pipe_data;
    jd_opipe_desc_t results_pipe;
};
static srv_t *_state;

REG_DEFINITION(                                     //
    devsdbg_regs,                                   //
    REG_SRV_COMMON,                                 //
    REG_U8(JD_DEVS_DBG_REG_ENABLED),                //
    REG_U8(JD_DEVS_DBG_REG_BREAK_AT_UNHANDLED_EXN), //
    REG_U8(JD_DEVS_DBG_REG_BREAK_AT_HANDLED_EXN),   //
    REG_U8(JD_DEVS_DBG_REG_IS_SUSPENDED),           //
)

static void devsdbg_stop_pipe(srv_t *state) {
    if (!state->pipe_cmd)
        return;

    // this will not send anything if a new pipe is opened immediately
    jd_opipe_close(&state->results_pipe);

    state->pipe_cmd = 0;
    jd_free(state->pipe_data);
    state->pipe_data = NULL;
}

static void devsdbg_pipe_alloc(srv_t *state, unsigned elt_size, unsigned num_elts) {
    JD_ASSERT(elt_size < JD_SERIAL_PAYLOAD_SIZE - 8);
    JD_ASSERT(num_elts < 1000);

    devsdbg_stop_pipe(state);

    state->pipe_elt_size = elt_size;
    state->pipe_num_elts = num_elts;
    state->pipe_curr_elt = 0;
    state->pipe_data = num_elts ? jd_alloc(elt_size * num_elts) : NULL;
    if (!state->pipe_data)
        state->pipe_num_elts = 0;
}

typedef struct {
    srv_t *state;
    jd_packet_t *pkt;
    devs_ctx_t *ctx;
} cmd_t;

static void *devsdbg_open_results_pipe(cmd_t *cmd, unsigned elt_size, unsigned num_elts) {
    srv_t *state = cmd->state;
    if (!state->enabled || !state->suspended)
        num_elts = 0;
    devsdbg_pipe_alloc(state, elt_size, num_elts);
    jd_opipe_open_cmd(&state->results_pipe, cmd->pkt);
    state->pipe_cmd = cmd->pkt->service_command;
    return state->pipe_data;
}

void devsdbg_process(srv_t *state) {
    while (state->pipe_cmd) {
        if (state->pipe_curr_elt >= state->pipe_num_elts)
            devsdbg_stop_pipe(state);
        else {
            unsigned sz = state->pipe_elt_size;
            int r = jd_opipe_write(&state->results_pipe,
                                   (uint8_t *)state->pipe_data + (state->pipe_curr_elt * sz), sz);
            if (r == JD_PIPE_OK) {
                state->pipe_curr_elt++;
            } else if (r == JD_PIPE_TRY_AGAIN) {
                // OK, will try again
                break;
            } else {
                devsdbg_stop_pipe(state);
            }
        }
    }
}

static uint32_t ptr_value(devs_ctx_t *ctx, void *ptr) {
    if (ptr == NULL)
        return 0;
    value_t v = devs_value_from_gc_obj(ctx, ptr);
    return devs_handle_value(v);
}

static uint16_t map_fn_idx(unsigned idx) {
    if (idx == 0)
        return JD_DEVS_DBG_FUN_IDX_MAIN;
    return idx;
}

static void send_empty(cmd_t *cmd) {
    devsdbg_open_results_pipe(cmd, 1, 0);
}

void *to_gc_obj(devs_ctx_t *ctx, uint32_t ref) {
    if (ref == 0)
        return NULL;
    void *r = devs_handle_ptr_value(ctx, devs_value_from_handle(DEVS_HANDLE_TYPE_GC_OBJECT, ref));
    JD_ASSERT(devs_gc_obj_valid(ctx, r));
    return r;
}

#define HAS_NAMED 0x80000000
static unsigned obj_get_props(devs_ctx_t *ctx, value_t v, jd_devs_dbg_key_value_t *trg);

static void expand_value(devs_ctx_t *ctx, jd_devs_dbg_value_t *trg, value_t v) {
    value_t this_val;
    devs_activation_t *clo;
    int fnidx = devs_get_fnidx(ctx, v, &this_val, &clo);
    if (fnidx >= 0) {
        if (clo && !devs_is_null(this_val)) {
            JD_ASSERT(devs_handle_is_ptr(v));
            trg->tag = JD_DEVS_DBG_VALUE_TAG_OBJ_BOUND_FUNCTION;
            trg->v0 = devs_handle_value(v);
            return;
        }
        if (clo)
            v = devs_value_from_gc_obj(ctx, clo);
        else
            v = this_val;
        trg->fn_idx = map_fn_idx(fnidx);
        // continue setting other fields of v
    }

    unsigned htp = devs_handle_type(v);
    uint32_t hv = devs_handle_value(v);

    if (htp == DEVS_HANDLE_TYPE_IMG_BUFFERISH) {
        trg->tag = JD_DEVS_DBG_VALUE_TAG_IMG_BUFFER + (hv >> DEVS_STRIDX__SHIFT);
        trg->v0 = hv & ((1 << DEVS_STRIDX__SHIFT) - 1);
        return;
    }

    TODO(); // handle all the 'map' cases

    switch (devs_value_typeof(ctx, v)) {
    case DEVS_OBJECT_TYPE_NULL:
        trg->tag = JD_DEVS_DBG_VALUE_TAG_SPECIAL;
        trg->v0 = JD_DEVS_DBG_VALUE_SPECIAL_NULL;
        break;

    case DEVS_OBJECT_TYPE_EXOTIC:
        trg->tag = JD_DEVS_DBG_VALUE_TAG_EXOTIC;
        memcpy(&trg->v0, &v, 8);
        break;

    case DEVS_OBJECT_TYPE_BOOL:
        trg->tag = JD_DEVS_DBG_VALUE_TAG_SPECIAL;
        trg->v0 = devs_value_to_bool(ctx, v) ? JD_DEVS_DBG_VALUE_SPECIAL_TRUE
                                             : JD_DEVS_DBG_VALUE_SPECIAL_FALSE;
        break;

    case DEVS_OBJECT_TYPE_NUMBER: {
        trg->tag = JD_DEVS_DBG_VALUE_TAG_NUMBER;
        double tmp = devs_value_to_double(ctx, v);
        memcpy(&trg->v0, &tmp, 8);
        break;
    }

    case DEVS_OBJECT_TYPE_ARRAY: {
        trg->tag = JD_DEVS_DBG_VALUE_TAG_OBJ_ARRAY;
        devs_array_t *arr = devs_handle_ptr_value(ctx, v);
        trg->v0 = hv;
        trg->v1 = arr->length;
        if (arr->attached)
            trg->v1 |= HAS_NAMED;
        break;
    }

    case DEVS_OBJECT_TYPE_ROLE:
        trg->tag = JD_DEVS_DBG_VALUE_TAG_IMG_ROLE;
        trg->v0 = hv;
        trg->v1 = obj_get_props(ctx, v, NULL);
        break;

    case DEVS_OBJECT_TYPE_FIBER:
        trg->tag = JD_DEVS_DBG_VALUE_TAG_FIBER;
        trg->v0 = hv;
        break;

    case DEVS_OBJECT_TYPE_STRING:
        JD_ASSERT(devs_gc_tag(devs_handle_ptr_value(ctx, v)) == DEVS_GC_TAG_STRING);
        trg->tag = JD_DEVS_DBG_VALUE_TAG_OBJ_STRING;
        trg->v0 = hv;
        break;

    case DEVS_OBJECT_TYPE_BUFFER: {
        devs_buffer_t *b = devs_handle_ptr_value(ctx, v);
        JD_ASSERT(devs_gc_tag(b) == DEVS_GC_TAG_BUFFER);
        trg->tag = JD_DEVS_DBG_VALUE_TAG_OBJ_BUFFER;
        trg->v0 = hv;
        trg->v1 = b->length;
        if (b->attached)
            trg->v1 |= HAS_NAMED;
        break;
    }

    case DEVS_OBJECT_TYPE_PACKET: {
        devs_packet_t *b = devs_handle_ptr_value(ctx, v);
        JD_ASSERT(devs_gc_tag(b) == DEVS_GC_TAG_PACKET);
        trg->tag = JD_DEVS_DBG_VALUE_TAG_OBJ_PACKET;
        trg->v0 = hv;
        trg->v1 = b->payload->length;
        trg->v1 |= HAS_NAMED; // device_id, etc always present
        break;
    }

    default:
        trg->tag = JD_DEVS_DBG_VALUE_TAG_UNHANDLED;
        memcpy(&trg->v0, &v, 8);
        break;
    }
}

static void expand_key_value(devs_ctx_t *ctx, jd_devs_dbg_key_value_t *trg, value_t key,
                             value_t v) {
    TODO();
}

static unsigned obj_length(void *obj) {
    switch (devs_gc_tag(obj)) {
    case DEVS_GC_TAG_ACTIVATION:
        return ((devs_activation_t *)obj)->func->num_slots;
    case DEVS_GC_TAG_ARRAY:
        return ((devs_array_t *)obj)->length;
    default:
        return 0;
    }
}

static value_t value_from_maplike(devs_ctx_t *ctx, devs_maplike_t *obj) {
    TODO();
}

static void kv_add(devs_ctx_t *ctx, void *userdata, value_t k, value_t v) {
    jd_devs_dbg_key_value_t **tp = userdata;
    expand_key_value(ctx, *tp, k, v);
    (*tp)++;
}

static unsigned obj_get_props(devs_ctx_t *ctx, value_t v, jd_devs_dbg_key_value_t *trg) {
    devs_maplike_t *obj = devs_object_get_attached_enum(ctx, v);
    if (obj == NULL)
        return 0;

    devs_maplike_t *proto = devs_maplike_get_proto(ctx, obj);
    unsigned idx = 0;
    if (proto) {
        if (trg)
            expand_key_value(ctx, trg++, devs_builtin_string(DEVS_BUILTIN_STRING___PROTO__),
                             value_from_maplike(ctx, proto));
        idx++;
    }

    if (trg)
        idx += devs_maplike_iter(ctx, obj, &trg, kv_add);
    else
        idx += devs_maplike_iter(ctx, obj, NULL, NULL);

    return idx;
}

static void send_values(cmd_t *cmd, unsigned num, value_t *vals) {
    jd_devs_dbg_value_t *r = devsdbg_open_results_pipe(cmd, sizeof(jd_devs_dbg_value_t), num);
    if (r)
        for (unsigned i = 0; i < num; ++i)
            expand_value(cmd->ctx, r + i, vals[i]);
}

static void send_indexed(cmd_t *cmd) {
    devs_ctx_t *ctx = cmd->ctx;
    jd_devs_dbg_read_indexed_values_t *args = (void *)cmd->pkt->data;
    switch (args->modifier) {
    case JD_DEVS_DBG_READ_INDEXED_MODIFIER_OBJECT: {
        void *obj = to_gc_obj(ctx, args->obj);
        unsigned len = obj_length(obj);
        if (len == 0)
            send_empty(cmd);
        else
            switch (devs_gc_tag(obj)) {
            case DEVS_GC_TAG_ARRAY:
                send_values(cmd, len, ((devs_array_t *)obj)->data);
                break;
            case DEVS_GC_TAG_ACTIVATION:
                send_values(cmd, len, ((devs_activation_t *)obj)->slots);
                break;
            default:
                JD_PANIC();
            }
        break;
    }

    case JD_DEVS_DBG_READ_INDEXED_MODIFIER_GLOBALS:
        send_values(cmd, ctx->img.header->num_globals, ctx->globals);
        break;

    case JD_DEVS_DBG_READ_INDEXED_MODIFIER_ROLES: {
        unsigned num = devs_img_num_roles(ctx->img);
        jd_devs_dbg_value_t *r = devsdbg_open_results_pipe(cmd, sizeof(jd_devs_dbg_value_t), num);
        if (r)
            for (unsigned i = 0; i < num; ++i)
                expand_value(ctx, r + i, devs_value_from_gc_obj(ctx, ctx->roles[i].attached));
        break;
    }

    default:
        send_empty(cmd);
        break;
    }
}

static void send_named(cmd_t *cmd) {
    jd_devs_dbg_read_named_values_t *args = (void *)cmd->pkt->data;
    devs_ctx_t *ctx = cmd->ctx;
    void *obj = to_gc_obj(ctx, args->obj);
    value_t v = devs_value_from_gc_obj(ctx, obj);

    unsigned len = obj_get_props(ctx, v, NULL);
    jd_devs_dbg_key_value_t *arr =
        devsdbg_open_results_pipe(cmd, sizeof(jd_devs_dbg_key_value_t), len);
    if (arr) {
        unsigned l2 = obj_get_props(ctx, v, arr);
        JD_ASSERT(len == l2);
    }
}

void devsdbg_handle_packet(srv_t *state, jd_packet_t *pkt) {
    devs_ctx_t *ctx = devicescriptmgr_get_ctx();
    cmd_t _cmd = {.state = state, .pkt = pkt, .ctx = ctx};
    cmd_t *cmd = &_cmd;

    switch (pkt->service_command) {
    case JD_DEVS_DBG_CMD_READ_FIBERS: {
        unsigned num_fib = 0;
        for (devs_fiber_t *f = ctx ? ctx->fibers : NULL; f; f = f->next)
            num_fib++;
        uint32_t *data = devsdbg_open_results_pipe(cmd, sizeof(uint32_t), num_fib);
        if (data) {
            num_fib = 0;
            for (devs_fiber_t *f = ctx ? ctx->fibers : NULL; f; f = f->next) {
                data[num_fib] = f->handle_tag;
                num_fib++;
            }
        }
        break;
    }

    case JD_DEVS_DBG_CMD_READ_STACK: {
        devs_fiber_t *fib =
            ctx ? devs_fiber_by_tag(ctx, ((jd_devs_dbg_read_stack_t *)pkt->data)->fiber_handle)
                : NULL;
        unsigned num_fr = 0;
        for (devs_activation_t *a = fib ? fib->activation : NULL; a; a = a->caller)
            num_fr++;
        jd_devs_dbg_stackframe_t *data =
            devsdbg_open_results_pipe(cmd, sizeof(jd_devs_dbg_stackframe_t), num_fr);
        if (data) {
            num_fr = 0;
            for (devs_activation_t *a = fib ? fib->activation : NULL; a; a = a->caller) {
                data[num_fr].self = ptr_value(ctx, a);
                data[num_fr].pc = a->pc;
                data[num_fr].closure = ptr_value(ctx, a->closure);
                data[num_fr].fn_idx = map_fn_idx(a->func - devs_img_get_function(ctx->img, 0));
                num_fr++;
            }
        }
        break;
    }

    case JD_DEVS_DBG_CMD_READ_INDEXED_VALUES:
        if (ctx == NULL)
            send_empty(cmd);
        else
            send_indexed(cmd);
        break;

    case JD_DEVS_DBG_CMD_READ_NAMED_VALUES:
        if (ctx == NULL)
            send_empty(cmd);
        else
            send_named(cmd);
        break;

    case JD_DEVS_DBG_CMD_READ_VALUE:
        TODO();
        break;

    case JD_DEVS_DBG_CMD_CLEAR_BREAKPOINT:
    case JD_DEVS_DBG_CMD_CLEAR_BREAKPOINTS:
    case JD_DEVS_DBG_CMD_SET_BREAKPOINT:
        TODO();
        break;

    case JD_DEVS_DBG_CMD_RESUME:
    case JD_DEVS_DBG_CMD_HALT:
    case JD_DEVS_DBG_CMD_RESTART_AND_HALT:
        TODO();
        break;

    default:
        switch (service_handle_register_final(state, pkt, devsdbg_regs)) {
        case JD_DEVS_DBG_REG_ENABLED:
        case JD_DEVS_DBG_REG_BREAK_AT_HANDLED_EXN:
        case JD_DEVS_DBG_REG_BREAK_AT_UNHANDLED_EXN:
            TODO();
            break;
        }
        break;
    }
}

SRV_DEF(devsdbg, JD_SERVICE_CLASS_DEVS_DBG);

void devsdbg_init(void) {
    SRV_ALLOC(devsdbg);
    _state = state;
}
