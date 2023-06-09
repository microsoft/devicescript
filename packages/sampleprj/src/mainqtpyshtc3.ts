// hardware configuration and drivers
import { pins, board } from "@dsboard/adafruit_qt_py_c3"
import { startSHTC3 } from "@devicescript/drivers"
// extra APIs
import { schedule } from "@devicescript/runtime"

// mounting a temperature server for the SHTC3 sensor
const { temperature, humidity } = await startSHTC3()

schedule(
    async () => {
        // read data from temperature sensor
        const humi = await humidity.reading.read()
        const temp = await temperature.reading.read()
        // print HTTP status
        console.log({ temp, humi })
    },
    { timeout: 1000, interval: 60000 }
)
