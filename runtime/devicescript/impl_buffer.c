#include "devs_internal.h"

static const void *buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    if (!devs_is_buffer(ctx, v)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_BUFFER, v);
        return NULL;
    }
    return devs_buffer_data(ctx, v, sz);
}

static void *wr_buffer_data(devs_ctx_t *ctx, value_t v, unsigned *sz) {
    if (!devs_buffer_is_writable(ctx, v)) {
        devs_throw_expecting_error_ext(ctx, "mutable Buffer", v);
        return NULL;
    }
    return devs_buffer_data(ctx, v, sz);
}

void fun1_Buffer_alloc(devs_ctx_t *ctx) {
    unsigned sz = devs_arg_int(ctx, 0);
    devs_ret_gc_ptr(ctx, devs_buffer_try_alloc(ctx, sz));
}

#define ENC_NULL 0
#define ENC_HEX 1
#define ENC_UTF 2
#define ENC_ERR -1

static int get_encoding(devs_ctx_t *ctx, value_t enc) {
    if (devs_is_null_or_undefined(enc))
        return ENC_NULL;

    if (devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_HEX)) {
        return ENC_HEX;
    } else if (devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_UTF8) ||
               devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_UTF_8)) {
        return ENC_UTF;
    } else {
        devs_throw_type_error(ctx, "Unknown encoding: %s", devs_show_value(ctx, enc));
        return ENC_ERR;
    }
}

void fun2_Buffer_from(devs_ctx_t *ctx) {
    value_t v = devs_arg(ctx, 0);
    int enc = get_encoding(ctx, devs_arg(ctx, 1));
    unsigned sz;
    const uint8_t *d = devs_bufferish_data(ctx, v, &sz);
    devs_buffer_t *buf = NULL;

    if (enc == ENC_ERR)
        return;

    if (enc != ENC_NULL && !devs_is_string(ctx, v)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_STRING, v);
        return;
    }

    if (d) {
        if (enc == ENC_HEX) {
            sz = jd_from_hex(NULL, (const char *)d);
            buf = devs_buffer_try_alloc(ctx, sz);
            if (buf)
                jd_from_hex(buf->data, (const char *)d);
        } else {
            buf = devs_buffer_try_alloc_init(ctx, d, sz);
        }
    } else {
        if (devs_is_array(ctx, v)) {
            devs_array_t *arr = devs_value_to_gc_obj(ctx, v);
            buf = devs_buffer_try_alloc(ctx, arr->length);
            if (buf)
                for (unsigned i = 0; i < arr->length; ++i)
                    buf->data[i] = devs_value_to_int(ctx, arr->data[i]);
        } else {
            devs_throw_type_error(ctx, "Expecting string, buffer or array");
        }
    }

    devs_ret_gc_ptr(ctx, buf);
}

value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self) {
    unsigned sz;
    if (buffer_data(ctx, self, &sz))
        return devs_value_from_int(sz);
    else
        return devs_undefined;
}

void meth1_Buffer_toString(devs_ctx_t *ctx) {
    unsigned sz;
    value_t enc = devs_arg(ctx, 0);
    const uint8_t *data = buffer_data(ctx, devs_arg_self(ctx), &sz);

    if (data) {
        if (devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_HEX)) {
            devs_string_t *s = devs_string_try_alloc(ctx, sz * 2);
            if (s)
                jd_to_hex(s->data, data, sz);
            devs_ret_gc_ptr(ctx, s);
        } else if (devs_is_null_or_undefined(enc) ||
                   devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_UTF8) ||
                   devs_value_eq_builtin_string(ctx, enc, DEVS_BUILTIN_STRING_UTF_8)) {
            devs_ret(ctx, devs_string_from_utf8(ctx, data, sz));
        } else {
            devs_throw_type_error(ctx, "Unknown encoding: %s", devs_show_value(ctx, enc));
        }
    }
}

