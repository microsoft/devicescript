#include "devs_internal.h"
#include <math.h>

STATIC_ASSERT(sizeof(devs_img_header_t) ==
              DEVS_FIX_HEADER_SIZE + DEVS_NUM_IMG_SECTIONS * sizeof(devs_img_section_t));

STATIC_ASSERT(sizeof(devs_service_spec_t) == DEVS_SERVICE_SPEC_HEADER_SIZE);
STATIC_ASSERT(sizeof(devs_packet_spec_t) == DEVS_SERVICE_SPEC_PACKET_SIZE);
STATIC_ASSERT(sizeof(devs_field_spec_t) == DEVS_SERVICE_SPEC_FIELD_SIZE);

static int fail(int code, uint32_t offset) {
    DMESG("! verification failure: %d at %x", code, (unsigned)offset);
    return -code;
}

// next error 1087
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

bool devs_img_stridx_ok(devs_img_t img, uint32_t nameidx) {
    if (nameidx >> 16)
        return false;
    unsigned idx = nameidx & ((1 << DEVS_STRIDX__SHIFT) - 1);
    switch (nameidx >> DEVS_STRIDX__SHIFT) {
    case DEVS_STRIDX_BUFFER:
        return (idx < img.header->buffers.length / sizeof(devs_img_section_t));
    case DEVS_STRIDX_BUILTIN:
        return (idx <= DEVS_BUILTIN_STRING___MAX);
    case DEVS_STRIDX_ASCII:
        JD_ASSERT(DEVS_ASCII_HEADER_SIZE == sizeof(uint16_t));
        return (idx < img.header->ascii_strings.length / DEVS_ASCII_HEADER_SIZE);
    case DEVS_STRIDX_UTF8:
        return (idx < img.header->utf8_strings.length / DEVS_UTF8_HEADER_SIZE);
    default:
        JD_PANIC();
    }
}

void devs_dump_versions(const void *imgdata) {
    uint32_t v;
    memcpy(&v, (const uint8_t *)imgdata + 8, 4);
    DMESG("* %s v%d.%d.%d; file v%d.%d.%d", app_get_dev_class_name(), DEVS_IMG_VERSION_MAJOR,
          DEVS_IMG_VERSION_MINOR, DEVS_IMG_VERSION_PATCH, DEVS_VERSION_MAJOR(v),
          DEVS_VERSION_MINOR(v), DEVS_VERSION_PATCH(v));
}

STATIC_ASSERT(sizeof(devs_utf8_string_t) == offsetof(devs_utf8_string_t, jmp_table));

