#pragma once

#include "jd_protocol.h"

#define JD_AES_KEY_BYTES 32
#define JD_AES_BLOCK_BYTES 16

#define JD_AES_CCM_TAG_BYTES 4
#define JD_AES_CCM_LENGTH_BYTES 2
#define JD_AES_CCM_NONCE_BYTES (15 - JD_AES_CCM_LENGTH_BYTES)

void jd_aes_setup_key(const uint8_t key[JD_AES_KEY_BYTES]);
void jd_aes_encrypt(uint8_t block[JD_AES_BLOCK_BYTES]);
void jd_aes_clear_key(void);

void jd_aes_ccm_encrypt(const uint8_t key[JD_AES_KEY_BYTES],
                        const uint8_t nonce[JD_AES_CCM_NONCE_BYTES],
                        uint8_t tag[JD_AES_CCM_TAG_BYTES], uint8_t *plain, unsigned size);

int jd_aes_ccm_decrypt(const uint8_t key[JD_AES_KEY_BYTES],
                       const uint8_t nonce[JD_AES_CCM_NONCE_BYTES],
                       uint8_t tag[JD_AES_CCM_TAG_BYTES], uint8_t *msg, unsigned size);

#define JD_CONN_EV_OPEN 0x01
#define JD_CONN_EV_CLOSE 0x02
#define JD_CONN_EV_ERROR 0x03
#define JD_CONN_EV_MESSAGE 0x04

// this on the TCP socket level - messages are not encrypted and can be fragmented
int jd_tcpsock_new(const char *hostname, int port);
void jd_tcpsock_on_event(unsigned event, const void *data, unsigned size);
int jd_tcpsock_write(const void *buf, unsigned size);
void jd_tcpsock_close(void);

// This is on WebSocket level - messages are whole
// Implemented in websock_conn.c
int jd_websock_new(const char *hostname, int port, const char *path, const char *protokey);
void jd_websock_on_event(unsigned event, const void *data, unsigned size);
int jd_websock_send_message(const void *data, unsigned size);
void jd_websock_close(void);

// This is on encrypted packet transport level - messages are whole
// and this will try to re-connect.
int jd_encsock_new(const char *hostname, int port, const char *path, const uint8_t master_key[JD_AES_KEY_BYTES]);
void jd_encsock_on_event(unsigned event, const void *data, unsigned size);
int jd_encsock_send_message(const void *data, unsigned size);
void jd_encsock_close(void);

const char *jd_websock_event_name(unsigned event);

// to implement:
void jd_crypto_get_random(uint8_t *buf, unsigned size);

char *jd_settings_get(const char *key);
int jd_settings_set(const char *key, const char *val);