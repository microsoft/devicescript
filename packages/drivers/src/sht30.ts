import { SHTDriver } from "./sht"
import { startTemperatureHumidity } from "./servers"
import { delay } from "@devicescript/core"

const SHT30_MEASURE_HIGH_REP = 0x2400 // no clock stretching
//const SHT30_SOFTRESET = 0x30a2
const SHT30_STATUS = 0xf32d
const STH30_THROTTLE = 500

class SHT30Driver extends SHTDriver {
    constructor(devAddr: number) {
        super(devAddr, { readCacheTime: STH30_THROTTLE })
    }

    override async readData() {
        await this.sendCmd(SHT30_MEASURE_HIGH_REP)
        await delay(20) // datasheet says 15.5ms
        const data = await this.readBuf(6)
        const temp = (data[0] << 8) | data[1]
        const hum = (data[3] << 8) | data[4]
        return {
            temperature: (175 / 0x10000) * temp - 45,
            humidity: (100 / 0x10000) * hum,
        }
    }
    override async initDriver() {
        const id = await this.readU16(SHT30_STATUS)
        console.debug(`SHT30 status=${id}`)
    }
}

/**
 * Start driver for Sensirion SHT30 temperature/humidity sensor at I2C `0x44` or `0x45` (default is `0x44`)
 * @ds-part Sensirion SHT30
 * @ds-services temperature, humidity
 * @link https://sensirion.com/products/catalog/SHT30-DIS-B/ Datasheet
 * @throws DriverError
 */
export async function startSHT30(options?: {
    address?: 0x44 | 0x45
    temperatureName?: string
    humidityName?: string
    baseName?: string
}) {
    const { address, temperatureName, humidityName, baseName } = options || {}
    const driver = new SHT30Driver(address || 0x44)
    await driver.init()
    return startTemperatureHumidity(
        {
            min: -40,
            max: 125,
            errorValue: 0.6,
            reading: async () => (await driver.read()).temperature,
            name: temperatureName,
            baseName,
        },
        {
            errorValue: 4,
            reading: async () => (await driver.read()).humidity,
            name: humidityName,
            baseName,
        }
    )
}
