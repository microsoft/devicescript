import { CloudAdapter, Register, Temperature } from "@devicescript/core"

const cloud = new CloudAdapter()
const thermo = new Temperature()

await cloud.trackEvent("start")

let h = 0
thermo.temperature.subscribe(t => {
    h = t
})
setInterval(async () => {
    await cloud.trackEvent("data", { measurements: { humi: h } })
    await cloud.uploadObject({ humi: h })
}, 15000)
