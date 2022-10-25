#pragma once

#include "jd_protocol.h"

#define JD_AES_KEY_BYTES 32
#define JD_AES_BLOCK_BYTES 16

#define JD_AES_CCM_TAG_BYTES 4
#define JD_AES_CCM_LENGTH_BYTES 2
#define JD_AES_CCM_NONCE_BYTES (15 - JD_AES_CCM_LENGTH_BYTES)

void jd_aes_setup_key(const uint8_t key[JD_AES_KEY_BYTES]);
void jd_aes_encrypt(uint8_t block[JD_AES_BLOCK_BYTES]);

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

// this on the socket level - messages are not encrypted and can be fragmented
int jd_sock_new(const char *hostname);
void jd_sock_on_event(unsigned event, void *data, unsigned size);
int jd_sock_write(const void *buf, unsigned size);

// This is on the connection level - messages are decrypted and whole
// Implemented in conn.c
int jd_conn_new(const char *hostname);
void jd_conn_on_event(unsigned event, const void *data, unsigned size);
int jd_conn_send_message(const void *data, unsigned size);

// to implement:
void jd_crypto_get_random(uint8_t *buf, unsigned size);

const char *jd_conn_event_name(unsigned event);