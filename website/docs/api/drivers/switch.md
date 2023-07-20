---
description: Mounts a switch server
title: Switch
---

# Switch

The `startSwitch` function starts a [switch](https://microsoft.github.io/jacdac-docs/services/switch) server on the device
and returns a [client](/api/clients/switch).

```ts
import { gpio } from "@devicescript/core"
import { startSwitch } from "@devicescript/servers"

const sw = startSwitch({
    pin: gpio(2),
})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `switch`.

## Options

### pin

The pin hardware identifier on which to mount the relay.

### options

Other configuration options are available in the options parameter.
