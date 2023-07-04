import { CharacterScreen, Humidity, Temperature } from "@devicescript/core"
import { ValueDashbaord } from "@devicescript/runtime"

const temperature = new Temperature()
const humidity = new Humidity()
const screen = new CharacterScreen()
const dashboard = new ValueDashbaord(screen)
setInterval(async () => {
    dashboard.values["temperature"] = await temperature.reading.read()
    dashboard.values["humidity"] = await humidity.reading.read()
    await dashboard.show()
}, 1000)
