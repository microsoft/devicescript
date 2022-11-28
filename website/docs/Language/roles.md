---
sidebar_position: 2
hide_table_of_contents: true
---
# Roles

Roles are defined by referencing a service name (in `roles` namespace).
The same role can be referenced multiple times, and runtime makes sure not to assign
multiple roles to the same service instance.

```ts
const btnA = roles.button()
const btnB = roles.button()
const pot = roles.potentiometer()
const lamp = roles.lightBulb()
```

You can check if role is currently assigned, and react to it being assigned or unassigned:

```ts
const heater = roles.relay()
if (heater.isConnected())
    heater.active.write(1)
heater.onConnected(() => {
    // ...
})
heater.onDisconnected(() => {
    // ...
})
```

## Events

Events are referenced as `myRole.eventName`. They currently have two member functions, `.wait()` and `.subscribe()`.

```ts
const btnA = roles.button()
btnA.down.subscribe(() => {
    console.log("button down!")
})

// ...
btnA.up.wait()
// ...
```