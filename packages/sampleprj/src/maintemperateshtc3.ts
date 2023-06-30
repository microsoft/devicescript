import "@dsboard/adafruit_qt_py_c3"
import { deviceIdentifier } from "@devicescript/core"
import { startMQTTClient } from "@devicescript/net"
import { startSHTC3 } from "@devicescript/drivers"
import { schedule } from "@devicescript/runtime"

// mqtt settings
const mqtt = await startMQTTClient({
    host: "broker.hivemq.com",
    proto: "tcp",
    port: 1883,
})
const topic = `devs/temp/${deviceIdentifier("self")}`
console.log({ topic })

// sensors
const { temperature } = await startSHTC3()
// pushing temperature every minute
schedule(async () => {
    const t = await temperature.reading.read()
    console.data({ t })
    await mqtt.publish(topic, { t })
})
