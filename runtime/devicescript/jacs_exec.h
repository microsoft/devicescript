#pragma once

#include "jacs_format.h"
#include "jacs_img.h"
#include "jd_sdk.h"

#define JACS_PANIC_REBOOT 60000
#define JACS_PANIC_TIMEOUT 60001
#define JACS_PANIC_INTERNAL_ERROR 60002

size_t jacs_strformat(const char *fmt, size_t fmtlen, char *dst, size_t dstlen, value_t *args, size_t numargs);
int jacs_verify(const uint8_t *img, uint32_t size);
