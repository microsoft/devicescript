---
sidebar_position: 8
---

# Cloud

Send a label + 0 or more numeric values.

```ts
const pot = roles.potentiometer()
cloud.upload("potval", pot.reading.read())
cloud.upload("color", r * 256, g * 256, b * 256)
```

Respond to a request from the cloud.
Normally, status code 200 is returned to the cloud once the handler finishes.
If the method is not found, 404 is returned.
If the method is already running 429 is returned.

```ts
const lightA = roles.led()
const lightB = roles.led()
const temp = roles.temperature()

cloud.onMethod("set_lights", (a, b) => {
    lightA.brightness.write(a)
    lightB.brightness.write(a)
})
cloud.onMethod("get_temp_hum", () => {
    return [temp.temperature.read(), hum.humidity.read()]
})
```