#ifndef UF2_HID_H
#define UF2_HID_H 1

#define HF2_CMD_BININFO 0x0001
// no arguments
#define HF2_MODE_BOOTLOADER 0x01
#define HF2_MODE_USERSPACE 0x02
struct HF2_BININFO_Result {
    uint32_t mode;
    uint32_t flash_page_size;
    uint32_t flash_num_pages;
    uint32_t max_message_size;
    uint32_t uf2_family;
};

#define HF2_CMD_INFO 0x0002
// no arguments
// results is utf8 character array

#define HF2_CMD_RESET_INTO_APP 0x0003
// no arguments, no result

#define HF2_CMD_RESET_INTO_BOOTLOADER 0x0004
// no arguments, no result

#define HF2_CMD_START_FLASH 0x0005
// no arguments, no result

#define HF2_CMD_WRITE_FLASH_PAGE 0x0006
struct HF2_WRITE_FLASH_PAGE_Command {
    uint32_t target_addr;
    uint32_t data[0];
};
// no result

#define HF2_CMD_CHKSUM_PAGES 0x0007
struct HF2_CHKSUM_PAGES_Command {
    uint32_t target_addr;
    uint32_t num_pages;
};
struct HF2_CHKSUM_PAGES_Result {
    uint16_t chksums[0 /* num_pages */];
};

#define HF2_CMD_READ_WORDS 0x0008
struct HF2_READ_WORDS_Command {
    uint32_t target_addr;
    uint32_t num_words;
};
struct HF2_READ_WORDS_Result {
    uint32_t words[0 /* num_words */];
};

#define HF2_CMD_WRITE_WORDS 0x0009
struct HF2_WRITE_WORDS_Command {
    uint32_t target_addr;
    uint32_t num_words;
    uint32_t words[0 /* num_words */];
};
// no result

#define HF2_CMD_DMESG 0x0010
// no arguments
// results is utf8 character array

#define HF2_EV_MASK 0x800000

#define HF2_CMD_JDS_CONFIG 0x0020
#define HF2_CMD_JDS_SEND 0x0021
#define HF2_EV_JDS_PACKET 0x800020

typedef struct {
    uint32_t command_id;
    uint16_t tag;
    uint8_t reserved0;
    uint8_t reserved1;

    union {
        struct HF2_WRITE_FLASH_PAGE_Command write_flash_page;
        struct HF2_WRITE_WORDS_Command write_words;
        struct HF2_READ_WORDS_Command read_words;
        struct HF2_CHKSUM_PAGES_Command chksum_pages;
        uint8_t data8[0];
        uint16_t data16[0];
        uint32_t data32[0];
    };
} HF2_Command;

typedef struct {
    union {
        uint32_t eventId;
        struct {
            uint16_t tag;
            union {
                struct {
                    uint8_t status;
                    uint8_t status_info;
                };
                uint16_t status16;
            };
        };
    };
    union {
        struct HF2_BININFO_Result bininfo;
        uint8_t data8[0];
        uint16_t data16[0];
        uint32_t data32[0];
    };
} HF2_Response;

#define HF2_FLAG_SERIAL_OUT 0x80
#define HF2_FLAG_SERIAL_ERR 0xC0
#define HF2_FLAG_CMDPKT_LAST 0x40
#define HF2_FLAG_CMDPKT_BODY 0x00
#define HF2_FLAG_MASK 0xC0
#define HF2_SIZE_MASK 63

#define HF2_STATUS_OK 0x00
#define HF2_STATUS_INVALID_CMD 0x01
#define HF2_STATUS_INVALID_STATE 0x02

#endif
