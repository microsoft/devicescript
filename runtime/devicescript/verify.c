#include "jacs_internal.h"
#include <math.h>

STATIC_ASSERT(sizeof(jacs_img_header_t) == 64 + JACS_NUM_IMG_SECTIONS * sizeof(jacs_img_section_t));

static int numSetBits(uint32_t n) {
    int r = 0;
    for (int i = 0; i < 32; ++i)
        if (n & (1 << i))
            r++;
    return r;
}

static int fail(int code, uint32_t offset) {
    DMESG("verification failure: %d at %x", code, (unsigned)offset);
    return -code;
}

// next error 1150 / 1051
#define CHECK(code, cond)                                                                          \
    if (!(cond))                                                                                   \
    return fail(code, offset)

#define SET_OFF(ptr) offset = (const uint8_t *)(ptr)-imgdata

#define FIRST_DESC(id) (void *)(imgdata + header->id.start)
#define LAST_DESC(id) (void *)(imgdata + header->id.start + header->id.length)

#define CHECK_SECT(sptr)                                                                           \
    SET_OFF(sptr);                                                                                 \
    CHECK(1001, sptr->start <= size);                                                              \
    CHECK(1002, sptr->start + sptr->length <= size)

#define CHECK_SECT_ALIGNED(sptr)                                                                   \
    CHECK_SECT(sptr);                                                                              \
    CHECK(1003, (sptr->start & 3) == 0);                                                           \
    CHECK(1004, (sptr->length & 3) == 0);

#define MUST_CONTAIN_PTR(code, container, off)                                                     \
    CHECK(code, (container).start <= off && off <= (container).start + (container).length)
#define MUST_CONTAIN_SECT(code, container, sect)                                                   \
    MUST_CONTAIN_PTR(code, container, (sect)->start);                                              \
    MUST_CONTAIN_PTR(code, container, (sect)->start + (sect)->length)

#define IS_DYNAMIC(x) ((x) + 1 == 0)
#define DYN_MARKER (0U - 1U)

