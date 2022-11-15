---
sidebar_position: 2
---
# Roles

Roles are defined by referencing a service name (in `roles` namespace).
The same role can be referenced multiple times, and runtime makes sure not to assign
multiple roles to the same service instance.

```js
var btnA = roles.button()
var btnB = roles.button()
var pot = roles.potentiometer()
var lamp = roles.lightBulb()
```

You can check if role is currently assigned, and react to it being assigned or unassigned:

```js
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

```js
btnA.down.subscribe(() => {
    console.log("button down!")
})

// ...
btnA.up.wait()
// ...
```