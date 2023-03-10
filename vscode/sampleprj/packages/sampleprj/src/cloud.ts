import { Temperature } from "@devicescript/core"
import { trackEvent, uploadMessage } from "@devicescript/cloud"

const thermo = new Temperature()

await trackEvent("start")

let h = 0
thermo.temperature.subscribe(t => {
    h = t
})
setInterval(async () => {
    await trackEvent("data", { measurements: { humi: h } })
    await uploadMessage("samples/cloud", { humi: h })
}, 15000)
