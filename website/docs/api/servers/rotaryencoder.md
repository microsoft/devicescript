---
description: Mounts a rotary encoder server
title: Rotary Encoder
---

# Rotary Encoder

The `RotaryEncoder` client constructor takes a configuration to start a [Rotary Encoder](https://microsoft.github.io/jacdac-docs/services/rotaryencoder) server on the device
and returns a [client](/api/clients/rotaryencoder).

```ts
import { gpio, RotaryEncoder } from "@devicescript/core"

const dialA = new RotaryEncoder({
    pin0: gpio(2),
    pin1: gpio(3),
})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `RotadialA`.

## Options

### pin0, pin1

The pin hardware identifiers on which to mount the Rotary Encoder.

### clicksPerTurn (optional)

Number of reported clicks per full rotation. Default is 12.

```ts
import { gpio, RotaryEncoder } from "@devicescript/core"

const dialA = new RotaryEncoder({
    pin0: gpio(2),
    pin1: gpio(3),
    // highlight-next-line
    clicksPerTurn: 24,
})
```

### dense (optional)

Encoder supports "half-clicks". Default is false.

```ts
import { gpio, RotaryEncoder } from "@devicescript/core"

const dialA = new RotaryEncoder({
    pin0: gpio(2),
    pin1: gpio(3),
    // highlight-next-line
    dense: true,
})
```

### inverted (optional)

Invert direction. Default is false.

```ts
import { gpio, RotaryEncoder } from "@devicescript/core"

const dialA = new RotaryEncoder({
    pin0: gpio(2),
    pin1: gpio(3),
    // highlight-next-line
    inverted: true,
})
```
