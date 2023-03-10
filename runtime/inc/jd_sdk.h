#pragma once

#include <string.h>
#include <stdint.h>

#include "jd_protocol.h"
#include "jd_client.h"
#include "network/jd_network.h"

typedef struct jd_transport_ctx jd_transport_ctx_t;

typedef struct {
    jd_transport_ctx_t *(*alloc)(void);
    void (*set_frame_callback)(jd_transport_ctx_t *ctx,
                               void (*cb)(void *userdata, jd_frame_t *frame), void *userdata);
    int (*connect)(jd_transport_ctx_t *ctx, const char *address);
    int (*send_frame)(jd_transport_ctx_t *ctx, jd_frame_t *frame);
    void (*free)(jd_transport_ctx_t *ctx);
} jd_transport_t;

extern const jd_transport_t hf2_transport;
extern const jd_transport_t sock_transport;

void tx_init(const jd_transport_t *transport_, jd_transport_ctx_t *ctx);
void tx_process(void);

int devs_client_deploy(const void *img, unsigned imgsize);

uint64_t jd_device_id_from_string(const char *str);
void flash_init(void);
void flush_dmesg(void);
void app_print_dmesg(const char *ptr);