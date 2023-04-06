# Servers

Some of the clients in `@devicescript/core` support an optional constructor argument to
start a server on the device.

```ts
import { gpio, Button } from "@devicescript/core"

const buttonA = new Button({
    pin: gpio(2),
})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `buttonA`.
