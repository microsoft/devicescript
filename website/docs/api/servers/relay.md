---
description: Mounts a relay server
title: Relay
---

# Relay

The [Relay](/api/clients/relay) constructor takes a configuration to start a [relay server](https://microsoft.github.io/jacdac-docs/services/relay) on the device.

```ts
import { gpio, Relay } from "@devicescript/core"

const relay = new Relay({
    pin: gpio(2),
})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `relay`.

## Options

### pin

The pin hardware identifier on which to mount the relay.

### options

Other configuration options are available in the options parameter.
