#ifdef __EMSCRIPTEN__

#include "jd_sdk.h"
#include <stdlib.h>
#include <sys/time.h>
#include <time.h>
#include <emscripten/emscripten.h>
#include "devicescript.h"
#include "storage/jd_storage.h"

uint64_t cached_devid = 0x1d46a30eef48919;
static uint8_t inited;

EM_JS(void, em_send_frame, (void *frame), {
    const sz = 12 + HEAPU8[frame + 2];
    const pkt = HEAPU8.slice(frame, frame + sz);
    Module.sendPacket(pkt)
});

EM_JS(void, _devs_panic_handler, (int exitcode), {
    console.log("PANIC", exitcode);
    if (Module.panicHandler)
        Module.panicHandler(exitcode);
});

// the syntax above doesn't work with weak symbols
void devs_panic_handler(int exitcode) {
    _devs_panic_handler(exitcode);
}

EM_JS(void, em_deploy_handler, (int exitcode), {
    if (Module.deployHandler)
        Module.deployHandler(exitcode);
});

void devs_deploy_handler(int exitcode) {
    em_deploy_handler(exitcode);
}

EM_JS(double, em_time_now, (void), { return Date.now(); });

EM_JS(void, em_jd_crypto_get_random, (uint8_t * trg, unsigned size), {
    let buf = new Uint8Array(size);
    if (typeof window == "object" && window.crypto && window.crypto.getRandomValues)
        window.crypto.getRandomValues(buf);
    else {
        buf = require("crypto").randomBytes(size);
    }
    HEAPU8.set(buf, trg);
});

void jd_crypto_get_random(uint8_t *trg, unsigned size) {
    em_jd_crypto_get_random(trg, size);
}

int jd_em_frame_received(jd_frame_t *frame);

int jd_em_send_frame(jd_transport_ctx_t *ctx, jd_frame_t *frame) {
    em_send_frame(frame);
    return 0;
}

static const jd_transport_t em_transport = {.send_frame = jd_em_send_frame};

EMSCRIPTEN_KEEPALIVE
void jd_em_set_device_id_2x_i32(int32_t id0, int32_t id1) {
    cached_devid = ((uint64_t)id0 << 32) | id1;
}

EMSCRIPTEN_KEEPALIVE
void jd_em_set_device_id_string(const char *str) {
    cached_devid = jd_device_id_from_string(str);
}

EMSCRIPTEN_KEEPALIVE
void jd_em_init(void) {
    if (inited)
        return;
    inited = 1;
    tx_init(&em_transport, NULL);
    jd_rx_init();
    jd_lstore_init();
    jd_services_init();
}

EMSCRIPTEN_KEEPALIVE
void jd_em_process(void) {
    if (inited == 1) {
        inited = 2;
        char shortbuf[5];
        jd_device_short_id(shortbuf, jd_device_id());
        char hexbuf[17];
        jd_to_hex(hexbuf, &cached_devid, 8);
        DMESG("self-device: %s/%s", hexbuf, shortbuf);
    }

    jd_process_everything();
    tx_process();
    jd_lstore_process();
}

EMSCRIPTEN_KEEPALIVE
int jd_em_frame_received(jd_frame_t *frame) {
    if (jd_crc16((uint8_t *)frame + 2, JD_FRAME_SIZE(frame) - 2) != frame->crc) {
        ERROR("invalid CRC");
        return -2;
    }
    return jd_rx_frame_received(frame);
}

EMSCRIPTEN_KEEPALIVE
int jd_em_devs_deploy(const void *img, unsigned imgsize) {
    return devsmgr_deploy(img, imgsize);
}

EMSCRIPTEN_KEEPALIVE
int jd_em_devs_verify(const void *img, unsigned imgsize) {
    return devs_verify(img, imgsize);
}

EMSCRIPTEN_KEEPALIVE
int jd_em_devs_client_deploy(const void *img, unsigned imgsize) {
    return devs_client_deploy(img, imgsize);
}

EMSCRIPTEN_KEEPALIVE
void jd_em_devs_enable_gc_stress(int en) {
    if (en)
        devs_set_global_flags(DEVS_FLAG_GC_STRESS);
    else
        devs_reset_global_flags(DEVS_FLAG_GC_STRESS);
}

#if 0
void run_emscripten_loop(void) {
    emscripten_set_interval(em_process, 10, NULL);
    emscripten_unwind_to_js_event_loop();
}
#endif

uint64_t hw_device_id(void) {
    return cached_devid;
}

void target_reset() {
    DMESG("target reset");
    exit(0);
}

static uint64_t getmicros(void) {
    return (uint64_t)(em_time_now() * 1000.0);
}

uint64_t tim_get_micros() {
    static uint64_t starttime;
    if (!starttime) {
        starttime = getmicros() - 123;
    }
    return getmicros() - starttime;
}

void target_wait_us(uint32_t us) {
    if (us < 1000) {
        uint64_t endt = tim_get_micros() + us;
        while (tim_get_micros() < endt)
            ;
    } else {
        emscripten_sleep(us / 1000);
    }
}

EM_JS(void, em_console_debug, (const char *ptr), {
    const s = UTF8ToString(ptr, 1024);
    if (Module.dmesg)
        Module.dmesg(s);
    else
        console.debug(s);
});

void dmesgv(const char *format, va_list arg) {
    char tmp[200];
    jd_vsprintf(tmp, sizeof(tmp) - 1, format, arg);
    em_console_debug(tmp);
}

void dmesg(const char *format, ...) {
    if (!strchr(format, '%'))
        em_console_debug(format);
    else {
        va_list arg;
        va_start(arg, format);
        dmesgv(format, arg);
        va_end(arg);
    }
}

void jd_tcpsock_process(void) {}

#endif
