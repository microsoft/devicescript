#include "jacs_internal.h"

#include <math.h>
#include <limits.h>

#if 0
value_t jacs_step_unop(int op, value_t v) {
    switch (op) {
    case JACS_OPUN_ID:
        return v;
    case JACS_OPUN_NOT:
        return jacs_value_from_int(!jacs_value_to_bool(v));
    case JACS_OPUN_BIT_NOT:
        return jacs_value_from_int(~jacs_value_to_int(v));
    case JACS_OPUN_TO_BOOL:
        return jacs_value_from_int(jacs_value_to_bool(v));
    }

    if (jacs_is_tagged_int(v)) {
        int q = v.val_int32;
        switch (op) {
        case JACS_OPUN_NEG:
            if (q == INT_MIN)
                return jacs_max_int_1;
            else
                return jacs_value_from_int(-q);
        case JACS_OPUN_ABS:
            if (q < 0) {
                if (q == INT_MIN)
                    return jacs_max_int_1;
                else
                    return jacs_value_from_int(-q);
            } else {
                return v;
            }
        case JACS_OPUN_IS_NAN:
            return jacs_zero;
        default:
            oops();
        }
    } else {
        switch (op) {
        case JACS_OPUN_NEG:
            return jacs_value_from_double(-v.f);
        case JACS_OPUN_ABS:
            return v.f < 0 ? jacs_value_from_double(-v.f) : v;
        case JACS_OPUN_IS_NAN:
            return jacs_value_from_bool(isnan(v.f));
        default:
            oops();
        }
    }
}

value_t jacs_step_binop(int op, value_t a, value_t b) {
    switch (op) {
    case JACS_OPBIN_BIT_AND:
        return jacs_value_from_int(jacs_value_to_int(a) & jacs_value_to_int(b));
    case JACS_OPBIN_BIT_OR:
        return jacs_value_from_int(jacs_value_to_int(a) | jacs_value_to_int(b));
    case JACS_OPBIN_BIT_XOR:
        return jacs_value_from_int(jacs_value_to_int(a) ^ jacs_value_to_int(b));
    case JACS_OPBIN_SHIFT_LEFT:
        return jacs_value_from_int(jacs_value_to_int(a) << (jacs_value_to_int(b) & 31));
    case JACS_OPBIN_SHIFT_RIGHT:
        return jacs_value_from_int(jacs_value_to_int(a) >> (jacs_value_to_int(b) & 31));
    case JACS_OPBIN_SHIFT_RIGHT_UNSIGNED: {
        uint32_t tmp = (uint32_t)jacs_value_to_int(a) >> (jacs_value_to_int(b) & 31);
        if (tmp >> 31)
            return jacs_value_from_double(tmp);
        else
            return jacs_value_from_int(tmp);
    }
    }

    if (jacs_is_tagged_int(a) && jacs_is_tagged_int(b)) {
        int aa = a.val_int32;
        int bb = b.val_int32;
        int r;

        switch (op) {
        case JACS_OPBIN_ADD:
            if (__builtin_sadd_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_SUB:
            if (__builtin_ssub_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_DIV:
            // not sure this is worth it on M0+; it definitely is on M4
            if (bb == 0 || (bb == -1 && aa == INT_MIN) || ((r = aa / bb)) * bb != aa)
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_MUL:
            if (__builtin_smul_overflow(aa, bb, &r))
                break;
            return jacs_value_from_int(r);

        case JACS_OPBIN_LT:
            return jacs_value_from_bool(aa < bb);
        case JACS_OPBIN_LE:
            return jacs_value_from_bool(aa <= bb);
        case JACS_OPBIN_EQ:
            return jacs_value_from_bool(aa == bb);
        case JACS_OPBIN_NE:
            return jacs_value_from_bool(aa != bb);

        default:
            oops();
        }
    }

    double af = jacs_value_to_double(a);
    double bf = jacs_value_to_double(b);

    switch (op) {
    case JACS_OPBIN_ADD:
        return jacs_value_from_double(af + bf);
    case JACS_OPBIN_SUB:
        return jacs_value_from_double(af - bf);
    case JACS_OPBIN_DIV:
        return jacs_value_from_double(af / bf);
    case JACS_OPBIN_MUL:
        return jacs_value_from_double(af * bf);
    case JACS_OPBIN_LT:
        return jacs_value_from_bool(af < bf);
    case JACS_OPBIN_LE:
        return jacs_value_from_bool(af <= bf);
    case JACS_OPBIN_EQ:
        return jacs_value_from_bool(af == bf);
    case JACS_OPBIN_NE:
        return jacs_value_from_bool(af != bf);

    default:
        oops();
    }
}

static uint32_t random_max(uint32_t mx) {
    uint32_t mask = 1;
    while (mask < mx)
        mask = (mask << 1) | 1;
    for (;;) {
        uint32_t r = jd_random() & mask;
        if (r <= mx)
            return r;
    }
}

value_t jacs_step_opmath1(int op, value_t a) {
    if (jacs_is_tagged_int(a)) {
        switch (op) {
        case JACS_OPMATH1_FLOOR:
        case JACS_OPMATH1_ROUND:
        case JACS_OPMATH1_CEIL:
            return a;
        }
    }

    double af = jacs_value_to_double(a);

    switch (op) {
    case JACS_OPMATH1_FLOOR:
        return jacs_value_from_double(floor(af));
    case JACS_OPMATH1_ROUND:
        return jacs_value_from_double(round(af));
    case JACS_OPMATH1_CEIL:
        return jacs_value_from_double(ceil(af));
    case JACS_OPMATH1_LOG_E:
        return jacs_value_from_double(log(af));
    case JACS_OPMATH1_RANDOM:
        return jacs_value_from_double(jd_random() * af / (double)0x100000000);
    case JACS_OPMATH1_RANDOM_INT:
        return jacs_value_from_int(random_max(jacs_value_to_int(a)));
    default:
        oops();
    }
}

value_t jacs_step_opmath2(int op, value_t a, value_t b) {
    if (op == JACS_OPMATH2_IDIV || op == JACS_OPMATH2_IMUL ||
        (jacs_is_tagged_int(a) && jacs_is_tagged_int(b))) {
        int aa = jacs_value_to_int(a);
        int bb = jacs_value_to_int(b);
        switch (op) {
        case JACS_OPMATH2_MIN:
            return aa < bb ? a : b;
        case JACS_OPMATH2_MAX:
            return aa > bb ? a : b;
        case JACS_OPMATH2_IDIV:
            if (bb == 0)
                return jacs_zero;
            return jacs_value_from_int(aa / bb);
        case JACS_OPMATH2_IMUL:
            // avoid signed overflow, which is undefined
            // note that signed and unsigned multiplication result in the same bit patterns
            return jacs_value_from_int((uint32_t)aa * (uint32_t)bb);
        }
    }

    double af = jacs_value_to_double(a);
    double bf = jacs_value_to_double(b);

    switch (op) {
    case JACS_OPMATH2_MIN:
        return af < bf ? a : b;
    case JACS_OPMATH2_MAX:
        return af > bf ? a : b;
    case JACS_OPMATH2_POW:
        return jacs_value_from_double(pow(af, bf));
    default:
        oops();
    }
}

#endif