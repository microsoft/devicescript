#include "devs_internal.h"

// #define LOG_TAG "exn"
#include "devs_logging.h"

static inline devs_pc_t *get_tryframes(devs_activation_t *frame) {
    JD_ASSERT(frame->func->num_try_frames > 0);
    return (devs_pc_t *)(frame->slots + frame->func->num_slots);
}

void devs_push_tryframe(devs_activation_t *frame, devs_ctx_t *ctx, int pc) {
    if (!pc)
        return;
    unsigned numtry = frame->func->num_try_frames;
    devs_pc_t *tf = get_tryframes(frame);
    for (unsigned i = 0; i < numtry; ++i) {
        if (tf[i] == 0) {
            tf[i] = pc;
            return;
        }
    }
    devs_invalid_program(ctx, 60123);
}

int devs_pop_tryframe(devs_activation_t *frame, devs_ctx_t *ctx) {
    int numtry = frame->func->num_try_frames;
    if (!numtry)
        return 0;
    devs_pc_t *tf = get_tryframes(frame);
    for (int i = numtry - 1; i >= 0; --i) {
        if (tf[i] != 0) {
            int pc = tf[i];
            tf[i] = 0;
            return pc;
        }
    }
    return 0;
}

const devs_function_desc_t *devs_function_by_pc(devs_ctx_t *ctx, unsigned pc) {
    unsigned numfn = devs_img_num_functions(ctx->img);

    // TODO could try binary search on functions
    for (unsigned fn = 0; fn < numfn; ++fn) {
        const devs_function_desc_t *desc = devs_img_get_function(ctx->img, fn);
        if (desc->start <= pc && pc <= desc->start + desc->length)
            return desc;
    }
    return NULL;
}

void devs_dump_stack(devs_ctx_t *ctx, value_t stack) {
    if (!devs_is_buffer(ctx, stack)) {
        devs_log_value(ctx, "! expecting stack, got", stack);
        return;
    }

    unsigned sz;
    devs_pc_t *data = devs_buffer_data(ctx, stack, &sz);
    sz /= sizeof(devs_pc_t);

    for (unsigned i = 0; i < sz; ++i) {
        int pc = data[i];
        const devs_function_desc_t *desc = devs_function_by_pc(ctx, data[i]);
        if (desc) {
            int fn = desc - devs_img_get_function(ctx->img, 0);
            DMESG("*  pc=%d @ %s_F%d", (int)(pc - desc->start), devs_img_fun_name(ctx->img, fn),
                  fn);
        } else {
            DMESG("*  pc=%d @ ???", pc);
        }
    }
}

void devs_dump_exception(devs_ctx_t *ctx, value_t exn) {
    int hadinfo = 0;
    if (devs_can_attach(ctx, exn)) {
        value_t ctor = devs_object_get_built_in_field(ctx, exn, DEVS_BUILTIN_STRING_NAME);
        if (!devs_is_null(ctor)) {
            devs_log_value(ctx, "* Exception", ctor);
            hadinfo++;
        }

        value_t msg = devs_object_get_built_in_field(ctx, exn, DEVS_BUILTIN_STRING_MESSAGE);
        if (!devs_is_null(msg)) {
            devs_log_value(ctx, "*  message", msg);
            value_t stack = devs_object_get_built_in_field(ctx, exn, DEVS_BUILTIN_STRING___STACK__);
            if (!devs_is_null(stack))
                devs_dump_stack(ctx, stack);
            hadinfo++;
        }
    }

    if (!hadinfo)
        devs_log_value(ctx, "* Exception", exn);
}

value_t devs_capture_stack(devs_ctx_t *ctx) {
    int numfr = 0;
    for (devs_activation_t *fn = ctx->curr_fn; fn; fn = fn->caller)
        numfr++;
    if (numfr > DEVS_MAX_STACK_TRACE_FRAMES)
        numfr = DEVS_MAX_STACK_TRACE_FRAMES;
    devs_buffer_t *stackbuf = devs_buffer_try_alloc(ctx, numfr * sizeof(devs_pc_t));
    if (!stackbuf)
        return devs_undefined;

    int idx = 0;
    for (devs_activation_t *fn = ctx->curr_fn; fn; idx++, fn = fn->caller) {
        if (idx >= numfr)
            break;
        ((devs_pc_t *)stackbuf->data)[idx] = fn->pc;
    }
    return devs_value_from_gc_obj(ctx, stackbuf);
}

void devs_unhandled_exn(devs_ctx_t *ctx, value_t exn) {
    DMESG("! Unhandled exception");
    ctx->in_throw = 0;
    devs_dump_exception(ctx, exn);
    devs_panic(ctx, DEVS_PANIC_UNHANDLED_EXCEPTION); // TODO should we continue instead?
}

void devs_throw(devs_ctx_t *ctx, value_t exn, unsigned flags) {
    LOG_VAL("throw", exn);

    if (ctx->in_throw) {
        devs_log_value(ctx, "! double throw", exn);
        return;
    }

    if (ctx->curr_fn == NULL) {
        devs_unhandled_exn(ctx, exn);
        return;
    }

    ctx->in_throw = 1;

    ctx->exn_val = exn;

    if (devs_can_attach(ctx, exn) && !(flags & DEVS_THROW_NO_STACK)) {
        value_t stack = devs_capture_stack(ctx);
        devs_value_pin(ctx, stack);
        devs_any_set(ctx, exn, devs_builtin_string(DEVS_BUILTIN_STRING___STACK__), stack);
        devs_value_unpin(ctx, stack);
    }
}

