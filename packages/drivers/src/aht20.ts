import * as ds from "@devicescript/core"
import { DriverError } from "./core"
import { startTempHumidity } from "./servers"
import { I2CSensorDriver } from "./driver"
import { sleep } from "@devicescript/core"

const AHT20_ADDRESS = 0x38
const AHT20_BUSY = 0x80
const AHT20_OK = 0x08
const AHT20_READ_THROTTLE = 500

class AHT20Driver extends I2CSensorDriver<{
    humidity: number
    temperature: number
}> {
    constructor() {
        super(AHT20_ADDRESS, { readCacheTime: AHT20_READ_THROTTLE })
    }

    private async status() {
        return (await this.readBuf(1))[0]
    }

    private async waitBusy() {
        while ((await this.status()) & AHT20_BUSY) await ds.sleep(10)
    }

    override async initDriver() {
        await this.writeBuf(hex`BA`) // reset
        await sleep(20)
        await this.writeBuf(hex`E10800`) // calibrate
        await this.waitBusy()
        if (!((await this.status()) & AHT20_OK))
            throw new DriverError("can't init AHT20")
    }

    override async readData() {
        await this.writeBuf(hex`AC3300`)
        await this.waitBusy()
        const data = await this.readBuf(6)

        const h0 = (data[1] << 12) | (data[2] << 4) | (data[3] >> 4)
        const humidity = h0 * (100 / 0x100000)
        const t0 = ((data[3] & 0xf) << 16) | (data[4] << 8) | data[5]
        const temperature = t0 * (200.0 / 0x100000) - 50

        return { humidity, temperature }
    }
}

/**
 * Start driver for AHT20 temperature/humidity sensor at I2C address `0x38`.
 * @link https://asairsensors.com/wp-content/uploads/2021/09/Data-Sheet-AHT20-Humidity-and-Temperature-Sensor-ASAIR-V1.0.03.pdf Datasheet
 * @throws DriverError
 */
export async function startAHT20(options?: { name?: string }) {
    const driver = new AHT20Driver()
    await driver.init()
    return startTempHumidity(
        {
            min: -40,
            max: 85,
            error: 1.5,
            read: async () => (await driver.read()).temperature,
        },
        {
            error: 4,
            read: async () => (await driver.read()).humidity,
        },
        options?.name
    )
}
