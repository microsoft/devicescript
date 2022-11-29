#include "jd_network.h"

typedef struct {
    uint32_t magic;
    uint32_t version;
    uint8_t seed0[JD_AES_KEY_BYTES / 4];
    uint8_t seed1[JD_AES_KEY_BYTES / 4];
} jd_wssk_hello_msg_t;

#define JD_WSSK_MAGIC 0xcee428ca
#define JD_WSSK_VERSION 1

#define JD_WSSK_AUTH_SIZE JD_AES_KEY_BYTES

#define LOG(fmt, ...) DMESG("WSSK: " fmt, ##__VA_ARGS__)
#if 1
#define LOGV(...) ((void)0)
#else
#define LOGV LOG
#endif

#define ST_NEW 1
#define ST_GOT_KEY 2
#define ST_GOT_AUTH 3
#define ST_CLOSED 4
#define ST_ERROR 0xff

typedef struct {
    uint8_t key[JD_AES_KEY_BYTES];
    uint8_t client_nonce[JD_AES_BLOCK_BYTES];
    uint8_t server_nonce[JD_AES_BLOCK_BYTES];
    uint8_t state;
} jd_wssk_t;
static jd_wssk_t _encsock;

STATIC_ASSERT(JD_AES_CCM_NONCE_BYTES <= JD_AES_BLOCK_BYTES);
STATIC_ASSERT(JD_AES_KEY_BYTES / 2 <= JD_AES_BLOCK_BYTES);

int jd_wssk_new(const char *hostname, int port, const char *path,
                   const uint8_t master_key[JD_AES_KEY_BYTES]) {
    jd_wssk_t *es = &_encsock;

    int sum = 0;
    for (int i = 0; i < JD_AES_KEY_BYTES; ++i)
        sum += master_key[i];
    if (sum == 0) {
        DMESG("zero key!");
        JD_PANIC();
    }

    memcpy(es->key, master_key, JD_AES_KEY_BYTES);
    es->state = ST_NEW;
    jd_crypto_get_random(es->client_nonce, JD_AES_KEY_BYTES / 2);
    char *key = jd_to_hex_a(es->client_nonce, JD_AES_KEY_BYTES / 2);
    key = jd_sprintf_a("jacdac-key-%-s", key);
    int r = jd_websock_new(hostname, port, path, key);
    jd_free(key);
    return r;
}

static void raise_error(jd_wssk_t *es, const char *msg) {
    LOG("error: %s", msg);
    if (es->state == ST_ERROR)
        return; // double error?
    es->state = ST_ERROR;
    jd_wssk_on_event(JD_CONN_EV_ERROR, msg, strlen(msg));
    jd_websock_close();
}

static void on_hello(jd_wssk_t *es, const uint8_t *msg, unsigned size) {
    LOG("process hello (%d bytes)", size);
    if (size < sizeof(jd_wssk_hello_msg_t)) {
        raise_error(es, "small hello");
        return;
    }
    jd_wssk_hello_msg_t hello;
    memcpy(&hello, msg, sizeof(hello));
    if (hello.magic != JD_WSSK_MAGIC) {
        raise_error(es, "bad magic");
        return;
    }
    if (hello.version != JD_WSSK_VERSION) {
        raise_error(es, "bad version");
        return;
    }

    uint8_t *buf = es->server_nonce;
    unsigned chunk = JD_AES_KEY_BYTES / 4;

    jd_aes_setup_key(es->key);

    memcpy(buf, es->client_nonce, chunk);
    memcpy(buf + chunk, hello.seed0, chunk);
    jd_aes_encrypt(buf);
    memcpy(es->key, buf, chunk * 2);

    memcpy(buf, es->client_nonce + chunk, chunk);
    memcpy(buf + chunk, hello.seed1, chunk);
    jd_aes_encrypt(buf);
    memcpy(es->key + chunk * 2, buf, chunk * 2);

    jd_aes_clear_key();

    memset(es->client_nonce, 0, sizeof(es->client_nonce));
    es->client_nonce[0] = 1;
    memset(es->server_nonce, 0, sizeof(es->server_nonce));
    es->server_nonce[0] = 2;

    es->state = ST_GOT_KEY;

    if (jd_wssk_send_message(NULL, JD_WSSK_AUTH_SIZE) != 0) {
        raise_error(es, "can't send auth");
        return;
    }

    LOG("sent auth");
}

