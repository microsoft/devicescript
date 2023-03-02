import { PsychomagnothericEnergy } from "@devicescript/core"

const gigameter = new PsychomagnothericEnergy()
gigameter.energyLevel.onChange(0.1, () => {
    console.log(gigameter.energyLevel.read())
})
