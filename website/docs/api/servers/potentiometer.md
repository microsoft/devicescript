---
description: Mounts a potentiometer
title: Potentiometer
---

# Potentiometer

The `startPotentiometer` starts a simple analog sensor server that models a potentiometer
and returns a [client](/api/clients/potentiometer) bound to the server.

- Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startPotentiometer } from "@devicescript/servers"

const sensor = startPotentiometer({
    pin: gpio(3),
})
sensor.position.subscribe(v => console.data({ value: 100 * v }))
```
