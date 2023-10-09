import "@dsboard/seeed_xiao_esp32c3"
import * as ds from "@devicescript/core"
import {
    XiaoGroveShield,
    startGroveRGBLCD16x2,
    startBME680,
} from "@devicescript/drivers"

const board = new XiaoGroveShield()

const { temperature } = await startBME680()
const lcd = await startGroveRGBLCD16x2()
setInterval(async () => {
    const temp = Math.round(await temperature.reading.read())
    await lcd.message.write(`temp: ${temp}C`)
}, 1000)
