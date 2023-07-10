// hardware configuration and drivers
import "@dsboard/adafruit_qt_py_c3"
import { startSHTC3 } from "@devicescript/drivers"
import { startMQTTClient } from "@devicescript/net"
// extra APIs
import { readSetting } from "@devicescript/settings"
import { ewma, auditTime } from "@devicescript/observables"

// mounting a temperature server for the SHTC3 sensor
const { temperature } = await startSHTC3()

const feed = "temperature"
const username = await readSetting("IO_USERNAME")
// this secret is stored in the .env.local and uploaded to the device settings
const password = await readSetting("IO_KEY")

const mqtt = await startMQTTClient({
    host: `io.adafruit.com`,
    proto: "tls",
    port: 8883,
    username,
    password,
})
const topic = `${username}/feeds/${feed}/json`

temperature.reading
    .pipe(ewma(0.5), auditTime(60000))
    .subscribe(async value => await mqtt.publish(topic, { value }))