static int verify_function(jacs_img_t *img, const jacs_function_desc_t *fptr) {
    const uint8_t *imgdata = img->data;
    uint32_t offset;
    const uint16_t *funcode = (const uint16_t *)(imgdata + fptr->start);
    uint32_t a, b, c, d;
    uint16_t num_regs = fptr->num_regs_and_args & 0xf;
    uint32_t numinstr = fptr->length >> 1;

    a = b = c = d = 0;

    for (uint32_t pc = 0; pc < numinstr; pc++) {
        uint32_t instr = funcode[pc];
        uint32_t op = instr >> 12;
        uint32_t arg12 = instr & 0xfff;
        uint32_t arg10 = instr & 0x3ff;
        uint32_t arg8 = instr & 0xff;
        uint32_t arg6 = instr & 0x3f;
        uint32_t subop = arg12 >> 8;
        bool lastOK = false;

        SET_OFF(&funcode[pc]);

        switch (op) {
        case JACS_OPTOP_LOAD_CELL:
        case JACS_OPTOP_STORE_CELL:
            a = (a << 4) | (arg8 & 0xf);
            break;
        case JACS_OPTOP_JUMP:
        case JACS_OPTOP_CALL:
            b = (b << 6) | arg6;
            break;
        }

        switch (op) {
        case JACS_OPTOP_SET_A:
            a = arg12;
            break;
        case JACS_OPTOP_SET_B:
            b = arg12;
            break;
        case JACS_OPTOP_SET_C:
            c = arg12;
            break;
        case JACS_OPTOP_SET_D:
            d = arg12;
            break;

        case JACS_OPTOP_SET_HIGH:
            if (arg10 >> 4 == 0x20) {
                switch (arg12 >> 10) {
                case 0:
                    a = DYN_MARKER;
                    break;
                case 1:
                    b = DYN_MARKER;
                    break;
                case 2:
                    c = DYN_MARKER;
                    break;
                case 3:
                    d = DYN_MARKER;
                    break;
                }
            } else {
                CHECK(1101, (arg10 >> 4) == 0);
                switch (arg12 >> 10) {
                case 0:
                    a |= arg10 << 12;
                    break;
                case 1:
                    b |= arg10 << 12;
                    break;
                case 2:
                    c |= arg10 << 12;
                    break;
                case 3:
                    d |= arg10 << 12;
                    break;
                }
            }
            break;

        case JACS_OPTOP_UNARY:                     // OP[4] DST[4] SRC[4]
            CHECK(1102, subop <= JACS_OPUN__LAST); // valid uncode
            break;

        case JACS_OPTOP_BINARY:                     // OP[4] DST[4] SRC[4]
            CHECK(1103, subop != 0);                // valid bincode
            CHECK(1104, subop <= JACS_OPBIN__LAST); // valid bincode
            break;

        case JACS_OPTOP_LOAD_CELL:  // DST[4] A:OP[2] B:OFF[6]
        case JACS_OPTOP_STORE_CELL: // SRC[4] A:OP[2] B:OFF[6]
        {
            uint32_t idx = a;
            uint16_t tp = arg8 >> 4;
            switch (tp) {
            case JACS_CELL_KIND_LOCAL:
                CHECK(1133, idx < fptr->num_locals); // locals range
                break;
            case JACS_CELL_KIND_GLOBAL:
                CHECK(1134, IS_DYNAMIC(idx) || idx < img->header->num_globals); // globals range
                break;
            case JACS_CELL_KIND_BUFFER:
                // all checks at runtime
                break;
            case JACS_CELL_KIND_FLOAT_CONST:
                CHECK(1138, idx < jacs_img_num_floats(img)); // float const in range
                break;
            case JACS_CELL_KIND_IDENTITY:
                break;
            case JACS_CELL_KIND_SPECIAL:
                CHECK(1139, idx <= JACS_VALUE_SPECIAL__LAST); // special in range
                break;
            case JACS_CELL_KIND_ROLE_PROPERTY:
                CHECK(1140, IS_DYNAMIC(b) || b < jacs_img_num_roles(img)); // role prop R range
                CHECK(1141, idx <= JACS_ROLE_PROPERTY__LAST);              // role prop C range
                break;
            default:
                CHECK(1142, false); // invalid cell kind
            }

            switch (tp) {
            case JACS_CELL_KIND_LOCAL:
            case JACS_CELL_KIND_GLOBAL:
            case JACS_CELL_KIND_BUFFER:
                break;
            default:
                CHECK(1143, op == JACS_OPTOP_LOAD_CELL); // cell kind not writable
                break;
            }
        } break;

        case JACS_OPTOP_JUMP: { // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
            int pc2 = pc + 1;
            if (arg8 & (1 << 7)) {
                pc2 -= b;
            } else {
                pc2 += b;
            }
            CHECK(1105, pc2 >= 0);                                            // jump before
            CHECK(1106, pc2 < (int)numinstr);                                 // jump after
            CHECK(1107, pc2 == 0 || !jacs_is_prefix_instr(funcode[pc2 - 1])); // jump into prefix
            if (!(arg8 & (1 << 6)))
                lastOK = true;
        } break;

        case JACS_OPTOP_CALL: // NUMREGS[4] OPCALL[2] B:OFF[6] (D - saved regs)
            CHECK(1108, numSetBits(d) <= num_regs);
            switch (arg8 >> 6) {
            case JACS_OPCALL_BG:
            case JACS_OPCALL_BG_MAX1:
            case JACS_OPCALL_BG_MAX1_PEND1:
                CHECK(1109, d == 0); // save regs on bg call
                break;
            case JACS_OPCALL_SYNC:
                break;
            default:
                CHECK(1110, false); // invalid callop
            }
            CHECK(1111, b < jacs_img_num_functions(img)); // call fn in range
            CHECK(1112, (jacs_img_get_function(img, b)->num_regs_and_args >> 4) ==
                            subop); // correct num of args
            break;

        case JACS_OPTOP_SYNC:
            switch (arg8) {
            case JACS_OPSYNC_RETURN:
                lastOK = true;
                break;
            case JACS_OPSYNC_SETUP_BUFFER:              // A-size
                CHECK(1113, IS_DYNAMIC(a) || a <= JD_SERIAL_PAYLOAD_SIZE); // setup buffer size in range
                CHECK(1149, d == 0);
                break;
            case JACS_OPSYNC_FORMAT:                        // A-string-index B-numargs
                CHECK(1114, c <= JD_SERIAL_PAYLOAD_SIZE);                      // offset in range
                CHECK(1115, a < jacs_img_num_strings(img)); // str in range
                CHECK(1147, b <= JACS_NUM_REGS);
                break;
            case JACS_OPSYNC_STR0EQ:
                CHECK(1116, c <= JD_SERIAL_PAYLOAD_SIZE);                      // offset in range
                CHECK(1117, a < jacs_img_num_strings(img)); // str in range
                break;
            case JACS_OPSYNC_MEMCPY:
                CHECK(1118, c <= JD_SERIAL_PAYLOAD_SIZE);                      // offset in range
                CHECK(1119, a < jacs_img_num_strings(img)); // str in range
                break;
            case JACS_OPSYNC_MATH1:
                CHECK(1120, a <= JACS_OPMATH1__LAST); // math1 in range
                break;
            case JACS_OPSYNC_MATH2:
                CHECK(1121, a <= JACS_OPMATH2__LAST); // math2 in range
                break;
            case JACS_OPSYNC_PANIC:
                lastOK = true;
                break;
            default:
                CHECK(1122, false); // invalid sync code
                break;
            }
            break;

        case JACS_OPTOP_ASYNC: // D:SAVE_REGS[4] OP[8]
            d = (d << 4) | subop;
            CHECK(1100, numSetBits(d) <= num_regs);
            switch (arg8) {
            case JACS_OPASYNC_SLEEP_MS:
                break;
            case JACS_OPASYNC_SLEEP_R0:
                break;
            case JACS_OPASYNC_WAIT_ROLE:
                CHECK(1123, IS_DYNAMIC(a) || a < jacs_img_num_roles(img)); // role in range
                break;
            case JACS_OPASYNC_SEND_CMD:                                    // A-role, B-code
                CHECK(1124, IS_DYNAMIC(a) || a < jacs_img_num_roles(img)); // role idx
                // CHECK(1125, b <= 0xffff);                 // cmd code
                break;
            case JACS_OPASYNC_QUERY_REG: // A-role, B-code, C-timeout
                CHECK(1126, IS_DYNAMIC(a) || a < jacs_img_num_roles(img)); // role idx
                CHECK(1127, IS_DYNAMIC(b) || b <= 0x1ff);                  // reg code
                break;
            case JACS_OPASYNC_QUERY_IDX_REG: // A-role, B-STRIDX:CMD[8], C-timeout
                CHECK(1128, IS_DYNAMIC(a) || a < jacs_img_num_roles(img)); // role idx
                CHECK(1129, b >> 8 != 0);                                  // arg!=0
                CHECK(1130, b >> 8 < jacs_img_num_strings(img));           // num str
                break;
            case JACS_OPASYNC_LOG_FORMAT: // A-string-index B-numargs
                CHECK(1144, c == 0);
                CHECK(1145, a < jacs_img_num_strings(img));
                CHECK(1146, b < JACS_NUM_REGS);
                CHECK(1148, (d & ((1 << b) - 1)) == (uint32_t)((1 << b) - 1));
                break;
            default:
                CHECK(1131, false); // invalid async code
                break;
            }
            break;
        }

        if (!jacs_is_prefix_instr(instr))
            a = b = c = d = 0;

        CHECK(1132, lastOK || pc + 1 < numinstr); // final fall-off
    }

    return 0;
}

