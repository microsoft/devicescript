#include "jd_network.h"

#if JD_AES_SOFT

#define AES256 1
#define CBC 0
#define ECB 1
#define CTR 0

#include "tiny-AES-c/aes.c"

static struct AES_ctx aes_ctx;

void jd_aes_setup_key(const uint8_t key[JD_AES_KEY_BYTES]) {
    AES_init_ctx(&aes_ctx, key);
}

void jd_aes_encrypt(uint8_t block[JD_AES_BLOCK_BYTES]) {
    AES_ECB_encrypt(&aes_ctx, block);
}

void jd_aes_clear_key(void) {
    memset(&aes_ctx, 0, sizeof(aes_ctx));
}

#endif
