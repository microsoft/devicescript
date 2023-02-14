---
pagination_prev: null
pagination_next: null
description: Mounts a button server
title: Button
---

# Button

The `startButton` function starts a [button](https://microsoft.github.io/jacdac-docs/services/button) server on the device
and returns a [client](/api/clients/button).

```ts no-run
import { startButton } from "@devicescript/servers"

const buttonA = startButton({
    pin: 2,
})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `buttonA`.

## Options

### pin

The pin hardware identifier on which to mount the button.

### pinBackLight

This pin is set high when the button is pressed. Useful for buttons with a builtin LED.

```ts no-run no-output
import { startButton } from "@devicescript/servers"

const buttonA = startButton({
    pin: 2,
    pinBackLight: 4,
})
```

### activeHigh

Button is normally active-low and pulled high.
This makes it active-high and pulled low.

```ts no-run no-output
import { startButton } from "@devicescript/servers"

const buttonA = startButton({
    pin: 2,
    activeHigh: true,
})
```
