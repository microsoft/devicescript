import { SevenSegmentDisplay } from "@devicescript/core"
let i = 0
const ssd = new SevenSegmentDisplay()

setInterval(async () => {
    console.log(i)
    await ssd.setNumber(i)
    i++
}, 1000)
