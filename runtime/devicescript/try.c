#include "devs_internal.h"

static inline devs_pc_t *get_tryframes(devs_activation_t *frame) {
    JD_ASSERT(frame->func->num_try_frames > 0);
    return (devs_pc_t *)frame->slots + frame->func->num_slots;
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
    devs_runtime_failure(ctx, 60192);
}

int devs_pop_tryframe(devs_activation_t *frame, devs_ctx_t *ctx) {
    unsigned numtry = frame->func->num_try_frames;
    if (!numtry)
        return 0;
    devs_pc_t *tf = get_tryframes(frame);
    for (unsigned i = numtry - 1; i > 0; --i) {
        if (tf[i] != 0) {
            int pc = tf[i];
            tf[i] = 0;
            return pc;
        }
    }
    return 0;
}

value_t devs_capture_stack(devs_ctx_t *ctx) {
    // TODO
    return devs_null;
}

void devs_unhandled_exn(devs_ctx_t *ctx, value_t exn) {
    value_t str = devs_value_to_string(ctx, exn);
    const char *s = devs_string_get_utf8(ctx, str, NULL);
    DMESG("unhandled exception: %s", s);
    devs_runtime_failure(ctx, 60196); // TODO should we continue instead?
}

void devs_throw(devs_ctx_t *ctx, value_t exn, unsigned flags) {
    devs_value_pin(ctx, exn);

    if (devs_can_attach(ctx, exn) && !(flags & DEVS_THROW_NO_STACK)) {
        value_t stack = devs_capture_stack(ctx);
        devs_value_pin(ctx, stack);
        devs_any_set(ctx, exn, devs_builtin_string(DEVS_BUILTIN_STRING___STACK__), stack);
        devs_value_unpin(ctx, stack);
    }

    int jump_pc = 0;
    unsigned jump_level;

    if (devs_is_special(exn) && devs_handle_is_throw_jmp(devs_handle_value(exn))) {
        jump_pc = devs_handle_decode_throw_jmp_pc(devs_handle_value(exn), &jump_level);
    }

    while (ctx->curr_fn) {
        devs_activation_t *frame = ctx->curr_fn;

        if (jump_pc && jump_level == 0) {
            frame->pc = jump_pc;
            break;
        }

        int pc = devs_pop_tryframe(frame, ctx);
        if (pc == 0) {
            if (jump_pc != 0) {
                devs_runtime_failure(ctx, 60199);
                break;
            }
            int hadcaller = frame->caller != NULL;
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
                    ctx->curr_fiber->ret_val = exn;
                    break;
                }
            } else if (op == DEVS_STMT0_FINALLY) {
                if (jump_pc)
                    exn = devs_value_encode_throw_jmp_pc(jump_pc, jump_level - 1);
                ctx->curr_fiber->ret_val = exn;
                break;
            } else {
                devs_runtime_failure(ctx, 60197);
                break;
            }
        }
    }

    devs_value_unpin(ctx, exn);
}

void devs_throw_type_error(devs_ctx_t *ctx, const char *format, ...) {
    devs_map_t *exn = devs_map_try_alloc(ctx);
    if (exn) {
        value_t eval = devs_value_from_gc_obj(ctx, exn);
        devs_value_pin(ctx, eval);
        exn->proto = devs_object_get_built_in(ctx, DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE);

        va_list arg;
        va_start(arg, format);
        value_t msg = devs_string_vsprintf(ctx, format, arg);
        va_end(arg);
        devs_value_pin(ctx, msg);

        devs_map_set(ctx, exn, devs_builtin_string(DEVS_BUILTIN_STRING_MESSAGE), msg);
        devs_value_unpin(ctx, msg);
        devs_value_unpin(ctx, eval);

        devs_throw(ctx, eval, DEVS_THROW_INTERNAL);
    }
}
