import "@dsboard/seeed_xiao_esp32c3"
import * as ds from "@devicescript/core"
import { XiaoExpansionBoard, startGroveRGBLCD16x2 } from "@devicescript/drivers"

const board = new XiaoExpansionBoard()

console.log("start...")
const lcd = await startGroveRGBLCD16x2()
setInterval(async () => {
    const t = ds.millis() + ""
    console.log(t)
    await lcd.message.write(t)
}, 1000)