void meth3_Buffer_fillAt(devs_ctx_t *ctx) {
    unsigned dlen;
    uint8_t *dst = wr_buffer_data(ctx, devs_arg_self(ctx), &dlen);
    if (dst == NULL)
        return;
    unsigned dst_offset = devs_arg_int(ctx, 0);
    unsigned len = devs_arg_int(ctx, 1);
    unsigned val = devs_arg_int(ctx, 2);

    if (dst_offset >= dlen)
        return;
    dlen -= dst_offset;
    if (dlen < len)
        len = dlen;

    memset(dst + dst_offset, val, len);
}

void meth4_Buffer_blitAt(devs_ctx_t *ctx) {
    unsigned slen, dlen;

    uint8_t *dst = wr_buffer_data(ctx, devs_arg_self(ctx), &dlen);
    if (dst == NULL)
        return;
    uint32_t dst_offset = devs_arg_int(ctx, 0);

    value_t src_ = devs_arg(ctx, 1);
    const uint8_t *src = devs_is_string(ctx, src_) ? devs_string_get_utf8(ctx, src_, &slen)
                                                   : buffer_data(ctx, src_, &slen);
    if (src == NULL)
        return;
    uint32_t src_offset = devs_arg_int(ctx, 2);
    uint32_t len = devs_arg_int(ctx, 3);

    if (src_offset >= slen)
        return;
    slen -= src_offset;
    if (slen < len)
        len = slen;

    if (dst_offset >= dlen)
        return;
    dlen -= dst_offset;
    if (dlen < len)
        len = dlen;

    memcpy(dst + dst_offset, src + src_offset, len);
}

void meth3_Buffer_rotate(devs_ctx_t *ctx) {
    unsigned dlen;
    uint8_t *dst = wr_buffer_data(ctx, devs_arg_self(ctx), &dlen);
    if (dst == NULL)
        return;

    int32_t offset = devs_arg_int(ctx, 0);
    int32_t start = devs_arg_int_defl(ctx, 1, 0);
    int32_t stop = devs_arg_int_defl(ctx, 2, dlen);
    int32_t length = stop - start;

    if (start < 0 || start + length > (int)dlen || start + length < start) {
        devs_throw_range_error(ctx, "invalid rotation range");
        return;
    }

    // make offset positive
    offset %= length;
    if (offset < 0)
        offset += length;

    if (offset == 0 || length == 0)
        return; // nothing to do

    uint8_t *data = dst + start;

    uint8_t *n_first = data + offset;
    uint8_t *first = data;
    uint8_t *next = n_first;
    uint8_t *last = data + length;

    while (first != next) {
        uint8_t tmp = *first;
        *first++ = *next;
        *next++ = tmp;
        if (next == last) {
            next = n_first;
        } else if (first == n_first) {
            n_first = next;
        }
    }
}

int devs_clamp_size(int v, int max) {
    if (v < 0)
        return 0;
    if (v > max)
        return max;
    return v;
}

void meth3_Buffer_indexOf(devs_ctx_t *ctx) {
    unsigned sz;
    const uint8_t *data = buffer_data(ctx, devs_arg_self(ctx), &sz);
    if (!data)
        return;

    int ch = devs_arg_int(ctx, 0);
    int start_pos = devs_arg_int(ctx, 1);
    int end_pos = devs_arg_int_defl(ctx, 2, sz);
    int rev = 0;

    start_pos = devs_clamp_size(start_pos, sz);
    if (end_pos < 0) {
        rev = 1;
        end_pos = -end_pos;
    }
    end_pos = devs_clamp_size(end_pos, sz);

    int r = -1;

    if (rev) {
        end_pos--;
        while (start_pos <= end_pos) {
            if (data[end_pos] == ch) {
                r = end_pos;
                break;
            }
            end_pos--;
        }
    } else {
        while (start_pos < end_pos) {
            if (data[start_pos] == ch) {
                r = start_pos;
                break;
            }
            start_pos++;
        }
    }

    devs_ret_int(ctx, r);
}

