#include "devs_internal.h"

#if JD_SHA256_SOFT

#include "sha-2/sha-256.c"

static struct Sha_256 _sha_ctx;
static uint8_t _sha_hash[JD_SHA256_HASH_BYTES];
static uint8_t _sha_locked;

void jd_sha256_setup() {
    target_disable_irq();
    if (_sha_locked)
        JD_PANIC();
    _sha_locked = 1;
    target_enable_irq();

    sha_256_init(&_sha_ctx, _sha_hash);
}

void jd_sha256_update(const void *buf, unsigned size) {
    if (size)
        sha_256_write(&_sha_ctx, buf, size);
}

void jd_sha256_finish(uint8_t hash[JD_SHA256_HASH_BYTES]) {
    sha_256_close(&_sha_ctx);
    memcpy(hash, _sha_hash, JD_SHA256_HASH_BYTES);
    _sha_locked = 0;
}

#endif

#define JD_SHA256_BLOCK_SIZE 64

static uint8_t sha256_hmac_padded_key[JD_SHA256_BLOCK_SIZE];

void jd_sha256_hmac_setup(const void *key, unsigned keysize) {
    memset(sha256_hmac_padded_key, 0, JD_SHA256_BLOCK_SIZE);
    if (keysize > JD_SHA256_BLOCK_SIZE) {
        jd_sha256_setup();
        jd_sha256_update(key, keysize);
        jd_sha256_finish(sha256_hmac_padded_key);
    } else {
        memcpy(sha256_hmac_padded_key, key, keysize);
    }
    for (unsigned i = 0; i < JD_SHA256_BLOCK_SIZE; ++i)
        sha256_hmac_padded_key[i] ^= 0x36;

    jd_sha256_setup();
    jd_sha256_update(sha256_hmac_padded_key, JD_SHA256_BLOCK_SIZE);
}

void jd_sha256_hmac_update(const void *buf, unsigned size) {
    jd_sha256_update(buf, size);
}

void jd_sha256_hmac_finish(uint8_t hash[JD_SHA256_HASH_BYTES]) {
    jd_sha256_finish(hash);

    jd_sha256_setup();
    for (unsigned i = 0; i < JD_SHA256_BLOCK_SIZE; ++i)
        sha256_hmac_padded_key[i] ^= 0x36 ^ 0x5c;
    jd_sha256_update(sha256_hmac_padded_key, JD_SHA256_BLOCK_SIZE);
    jd_sha256_update(hash, JD_SHA256_HASH_BYTES);
    jd_sha256_finish(hash);
    memset(sha256_hmac_padded_key, 0, JD_SHA256_BLOCK_SIZE);
}

static void jd_sha256_test_one(const char *key, const char *msg, const char *exp) {
    unsigned keysz, msgsz;
    unsigned size;
    void *buf = jd_from_hex_a(key, &size);
    keysz = size;
    jd_sha256_hmac_setup(buf, size);
    jd_free(buf);

    buf = jd_from_hex_a(msg, &size);
    msgsz = size;
    jd_sha256_hmac_update(buf, size);
    jd_free(buf);

    uint8_t hash[JD_SHA256_HASH_BYTES];
    jd_sha256_hmac_finish(hash);

    DMESG("key %d + msg %d -> %-s", keysz, msgsz, jd_to_hex_a(hash, JD_SHA256_HASH_BYTES));

    buf = jd_from_hex_a(exp, &size);
    JD_ASSERT(size == JD_SHA256_HASH_BYTES);
    JD_ASSERT(memcmp(hash, buf, size) == 0);
    jd_free(buf);
}

void jd_sha256_hkdf(const void *salt, unsigned salt_size, const void *key, unsigned key_size,
                    const void *info, unsigned info_size, const void *info2, unsigned info_size2,
                    uint8_t outkey[JD_SHA256_HASH_BYTES]) {
    uint8_t hash[JD_SHA256_HASH_BYTES];

    jd_sha256_hmac_setup(salt, salt_size);

    jd_sha256_hmac_update(key, key_size);
    jd_sha256_hmac_finish(hash);

    jd_sha256_hmac_setup(hash, JD_SHA256_HASH_BYTES);
    jd_sha256_hmac_update(info, info_size);
    jd_sha256_hmac_update(info2, info_size2);
    jd_sha256_hmac_update("\x01", 1);
    jd_sha256_hmac_finish(outkey);
}

void jd_sha256_hmac_test(void) {
    jd_sha256_test_one("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b", "4869205468657265",
                       "b0344c61d8db38535ca8afceaf0bf12b 881dc200c9833da726e9376c2e32cff7");
    jd_sha256_test_one("4a656665", "7768617420646f2079612077616e7420 666f72206e6f7468696e673f",
                       "5bdcc146bf60754e6a042426089575c7 5a003f089d2739839dec58b964ec3843");
    jd_sha256_test_one("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaa",
                       "dddddddddddddddddddddddddddddddd dddddddddddddddddddddddddddddddd "
                       "dddddddddddddddddddddddddddddddd dddd",
                       "773ea91e36800e46854db8ebd09181a7 2959098b3ef8c122d9635514ced565fe");
    jd_sha256_test_one("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa "
                       "aaaaaa",
                       "54657374205573696e67204c61726765 "
                       "72205468616e20426c6f636b2d53697a "
                       "65204b6579202d2048617368204b6579 "
                       "204669727374",
                       "60e431591ee0b67f0d8a26aacbf5b77f "
                       "8e0bc6213728c5140546040f0ee37f54 ");

    unsigned sz;
    void *key = jd_from_hex_a("60e431591ee0b67f0d8a26aacbf5b77f "
                              "8e0bc6213728c5140546040f0ee37f54 ",
                              &sz);
    uint8_t outkey[JD_SHA256_HASH_BYTES];
    jd_sha256_hkdf(NULL, 0, key, sz, "Hello", 5, NULL, 0, outkey);
    DMESG("%-s Hello -> %-s", jd_to_hex_a(key, sz), jd_to_hex_a(outkey, JD_SHA256_HASH_BYTES));
    jd_free(key);
    void *exp =
        jd_from_hex_a("765c02ce44dc89b569157316c33e8a296117c6c17efeec2e976e480825cfdcde", &sz);
    if (memcmp(exp, outkey, JD_SHA256_HASH_BYTES) != 0)
        JD_PANIC();
}
