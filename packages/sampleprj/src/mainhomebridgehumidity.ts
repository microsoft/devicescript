import { pins, board } from "@dsboard/seeed_xiao_esp32c3_msr218"
import { Humidity } from "@devicescript/core"
import { throttleTime } from "@devicescript/observables"
import { publishMessage } from "@devicescript/cloud"
// highlight-next-line
import { startSHTC3 } from "@devicescript/drivers"

// highlight-next-line
const { humidity: sensor } = await startSHTC3()

sensor.reading.pipe(throttleTime(5000)).subscribe(async humidity => {
    console.data({ humidity })
    await publishMessage("/humidity", { humidity })
})