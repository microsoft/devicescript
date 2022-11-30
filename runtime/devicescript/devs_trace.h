#pragma once

#define JACS_TRACE_EV_NOW 0x40

#define JACS_TRACE_EV_INIT 0x41
typedef struct {
    uint32_t image_hash;
} devs_trace_ev_init_t;

#define JACS_TRACE_EV_SERVICE_PACKET 0x42

#define JACS_TRACE_EV_NON_SERVICE_PACKET 0x43

#define JACS_TRACE_EV_BROADCAST_PACKET 0x44

#define JACS_TRACE_EV_ROLE_CHANGED 0x45

#define JACS_TRACE_EV_FIBER_RUN 0x46
typedef struct {
    uint16_t pc;
} devs_trace_ev_fiber_run_t;

#define JACS_TRACE_EV_FIBER_YIELD 0x47
typedef struct {
    uint16_t pc;
} devs_trace_ev_fiber_yield_t;


void devs_trace(devs_ctx_t *ctx, unsigned trace_type, const void *data, unsigned data_size);
