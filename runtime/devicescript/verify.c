#include "devs_internal.h"
#include <math.h>

STATIC_ASSERT(sizeof(devs_img_header_t) == 64 + JACS_NUM_IMG_SECTIONS * sizeof(devs_img_section_t));

static int fail(int code, uint32_t offset) {
    DMESG("verification failure: %d at %x", code, (unsigned)offset);
    return -code;
}

// next error 1052
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

int devs_verify(const uint8_t *imgdata, uint32_t size) {
    JD_ASSERT(((uintptr_t)imgdata & 3) == 0);
    JD_ASSERT(size > sizeof(devs_img_header_t));
    uint32_t offset = 0;
    const devs_img_header_t *header = (const devs_img_header_t *)imgdata;
    devs_img_t _img;
    _img.data = imgdata;
    devs_img_t *img = &_img;

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
        CHECK(1052, fptr->name_idx < devs_img_num_strings(img));
    }

    for (sptr = FIRST_DESC(strings); (void *)sptr < LAST_DESC(strings); sptr++) {
        CHECK_SECT(sptr);
        MUST_CONTAIN_SECT(1030, header->string_data, sptr);
    }

    for (const devs_role_desc_t *fptr = FIRST_DESC(roles); //
         (void *)fptr < LAST_DESC(roles);                  //
         fptr++) {
        SET_OFF(fptr);
        int top = fptr->service_class >> 28;
        CHECK(1040, top == 1 || top == 2);
        // CHECK(1041, fptr->name_idx > 0); - TODO why was this here?
        CHECK(1042, fptr->name_idx < devs_img_num_strings(img));
    }

    return 0;
}