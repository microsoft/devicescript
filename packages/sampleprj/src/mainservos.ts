import { pins } from "@dsboard/pico"
import { startServo } from "@devicescript/servers"
import { schedule } from "@devicescript/runtime"

const servo = startServo({
    pin: pins.GP21,
})

schedule(
    async ({ counter }) => {
        const angle = counter % 2 ? -45 : 45
        await servo.angle.write(angle)
    },
    { interval: 2000 }
)