int jacs_verify(const uint8_t *imgdata, uint32_t size) {
    JD_ASSERT(((uintptr_t)imgdata & 3) == 0);
    JD_ASSERT(size > sizeof(jacs_img_header_t));
    uint32_t offset = 0;
    const jacs_img_header_t *header = (const jacs_img_header_t *)imgdata;
    jacs_img_t _img;
    _img.data = imgdata;
    jacs_img_t *img = &_img;

    CHECK(1000, header->magic0 == JACS_IMG_MAGIC0 && header->magic1 == JACS_IMG_MAGIC1);
    CHECK(1050, header->version == JACS_IMG_VERSION);

    const jacs_img_section_t *sptr = &header->functions;

    for (int i = 0; i < JACS_NUM_IMG_SECTIONS; ++i) {
        CHECK_SECT_ALIGNED(sptr);
        CHECK(1010, i == 0 || (sptr - 1)->start + (sptr - 1)->length == sptr->start);
        sptr++;
    }

    SET_OFF(&header->float_literals);
    CHECK(1011, (header->float_literals.length & 7) == 0);

    for (const value_t *fptr = FIRST_DESC(float_literals); //
         (void *)fptr < LAST_DESC(float_literals);         //
         fptr++) {
        value_t tmp = *fptr;
        if (jacs_is_tagged_int(tmp))
            continue;
        CHECK(1043, !isnan(tmp.f));
        CHECK(1044, jacs_value_from_double(tmp.f).u64 == tmp.u64);
    }

    uint32_t prevProc = header->functions_data.start;
    for (const jacs_function_desc_t *fptr = FIRST_DESC(functions); //
         (void *)fptr < LAST_DESC(functions);                      //
         fptr++) {
        sptr = (const jacs_img_section_t *)fptr;
        CHECK_SECT_ALIGNED(sptr);
        MUST_CONTAIN_SECT(1021, header->functions_data, sptr);
        CHECK(1020, sptr->start == prevProc);
        int r = verify_function(img, fptr);
        if (r)
            return r;
        prevProc += sptr->length;
    }

    for (sptr = FIRST_DESC(strings); (void *)sptr < LAST_DESC(strings); sptr++) {
        CHECK_SECT(sptr);
        MUST_CONTAIN_SECT(1030, header->string_data, sptr);
    }

    for (const jacs_role_desc_t *fptr = FIRST_DESC(roles); //
         (void *)fptr < LAST_DESC(roles);                  //
         fptr++) {
        SET_OFF(fptr);
        int top = fptr->service_class >> 28;
        CHECK(1040, top == 1 || top == 2);
        // CHECK(1041, fptr->name_idx > 0); - TODO why was this here?
        CHECK(1042, fptr->name_idx < jacs_img_num_strings(img));
    }

    for (const jacs_buffer_desc_t *fptr = FIRST_DESC(buffers); //
         (void *)fptr < LAST_DESC(buffers);                    //
         fptr++) {
        SET_OFF(fptr);
        CHECK(1045, fptr->type == 0);
        CHECK(1046, fptr->reserved == 0);
        if (fptr == FIRST_DESC(buffers)) {
            CHECK(1049, fptr->size == JD_SERIAL_PAYLOAD_SIZE); // buffer #0 is current packet
        } else {
            CHECK(1047, fptr->size > 0);
            CHECK(1048, fptr->size <= 1024);
        }
    }

    return 0;
}