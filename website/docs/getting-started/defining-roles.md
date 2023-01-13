---
sidebar_position: 2
hide_table_of_contents: true
---

# Defining Roles

In DeviceScript, all access to sensors, actuators or other hardware components are abstracted through [Jacdac](https://aka.ms/jacdac) services. Sensors act as **servers** and your scripts connects **clients** to interact with them.

To interact with Jacdac services, you define **roles** for each service you need.

In this scenario, we will need to measure air pressure and send HID mouse commands. Therefore, we declare a `airPressure` role and a `hidMouse` role.

```ts
import * as ds from "@devicescript/core"

console.log(`starting...`)
const sensor = new ds.AirPressure()
const mouse = new ds.HidMouse()
```

## Try it out

- [ ]   Click `Run` to load the snippet in the developer tools
- [ ]  Check that a air pressure and mouse simulator was started by the tools.

You can already interact with the simulators, but we don't have any interesting code using them yet.

:::note
For consistency and brevity, the `@devicescript/core` module
is implicitly imported as follows:

```ts no-build no-run
import * as ds from "@devicescript/core"
```

:::
