#pragma once
#include <stdint.h>

typedef struct {
    uint16_t builtin_string_id;
    uint8_t num_args;
    uint8_t flags;
    void *handler;
} devs_builtin_proto_entry_t;

#define DEVS_BUILTIN_MAX_ARGS 4
#define DEVS_BUILTIN_FLAG_IS_PROPERTY 0x01
#define DEVS_BUILTIN_FLAG_ASYNC_CALL 0x02
#define DEVS_BUILTIN_FLAG_NO_SELF 0x04
