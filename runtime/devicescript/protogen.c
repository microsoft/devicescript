// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF

#define N(n) (DEVS_BUILTIN_STRING_##n)

// impl_buffer.c
value_t fun_Buffer_alloc(devs_ctx_t *ctx, value_t sz);
value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self);
value_t fun_Buffer_toString(devs_ctx_t *ctx, value_t self);
// impl_ds.c
void fun_DeviceScript_sleepMs(devs_ctx_t *ctx, value_t ms);
void fun_DeviceScript_panic(devs_ctx_t *ctx, value_t v);
void fun_DeviceScript_reboot(devs_ctx_t *ctx);
// impl_math.c
value_t fun_Math_ceil(devs_ctx_t *ctx, value_t v);
value_t fun_Math_floor(devs_ctx_t *ctx, value_t v);
value_t fun_Math_round(devs_ctx_t *ctx, value_t v);
value_t fun_Math_random(devs_ctx_t *ctx);
value_t fun_Math_randomInt(devs_ctx_t *ctx, value_t lim);
value_t fun_Math_log(devs_ctx_t *ctx, value_t v);
value_t fun_Math_pow(devs_ctx_t *ctx, value_t a, value_t b);
value_t fun_Math_idiv(devs_ctx_t *ctx, value_t a, value_t b);
value_t fun_Math_imod(devs_ctx_t *ctx, value_t a, value_t b);
value_t fun_Math_imul(devs_ctx_t *ctx, value_t a, value_t b);
value_t fun_Math_min(devs_ctx_t *ctx, value_t a, value_t b);
value_t fun_Math_max(devs_ctx_t *ctx, value_t a, value_t b);
// impl_string.c
value_t prop_String_length(devs_ctx_t *ctx, value_t self);
value_t fun_String_charCodeAt(devs_ctx_t *ctx, value_t self, value_t idxv);

static const devs_builtin_proto_entry_t Buffer_entries[] = { //
    {N(ALLOC), 0xf000},
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 0xf001},
    {N(TOSTRING), 0xf002},
    {0, 0}};

static const devs_builtin_proto_entry_t DeviceScript_entries[] = { //
    {N(SLEEPMS), 0xf003},
    {N(PANIC), 0xf004},
    {N(REBOOT), 0xf005},
    {0, 0}};

static const devs_builtin_proto_entry_t Math_entries[] = { //
    {N(CEIL), 0xf006},
    {N(FLOOR), 0xf007},
    {N(ROUND), 0xf008},
    {N(RANDOM), 0xf009},
    {N(RANDOMINT), 0xf00a},
    {N(LOG), 0xf00b},
    {N(POW), 0xf00c},
    {N(IDIV), 0xf00d},
    {N(IMOD), 0xf00e},
    {N(IMUL), 0xf00f},
    {N(MIN), 0xf010},
    {N(MAX), 0xf011},
    {0, 0}};

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 0xf012},
    {N(CHARCODEAT), 0xf013},
    {0, 0}};

const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {
    [DEVS_BUILTIN_OBJECT_BUFFER] = {DEVS_BUILTIN_PROTO_INIT, Buffer_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, Buffer_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DEVICESCRIPT] = {DEVS_BUILTIN_PROTO_INIT, DeviceScript_entries},
    [DEVS_BUILTIN_OBJECT_MATH] = {DEVS_BUILTIN_PROTO_INIT, Math_entries},
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, String_prototype_entries},
};

uint16_t devs_num_builtin_functions = 20;
const devs_builtin_function_t devs_builtin_functions[20] = {
    {N(ALLOC), 1, NO_SELF, (void *)fun_Buffer_alloc},
    {N(LENGTH), 0, PROP, (void *)prop_Buffer_length},
    {N(TOSTRING), 0, 0, (void *)fun_Buffer_toString},
    {N(SLEEPMS), 1, ASYNC | NO_SELF, (void *)fun_DeviceScript_sleepMs},
    {N(PANIC), 1, ASYNC | NO_SELF, (void *)fun_DeviceScript_panic},
    {N(REBOOT), 0, ASYNC | NO_SELF, (void *)fun_DeviceScript_reboot},
    {N(CEIL), 1, NO_SELF, (void *)fun_Math_ceil},
    {N(FLOOR), 1, NO_SELF, (void *)fun_Math_floor},
    {N(ROUND), 1, NO_SELF, (void *)fun_Math_round},
    {N(RANDOM), 0, NO_SELF, (void *)fun_Math_random},
    {N(RANDOMINT), 1, NO_SELF, (void *)fun_Math_randomInt},
    {N(LOG), 1, NO_SELF, (void *)fun_Math_log},
    {N(POW), 2, NO_SELF, (void *)fun_Math_pow},
    {N(IDIV), 2, NO_SELF, (void *)fun_Math_idiv},
    {N(IMOD), 2, NO_SELF, (void *)fun_Math_imod},
    {N(IMUL), 2, NO_SELF, (void *)fun_Math_imul},
    {N(MIN), 2, NO_SELF, (void *)fun_Math_min},
    {N(MAX), 2, NO_SELF, (void *)fun_Math_max},
    {N(LENGTH), 0, PROP, (void *)prop_String_length},
    {N(CHARCODEAT), 1, 0, (void *)fun_String_charCodeAt}};

STATIC_ASSERT(2 <= DEVS_BUILTIN_MAX_ARGS);
STATIC_ASSERT(61440 == DEVS_FIRST_BUILTIN_FUNCTION);
