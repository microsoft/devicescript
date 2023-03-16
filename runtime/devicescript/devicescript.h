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

void devs_panic_handler(int exitcode);
void devs_deploy_handler(int exitcode);

#define DEVS_FLAG_GC_STRESS (1U << 0)

void devs_set_global_flags(uint32_t global_flags);
void devs_reset_global_flags(uint32_t global_flags);
uint32_t devs_get_global_flags(void);

// General utils
char *devs_json_escape(const char *str, unsigned sz);

// DeviceScript manager service
typedef struct {
#if !JD_SETTINGS_LARGE
    void *program_base;
    uint32_t max_program_size;
#endif
} devsmgr_cfg_t;

void devsmgr_init(const devsmgr_cfg_t *cfg);
// start all related services, including network and debugging
void devs_service_full_init(const devsmgr_cfg_t *cfg);

devs_ctx_t *devsmgr_get_ctx(void);
int devsmgr_deploy(const void *img, unsigned imgsize);
int devsmgr_get_hash(uint8_t hash[JD_SHA256_HASH_BYTES]);
int devsmgr_deploy_start(uint32_t sz);
int devsmgr_deploy_write(const void *buf, unsigned size);
void devsmgr_restart(void);

const devsmgr_cfg_t *devsmgr_init_mem(unsigned size);

void devsdbg_init(void);
void devsdbg_suspend_cb(devs_ctx_t *ctx);

typedef struct {
    int (*send_message)(int data_type, const char *topic, const void *data, unsigned datasize);
    int (*is_connected)(void);
    size_t max_bin_upload_size;
    int (*service_query)(jd_packet_t *pkt);
} devscloud_api_t;
extern const devscloud_api_t noop_cloud;
extern const devscloud_api_t wssk_cloud;

void devscloud_on_message(int data_type, const void *data, unsigned datasize);
void devscloud_init(const devscloud_api_t *cloud_api);
