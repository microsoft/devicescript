---
description: Mounts an accelerometer server
title: Accelerometer
---

# Accelerometer

The [Accelerometer](/api/clients/accelerometer) constructor takes a configuration to start a [accelerometer server](https://microsoft.github.io/jacdac-docs/services/accelerometer) on the device.

The accelerometer IMU chip will be auto-detected if it is supported.

```ts
import { Accelerometer } from "@devicescript/core"
const acc = new Accelerometer({})
```

## Coordinate transforms

You can specify transform for X, Y, Z axis of the accelerometer to compensate for the physical
placement of the IMU chip.
See [service spec](https://microsoft.github.io/jacdac-docs/services/accelerometer) for
info about what XYZ values should be returned, depending on device position.

For each output axis (`trX`, `trY`, `trZ`) you specify input axis `1`, `2`, `3`
or negated input axis `-1`, `-2`, `-3`.
The default is `{ trX: 1, trY: 2, trZ: 3 }`, which is no transform.
The following would work for accelerometer mounted upside down and rotated,
it transforms `(x1, y2, z3)` into `(y2, -x1, -z3)`.

```ts
import { Accelerometer } from "@devicescript/core"
const acc = new Accelerometer({
    trX: 2,
    trY: -1,
    trZ: -3,
})
```
