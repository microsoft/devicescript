// hardware configuration and drivers
import { pins, board } from "@dsboard/adafruit_qt_py_c3"
import { startSHTC3 } from "@devicescript/drivers"
// extra APIs
import { readSetting } from "@devicescript/settings"
import { schedule } from "@devicescript/runtime"
import { fetch } from "@devicescript/net"

// mounting a temperature server for the SHTC3 sensor
const { temperature, humidity } = await startSHTC3()

// feed configuration
const user = "user"
const feed = "temperature"
// this secret is stored in the .env.local and uploaded to the device settings
const key = await readSetting("IO_KEY")

// Adafruit IO API https://io.adafruit.com/api/docs/#create-data
const url = `https://io.adafruit.com/api/v2/${user}/feeds/${feed}/data`
const headers = { "X-AIO-Key": key, "Content-Type": "application/json" }

console.log({ url })

schedule(
    async () => {
        // read data from temperature sensor
        const value = await temperature.reading.read()
        // craft Adafruit.io payload
        const body = { value }
        // send request
        const { status } = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })
        // print HTTP status
        console.log({ status })
    },
    { timeout: 1000, interval: 60000 }
)
