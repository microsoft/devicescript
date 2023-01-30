#pragma once

#include "jd_protocol.h"

#ifndef JD_WEBSOCK_IMPL
#define JD_WEBSOCK_IMPL 1
#endif

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

#define JD_CONN_EV_OPEN 0x01
#define JD_CONN_EV_CLOSE 0x02
#define JD_CONN_EV_ERROR 0x03
#define JD_CONN_EV_MESSAGE 0x04

// this on the TCP socket level - messages are not encrypted and can be fragmented
int jd_tcpsock_new(const char *hostname, int port);
void jd_tcpsock_on_event(unsigned event, const void *data, unsigned size);
int jd_tcpsock_write(const void *buf, unsigned size);
void jd_tcpsock_close(void);
bool jd_tcpsock_is_available(void);

// This is on WebSocket level - messages are whole
// Implemented in websock_conn.c
int jd_websock_new(const char *hostname, int port, const char *path, const char *protokey);
void jd_websock_on_event(unsigned event, const void *data, unsigned size);
int jd_websock_send_message(const void *data, unsigned size);
void jd_websock_close(void);

// This is on encrypted packet transport level - messages are whole
// and this will try to re-connect.
int jd_wssk_new(const char *hostname, int port, const char *path, const uint8_t master_key[JD_AES_KEY_BYTES]);
void jd_wssk_on_event(unsigned event, const void *data, unsigned size);
int jd_wssk_send_message(const void *data, unsigned size);
void jd_wssk_close(void);

const char *jd_websock_event_name(unsigned event);

void wsskhealth_init(void);

// to implement:
void jd_crypto_get_random(uint8_t *buf, unsigned size);

