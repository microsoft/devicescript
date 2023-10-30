// based on https://github.com/pimoroni/pimoroni-pico/blob/main/drivers/uc8151/uc8151.cpp
// by Pimoroni Ltd, MIT license

import { GPIOMode, InputPin, LOW, delay, isSimulator } from "@devicescript/core"
import { FourWireDriver, FourWireOptions } from "./st7735"
import {
    Display,
    Image,
    SpiImageFlags,
    spiSendImage,
    Palette,
} from "@devicescript/graphics"
import { DriverError } from "./core"

export interface UC8151Options extends FourWireOptions {
    /**
     * Pin is low when busy.
     */
    busy?: InputPin

    /**
     * Flip the display 180 deg.
     * Without flipping, the connector ribbon of the screen should be on the top or left.
     */
    flip?: boolean
}

export class UC8151Driver
    extends FourWireDriver<UC8151Options>
    implements Display
{
    public readonly palette: Palette
    private resflag: number

    constructor(
        public readonly image: Image,
        options: UC8151Options
    ) {
        super(options)

        const sm = Math.min(this.image.width, this.image.height)
        const bg = Math.max(this.image.width, this.image.height)
        if (sm === 96 && bg === 230) this.resflag = PSR_FLAGS.RES_96x230
        else if (sm === 96 && bg === 252) this.resflag = PSR_FLAGS.RES_96x252
        else if (sm === 128 && bg === 296) this.resflag = PSR_FLAGS.RES_128x296
        else if (sm === 160 && bg === 296) this.resflag = PSR_FLAGS.RES_160x296
        else
            throw new DriverError(
                `unsupported resolution; ${sm}x${bg}; supported: 96x230, 96x252, 128x296, 160x296`
            )
        this.resflag |= PSR_FLAGS.FORMAT_BW

        this.palette = Palette.monochrome()
    }

    private isBusy() {
        return this.options.busy?.value === LOW
    }

    private async busyWait() {
        while (this.isBusy()) await delay(1)
    }

    private async fastLuts() {
        await this.sendSeq(hex`
        20 2c // LUT_VCOM
            00 04 04 07 00 01 00 0c 0c 00 00 02 00 04 04 07 00 02 00 00 00 00 00 00
            00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        
        21 2a // LUT_WW
            54 04 04 07 00 01 60 0c 0c 00 00 02 a8 04 04 07 00 02 00 00 00 00 00 00
            00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        
        22 2a // LUT_BW
            54 04 04 07 00 01 60 0c 0c 00 00 02 a8 04 04 07 00 02 00 00 00 00 00 00
            00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        
        23 2a // LUT_WB
            a8 04 04 07 00 01 60 0c 0c 00 00 02 54 04 04 07 00 02 00 00 00 00 00 00
            00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        
        24 2a // LUT_BB
            a8 04 04 07 00 01 60 0c 0c 00 00 02 54 04 04 07 00 02 00 00 00 00 00 00
            00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        
        30 01 39 // PLL HZ_200
        `)
        await this.busyWait()
    }

    async init() {
        if (isSimulator()) return

        this.options.busy?.setMode(GPIOMode.InputPullUp)
        await this.initPins()

        let psr_setting =
            this.resflag | PSR_FLAGS.BOOSTER_ON | PSR_FLAGS.RESET_NONE
        psr_setting |= PSR_FLAGS.LUT_REG
        if (this.image.width < this.image.height)
            psr_setting |= this.options.flip
                ? PSR_FLAGS.SHIFT_RIGHT | PSR_FLAGS.SCAN_UP
                : PSR_FLAGS.SHIFT_LEFT | PSR_FLAGS.SCAN_DOWN
        else
            psr_setting |= this.options.flip
                ? PSR_FLAGS.SHIFT_LEFT | PSR_FLAGS.SCAN_UP
                : PSR_FLAGS.SHIFT_RIGHT | PSR_FLAGS.SCAN_DOWN
        await this.sendCmd(CMD.PSR, psr_setting)
        await this.fastLuts()

        await this.sendCmd(
            CMD.PWR,
            PWR_FLAGS_1.VDS_INTERNAL | PWR_FLAGS_1.VDG_INTERNAL,
            PWR_FLAGS_2.VCOM_VD | PWR_FLAGS_2.VGHL_16V,
            0b101011,
            0b101011,
            0b101011
        )
        await this.sendCmd(CMD.PON)
        await this.busyWait()

        // booster soft start configuration
        const bst =
            BOOSTER_FLAGS.START_10MS |
            BOOSTER_FLAGS.STRENGTH_3 |
            BOOSTER_FLAGS.OFF_6_58US
        await this.sendCmd(CMD.BTST, bst, bst, bst)
        await this.sendCmd(CMD.PFS, PFS_FLAGS.FRAMES_1)

        await this.sendCmd(
            CMD.TSE,
            TSE_FLAGS.TEMP_INTERNAL | TSE_FLAGS.OFFSET_0
        )

        await this.sendCmd(CMD.TCON, 0x22) // tcon setting
        const inverted = false
        const cdi = inverted ? 0b10_01_1100 : 0b01_00_1100 // vcom and data interval
        await this.sendCmd(CMD.CDI, cdi)
        await this.sendCmd(CMD.PLL, PLL_FLAGS.HZ_100)
        await this.sendCmd(CMD.POF)
        await this.busyWait()
    }

    async show() {
        if (isSimulator()) return

        await this.busyWait()
        await this.sendCmd(CMD.PON) // turn on
        await this.sendCmd(CMD.PTOU) // disable partial mode

        await this.cmdPrep(CMD.DTM2)

        let flags =
            this.image.width < this.image.height
                ? SpiImageFlags.MODE_MONO_REV | SpiImageFlags.BY_ROW
                : SpiImageFlags.MODE_MONO_REV | SpiImageFlags.BY_COL

        await spiSendImage({
            spi: this.options.spi,
            image: this.image,
            palette: this.palette,
            flags,
        })

        await this.sendCmd(CMD.DSP) // data stop
        await this.sendCmd(CMD.DRF) // start display refresh

        await this.busyWait()
        await this.sendCmd(CMD.POF)
    }
}

