#include "devs_internal.h"
#include "jacdac/dist/c/timeseriesaggregator.h"

#include <math.h>

// TODO: try to synchronize series to reduce number of uploads

// all values in ms
#define MAX_WINDOW (24 * 3600 * 1000)
#define CONT_WINDOW_0 5000
#define CONT_WINDOW_FINAL 60000
#define CONT_WINDOW_STEP 2000 // every 5000ms

#define LOG(msg, ...) DMESG("tsagg: " msg, ##__VA_ARGS__)
#define MS(n) ((n) << 10)

typedef struct tsagg_series {
    struct tsagg_series *next;

    jd_device_service_t *service;
    uint8_t prev_streaming_samples;
    uint8_t streaming_samples;

    int8_t upload; // -1 - use default, 0/1 - yes/no

    char *label;

    uint32_t window_ms;
    uint32_t previous_sample;

    double v_previous;

    jd_timeseries_aggregator_stored_report_t acc;
} tsagg_series_t;

struct srv_state {
    SRV_COMMON;

    // regs:
    uint32_t sensor_watchdog_period;
    uint32_t default_window;
    uint8_t upload_unlabelled;
    uint8_t default_upload;
    uint8_t fast_start;

    // not regs:
    uint32_t next_local_streaming_samples;
    uint32_t next_global_streaming_samples;
    uint32_t watchdog_timer_ms;

    const devscloud_api_t *api;
    tsagg_series_t *series;

    uint32_t current_cont_window;
};

REG_DEFINITION(                                                   //
    tsagg_regs,                                                   //
    REG_SRV_COMMON,                                               //
    REG_U32(JD_TIMESERIES_AGGREGATOR_REG_SENSOR_WATCHDOG_PERIOD), //
    REG_U32(JD_TIMESERIES_AGGREGATOR_REG_DEFAULT_WINDOW),         //
    REG_U8(JD_TIMESERIES_AGGREGATOR_REG_UPLOAD_UNLABELLED),       //
    REG_U8(JD_TIMESERIES_AGGREGATOR_REG_DEFAULT_UPLOAD),          //
    REG_U8(JD_TIMESERIES_AGGREGATOR_REG_FAST_START),              //
)

const devs_packed_service_desc_t *devs_get_packed_service_desc(uint32_t service_class) {
    int l = 0;
    int r = devs_num_packed_service_descs - 1;
    while (l <= r) {
        int m = (l + r) / 2;
        if (devs_packed_service_descs[m].service_class < service_class)
            l = m + 1;
        else if (devs_packed_service_descs[m].service_class > service_class)
            r = m - 1;
        else
            return &devs_packed_service_descs[m];
    }
    return NULL;
}

static void log_series(tsagg_series_t *s, const char *msg) {
    if (s->service) {
        char shortid[5];
        jd_device_short_id(shortid, jd_service_parent(s->service)->device_identifier);
        if (s->label)
            LOG("%s (%s/%d): %s", s->label, shortid, s->service->service_index, msg);
        else
            LOG("%s/%d: %s", shortid, s->service->service_index, msg);
    } else {
        LOG("%s: %s", s->label, msg);
    }
}

static uint32_t get_window_ms(srv_t *state, tsagg_series_t *ts) {
    if (ts->window_ms != 0)
        return ts->window_ms;

    if (state->fast_start) {
        if (!state->current_cont_window)
            state->current_cont_window = CONT_WINDOW_0;
        return state->current_cont_window;
    } else {
        return state->default_window;
    }
}

static void feed_watchdog(srv_t *state) {
    if (state->sensor_watchdog_period)
        state->watchdog_timer_ms = now_ms + state->sensor_watchdog_period;
}

static tsagg_series_t *add_series(srv_t *state, jd_device_service_t *serv) {
    tsagg_series_t *ts = jd_alloc(sizeof(tsagg_series_t));

    ts->service = serv;
    ts->upload = -1;

    ts->next = state->series;
    state->series = ts;

    ts->v_previous = NAN;
    ts->acc.start_time = now_ms;
    ts->acc.end_time = now_ms + get_window_ms(state, ts);

    if (serv) {
        jd_role_t *r = jd_role_by_service(serv);
        if (r)
            ts->label = jd_strdup(r->name);
    }

    log_series(ts, "created");

    return ts;
}

static tsagg_series_t *lookup_series(srv_t *state, const char *label, int len) {
    for (tsagg_series_t *ts = state->series; ts; ts = ts->next) {
        if (ts->label && memcmp(ts->label, label, len + 1) == 0)
            return ts;
    }
    return NULL;
}

static tsagg_series_t *lookup_or_add_series(srv_t *state, const char *label, int len) {
    if (!label)
        label = "?";
    tsagg_series_t *ts = lookup_series(state, label, len);
    if (ts)
        return ts;
    ts = add_series(state, NULL);
    ts->label = jd_alloc(len + 1);
    memcpy(ts->label, label, len);
    return ts;
}

