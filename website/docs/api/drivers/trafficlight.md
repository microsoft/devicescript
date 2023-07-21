# Traffic Light

The traffic light driver, `startTrafficLight` is used to control a toy traffic light, driving 3 LEDs.

```ts
import { pins } from "@dsboard/pico_w"
import { startTrafficLight } from "@devicescript/drivers"

const light = await startTrafficLight({
    red: pins.GP10,
    yellow: pins.GP11,
    green: pins.GP12,
})

await light.green.write(true)
await light.yellow.write(false)
await light.red.write(false)
```