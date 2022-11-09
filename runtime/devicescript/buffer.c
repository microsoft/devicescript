#include "jacs_internal.h"
#include "jd_numfmt.h"
#include <limits.h>
#include <math.h>

value_t jacs_buffer_op(jacs_activation_t *frame, uint32_t fmt0, uint32_t offset, value_t buffer,
                       value_t *setv) {

    unsigned sz = jd_numfmt_bytes(fmt0);

    jacs_ctx_t *ctx = frame->fiber->ctx;

    if (!jd_numfmt_is_valid(fmt0))
        return jacs_runtime_failure(ctx, 60100);

    unsigned bufsz;
    uint8_t *data = jacs_buffer_data(ctx, buffer, &bufsz);

    if (offset + sz > bufsz) {
        // DMESG("gv NAN at pc=%d sz=%d %x", frame->pc, pkt->service_size, pkt->service_command);
        if (setv)
            return jacs_runtime_failure(ctx, 60103);
        else
            return jacs_undefined;
    }

    data += offset;

    if (setv) {
        value_t q = *setv;
        if (jacs_is_tagged_int(q)) {
            jd_numfmt_write_i32(data, fmt0, q.val_int32);
        } else {
            jd_numfmt_write_float(data, fmt0, jacs_value_to_double(q));
        }

        return jacs_void;
    } else {
        if (jd_numfmt_is_plain_int(fmt0)) {
            int32_t q = jd_numfmt_read_i32(data, fmt0);
            // if it was out of range, it would get clamped
            if (INT_MIN < q && q < INT_MAX)
                return jacs_value_from_int(q);
        }

        return jacs_value_from_double(jd_numfmt_read_float(data, fmt0));
    }
}

double jacs_read_number(void *data, unsigned bufsz, uint16_t fmt0) {
    unsigned sz = jd_numfmt_bytes(fmt0);

    if (sz > bufsz)
        return NAN;

    return jd_numfmt_read_float(data, fmt0);
}
