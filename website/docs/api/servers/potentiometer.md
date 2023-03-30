---
description: Mounts a potentiometer
title: Potentiometer
---

# Potentiometer

The `startPotentiometer` starts a simple analog sensor server that models a potentiometer. 

- Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startPotentiometer } from "@devicescript/servers"

const slider = startPotentiometer({
    pin: ds.gpio(3),
})
slider.subscribe(v => console.data({ value: 100 * v }))
```
