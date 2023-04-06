---
description: Mounts a light bulb server
title: Light bulb
---

# Light bulb

The [LightBulb](/api/clients/lightbulb) constructor takes a configuration to start a [lightbulb server](https://microsoft.github.io/jacdac-docs/services/lightbulb) on the device.

```ts
import { gpio, LightBulb } from "@devicescript/core"

const bulb = new LightBulb({
    pin: gpio(20),
    dimmable: true,
})
```

## Options

### pin

The pin hardware identifier on which to mount the light bulb.

### dimmable

When set to `true` you can set the intensity of the light (it will use a [PWM](https://en.wikipedia.org/wiki/Pulse-width_modulation) signal at a few kHz).

### activeLow

Indicates that the light is on when the pin `0`.
By default, the light is on when the pin is `1`.
