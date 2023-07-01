import { schedule, setStatusLight } from "@devicescript/runtime"

// counter increments on every invocation
schedule(
    async ({ counter }) => {
        console.data({ counter })
        // toggle between red and off
        await setStatusLight(counter % 2 === 0 ? 0xff0000 : 0x000000)
    },
    {
        // first delay
        timeout: 100,
        // repeated delay
        interval: 1000,
    }
)
