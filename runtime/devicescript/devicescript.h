#pragma once

#include "jd_protocol.h"
#include "jd_client.h"
#include "network/jd_network.h"
#include "jacdac/dist/c/devicescriptmanager.h"
#include "jacdac/dist/c/timeseriesaggregator.h"

#define DEVS_PANIC_REBOOT 60000
#define DEVS_PANIC_TIMEOUT 60001
#define DEVS_PANIC_INTERNAL_ERROR 60002  // not used
#define DEVS_PANIC_RUNTIME_FAILURE 60003 // not used
#define DEVS_PANIC_OOM 60004
#define DEVS_PANIC_UNHANDLED_EXCEPTION 60005

typedef struct devs_ctx devs_ctx_t;

typedef struct {
    uint8_t mgr_service_idx;
} devs_cfg_t;

int devs_verify(const uint8_t *img, uint32_t size);
void devs_dump_versions(const void *img);

devs_ctx_t *devs_create_ctx(const uint8_t *img, uint32_t size, const devs_cfg_t *cfg);
void devs_restart(devs_ctx_t *ctx);
unsigned devs_error_code(devs_ctx_t *ctx, unsigned *pc);
void devs_client_event_handler(devs_ctx_t *ctx, int event_id, void *arg0, void *arg1);
void devs_free_ctx(devs_ctx_t *ctx);
void devs_set_logging(devs_ctx_t *ctx, uint8_t logging);

void devs_panic_handler(int exitcode);
void devs_deploy_handler(int exitcode);

#define DEVS_FLAG_GC_STRESS (1U << 0)

void devs_set_global_flags(uint32_t global_flags);
void devs_reset_global_flags(uint32_t global_flags);
uint32_t devs_get_global_flags(void);

// DeviceScript manager service
typedef struct {
    void *program_base;
    uint32_t max_program_size;
} devsmgr_cfg_t;

void devsmgr_init(const devsmgr_cfg_t *cfg);
void devsmgr_set_logging(bool logging);

devs_ctx_t *devsmgr_get_ctx(void);
int devsmgr_deploy(const void *img, unsigned imgsize);
int devsmgr_get_hash(uint8_t hash[JD_SHA256_HASH_BYTES]);
int devsmgr_deploy_start(uint32_t sz);
int devsmgr_deploy_write(const void *buf, unsigned size);
void devsmgr_restart(void);

void devsmgr_init_mem(unsigned size);

void devsdbg_init(void);
void devsdbg_suspend_cb(devs_ctx_t *ctx);

typedef struct {
    int (*upload)(const char *label, int numvals, double *vals);
    int (*bin_upload)(const void *data, unsigned datasize);
    // label != NULL || service != NULL
    int (*agg_upload)(const char *label, jd_device_service_t *service,
                      jd_timeseries_aggregator_stored_report_t *data);
    int (*is_connected)(void);
    size_t max_bin_upload_size;
    int (*respond_method)(uint32_t method_id, uint32_t status, int numvals, double *vals);
} devscloud_api_t;
extern const devscloud_api_t noop_cloud;
extern const devscloud_api_t wssk_cloud;
void devscloud_on_method(const char *label, uint32_t method_id, int numvals, const double *vals);
void devscloud_init(const devscloud_api_t *cloud_api);

void tsagg_init(const devscloud_api_t *cloud_api);
void tsagg_update(const char *name, double v);

// extcloud.c
extern const devscloud_api_t extcloud;
void extcloud_init(void);

// aggbuffer.c
void aggbuffer_init(const devscloud_api_t *api);
int aggbuffer_flush(void);
int aggbuffer_upload(const char *label, jd_device_service_t *service,
                     jd_timeseries_aggregator_stored_report_t *data);
