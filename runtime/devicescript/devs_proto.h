#pragma once
#include <stdint.h>

typedef struct {
    uint16_t builtin_string_id;    // DEVS_BUILTIN_STRING_xxx
    uint16_t builtin_function_idx; // 0xfXXX
} devs_builtin_proto_entry_t;

typedef struct {
    uint16_t builtin_string_id; // DEVS_BUILTIN_STRING_xxx
    uint8_t num_args;
    uint8_t flags; // DEVS_BUILTIN_FLAG_
    void *handler;
} devs_builtin_function_t;

#define DEVS_BUILTIN_MAX_ARGS 4
#define DEVS_BUILTIN_FLAG_IS_PROPERTY 0x01
#define DEVS_BUILTIN_FLAG_ASYNC_CALL 0x02
#define DEVS_BUILTIN_FLAG_NO_SELF 0x04

extern uint16_t devs_num_builtin_functions;
extern const devs_builtin_function_t devs_builtin_functions[];
