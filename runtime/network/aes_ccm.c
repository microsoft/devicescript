#include "jd_network.h"

#define M JD_AES_CCM_TAG_BYTES
#define L JD_AES_CCM_LENGTH_BYTES
#define NONCE_SIZE JD_AES_CCM_NONCE_BYTES
#define BLOCK_BYTES JD_AES_BLOCK_BYTES

static uint8_t aes_buf[BLOCK_BYTES];

static void setup_nonce(const uint8_t *nonce, unsigned ctr) {
    aes_buf[0] = (JD_AES_CCM_LENGTH_BYTES - 1);
    memcpy(aes_buf + 1, nonce, NONCE_SIZE);
    aes_buf[14] = (ctr >> 8) & 0xff;
    aes_buf[15] = ctr & 0xff;
}

static void xor_buf(uint8_t *trg, const uint8_t *src, unsigned sz) {
    if (sz > BLOCK_BYTES)
        sz = BLOCK_BYTES;
    for (unsigned i = 0; i < sz; ++i)
        trg[i] ^= src[i];
}

static void cbc_mac(const uint8_t *nonce, const uint8_t *plain, unsigned size) {
    setup_nonce(nonce, size);
    aes_buf[0] = 8 * ((JD_AES_CCM_TAG_BYTES - 2) / 2) + (JD_AES_CCM_LENGTH_BYTES - 1);

    jd_aes_encrypt(aes_buf);

    for (unsigned ptr = 0; ptr < size; ptr += BLOCK_BYTES) {
        xor_buf(aes_buf, plain + ptr, size - ptr);
        jd_aes_encrypt(aes_buf);
    }
}

static void ctr_xcrypt(const uint8_t *nonce, uint8_t *msg, unsigned size) {
    unsigned ctr = 1;
    for (unsigned ptr = 0; ptr < size; ptr += BLOCK_BYTES) {
        setup_nonce(nonce, ctr);
        jd_aes_encrypt(aes_buf);
        xor_buf(msg + ptr, aes_buf, size - ptr);
        ctr++;
    }
}

void jd_aes_ccm_encrypt(const uint8_t key[JD_AES_KEY_BYTES],
                        const uint8_t nonce[JD_AES_CCM_NONCE_BYTES],
                        uint8_t tag[JD_AES_CCM_TAG_BYTES], uint8_t *plain, unsigned size) {
    if (size >= (1 << (JD_AES_CCM_LENGTH_BYTES * 8)) - 10)
        JD_PANIC();

    jd_aes_setup_key(key);

    cbc_mac(nonce, plain, size);
    memcpy(tag, aes_buf, JD_AES_CCM_TAG_BYTES);
    setup_nonce(nonce, 0);
    jd_aes_encrypt(aes_buf);
    xor_buf(tag, aes_buf, JD_AES_CCM_TAG_BYTES);

    ctr_xcrypt(nonce, plain, size);

    jd_aes_clear_key();
}

int jd_aes_ccm_decrypt(const uint8_t key[JD_AES_KEY_BYTES],
                       const uint8_t nonce[JD_AES_CCM_NONCE_BYTES],
                       uint8_t tag[JD_AES_CCM_TAG_BYTES], uint8_t *msg, unsigned size) {
    if (size >= (1 << (JD_AES_CCM_LENGTH_BYTES * 8)) - 10)
        return -1;

    jd_aes_setup_key(key);

    ctr_xcrypt(nonce, msg, size);

    cbc_mac(nonce, msg, size);
    xor_buf(tag, aes_buf, JD_AES_CCM_TAG_BYTES);
    setup_nonce(nonce, 0);
    jd_aes_encrypt(aes_buf);
    xor_buf(tag, aes_buf, JD_AES_CCM_TAG_BYTES);

    jd_aes_clear_key();

    int sum = 0;
    for (unsigned i = 0; i < JD_AES_CCM_TAG_BYTES; ++i)
        sum += tag[i];
    return sum;
}

void jd_aes_ccm_test(void) {
    uint8_t key[JD_AES_KEY_BYTES];
    uint8_t nonce[JD_AES_CCM_NONCE_BYTES];
    uint8_t tag[JD_AES_CCM_TAG_BYTES];
    uint8_t plain[100];
    unsigned size;

    jd_from_hex(key, "c0c1c2c3c4c5c6c7c8c9cacbcccdcecfc0c1c2c3c4c5c6c7c8c9cacbcccdcecf");
    jd_from_hex(nonce, "00000003020100a0a1a2a3a4a5");
    size = jd_from_hex(plain, "616c61206d61206b6f74612c206b6f74206d6120616c652c20616e642065766572796f6e65206973206861707079");

    jd_aes_ccm_encrypt(key, nonce, tag, plain, size);
    DMESG("res: %s %s", jd_to_hex_a(plain, size), jd_to_hex_a(tag, JD_AES_CCM_TAG_BYTES));

    int r = jd_aes_ccm_decrypt(key, nonce, tag, plain, size);
    DMESG("dec: %s %d", jd_to_hex_a(plain, size), r);

}