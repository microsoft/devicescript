#include "devs_internal.h"
#include <math.h>

STATIC_ASSERT(sizeof(devs_img_header_t) ==
              JACS_FIX_HEADER_SIZE + JACS_NUM_IMG_SECTIONS * sizeof(devs_img_section_t));

static int fail(int code, uint32_t offset) {
    DMESG("verification failure: %d at %x", code, (unsigned)offset);
    return -code;
}

// next error 1059
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
    unsigned idx = nameidx & ((1 << JACS_STRIDX__SHIFT) - 1);
    switch (nameidx >> JACS_STRIDX__SHIFT) {
    case JACS_STRIDX_BUFFER:
        return (idx < img.header->buffers.length / sizeof(devs_img_section_t));
    case JACS_STRIDX_BUILTIN:
        return (idx < JACS_BUILTIN_STRING__SIZE);
    case JACS_STRIDX_ASCII:
        JD_ASSERT(JACS_ASCII_HEADER_SIZE == sizeof(uint16_t));
        return (idx < img.header->ascii_strings.length / JACS_ASCII_HEADER_SIZE);
    case JACS_STRIDX_UTF8:
        return (idx < img.header->utf8_strings.length / sizeof(devs_img_section_t));
    default:
        JD_ASSERT(0);
    }
}

int devs_verify(const uint8_t *imgdata, uint32_t size) {
    JD_ASSERT(((uintptr_t)imgdata & 3) == 0);
    JD_ASSERT(size > sizeof(devs_img_header_t));
    uint32_t offset = 0;
    const devs_img_header_t *header = (const devs_img_header_t *)imgdata;
    devs_img_t _img;
    _img.data = imgdata;

    CHECK(1000, header->magic0 == JACS_MAGIC0 && header->magic1 == JACS_MAGIC1);
    CHECK(1050, header->version == JACS_IMG_VERSION);

    const devs_img_section_t *sptr = &header->functions;

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
        if (devs_is_tagged_int(tmp))
            continue;
        CHECK(1043, !isnan(tmp._f));
        CHECK(1044, devs_value_from_double(tmp._f).u64 == tmp.u64);
    }

    uint32_t prevProc = header->functions_data.start;
    for (const devs_function_desc_t *fptr = FIRST_DESC(functions); //
         (void *)fptr < LAST_DESC(functions);                      //
         fptr++) {
        sptr = (const devs_img_section_t *)fptr;
        CHECK_SECT_ALIGNED(sptr);
        MUST_CONTAIN_SECT(1021, header->functions_data, sptr);
        CHECK(1020, sptr->start == prevProc);
        prevProc += sptr->length;
        CHECK(1051, prevProc < 0x10000);
        CHECK(1052, devs_img_stridx_ok(_img, fptr->name_idx));
    }

    uint8_t *str_data = FIRST_DESC(string_data);
    CHECK(1059, str_data[header->string_data.length - 1] == 0);
    for (sptr = FIRST_DESC(utf8_strings); (void *)sptr < LAST_DESC(utf8_strings); sptr++) {
        CHECK(1052, sptr->start < header->string_data.length);
        CHECK(1053, sptr->start + sptr->length < header->string_data.length);
        CHECK(1054, str_data[sptr->start + sptr->length] == 0);
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

    for (const devs_role_desc_t *fptr = FIRST_DESC(roles); //
         (void *)fptr < LAST_DESC(roles);                  //
         fptr++) {
        SET_OFF(fptr);
        int top = fptr->service_class >> 28;
        CHECK(1040, top == 1 || top == 2);
        // CHECK(1041, fptr->name_idx > 0); - TODO why was this here?
        CHECK(1042, devs_img_stridx_ok(_img, fptr->name_idx));
    }

    return 0;
}