enum PSR_FLAGS {
    RES_96x230 = 0b00000000,
    RES_96x252 = 0b01000000,
    RES_128x296 = 0b10000000,
    RES_160x296 = 0b11000000,

    LUT_OTP = 0b00000000,
    LUT_REG = 0b00100000,

    FORMAT_BWR = 0b00000000,
    FORMAT_BW = 0b00010000,

    SCAN_DOWN = 0b00000000,
    SCAN_UP = 0b00001000,

    SHIFT_LEFT = 0b00000000,
    SHIFT_RIGHT = 0b00000100,

    BOOSTER_OFF = 0b00000000,
    BOOSTER_ON = 0b00000010,

    RESET_SOFT = 0b00000000,
    RESET_NONE = 0b00000001,
}

enum PWR_FLAGS_1 {
    VDS_EXTERNAL = 0b00000000,
    VDS_INTERNAL = 0b00000010,

    VDG_EXTERNAL = 0b00000000,
    VDG_INTERNAL = 0b00000001,
}

enum PWR_FLAGS_2 {
    VCOM_VD = 0b00000000,
    VCOM_VG = 0b00000100,

    VGHL_16V = 0b00000000,
    VGHL_15V = 0b00000001,
    VGHL_14V = 0b00000010,
    VGHL_13V = 0b00000011,
}

enum BOOSTER_FLAGS {
    START_10MS = 0b00000000,
    START_20MS = 0b01000000,
    START_30MS = 0b10000000,
    START_40MS = 0b11000000,

    STRENGTH_1 = 0b00000000,
    STRENGTH_2 = 0b00001000,
    STRENGTH_3 = 0b00010000,
    STRENGTH_4 = 0b00011000,
    STRENGTH_5 = 0b00100000,
    STRENGTH_6 = 0b00101000,
    STRENGTH_7 = 0b00110000,
    STRENGTH_8 = 0b00111000,

    OFF_0_27US = 0b00000000,
    OFF_0_34US = 0b00000001,
    OFF_0_40US = 0b00000010,
    OFF_0_54US = 0b00000011,
    OFF_0_80US = 0b00000100,
    OFF_1_54US = 0b00000101,
    OFF_3_34US = 0b00000110,
    OFF_6_58US = 0b00000111,
}

enum PFS_FLAGS {
    FRAMES_1 = 0b00000000,
    FRAMES_2 = 0b00010000,
    FRAMES_3 = 0b00100000,
    FRAMES_4 = 0b00110000,
}

enum TSE_FLAGS {
    TEMP_INTERNAL = 0b00000000,
    TEMP_EXTERNAL = 0b10000000,

    OFFSET_0 = 0b00000000,
    OFFSET_1 = 0b00000001,
    OFFSET_2 = 0b00000010,
    OFFSET_3 = 0b00000011,
    OFFSET_4 = 0b00000100,
    OFFSET_5 = 0b00000101,
    OFFSET_6 = 0b00000110,
    OFFSET_7 = 0b00000111,

    OFFSET_MIN_8 = 0b00001000,
    OFFSET_MIN_7 = 0b00001001,
    OFFSET_MIN_6 = 0b00001010,
    OFFSET_MIN_5 = 0b00001011,
    OFFSET_MIN_4 = 0b00001100,
    OFFSET_MIN_3 = 0b00001101,
    OFFSET_MIN_2 = 0b00001110,
    OFFSET_MIN_1 = 0b00001111,
}

enum PLL_FLAGS {
    // other frequency options exist but there doesn't seem to be much
    // point in including them - this is a fair range of options...
    HZ_29 = 0b00111111,
    HZ_33 = 0b00111110,
    HZ_40 = 0b00111101,
    HZ_50 = 0b00111100,
    HZ_67 = 0b00111011,
    HZ_100 = 0b00111010,
    HZ_200 = 0b00111001,
}

enum CMD {
    PSR = 0x00,
    PWR = 0x01,
    POF = 0x02,
    PFS = 0x03,
    PON = 0x04,
    PMES = 0x05,
    BTST = 0x06,
    DSLP = 0x07,
    DTM1 = 0x10,
    DSP = 0x11,
    DRF = 0x12,
    DTM2 = 0x13,
    LUT_VCOM = 0x20,
    LUT_WW = 0x21,
    LUT_BW = 0x22,
    LUT_WB = 0x23,
    LUT_BB = 0x24,
    PLL = 0x30,
    TSC = 0x40,
    TSE = 0x41,
    TSR = 0x43,
    TSW = 0x42,
    CDI = 0x50,
    LPD = 0x51,
    TCON = 0x60,
    TRES = 0x61,
    REV = 0x70,
    FLG = 0x71,
    AMV = 0x80,
    VV = 0x81,
    VDCS = 0x82,
    PTL = 0x90,
    PTIN = 0x91,
    PTOU = 0x92,
    PGM = 0xa0,
    APG = 0xa1,
    ROTP = 0xa2,
    CCSET = 0xe0,
    PWS = 0xe3,
    TSSET = 0xe5,
}
