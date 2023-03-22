---
pagination_prev: null
pagination_next: null
description: Mounts a relay server
title: Relay
---

# Relay

The `startRelay` function starts a [relay](https://microsoft.github.io/jacdac-docs/services/relay) server on the device
and returns a [client](/api/clients/relay).

```ts
import { gpio } from "@devicescript/core"
import { startRelay } from "@devicescript/servers"

const relay = startRelay({
    pin: gpio(2),
})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `relay`.

## Options

### pin

The pin hardware identifier on which to mount the relay.

### options

Other configuration options are available in the options parameter.
