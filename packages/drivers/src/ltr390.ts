import * as ds from "@devicescript/core"
import { DriverError } from "./core"
import { I2CSensorDriver } from "./driver"
import { startSimpleServer } from "./servers"

const LTR390UV_ADDR = 0x53
const LTR390UV_MAIN_CTRL = 0x00
const LTR390UV_MEAS_RATE = 0x04
const LTR390UV_GAIN = 0x05
const LTR390UV_PART_ID = 0x06
const LTR390UV_MAIN_STATUS = 0x07
const LTR390UV_ALSDATA = 0x0d
const LTR390UV_UVSDATA = 0x10

const LTR390UV_READ_THROTTLE = 300

class LTR390Driver extends I2CSensorDriver<{
    illuminance: number
    uvindex: number
}> {
    private gain: number

    constructor() {
        super(LTR390UV_ADDR, { readCacheTime: LTR390UV_READ_THROTTLE })
    }

    private async readDataAt(addr: number) {
        while (((await this.readReg(LTR390UV_MAIN_STATUS)) & 0x08) === 0)
            await ds.sleep(5)
        const data = await this.readRegBuf(addr, 3)
        return data[0] | (data[1] << 8) | ((data[2] & 0xf) << 16)
    }

    override async initDriver() {
        const part = await this.readReg(LTR390UV_PART_ID)
        console.debug(`LTR390 part ${part}`)
        if (part >> 4 !== 0xb) throw new DriverError(`can't find LTR390UV`)
        await this.writeReg(LTR390UV_MEAS_RATE, 0x22) // 18bit/100ms
        this.gain = 3
        await this.writeReg(LTR390UV_GAIN, 0x01)
    }

    override async readData() {
        await this.writeReg(LTR390UV_MAIN_CTRL, 0x02) // ALS Mode, Enabled
        const v = await this.readDataAt(LTR390UV_ALSDATA)
        const illuminance = (v * 6) / (10 * this.gain)

        await this.writeReg(LTR390UV_MAIN_CTRL, 0x0a) // UV Mode, Enabled
        const v2 = await this.readDataAt(LTR390UV_UVSDATA)
        const uvindex = (v2 * 2) / this.gain

        await this.writeReg(LTR390UV_MAIN_CTRL, 0x00) // Disabled

        return { illuminance, uvindex }
    }
}

/**
 * Start driver for LITEON LTR-390UV-01 UV/ambient light sensor at I2C address `0x53`.
 * @ds-part LITEON LTR-390UV-01
 * @ds-services uvIndex, illuminance
 * @link https://optoelectronics.liteon.com/upload/download/DS86-2015-0004/LTR-390UV_Final_%20DS_V1%201.pdf Datasheet
 * @throws DriverError
 */
export async function startLTR390(options?: {
    uvIndexName?: string
    illuminanceName?: string
    baseName?: string
}) {
    const { uvIndexName, illuminanceName, baseName } = options || {}
    const driver = new LTR390Driver()
    await driver.init()
    const uvIndex = new ds.UvIndex(
        startSimpleServer({
            ...options,
            spec: ds.UvIndex.spec,
            errorFraction: 0.1,
            reading: async () => (await driver.read()).uvindex,
            name: uvIndexName,
            baseName,
        })
    )
    const illuminance = new ds.Illuminance(
        startSimpleServer({
            ...options,
            spec: ds.Illuminance.spec,
            errorFraction: 0.1,
            reading: async () => (await driver.read()).illuminance,
            name: illuminanceName,
            baseName,
        })
    )

    return { uvIndex, illuminance }
}
