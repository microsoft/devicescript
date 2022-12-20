// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF

#define N(n) (DEVS_BUILTIN_STRING_##n)

// impl_buffer.c
void fun1_Buffer_alloc(devs_ctx_t *ctx);
value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self);
void meth0_Buffer_toString(devs_ctx_t *ctx);
void meth3_Buffer_fillAt(devs_ctx_t *ctx);
void meth4_Buffer_blitAt(devs_ctx_t *ctx);
// impl_ds.c
void fun1_DeviceScript_sleepMs(devs_ctx_t *ctx);
void fun1_DeviceScript_panic(devs_ctx_t *ctx);
void fun0_DeviceScript_reboot(devs_ctx_t *ctx);
// impl_math.c
void fun1_Math_ceil(devs_ctx_t *ctx);
void fun1_Math_floor(devs_ctx_t *ctx);
void fun1_Math_round(devs_ctx_t *ctx);
void fun0_Math_random(devs_ctx_t *ctx);
void fun1_Math_randomInt(devs_ctx_t *ctx);
void fun1_Math_log(devs_ctx_t *ctx);
void fun2_Math_pow(devs_ctx_t *ctx);
void fun2_Math_idiv(devs_ctx_t *ctx);
void fun2_Math_imod(devs_ctx_t *ctx);
void fun2_Math_imul(devs_ctx_t *ctx);
void fun2_Math_min(devs_ctx_t *ctx);
void fun2_Math_max(devs_ctx_t *ctx);
// impl_object.c
// impl_role.c
value_t prop_Role_isConnected(devs_ctx_t *ctx, value_t self);
// impl_string.c
value_t prop_String_length(devs_ctx_t *ctx, value_t self);
void meth1_String_charCodeAt(devs_ctx_t *ctx);

static const devs_builtin_proto_entry_t Buffer_entries[] = { //
    {N(ALLOC), 0xf000},
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 0xf001},
    {N(TOSTRING), 0xf002},
    {N(FILLAT), 0xf003},
    {N(BLITAT), 0xf004},
    {0, 0}};

static const devs_builtin_proto_entry_t DeviceScript_entries[] = { //
    {N(SLEEPMS), 0xf005},
    {N(PANIC), 0xf006},
    {N(REBOOT), 0xf007},
    {0, 0}};

static const devs_builtin_proto_entry_t Math_entries[] = { //
    {N(CEIL), 0xf008},
    {N(FLOOR), 0xf009},
    {N(ROUND), 0xf00a},
    {N(RANDOM), 0xf00b},
    {N(RANDOMINT), 0xf00c},
    {N(LOG), 0xf00d},
    {N(POW), 0xf00e},
    {N(IDIV), 0xf00f},
    {N(IMOD), 0xf010},
    {N(IMUL), 0xf011},
    {N(MIN), 0xf012},
    {N(MAX), 0xf013},
    {0, 0}};

static const devs_builtin_proto_entry_t Role_prototype_entries[] = { //
    {N(ISCONNECTED), 0xf014},
    {0, 0}};

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 0xf015},
    {N(CHARCODEAT), 0xf016},
    {0, 0}};

const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {
    [DEVS_BUILTIN_OBJECT_BUFFER] = {DEVS_BUILTIN_PROTO_INIT, Buffer_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, Buffer_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DEVICESCRIPT] = {DEVS_BUILTIN_PROTO_INIT, DeviceScript_entries},
    [DEVS_BUILTIN_OBJECT_MATH] = {DEVS_BUILTIN_PROTO_INIT, Math_entries},
    [DEVS_BUILTIN_OBJECT_ROLE_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, Role_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, String_prototype_entries},
};

uint16_t devs_num_builtin_functions = 23;
const devs_builtin_function_t devs_builtin_functions[23] = {
    {N(ALLOC), 1, NO_SELF, {.meth = fun1_Buffer_alloc}},
    {N(LENGTH), 0, PROP, {.prop = prop_Buffer_length}},
    {N(TOSTRING), 0, 0, {.meth = meth0_Buffer_toString}},
    {N(FILLAT), 3, 0, {.meth = meth3_Buffer_fillAt}},
    {N(BLITAT), 4, 0, {.meth = meth4_Buffer_blitAt}},
    {N(SLEEPMS), 1, NO_SELF, {.meth = fun1_DeviceScript_sleepMs}},
    {N(PANIC), 1, NO_SELF, {.meth = fun1_DeviceScript_panic}},
    {N(REBOOT), 0, NO_SELF, {.meth = fun0_DeviceScript_reboot}},
    {N(CEIL), 1, NO_SELF, {.meth = fun1_Math_ceil}},
    {N(FLOOR), 1, NO_SELF, {.meth = fun1_Math_floor}},
    {N(ROUND), 1, NO_SELF, {.meth = fun1_Math_round}},
    {N(RANDOM), 0, NO_SELF, {.meth = fun0_Math_random}},
    {N(RANDOMINT), 1, NO_SELF, {.meth = fun1_Math_randomInt}},
    {N(LOG), 1, NO_SELF, {.meth = fun1_Math_log}},
    {N(POW), 2, NO_SELF, {.meth = fun2_Math_pow}},
    {N(IDIV), 2, NO_SELF, {.meth = fun2_Math_idiv}},
    {N(IMOD), 2, NO_SELF, {.meth = fun2_Math_imod}},
    {N(IMUL), 2, NO_SELF, {.meth = fun2_Math_imul}},
    {N(MIN), 2, NO_SELF, {.meth = fun2_Math_min}},
    {N(MAX), 2, NO_SELF, {.meth = fun2_Math_max}},
    {N(ISCONNECTED), 0, PROP, {.prop = prop_Role_isConnected}},
    {N(LENGTH), 0, PROP, {.prop = prop_String_length}},
    {N(CHARCODEAT), 1, 0, {.meth = meth1_String_charCodeAt}}};

STATIC_ASSERT(4 <= DEVS_BUILTIN_MAX_ARGS);
STATIC_ASSERT(61440 == DEVS_FIRST_BUILTIN_FUNCTION);
