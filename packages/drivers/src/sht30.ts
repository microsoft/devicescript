import * as ds from "@devicescript/core"
import { i2c } from "@devicescript/i2c"
import { shtSendCmd, shtReadU16 } from "./sht"
import { DriverError, throttle } from "./core"
import { startHumidity, startTemperature } from "./servers"

const SHT30_ADDR = 0x44
const SHT30_MEASURE_HIGH_REP = 0x2400 // no clock stretching
const SHT30_SOFTRESET = 0x30a2
const SHT30_STATUS = 0xf32d

let sht30_addr = SHT30_ADDR

async function send_cmd(cmd: number) {
    await shtSendCmd(sht30_addr, cmd)
}

async function wake() {
    // nothing to do on this chip
}

async function is_present() {
    for (let i = 0x44; i <= 0x45; ++i) {
        try {
            await shtReadU16(i, SHT30_STATUS)
            return true
        } catch {}
    }
    return false
}

async function read() {
    await wake()
    await send_cmd(SHT30_MEASURE_HIGH_REP)
    await ds.delay(20) // datasheet says 15.5ms
    const data = await i2c.readBuf(sht30_addr, 6)
    const temp = (data[0] << 8) | data[1]
    const hum = (data[3] << 8) | data[4]
    return {
        temperature: (175 / 0x10000) * temp - 45,
        humidity: (100 / 0x10000) * hum,
    }
}

async function init() {
    if (await is_present()) {
        const id = await shtReadU16(sht30_addr, SHT30_STATUS)
        console.debug(`SHT30 status=${id}`)
    } else {
        throw new DriverError("SHT30 not found")
    }
}

/**
 * Start driver for Sensirion SHT30 temperature/humidity sensor at I2C 0x44 or 0x45.
 */
export async function startSHT30() {
    await init()
    const readThr = throttle(500, read)
    startTemperature({
        min: -40,
        max: 125,
        error: 0.6,
        read: async () => (await readThr()).temperature,
    })
    startHumidity({
        error: 4,
        read: async () => (await readThr()).humidity,
    })
}
