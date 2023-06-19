import * as ds from "@devicescript/core"
import {
    SSD1306Driver,
    startBME680,
    startCharacterScreen,
} from "@devicescript/drivers"
import { fetch } from "@devicescript/net"
import {
    startBuzzer,
    startPotentiometer,
    startServo,
} from "@devicescript/servers"
import { pins } from "@dsboard/seeed_xiao_esp32c3_msr218"

const wifi = new ds.Wifi()
let didReq = false
setInterval(async () => {
    if (didReq) return
    const ip = await wifi.ipAddress.read()
    if (ip[0] === 0) return
    didReq = true
    const resp = await fetch("https://bing.com")
    console.log(await resp.text())
}, 1000)

const servo = startServo({ pin: pins.A2 })
const potentiometer = startPotentiometer({ pin: pins.A0 })
const buzzer = startBuzzer({ pin: pins.A1 })
const { temperature, humidity, pressure } = await startBME680()
const display = await startCharacterScreen(
    new SSD1306Driver({ width: 64, height: 48 })
)
const btnA = new ds.Button()
const btnB = new ds.Button()

btnA.down.subscribe(async () => {
    await buzzer.playNote(440, 1, 200)
})

btnB.down.subscribe(async () => {
    await buzzer.playNote(1200, 1, 100)
})

await potentiometer.streamingInterval.write(300)

potentiometer.reading.subscribe(async p => {
    await servo.enabled.write(true)
    await servo.angle.write(Math.map(p, 0, 1, -90, 90))
})

temperature.reading.subscribe(async temp => {
    const hum = await humidity.reading.read()
    const press = await pressure.reading.read()
    await display.message.write(
        `${Math.round(temp)}C ${Math.round(hum)}%\n${Math.round(press)}hPa`
    )
    // console.log({ temp, hum, press })
})
