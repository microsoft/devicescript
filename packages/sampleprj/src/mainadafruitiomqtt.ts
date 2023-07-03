// hardware configuration and drivers
import "@dsboard/adafruit_qt_py_c3"
import { startSHTC3 } from "@devicescript/drivers"
import { startMQTTClient } from "@devicescript/net"
// extra APIs
import { readSetting } from "@devicescript/settings"
import { schedule } from "@devicescript/runtime"

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

schedule(
    async () => {
        // read data from temperature sensor
        const value = await temperature.reading.read()
        // publish to feed topic
        await mqtt.publish(topic, { value })
    },
    { timeout: 1000, interval: 60000 }
)