static void dev_created(srv_t *state, jd_device_t *dev) {
    for (unsigned i = 1; i < dev->num_services; ++i) {
        const devs_packed_service_desc_t *desc =
            devs_get_packed_service_desc(dev->services[i].service_class);
        if (!desc)
            continue;
        add_series(state, &dev->services[i]);
    }
}

static void free_series(tsagg_series_t *ts) {
    jd_free(ts->label);
    jd_free(ts);
}

static void dev_destroyed(srv_t *state, jd_device_t *dev) {
    tsagg_series_t *n, *prev = NULL;
    tsagg_series_t *ts = state->series;

    while (ts) {
        n = ts->next;
        if (dev == NULL || (ts->service && jd_service_parent(ts->service) == dev)) {
            if (prev == NULL)
                state->series = n;
            else
                prev->next = n;
            free_series(ts);
            ts = n;
        } else {
            prev = ts;
            ts = n;
        }
    }
}

static void role_changed(srv_t *state, jd_device_service_t *serv, jd_role_t *role) {
    // we don't care about un-assignments
    if (!serv)
        return;

    for (tsagg_series_t *ts = state->series; ts; ts = ts->next) {
        int eq = ts->label == NULL ? 0 : strcmp(ts->label, role->name) == 0;
        if (ts->service == serv) {
            if (!eq) {
                jd_free(ts->label);
                ts->label = jd_strdup(role->name);
            }
        } else if (eq) {
            jd_free(ts->label);
            ts->label = NULL;
        }
    }
}

static void series_reset(tsagg_series_t *ts) {
    ts->acc.min = ts->acc.max = ts->v_previous;
    ts->acc.avg = 0;
    ts->acc.num_samples = 0;
    ts->previous_sample = ts->acc.start_time;
}

static void series_update(srv_t *state, tsagg_series_t *ts, double v) {
    if (isnan(v))
        return;
    if (isnan(ts->v_previous)) {
        // first sample
        ts->v_previous = v;
        series_reset(ts);
    }

    ts->acc.num_samples++;

    if (in_past_ms(ts->acc.end_time)) {
        uint32_t delta = ts->acc.end_time - ts->previous_sample;
        ts->acc.avg += ts->v_previous * delta;
        ts->previous_sample = ts->acc.end_time;
    } else {
        uint32_t delta = now_ms - ts->previous_sample;
        ts->acc.avg += ts->v_previous * delta;
        ts->previous_sample = now_ms;
    }

    if (v > ts->acc.max)
        ts->acc.max = v;
    if (v < ts->acc.min)
        ts->acc.min = v;
    ts->v_previous = v;
}

static void dev_packet(srv_t *state, jd_device_service_t *serv, jd_packet_t *pkt) {
    if (pkt->service_command != JD_GET(JD_REG_READING) && !jd_is_report(pkt))
        return;

    const devs_packed_service_desc_t *desc = devs_get_packed_service_desc(serv->service_class);
    if (desc == NULL)
        return;

    for (tsagg_series_t *ts = state->series; ts; ts = ts->next) {
        if (ts->service == serv) {
            if (ts->streaming_samples)
                ts->streaming_samples--;
            double v = devs_read_number(pkt->data, pkt->service_size, desc->numfmt);
            series_update(state, ts, v);
            feed_watchdog(state);
        }
    }
}

void tsagg_client_ev(void *_state, int event_id, void *arg0, void *arg1) {
    srv_t *state = _state;

    switch (event_id) {
    case JD_CLIENT_EV_DEVICE_CREATED:
        dev_created(state, arg0);
        break;

    case JD_CLIENT_EV_DEVICE_DESTROYED:
        JD_ASSERT(arg0);
        dev_destroyed(state, arg0);
        break;

    case JD_CLIENT_EV_SERVICE_PACKET:
        dev_packet(state, arg0, arg1);
        break;

    case JD_CLIENT_EV_ROLE_CHANGED:
        role_changed(state, arg0, arg1);
        break;
    }
}

