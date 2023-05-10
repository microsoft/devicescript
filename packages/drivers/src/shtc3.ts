import { SHTDriver } from "./sht"
import { startTemperatureHumidity } from "./servers"
import { delay, sleep } from "@devicescript/core"
import { DriverError } from "./core"

const SHTC3_ADDR = 0x70
const SHTC3_MEASURE_NORMAL = 0x7866
//const SHTC3_MEASURE_LOW_POWER = 0x609c
//const SHTC3_SOFTRESET = 0x805d
const SHTC3_ID = 0xefc8
const SHTC3_SLEEP = 0xb098
const SHTC3_WAKEUP = 0x3517
const SHTC3_THROTTLE = 500

class SHTC3Driver extends SHTDriver {
    constructor() {
        super(SHTC3_ADDR, { readCacheTime: SHTC3_THROTTLE })
    }

    async wake() {
        await this.sendCmd(SHTC3_WAKEUP)
        await sleep(1) // really, 200us
    }

    async sleep() {
        await this.sendCmd(SHTC3_SLEEP)
    }

    override async initDriver(): Promise<void> {
        await this.wake()
        const id = await this.readU16(SHTC3_ID)
        console.debug(`SHTC3 id=${id}`)
        await this.sendCmd(SHTC3_SLEEP)
    }

    override async readData() {
        await this.wake()
        await this.sendCmd(SHTC3_MEASURE_NORMAL)

        await delay(20) // datasheet says 12.1ms
        const data = await this.readBuf(6)
        const temp = (data[0] << 8) | data[1]
        const hum = (data[3] << 8) | data[4]
        const temperature = (175 / 0x10000) * temp - 45
        const humidity = (100 / 0x10000) * hum

        await this.sleep()

        return {
            temperature,
            humidity,
        }
    }
}

/**
 * Start driver for Sensirion SHTC3 temperature/humidity sensor at I2C `0x70`.
 * @ds-part Sensirion SHTC3
 * @ds-services temperature, humidity
 * @link https://sensirion.com/products/catalog/SHTC3/ Datasheet
 * @throws DriverError
 */
export async function startSHTC3(options?: {
    temperatureName?: string
    humidityName?: string
    baseName?: string
}) {
    const { temperatureName, humidityName, baseName } = options || {}
    const driver = new SHTC3Driver()
    await driver.init()
    return startTemperatureHumidity(
        {
            min: -40,
            max: 125,
            errorValue: 0.8,
            reading: async () => (await driver.read()).temperature,
            name: temperatureName,
            baseName,
        },
        {
            errorValue: 3.5,
            reading: async () => (await driver.read()).humidity,
            name: humidityName,
            baseName,
        }
    )
}