static void inc_nonce(uint8_t nonce[JD_AES_CCM_NONCE_BYTES]) {
    for (int i = JD_AES_CCM_NONCE_BYTES - 1; i >= 0; i--) {
        if (nonce[i] < 0xff) {
            nonce[i]++;
            break;
        } else {
            nonce[i] = 0x00;
            continue;
        }
    }
}

static int decrypt(jd_wssk_t *es, uint8_t *msg, unsigned size) {
    if (size < JD_AES_CCM_TAG_BYTES + 4) {
        raise_error(es, "small msg");
        return -1;
    }

    unsigned msgsize = size - JD_AES_CCM_TAG_BYTES;
    int r = jd_aes_ccm_decrypt(es->key, es->server_nonce, msg + msgsize, msg, msgsize);
    inc_nonce(es->server_nonce);
    if (r != 0) {
        raise_error(es, "tag error");
        return -1;
    }

    return 0;
}

static void on_message(jd_wssk_t *es, const uint8_t *msg, unsigned size) {
    switch (es->state) {
    case ST_NEW:
        on_hello(es, msg, size);
        break;
    case ST_GOT_KEY:
        LOG("process auth (%d bytes)", size);
        if (size < JD_WSSK_AUTH_SIZE + JD_AES_CCM_TAG_BYTES) {
            raise_error(es, "auth too short");
            return;
        }
        if (decrypt(es, (uint8_t *)msg, size) == 0) {
            for (int i = 0; i < JD_WSSK_AUTH_SIZE; ++i)
                if (msg[i] != 0) {
                    raise_error(es, "auth non-0");
                    return;
                }
            es->state = ST_GOT_AUTH;
            jd_wssk_on_event(JD_CONN_EV_OPEN, NULL, 0);
        }
        break;
    case ST_GOT_AUTH:
        if (decrypt(es, (uint8_t *)msg, size) == 0) {
            jd_wssk_on_event(JD_CONN_EV_MESSAGE, msg, size - JD_AES_CCM_TAG_BYTES);
        }
        break;
    }
}

int jd_wssk_send_message(const void *data, unsigned size) {
    jd_wssk_t *es = &_encsock;

    if (target_in_irq())
        JD_PANIC();

    if (!((es->state == ST_GOT_KEY && data == NULL) || (es->state == ST_GOT_AUTH && data != NULL)))
        return -1;

    uint8_t *sendbuf = jd_alloc(size + JD_AES_CCM_TAG_BYTES);
    if (data)
        memcpy(sendbuf, data, size);
    jd_aes_ccm_encrypt(es->key, es->client_nonce, sendbuf + size, sendbuf, size);
    int r = jd_websock_send_message(sendbuf, size + JD_AES_CCM_TAG_BYTES);
    jd_free(sendbuf);
    if (r != 0) {
        raise_error(es, "write err");
        return r;
    }
    inc_nonce(es->client_nonce);
    return 0;
}

void jd_websock_on_event(unsigned event, const void *data, unsigned size) {
    if (target_in_irq())
        JD_PANIC();
    LOGV("%s %-s", jd_websock_event_name(event), jd_json_escape(data, size));

    jd_wssk_t *es = &_encsock;
    switch (event) {
    case JD_CONN_EV_OPEN:
        break;
    case JD_CONN_EV_MESSAGE:
        // DMESG("msg '%-s'", jd_json_escape(data, size));
        on_message(es, data, size);
        break;
    case JD_CONN_EV_CLOSE:
        if (es->state != ST_ERROR)
            es->state = ST_CLOSED;
        jd_wssk_on_event(event, data, size);
        break;
    case JD_CONN_EV_ERROR:
        es->state = ST_ERROR;
        jd_websock_close();
        jd_wssk_on_event(event, data, size);
        break;
    }
}

void jd_wssk_close(void) {
    if (target_in_irq())
        JD_PANIC();
    jd_wssk_t *es = &_encsock;
    if (es->state != ST_CLOSED && es->state != ST_ERROR)
        jd_websock_close();
}

__attribute__((weak)) void jd_wssk_on_event(unsigned event, const void *data, unsigned size) {
    DMESG("CONN: %s %-s", jd_websock_event_name(event), jd_json_escape(data, size));

    if (event == JD_CONN_EV_OPEN)
        jd_wssk_send_message("lalala", 6);
}
