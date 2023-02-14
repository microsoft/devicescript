---
pagination_prev: null
pagination_next: null
description: Mounts a button server
title: startButton
---
# Button

The `startButton` function starts a [button](https://microsoft.github.io/jacdac-docs/services/button) server on the device
and returns [client](/docs/api/button).

```ts no-run
import { startButton } from "@devicescript/servers"

const button = startButton({
    pin: 2,
})
```
