#include "jd_sdk.h"

#if defined(__EMSCRIPTEN__) && JD_EM_NODEJS_SOCKET

#include <emscripten/emscripten.h>
#include "devicescript.h"

EM_JS(int, _jd_tcpsock_new, (const char *hostname, int port),
      { return Module.sockOpen(hostname, port); });

EM_JS(int, _jd_tcpsock_write, (const void *buf, unsigned size),
      { return Module.sockWrite(buf, size); });

EM_JS(int, _jd_tcpsock_close, (void), { return Module.sockClose(); });

EM_JS(bool, _jd_tcpsock_is_available, (void), { return Module.sockIsAvailable(); });

int jd_tcpsock_new(const char *hostname, int port) {
    return _jd_tcpsock_new(hostname, port);
}

int jd_tcpsock_write(const void *buf, unsigned size) {
    return _jd_tcpsock_write(buf, size);
}

void jd_tcpsock_close(void) {
    _jd_tcpsock_close();
}

bool jd_tcpsock_is_available(void) {
    return _jd_tcpsock_is_available();
}

EMSCRIPTEN_KEEPALIVE
void jd_em_tcpsock_on_event(int ev, void *arg, int len) {
    jd_tcpsock_on_event(ev, arg, len);
}

#endif