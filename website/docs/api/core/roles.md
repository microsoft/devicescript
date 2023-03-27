---
sidebar_position: 0.5
---
# Roles

Roles are defined by instantiating a service client.
The same role can be referenced multiple times, and runtime makes sure not to assign
multiple roles to the same service instance.

```ts
const btnA = new ds.Button()
const btnB = new ds.Button()
const pot = new ds.Potentiometer()
const lamp = new ds.LightBulb()
```

You can check if role is currently assigned, and react to it being assigned or unassigned:

```js
const heater = new ds.Relay()
if (heater.isBound)
    heater.active.write(true)
heater.onConnected(() => {
    // ...
})
heater.onDisconnected(() => {
    // ...
})
```
