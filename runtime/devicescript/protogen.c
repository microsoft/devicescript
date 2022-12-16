// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL 0x02
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF 0x04

#define N(n) (DEVS_BUILTIN_STRING_##n)

// impl_string.c
value_t prop_String_length(devs_ctx_t *ctx, value_t self);
value_t fun_String_charCodeAt(devs_ctx_t *ctx, value_t self, value_t idxv);
value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self);

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 0xf000},
    {N(CHARCODEAT), 0xf001},
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 0xf002},
    {0, 0}};

const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, String_prototype_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, Buffer_prototype_entries},
};

uint16_t devs_num_builtin_functions = 3;
const devs_builtin_function_t devs_builtin_functions[3] = {
    {N(LENGTH), 0, PROP, (void *)prop_String_length},
    {N(CHARCODEAT), 1, 0, (void *)fun_String_charCodeAt},
    {N(LENGTH), 0, PROP, (void *)prop_Buffer_length}};

STATIC_ASSERT(1 <= DEVS_BUILTIN_MAX_ARGS);
STATIC_ASSERT(61440 == DEVS_FIRST_BUILTIN_FUNCTION);
