// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF

#define N(n) (DEVS_BUILTIN_STRING_##n)

// impl_array.c
value_t prop_Array_length(devs_ctx_t *ctx, value_t self);
void meth2_Array_insert(devs_ctx_t *ctx);
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
void funX_DeviceScript_format(devs_ctx_t *ctx);
void fun1_DeviceScript_log(devs_ctx_t *ctx);
// impl_function.c
void methX_Function_start(devs_ctx_t *ctx);
// impl_math.c
void fun1_Math_ceil(devs_ctx_t *ctx);
void fun1_Math_floor(devs_ctx_t *ctx);
void fun1_Math_round(devs_ctx_t *ctx);
void fun1_Math_abs(devs_ctx_t *ctx);
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
void meth1_String_charAt(devs_ctx_t *ctx);

static const devs_builtin_proto_entry_t Array_prototype_entries[] = { //
    {N(LENGTH), 50000},
    {N(INSERT), 50001},
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_entries[] = { //
    {N(ALLOC), 50002},
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 50003},
    {N(TOSTRING), 50004},
    {N(FILLAT), 50005},
    {N(BLITAT), 50006},
    {0, 0}};

static const devs_builtin_proto_entry_t DeviceScript_entries[] = { //
    {N(SLEEPMS), 50007}, {N(PANIC), 50008}, {N(REBOOT), 50009},
    {N(FORMAT), 50010},  {N(LOG), 50011},   {0, 0}};

static const devs_builtin_proto_entry_t Function_prototype_entries[] = { //
    {N(START), 50012},
    {0, 0}};

static const devs_builtin_proto_entry_t Math_entries[] = { //
    {N(CEIL), 50013},   {N(FLOOR), 50014},
    {N(ROUND), 50015},  {N(ABS), 50016},
    {N(RANDOM), 50017}, {N(RANDOMINT), 50018},
    {N(LOG), 50019},    {N(POW), 50020},
    {N(IDIV), 50021},   {N(IMOD), 50022},
    {N(IMUL), 50023},   {N(MIN), 50024},
    {N(MAX), 50025},    {0, 0}};

static const devs_builtin_proto_entry_t Role_prototype_entries[] = { //
    {N(ISCONNECTED), 50026},
    {0, 0}};

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 50027},
    {N(CHARCODEAT), 50028},
    {N(CHARAT), 50029},
    {0, 0}};

const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {
    [DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, Array_prototype_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER] = {DEVS_BUILTIN_PROTO_INIT, Buffer_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, Buffer_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DEVICESCRIPT] = {DEVS_BUILTIN_PROTO_INIT, DeviceScript_entries},
    [DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT,
                                                Function_prototype_entries},
    [DEVS_BUILTIN_OBJECT_MATH] = {DEVS_BUILTIN_PROTO_INIT, Math_entries},
    [DEVS_BUILTIN_OBJECT_ROLE_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, Role_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, String_prototype_entries},
};

uint16_t devs_num_builtin_functions = 30;
const devs_builtin_function_t devs_builtin_functions[30] = {
    {N(LENGTH), 0, PROP, {.prop = prop_Array_length}},
    {N(INSERT), 2, 0, {.meth = meth2_Array_insert}},
    {N(ALLOC), 1, NO_SELF, {.meth = fun1_Buffer_alloc}},
    {N(LENGTH), 0, PROP, {.prop = prop_Buffer_length}},
    {N(TOSTRING), 0, 0, {.meth = meth0_Buffer_toString}},
    {N(FILLAT), 3, 0, {.meth = meth3_Buffer_fillAt}},
    {N(BLITAT), 4, 0, {.meth = meth4_Buffer_blitAt}},
    {N(SLEEPMS), 1, NO_SELF, {.meth = fun1_DeviceScript_sleepMs}},
    {N(PANIC), 1, NO_SELF, {.meth = fun1_DeviceScript_panic}},
    {N(REBOOT), 0, NO_SELF, {.meth = fun0_DeviceScript_reboot}},
    {N(FORMAT), 0, NO_SELF, {.meth = funX_DeviceScript_format}},
    {N(LOG), 1, NO_SELF, {.meth = fun1_DeviceScript_log}},
    {N(START), 0, 0, {.meth = methX_Function_start}},
    {N(CEIL), 1, NO_SELF, {.meth = fun1_Math_ceil}},
    {N(FLOOR), 1, NO_SELF, {.meth = fun1_Math_floor}},
    {N(ROUND), 1, NO_SELF, {.meth = fun1_Math_round}},
    {N(ABS), 1, NO_SELF, {.meth = fun1_Math_abs}},
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
    {N(CHARCODEAT), 1, 0, {.meth = meth1_String_charCodeAt}},
    {N(CHARAT), 1, 0, {.meth = meth1_String_charAt}}};

STATIC_ASSERT(4 <= DEVS_BUILTIN_MAX_ARGS);
STATIC_ASSERT(50000 == DEVS_FIRST_BUILTIN_FUNCTION);
