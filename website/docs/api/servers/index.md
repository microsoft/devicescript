# Servers

The `@devicescript/servers` module provides helper functions to mount service servers on your low level hardware components. Basically, you have access to all the drivers available in the C server SDK.

```ts
import { Button } from "@devicescript/core"
import { gpio } from "@devicescript/core"
import { startButton } from "@devicescript/servers"

startButton({
    pin: gpio(2),
})
const buttonA = new ds.Button()
```
