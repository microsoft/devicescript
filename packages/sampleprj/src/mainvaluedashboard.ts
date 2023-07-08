import { CharacterScreen, Humidity, Temperature } from "@devicescript/core"
import { ValueDashboard } from "@devicescript/runtime"

const temperature = new Temperature()
const humidity = new Humidity()
const screen = new CharacterScreen()
const dashboard = new ValueDashboard(screen, {
    temperature: { digits: 1, unit: "C" },
    humi: { digits: 0, unit: "%" },
})
setInterval(async () => {
    dashboard.values["temperature"] = await temperature.reading.read()
    dashboard.values["humi"] = await humidity.reading.read()
    await dashboard.show()
}, 1000)
