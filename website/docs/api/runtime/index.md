# Runtime

The `@devicescript/runtime` [builtin](/developer/packages) module provides additional runtime helpers.

### `schedule` {#schedule}

The schedule function combines `setTimeout` and `setInterval` to provide a single function that can be used to schedule a function to run once or repeatedly.
The function also tracks the number of invocation, total elapsed time and time since last invocation.

```ts
import { schedule, setStatusLight } from "@devicescript/runtime"

// counter increments on every invocation
schedule(
    async ({ counter, elapsed, delta }) => {
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
```
