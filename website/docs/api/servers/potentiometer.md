---
description: Mounts a potentiometer
title: Potentiometer
---

# Potentiometer

The [Potentiometer](/api/clients/potentiometer) constructor takes a configuration to start a [potentiometer server](https://microsoft.github.io/jacdac-docs/services/potentiometer) on the device.

-   Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio, Potentiometer } from "@devicescript/core"

const sensor = new Potentiometer({
    pin: gpio(3),
})
sensor.position.subscribe(v => console.data({ value: 100 * v }))
```