//
// Crypto
//

void meth0_Buffer_fillRandom(devs_ctx_t *ctx) {
    unsigned dlen;
    uint8_t *dst = wr_buffer_data(ctx, devs_arg_self(ctx), &dlen);
    if (dst == NULL)
        return;
    jd_crypto_get_random(dst, dlen);
}

void meth4_Buffer_encrypt(devs_ctx_t *ctx) {
    unsigned slen, klen, ivlen;
    const uint8_t *src = buffer_data(ctx, devs_arg_self(ctx), &slen);
    const char *algo = devs_string_get_utf8(ctx, devs_arg(ctx, 0), NULL);
    const uint8_t *key = buffer_data(ctx, devs_arg(ctx, 1), &klen);
    const uint8_t *iv = buffer_data(ctx, devs_arg(ctx, 2), &ivlen);
    int tagLen = devs_arg_int_defl(ctx, 3, -1);
    bool encrypt = true;
    if (tagLen >= 0x1000) {
        encrypt = false;
        tagLen -= 0x1000;
    }

    if (strcmp(algo, "aes-256-ccm") != 0)
        return;

    if (src == NULL || klen != JD_AES_KEY_BYTES || ivlen != JD_AES_CCM_NONCE_BYTES)
        return;

    if (tagLen < 0 || tagLen > 16)
        return;

    int dlen = (int)slen;
    if (encrypt)
        dlen += tagLen;
    else
        dlen -= tagLen;

    if (dlen < 0) {
        devs_throw_generic_error(ctx, "encrypted data (len=%u) shorter than tagLen (%u)", slen,
                                 tagLen);
        return;
    }

    devs_buffer_t *dst = devs_buffer_try_alloc(ctx, dlen);
    if (dst == NULL)
        return;
    devs_ret_gc_ptr(ctx, dst);

    if (encrypt) {
        memcpy(dst->data, src, slen);
        jd_aes_ccm_encrypt(key, iv, dst->data + slen, tagLen, dst->data, slen);
    } else {
        uint8_t tag[tagLen + 1];
        memcpy(tag, src + dlen, tagLen);
        memcpy(dst->data, src, dlen);
        int r = jd_aes_ccm_decrypt(key, iv, tag, tagLen, dst->data, dlen);
        if (r) {
            devs_throw_generic_error(ctx, "encryption tag mismatch");
            devs_ret(ctx, devs_undefined);
        }
    }
}

void fun3_Buffer_digest(devs_ctx_t *ctx) {
    unsigned klen;
    const uint8_t *key = devs_bufferish_data(ctx, devs_arg(ctx, 0), &klen);
    const char *algo = devs_string_get_utf8(ctx, devs_arg(ctx, 1), NULL);
    value_t other = devs_arg(ctx, 2);
    if (!devs_is_array(ctx, other)) {
        devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_ARRAY, other);
        return;
    }
    devs_array_t *data = devs_value_to_gc_obj(ctx, other);

    if (strcmp(algo, "sha256") != 0)
        return;

    if (key)
        jd_sha256_hmac_setup(key, klen);
    else
        jd_sha256_setup();

    for (unsigned i = 0; i < data->length; ++i) {
        unsigned sz;
        const uint8_t *d = devs_bufferish_data(ctx, data->data[i], &sz);
        if (!d) {
            devs_throw_expecting_error(ctx, DEVS_BUILTIN_STRING_BUFFER, data->data[i]);
            return;
        }

        if (key)
            jd_sha256_hmac_update(d, sz);
        else
            jd_sha256_update(d, sz);
    }

    devs_buffer_t *buf = devs_buffer_try_alloc(ctx, JD_SHA256_HASH_BYTES);
    if (buf == NULL)
        return;
    devs_ret_gc_ptr(ctx, buf);
    if (key)
        jd_sha256_hmac_finish(buf->data);
    else
        jd_sha256_finish(buf->data);
}