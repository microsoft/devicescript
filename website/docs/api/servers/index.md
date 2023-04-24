# Servers

Starting servers provide a programming abstraction for hardware periphericals. Some server implementations are builtin (written C), while others can be contributed as DeviceScript packages.

```ts
import { gpio } from "@devicescript/core"
import { startButton } from "@devicescript/servers"

const buttonA = startButton({
    pin: gpio(2),
})
```
