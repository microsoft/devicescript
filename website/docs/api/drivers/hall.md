---
description: Mounts a Hall sensor
title: Hall sensor
---

# Hall sensor

The `startPotentiometer` starts a Hall (analog) sensor server and returns a [client](/api/clients/potentiometer) bound to the server.

```ts
import { gpio } from "@devicescript/core"
import { startPotentiometer } from "@devicescript/servers"

const sensor = startPotentiometer({
    pin: ds.gpio(3),
})
sensor.reading.subscribe(v => console.data({ value: 100 * v }))
```