static bool has_catch(devs_ctx_t *ctx) {
    for (devs_activation_t *frame = ctx->curr_fn; frame; frame = frame->caller) {
        int pc0 = frame->pc;
        devs_pc_t *tf = get_tryframes(frame);
        for (int i = frame->func->num_try_frames - 1; i >= 0; --i) {
            if (tf[i] == 0)
                continue;
            frame->pc = tf[i];
            int op = devs_fetch_opcode(frame, ctx);
            if (op == DEVS_STMT0_CATCH) {
                frame->pc = pc0;
                return true;
            }
        }
        frame->pc = pc0;
    }
    return false;
}

void devs_process_throw(devs_ctx_t *ctx) {
    value_t exn = ctx->exn_val;
    int jump_pc = 0;
    unsigned jump_level = 0;
    bool step_frame_popped = false;

    if (devs_is_special(exn) && devs_handle_is_throw_jmp(devs_handle_value(exn))) {
        jump_pc = devs_handle_decode_throw_jmp_pc(devs_handle_value(exn), &jump_level);
    } else if (ctx->dbg_en) {
        unsigned dbg_reason = JD_DEVS_DBG_SUSPENSION_TYPE_NONE;
        if (!ctx->ignore_brk &&
            (ctx->dbg_flags & (DEVS_DBG_BRK_HANDLED_EXN | DEVS_DBG_BRK_UNHANDLED_EXN))) {
            if (has_catch(ctx)) {
                if (ctx->dbg_flags & DEVS_DBG_BRK_HANDLED_EXN)
                    dbg_reason = JD_DEVS_DBG_SUSPENSION_TYPE_HANDLED_EXCEPTION;
            } else {
                dbg_reason = JD_DEVS_DBG_SUSPENSION_TYPE_UNHANDLED_EXCEPTION;
            }
        }
        if (dbg_reason) {
            devs_vm_suspend(ctx, dbg_reason);
            return;
        }
    }

    while (ctx->curr_fn) {
        devs_activation_t *frame = ctx->curr_fn;

        if (jump_pc && jump_level == 0) {
            frame->pc = jump_pc;
            break;
        }

        int pc = devs_pop_tryframe(frame, ctx);
        LOG("pc=%d", pc);
        if (pc == 0) {
            if (jump_pc != 0) {
                devs_invalid_program(ctx, 60124);
                break;
            }
            int hadcaller = frame->caller != NULL;
            if (frame == ctx->step_fn)
                step_frame_popped = true;
            LOG("up hadcaller=%d", hadcaller);
            devs_fiber_return_from_call(ctx->curr_fiber, frame);
            if (!hadcaller) {
                devs_unhandled_exn(ctx, exn);
                break;
            } else {
                continue;
            }
        } else {
            frame->pc = pc;
            int op = devs_fetch_opcode(frame, ctx);
            if (op == DEVS_STMT0_CATCH) {
                if (jump_pc) {
                    jump_level--;
                } else {
                    break;
                }
            } else if (op == DEVS_STMT0_FINALLY) {
                if (jump_pc) {
                    ctx->exn_val = devs_value_encode_throw_jmp_pc(jump_pc, jump_level - 1);
                    if (ctx->dbg_en && ctx->step_fn == ctx->curr_fn)
                        devs_vm_suspend(ctx, JD_DEVS_DBG_SUSPENSION_TYPE_STEP);
                }
                break;
            } else {
                devs_invalid_program(ctx, 60125);
                break;
            }
        }
    }

    ctx->stack_top = 0;
    ctx->in_throw = 0;
    if (ctx->curr_fiber)
        ctx->curr_fiber->ret_val = ctx->exn_val;
    ctx->exn_val = devs_undefined;

    if (step_frame_popped)
        devs_vm_suspend(ctx, JD_DEVS_DBG_SUSPENSION_TYPE_STEP);
}

static value_t devs_throw_internal_error(devs_ctx_t *ctx, unsigned proto_idx, const char *format,
                                         va_list arg) {
    devs_map_t *exn = devs_map_try_alloc(ctx, devs_get_builtin_object(ctx, proto_idx));
    if (exn) {
        value_t eval = devs_value_from_gc_obj(ctx, exn);
        devs_value_pin(ctx, eval);

        value_t msg = devs_string_vsprintf(ctx, format, arg);

        devs_map_set_string_field(ctx, exn, DEVS_BUILTIN_STRING_MESSAGE, msg);

        devs_value_unpin(ctx, eval);
        devs_throw(ctx, eval, DEVS_THROW_INTERNAL);
    }
    return devs_undefined;
}

value_t devs_throw_type_error(devs_ctx_t *ctx, const char *format, ...) {
    va_list arg;
    va_start(arg, format);
    value_t exn =
        devs_throw_internal_error(ctx, DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE, format, arg);
    va_end(arg);
    return exn;
}

value_t devs_throw_range_error(devs_ctx_t *ctx, const char *format, ...) {
    va_list arg;
    va_start(arg, format);
    value_t exn =
        devs_throw_internal_error(ctx, DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE, format, arg);
    va_end(arg);
    return exn;
}

value_t devs_throw_not_supported_error(devs_ctx_t *ctx, const char *what) {
    return devs_throw_type_error(ctx, "%s not supported (yet)", what);
}

value_t devs_throw_expecting_error(devs_ctx_t *ctx, unsigned builtinstr, value_t v) {
    return devs_throw_expecting_error_ext(ctx, devs_builtin_string_by_idx(builtinstr), v);
}

value_t devs_throw_expecting_error_ext(devs_ctx_t *ctx, const char *what, value_t v) {
    return devs_throw_type_error(ctx, "expecting %s; got %s", what, devs_show_value(ctx, v));
}

value_t devs_throw_too_big_error(devs_ctx_t *ctx, unsigned builtinstr) {
    return devs_throw_range_error(ctx, "%s too big", devs_builtin_string_by_idx(builtinstr));
}
