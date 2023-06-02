import { millis } from "@devicescript/core"
import { rosConfigure, rosPublish, rosSubscribe } from "@devicescript/ros"

await rosConfigure("dsnode")
await rosSubscribe("/pong", async msg => {
    console.log("pong", msg)
})
setInterval(async () => {
    await rosPublish("/ping", { time: millis() })
}, 1000)
