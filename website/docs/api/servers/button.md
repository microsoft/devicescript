---
pagination_prev: null
pagination_next: null
description: Mounts a button server
title: Button
---
# Button

The `startButton` function starts a [button](https://microsoft.github.io/jacdac-docs/services/button) server on the device
and returns a [client](/api/clients/button).

```ts no-run
import { startButton } from "@devicescript/servers"

const button = startButton({
    pin: 2,
})
```
