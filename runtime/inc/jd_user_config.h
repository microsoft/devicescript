#ifndef JD_USER_CONFIG_H
#define JD_USER_CONFIG_H

#define JD_CONFIG_TEMPERATURE 0

#include <stdio.h>
#include <stdint.h>

__attribute__((format(printf, 1, 2))) void app_dmesg(const char *format, ...);
#define DMESG app_dmesg

#define JD_DMESG_LINE_BUFFER 300

#define JD_CONFIG_STATUS 0
#define JD_CONFIG_CONTROL_FLOOD 0
#define JD_CLIENT 1
#define JD_VERBOSE_ASSERT 1
#define JD_PHYSICAL 0

#define JD_FLASH_PAGE_SIZE 4096

#ifdef __EMSCRIPTEN__
#define JD_LSTORE 0
#define JD_NET_BRIDGE 0
#define JD_WEBSOCK_IMPL 0
#else
#define JD_LSTORE 1
#define JD_LSTORE_FF 0
#define JD_LSTORE_FILE_SIZE (4 * 1024 * 1024)
#define JD_NET_BRIDGE 1
#endif

// disable reset_in packets - not too useful on servers
#define JD_CONFIG_WATCHDOG 0

// #define JD_THR_PTHREAD 1

extern uintptr_t flash_base_addr(void);
#define JD_FSTOR_BASE_ADDR flash_base_addr()
#define JD_SETTINGS_LARGE 1

extern const uint8_t jd_dcfg_array[];
#define JD_DCFG_BASE_ADDR ((uintptr_t)jd_dcfg_array)

#endif
