import {
    startGroveRGBLCD16x2,
    startBME680,
    XiaoGroveShield,
} from "@devicescript/drivers"
import { ValueDashboard } from "@devicescript/runtime"

const shield = new XiaoGroveShield()
const { temperature, humidity } = await startBME680({
    address: 0x76,
})
const screen = await startGroveRGBLCD16x2()

const dashboard = new ValueDashboard(screen, {
    temp: { digits: 1, unit: "C" },
    humi: { digits: 0, unit: "%" },
})

setInterval(async () => {
    dashboard.values.temp = await temperature.reading.read()
    dashboard.values.humi = await humidity.reading.read()
    await dashboard.show()
}, 1000)
