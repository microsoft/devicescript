import { PsychomagnothericEnergy } from "@devicescript/core"

const gigameter = new PsychomagnothericEnergy()
gigameter.reading.subscribe(async () => {
    console.log(await gigameter.reading.read())
})
