#pragma once

#include "jd_protocol.h"
#include "jd_client.h"
#include "jacdac/dist/c/jacscriptmanager.h"
#include "jacdac/dist/c/timeseriesaggregator.h"

#define JACS_PANIC_REBOOT 60000
#define JACS_PANIC_TIMEOUT 60001
#define JACS_PANIC_INTERNAL_ERROR 60002
#define JACS_PANIC_RUNTIME_FAILURE 60003

typedef struct jacs_ctx jacs_ctx_t;

typedef struct {
    uint8_t mgr_service_idx;
} jacs_cfg_t;

int jacs_verify(const uint8_t *img, uint32_t size);

jacs_ctx_t *jacs_create_ctx(const uint8_t *img, uint32_t size, const jacs_cfg_t *cfg);
void jacs_restart(jacs_ctx_t *ctx);
unsigned jacs_error_code(jacs_ctx_t *ctx, unsigned *pc);
void jacs_client_event_handler(jacs_ctx_t *ctx, int event_id, void *arg0, void *arg1);
void jacs_free_ctx(jacs_ctx_t *ctx);
void jacs_set_logging(jacs_ctx_t *ctx, uint8_t logging);

// Jacscript manager service
typedef struct {
    void *program_base;
    uint32_t max_program_size;
} jacscriptmgr_cfg_t;

void jacscriptmgr_init(const jacscriptmgr_cfg_t *cfg);

jacs_ctx_t *jacscriptmgr_get_ctx(void);
int jacscriptmgr_deploy(const void *img, unsigned imgsize);

typedef struct {
    int (*upload)(const char *label, int numvals, double *vals);
    int (*bin_upload)(const void *data, unsigned datasize);
    // label != NULL || service != NULL
    int (*agg_upload)(const char *label, jd_device_service_t *service,
                      jd_timeseries_aggregator_stored_report_t *data);
    int (*is_connected)(void);
    size_t max_bin_upload_size;
} jacscloud_api_t;
void jacscloud_init(const jacscloud_api_t *cloud_api);

void tsagg_init(const jacscloud_api_t *cloud_api);
void tsagg_update(const char *name, double v);

// extcloud.c
extern const jacscloud_api_t extcloud;
void extcloud_init(void);