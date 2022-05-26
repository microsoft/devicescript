#include "jacs_internal.h"
#include "jacdac/dist/c/timeseriesaggregator.h"

#define LOG(msg, ...) DMESG("aggbuf: " msg, ##__VA_ARGS__)

#define MAX_DATA 8
#define MAX_MESSAGE 512

#define JDBR_MAGIC 0x5242444a // "JDBR"
typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint64_t device_time;
    uint8_t reserved[28];
} jdbr_header_t;

typedef struct {
    uint32_t timeoffset;
    float value;
} jdbr_data_point_t;

typedef struct data_acc {
    struct data_acc *next;
    char *label;
    uint8_t num_data_points;
    jdbr_data_point_t data[MAX_DATA];
} data_acc_t;

static const jacscloud_api_t *cloud_api;
static data_acc_t *series;
static uint16_t acc_size;

void aggbuffer_init(const jacscloud_api_t *api) {
    cloud_api = api;
}

int aggbuffer_flush(void) {
    if (acc_size == 0)
        return 0;

    if (!cloud_api->is_connected())
        return -1;

    acc_size += sizeof(jdbr_header_t);
    uint8_t *buf = jd_alloc(acc_size);
    jdbr_header_t *hd = (void *)buf;
    hd->magic = JDBR_MAGIC;
    hd->device_time = now_ms_long;

    uint32_t n = (uint32_t)now_ms_long;

    uint8_t *dst = buf + sizeof(jdbr_header_t);
    for (data_acc_t *p = series; p; p = p->next) {
        int len = strlen(p->label) + 1;
        memcpy(dst, p->label, len);
        dst += len;
        uint32_t data_bytes = p->num_data_points * sizeof(jdbr_data_point_t);
        memcpy(dst, &data_bytes, 4);
        dst += 4;
        for (int i = 0; i < p->num_data_points; ++i)
            p->data[i].timeoffset = n - p->data[i].timeoffset;
        memcpy(dst, p->data, data_bytes);
        // restore, in case we fail to send
        for (int i = 0; i < p->num_data_points; ++i)
            p->data[i].timeoffset = n - p->data[i].timeoffset;
        dst += data_bytes;
    }

    JD_ASSERT(dst - buf == acc_size);

    int r = cloud_api->bin_upload(buf, acc_size);

    if (r == 0)
        LOG("uploaded %d bytes", acc_size);
    else
        LOG("failed to upload %d bytes", acc_size);

    jd_free(buf);

    // if we failed to upload, don't clear the data
    if (r)
        return r;

    acc_size = 0;
    while (series) {
        data_acc_t *p = series;
        series = p->next;
        jd_free(p->label);
        jd_free(p);
    }

    return 0;
}

int aggbuffer_upload(const char *label, jd_device_service_t *service, uint8_t mode,
                     jd_timeseries_aggregator_stored_report_t *data) {
    if (!label)
        label = "";

    char *upl_label;
    if (service) {
        jd_device_t *dev = jd_service_parent(service);

        int idx = 0;
        for (int i = 1; i < service->service_index; ++i)
            if (dev->services[i].service_class == service->service_class)
                idx++;

        upl_label = jd_to_hex_a(&dev->device_identifier, 8);

        const jacs_packed_service_desc_t *desc =
            jacs_get_packed_service_desc(service->service_class);
        if (desc) {
            upl_label = jd_sprintf_a("%-s:%s", upl_label, desc->name);
            if (idx > 0)
                upl_label = jd_sprintf_a("%-s%d", upl_label, idx + 1);
        } else {
            upl_label = jd_sprintf_a("%-s:%x", upl_label, service->service_class);
            if (idx > 0)
                upl_label = jd_sprintf_a("%-s_%d", upl_label, idx + 1);
        }

        if (label[0])
            upl_label = jd_sprintf_a("%-s_%s", upl_label, label);
    } else {
        uint64_t self = jd_device_id();
        upl_label = jd_sprintf_a("%-s:%s", jd_to_hex_a(&self, 8), label);
    }

    LOG("upl: '%s' %f", upl_label, data->avg);

    data_acc_t *p;
    for (p = series; p; p = p->next) {
        if (strcmp(p->label, upl_label) == 0)
            break;
    }

    int res = 0;

    if (p && p->num_data_points >= MAX_DATA) {
        res = aggbuffer_flush();
        if (res) {
            jd_free(upl_label);
            return res; // couldn't send, and can't add this data point...
        }
        p = NULL;
    }

    if (p) {
        jd_free(upl_label);
    } else {
        p = jd_alloc(sizeof(*p));
        p->label = upl_label;
        p->next = series;
        series = p;
        acc_size += strlen(upl_label) + 1 + 4;
    }

    int idx = p->num_data_points++;
    p->data[idx].timeoffset = now_ms;
    p->data[idx].value = data->avg;
    acc_size += sizeof(jdbr_data_point_t);

    if (res == 0 && acc_size > MAX_MESSAGE - sizeof(jdbr_header_t))
        res = aggbuffer_flush();

    return res;
}
