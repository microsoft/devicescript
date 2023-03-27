# Servers

The `@devicescript/servers` module provides helper functions to mount service servers on your low level hardware components. Basically, you have access to all the drivers available in the C server SDK.

```ts
import { gpio } from "@devicescript/core"
import { startButton } from "@devicescript/servers"

const buttonA = startButton({
    pin: gpio(2),
})
```

The `start...` function starts a server and returns the client instance.
The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `buttonA`.
