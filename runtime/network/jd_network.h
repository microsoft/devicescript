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