void tsagg_process(srv_t *state) {
    if (state->sensor_watchdog_period && in_past_ms(state->watchdog_timer_ms)) {
        ERROR("sensor watchdog reset");
        target_reset();
    }

    // every 5s set streaming_samples of everyone who didn't stream anything
    if (jd_should_sample(&state->next_global_streaming_samples, MS(5000))) {
        for (tsagg_series_t *ts = state->series; ts; ts = ts->next) {
            if (ts->streaming_samples == ts->prev_streaming_samples)
                ts->streaming_samples = 0;
            ts->prev_streaming_samples = ts->streaming_samples;
        }

        // also do fast_start processing
        if (state->current_cont_window) {
            if (state->current_cont_window < state->default_window)
                state->current_cont_window += CONT_WINDOW_STEP;
            if (state->current_cont_window > state->default_window)
                state->current_cont_window = state->default_window;
        }
    }

    if (jd_should_sample(&state->next_local_streaming_samples, MS(100))) {
        for (tsagg_series_t *ts = state->series; ts; ts = ts->next) {
            if (ts->service && ts->streaming_samples < 50) {
                uint8_t num = 250;
                if (jd_service_send_cmd(ts->service, JD_SET(JD_REG_STREAMING_SAMPLES), &num,
                                        sizeof(num)) != 0) {
                    // sending failed; try again soon
                    state->next_local_streaming_samples = now + MS(8);
                    break;
                }
                ts->streaming_samples = num;
                // log_series(ts, "set streaming samples");
            }
        }
    }

    for (tsagg_series_t *ts = state->series; ts; ts = ts->next) {
        if (in_future_ms(ts->acc.end_time))
            continue;

        // log_series(ts, "window expire");
        if (ts->acc.num_samples == 0) {
            // no values
            ts->v_previous = NAN;
        } else {
            uint32_t delta = ts->acc.end_time - ts->previous_sample;
            double sum = ts->acc.avg + ts->v_previous * delta;

            int sz0 = offsetof(jd_timeseries_aggregator_stored_report_t, label);
            int lbllen = ts->label ? strlen(ts->label) : 0;
            int sz = sz0 + lbllen;
            // +1 for NUL character at the end of label
            jd_timeseries_aggregator_stored_report_t *data = jd_alloc(sz + 1);
            memcpy(data, &ts->acc, sz0);
            if (ts->label)
                memcpy(data->label, ts->label, lbllen);

            data->avg = sum / (ts->acc.end_time - ts->acc.start_time);

            if (jd_send(state->service_index, JD_TIMESERIES_AGGREGATOR_CMD_STORED, data, sz) != 0) {
                jd_free(data);
                continue; // try again later
            }

            int upload = ts->upload;
            if (upload == -1)
                upload = ts->label ? state->default_upload : state->upload_unlabelled;
            if (upload) {
                if (state->api->agg_upload(ts->label, ts->service, data) != 0)
                    log_series(ts, "upload failed");
            }
            jd_free(data);
        }

        ts->acc.start_time = ts->acc.end_time;
        ts->acc.end_time += get_window_ms(state, ts);
        series_reset(ts);
    }
}

static uint32_t clamp_window(uint32_t ms) {
    if (ms > MAX_WINDOW)
        return MAX_WINDOW;
    return ms;
}

#define LOOKUP_SERIES(tp)                                                                          \
    tp *p = (void *)pkt->data;                                                                     \
    int len = pkt->service_size - offsetof(tp, label);                                             \
    tsagg_series_t *ts = len > 0 ? lookup_or_add_series(state, p->label, len) : NULL;

void tsagg_handle_packet(srv_t *state, jd_packet_t *pkt) {
    switch (pkt->service_command) {
    case JD_TIMESERIES_AGGREGATOR_CMD_CLEAR:
        dev_destroyed(state, NULL);
        state->current_cont_window = 0; // restart fast upload
        return;

    case JD_TIMESERIES_AGGREGATOR_CMD_UPDATE: {
        LOOKUP_SERIES(jd_timeseries_aggregator_update_t);
        if (ts)
            series_update(state, ts, p->value);
        break;
    }

    case JD_TIMESERIES_AGGREGATOR_CMD_SET_WINDOW: {
        LOOKUP_SERIES(jd_timeseries_aggregator_set_window_t);
        if (ts)
            ts->window_ms = clamp_window(p->duration);
        break;
    }

    case JD_TIMESERIES_AGGREGATOR_CMD_SET_UPLOAD: {
        LOOKUP_SERIES(jd_timeseries_aggregator_set_upload_t);
        if (ts)
            ts->upload = p->upload != 0;
        break;
    }

    default:
        switch (service_handle_register_final(state, pkt, tsagg_regs)) {
        case JD_TIMESERIES_AGGREGATOR_REG_DEFAULT_WINDOW:
            state->default_window = clamp_window(state->default_window);
            break;

        case JD_TIMESERIES_AGGREGATOR_REG_SENSOR_WATCHDOG_PERIOD:
            state->sensor_watchdog_period = clamp_window(state->sensor_watchdog_period);
            feed_watchdog(state);
            break;
        }
        return;
    }
}

static srv_t *tsagg_state;

SRV_DEF(tsagg, JD_SERVICE_CLASS_TIMESERIES_AGGREGATOR);
void tsagg_init(const devscloud_api_t *cloud_api) {
    SRV_ALLOC(tsagg);
    tsagg_state = state;
    state->api = cloud_api;
    state->fast_start = 1;
    state->default_window = CONT_WINDOW_FINAL;
    state->default_upload = 1;
    state->upload_unlabelled = 1;
    jd_client_subscribe(tsagg_client_ev, state);
}

void tsagg_update(const char *name, double v) {
    srv_t *state = tsagg_state;
    if (state) {
        tsagg_series_t *ts = lookup_or_add_series(state, name, strlen(name));
        series_update(state, ts, v);
    }
}
