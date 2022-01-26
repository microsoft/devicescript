#pragma once

#include "jacs_format.h"
#include "jacs_img.h"
#include "jd_sdk.h"

size_t jacs_strformat(const char *fmt, size_t fmtlen, char *dst, size_t dstlen, value_t *args, size_t numargs);
uint32_t jacs_now(void);
int jacs_verify(const uint8_t *img, uint32_t size);
