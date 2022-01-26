#pragma once

#include "jd_protocol.h"

#define JACS_PANIC_REBOOT 60000
#define JACS_PANIC_TIMEOUT 60001
#define JACS_PANIC_INTERNAL_ERROR 60002

typedef struct jacs_ctx jacs_ctx_t;

int jacs_verify(const uint8_t *img, uint32_t size);

jacs_ctx_t *jacs_create_ctx(const uint8_t *img, uint32_t size);
void jacs_restart(jacs_ctx_t *ctx);
unsigned jacs_error_code(jacs_ctx_t *ctx);
void jacs_process(jacs_ctx_t *ctx);
void jacs_handle_packet(jacs_ctx_t *ctx, jd_packet_t *pkt);
void jacs_free_ctx(jacs_ctx_t *ctx);
