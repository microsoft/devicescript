---
description: Mounts a potentiometer
title: Potentiometer
---

# Potentiometer

The `startPotentiometer` starts a simple analog sensor server that models a potentiometer
and returns a [client](/api/clients/potentiometer) bound to the server.

-   Please refer to the **[analog documentation](/developer/drivers/analog/)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startPotentiometer } from "@devicescript/servers"

const sensor = startPotentiometer({
    pin: ds.gpio(3),
})
sensor.reading.subscribe(v => console.data({ value: 100 * v }))
```
