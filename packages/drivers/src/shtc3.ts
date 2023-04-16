import * as ds from "@devicescript/core"
import { i2c } from "@devicescript/i2c"
import { shtReadU16, shtSendCmd } from "./sht"
import { throttle } from "./core"
import { startHumidity, startTemperature } from "./servers"

const SHTC3_ADDR = 0x70
const SHTC3_MEASURE_NORMAL = 0x7866
const SHTC3_MEASURE_LOW_POWER = 0x609c
const SHTC3_SOFTRESET = 0x805d
const SHTC3_ID = 0xefc8
const SHTC3_SLEEP = 0xb098
const SHTC3_WAKEUP = 0x3517

async function send_cmd(cmd: number) {
    shtSendCmd(SHTC3_ADDR, cmd)
}

async function wake() {
    await send_cmd(SHTC3_WAKEUP)
    await ds.sleep(1) // really, 200us
}

async function read() {
    await wake()
    await send_cmd(SHTC3_MEASURE_NORMAL)
    await ds.delay(20) // datasheet says 12.1ms
    const data = await i2c.readBuf(SHTC3_ADDR, 6)
    const temp = (data[0] << 8) | data[1]
    const hum = (data[3] << 8) | data[4]
    await send_cmd(SHTC3_SLEEP)
    return {
        temperature: (175 / 16) * temp - 45,
        humidity: (100 / 16) * hum,
    }
}

async function init() {
    await wake()
    const id = await shtReadU16(SHTC3_ADDR, SHTC3_ID)
    console.debug(`SHTC3 id=${id}`)
    await send_cmd(SHTC3_SLEEP)
}

export async function startSHTC3() {
    await init()
    const readThr = throttle(500, read)
    startTemperature({
        min: -40,
        max: 125,
        error: 0.8,
        read: async () => (await readThr()).temperature,
    })
    startHumidity({
        error: 3.5,
        read: async () => (await readThr()).humidity,
    })
}
