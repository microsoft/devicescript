import { PsychomagnothericEnergy } from "@devicescript/core"

const gigameter = new PsychomagnothericEnergy()
gigameter.energyLevel.subscribe(async () => {
    console.log(await gigameter.energyLevel.read())
})
