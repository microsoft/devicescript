#pragma once
#include "jacs_pack.h"
#include "jacs_format.h"
#include "jacdac/dist/c/timeseriesaggregator.h"

#define JD_SPEC_PACK_BEGIN const jacs_packed_service_desc_t jacs_packed_service_descs[] = {
#define JD_SPEC_PACK_END                                                                           \
    }                                                                                              \
    ;
#define JD_SPEC_PACK_SERVICE(name, cls, fmt, shift, mode)                                          \
    {cls, JACS_NUM_FMT(JACS_NUMFMT_##fmt, shift), JD_TIMESERIES_AGGREGATOR_DATA_MODE_##mode},
#define JD_SPEC_PACK_NUM(n) const unsigned jacs_num_packed_service_descs = n;
