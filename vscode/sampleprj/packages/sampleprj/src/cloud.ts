import { Temperature } from "@devicescript/core"
import {
    createMetric,
    trackException,
    trackEvent,
    uploadMessage,
} from "@devicescript/cloud"

console.log("starting...")
const thermo = new Temperature()
const temp = createMetric("temp")
await trackEvent("start")

console.log("running...")
let h = 0
thermo.temperature.subscribe(async t => {
    h = t
    temp.add(t)
})
setInterval(async () => {
    console.log("upload data")
    await temp.upload()
    await trackEvent("data", { measurements: { humi: h } })
    await uploadMessage("samples/cloud", { humi: h })
    try {
        throw new Error("noes!")
    } catch (e) {
        trackException(e as Error)
    }
}, 15000)
