import { Humidity } from "@devicescript/core"
import { throttleTime } from "@devicescript/observables"
// highlight-next-line
import { publishMessage } from "@devicescript/cloud"

const sensor = new Humidity()
sensor.reading.pipe(throttleTime(5000)).subscribe(async humidity => {
    console.data({ humidity })
    // highlight-next-line
    await publishMessage("/humidity", { humidity })
})