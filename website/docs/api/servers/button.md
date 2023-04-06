---
description: Mounts a button server
title: Button
---

# Button

The [Button](/api/clients/button) constructor takes a configuration to start a [button server](https://microsoft.github.io/jacdac-docs/services/button) on the device.

```ts
import { gpio } from "@devicescript/core"
import { Button } from "@devicescript/servers"

const buttonA = new Button({
    pin: gpio(2),
})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `buttonA`.

## Options

### pin

The pin hardware identifier on which to mount the button.

### pinBackLight

This pin is set high when the button is pressed. Useful for buttons with a builtin LED.

```ts no-run no-output
import { gpio } from "@devicescript/core"
import { Button } from "@devicescript/servers"

const buttonA = new Button({
    pin: gpio(2),
    pinBackLight: gpio(4),
})
```

### activeHigh

Button is normally active-low and pulled high.
This makes it active-high and pulled low.

```ts no-run no-output
import { gpio } from "@devicescript/core"
import { Button } from "@devicescript/servers"

const buttonA = new Button({
    pin: gpio(2),
    activeHigh: true,
})
```
