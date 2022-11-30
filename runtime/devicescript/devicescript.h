#pragma once

#include "jd_protocol.h"
#include "jd_client.h"
#include "network/jd_network.h"
#include "jacdac/dist/c/devicescriptmanager.h"
#include "jacdac/dist/c/timeseriesaggregator.h"

#define JACS_PANIC_REBOOT 60000
#define JACS_PANIC_TIMEOUT 60001
#define JACS_PANIC_INTERNAL_ERROR 60002
#define JACS_PANIC_RUNTIME_FAILURE 60003
#define JACS_PANIC_OOM 60004

typedef struct devs_ctx devs_ctx_t;

typedef struct {
    uint8_t mgr_service_idx;
} devs_cfg_t;

int devs_verify(const uint8_t *img, uint32_t size);

devs_ctx_t *devs_create_ctx(const uint8_t *img, uint32_t size, const devs_cfg_t *cfg);
void devs_restart(devs_ctx_t *ctx);
unsigned devs_error_code(devs_ctx_t *ctx, unsigned *pc);
void devs_client_event_handler(devs_ctx_t *ctx, int event_id, void *arg0, void *arg1);
void devs_free_ctx(devs_ctx_t *ctx);
void devs_set_logging(devs_ctx_t *ctx, uint8_t logging);

#define JACS_FLAG_GC_STRESS (1U << 0)

void devs_set_global_flags(uint32_t global_flags);
void devs_reset_global_flags(uint32_t global_flags);
uint32_t devs_get_global_flags(void);

// this is used by DeviceScript Manager and implemented by default in software
#define JD_SHA256_HASH_BYTES 32

#ifndef JD_SHA256_SOFT
#define JD_SHA256_SOFT 1
#endif

void jd_sha256_setup(void);
void jd_sha256_update(const void *buf, unsigned size);
void jd_sha256_finish(uint8_t hash[JD_SHA256_HASH_BYTES]);

// these are implemented based on the jd_sha256_* above
void jd_sha256_hmac_setup(const void *key, unsigned keysize);
void jd_sha256_hmac_update(const void *buf, unsigned size);
void jd_sha256_hmac_finish(uint8_t hash[JD_SHA256_HASH_BYTES]);
void jd_sha256_hkdf(const void *salt, unsigned salt_size, const void *key, unsigned key_size,
                    const void *info, unsigned info_size, const void *info2, unsigned info_size2,
                    uint8_t outkey[JD_SHA256_HASH_BYTES]);

// DeviceScript manager service
typedef struct {
    void *program_base;
    uint32_t max_program_size;
} devicescriptmgr_cfg_t;

void devicescriptmgr_init(const devicescriptmgr_cfg_t *cfg);

devs_ctx_t *devicescriptmgr_get_ctx(void);
int devicescriptmgr_deploy(const void *img, unsigned imgsize);
int devicescriptmgr_get_hash(uint8_t hash[JD_SHA256_HASH_BYTES]);
int devicescriptmgr_deploy_start(uint32_t sz);
int devicescriptmgr_deploy_write(const void *buf, unsigned size);

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