int devs_verify(const uint8_t *imgdata, uint32_t size) {
    JD_ASSERT(((uintptr_t)imgdata & 3) == 0);
    JD_ASSERT(size > sizeof(devs_img_header_t));
    uint32_t offset = 0;
    const devs_img_header_t *header = (const devs_img_header_t *)imgdata;
    devs_img_t _img;
    _img.data = imgdata;

    CHECK(1000, header->magic0 == DEVS_MAGIC0 && header->magic1 == DEVS_MAGIC1);

    // precise match on major,
    // bytecode minor should only load if no newer than current runtime,
    // ignore patch
    if (DEVS_VERSION_MAJOR(header->version) == DEVS_VERSION_MAJOR(DEVS_IMG_VERSION) &&
        DEVS_VERSION_MINOR(header->version) <= DEVS_VERSION_MINOR(DEVS_IMG_VERSION) &&
        // 2.5.0 is first version with UTF8 layout
        // 2.7.0 is first version without static roles
        // -> remove when we reach v3
        DEVS_VERSION_MINOR(header->version) >= 7) {
        // OK
    } else {
        DMESG("! version mismatch");
        devs_dump_versions(imgdata);
        return fail(1050, offset);
    }

    const devs_img_section_t *sptr = &header->functions;

    for (int i = 0; i < DEVS_NUM_IMG_SECTIONS; ++i) {
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
        if (devs_is_tagged_int(tmp))
            continue;
        CHECK(1043, !isnan(tmp._f));
        CHECK(1044, devs_value_from_double(tmp._f).u64 == tmp.u64);
    }

    CHECK(1059,
          header->functions.length / sizeof(devs_function_desc_t) < DEVS_FIRST_BUILTIN_FUNCTION);

    uint32_t prevProc = header->functions_data.start;
    for (const devs_function_desc_t *fptr = FIRST_DESC(functions); //
         (void *)fptr < LAST_DESC(functions);                      //
         fptr++) {
        CHECK(1062, fptr->num_args <= fptr->num_slots);
        sptr = (const devs_img_section_t *)fptr;
        CHECK_SECT_ALIGNED(sptr);
        MUST_CONTAIN_SECT(1021, header->functions_data, sptr);
        CHECK(1020, sptr->start == prevProc);
        prevProc += sptr->length;
        CHECK(1051, prevProc < 0x10000);
        CHECK(1052, devs_img_stridx_ok(_img, fptr->name_idx));
        if (fptr->flags & DEVS_FUNCTIONFLAG_IS_CTOR)
            CHECK(1075, fptr->flags & DEVS_FUNCTIONFLAG_NEEDS_THIS);
        int numargs = fptr->num_args;
        if (fptr->flags & DEVS_FUNCTIONFLAG_NEEDS_THIS)
            numargs--;
        if (fptr->flags & DEVS_FUNCTIONFLAG_HAS_REST_ARG)
            numargs--;
        CHECK(1076, numargs >= 0);
    }

    const uint8_t *str_data = FIRST_DESC(string_data);
    CHECK(1059, str_data[header->string_data.length - 1] == 0);

    for (uint32_t *off = FIRST_DESC(utf8_strings); (void *)off < LAST_DESC(utf8_strings); off++) {
        CHECK(1078, (*off & 1) == 0);
        CHECK(1079, *off < header->string_data.length);
        CHECK(1080, *off + sizeof(devs_utf8_string_t) + 1 < header->string_data.length);
        const devs_utf8_string_t *str = (const void *)(str_data + *off);
        unsigned num_ent = devs_utf8_string_jmp_entries(str->length);
        unsigned data_size = num_ent * sizeof(uint16_t) + str->size + 1;
        CHECK(1081, *off + sizeof(devs_utf8_string_t) + data_size < header->string_data.length);
        int r = devs_utf8_init(devs_utf8_string_data(str), str->size, NULL, str,
                               DEVS_UTF8_INIT_CHK_DATA | DEVS_UTF8_INIT_CHK_JMP);
        // map error codes
        CHECK(1082, r != DEVS_UTF8_INIT_ERR_JMP_TBL);
        CHECK(1083, r != DEVS_UTF8_INIT_ERR_DATA);
        CHECK(1084, r != DEVS_UTF8_INIT_ERR_SIZES);
        CHECK(1085, r != DEVS_UTF8_INIT_ERR_NUL_TERM);
        CHECK(1086, r >= 0); // fallback
    }
    for (sptr = FIRST_DESC(buffers); (void *)sptr < LAST_DESC(buffers); sptr++) {
        CHECK(1055, sptr->start < header->string_data.length);
        CHECK(1056, sptr->start + sptr->length < header->string_data.length);
    }
    for (uint16_t *off = FIRST_DESC(ascii_strings); (void *)off < LAST_DESC(ascii_strings); off++) {
        CHECK(1057, *off < header->string_data.length);
        for (unsigned endp = *off; endp < header->string_data.length; ++endp) {
            CHECK(1058, endp - *off < 200);
            if (str_data[endp] == 0)
                break;
        }
    }

    CHECK(1040, header->roles_removed.length == 0);

    const devs_service_spec_t *specs = FIRST_DESC(service_specs);
    const uint8_t *specs_base = (const uint8_t *)specs;
    for (unsigned i = 0; i < header->num_service_specs; ++i) {
        const devs_service_spec_t *spec = specs + i;
        SET_OFF(spec);
        CHECK(1074, (void *)(spec + 1) < LAST_DESC(service_specs));
        if (i == DEVS_SERVICESPEC_FLAG_DERIVE_BASE)
            CHECK(1063, spec->service_class == JD_SERVICE_CLASS_BASE);
        if (i == DEVS_SERVICESPEC_FLAG_DERIVE_SENSOR)
            CHECK(1064, spec->service_class == JD_SERVICE_CLASS_SENSOR);
        unsigned off = spec->packets_offset * 4;
        CHECK(1065, off < header->service_specs.length);
        CHECK(1066,
              off + sizeof(devs_packet_spec_t) * spec->num_packets <= header->service_specs.length);

        CHECK(1067, devs_img_stridx_ok(_img, spec->name_idx));
        unsigned base_class = spec->flags & DEVS_SERVICESPEC_FLAG_DERIVE_MASK;
        CHECK(1068, base_class <= DEVS_SERVICESPEC_FLAG_DERIVE_LAST);
        const devs_packet_spec_t *pkts = (const void *)(specs_base + off);
        for (unsigned idx = 0; idx < spec->num_packets; ++idx) {
            const devs_packet_spec_t *pkt = pkts + idx;
            SET_OFF(pkt);
            CHECK(1069, devs_img_stridx_ok(_img, pkt->name_idx));
            if (pkt->flags & DEVS_PACKETSPEC_FLAG_MULTI_FIELD) {
                unsigned foff = pkt->numfmt_or_offset * 4;
                CHECK(1070, foff + 4 < header->service_specs.length);
                const devs_field_spec_t *fld = (const void *)(specs_base + foff);
                bool terminated = false;
                while ((void *)fld < LAST_DESC(service_specs)) {
                    if (fld->name_idx == 0) {
                        CHECK(1071, fld->numfmt == 0 && fld->flags == 0);
                        terminated = true;
                        break;
                    }
                    CHECK(1072, devs_img_stridx_ok(_img, fld->name_idx));
                    fld++;
                }
                CHECK(1073, terminated);
            }
        }
    }

    if (header->dcfg.length) {
        const dcfg_header_t *hd = FIRST_DESC(dcfg);
        CHECK(1077, hd->total_bytes <= header->dcfg.length);
        int r = dcfg_validate(hd);
        if (r) {
            fail(r, header->dcfg.start);
            return -r;
        }
    }

    return 0;
}