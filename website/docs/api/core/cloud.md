---
sidebar_position: 10
hide_table_of_contents: true
---

# Cloud

The `ds.cloud` constant represents the built-in related to the `ds.CloudConnector`,
but with additional functions.

## upload

Send a label + 0 or more numeric values.

```ts
const pot = new ds.Potentiometer()
ds.cloud.upload("potval", pot.position.read())
let r = 0.1, g = 0.2, b = 0.3
ds.cloud.upload("color", r * 256, g * 256, b * 256)
```

## onMethod

Respond to a request from the cloud.
Normally, status code 200 is returned to the cloud once the handler finishes.
If the method is not found, 404 is returned.
If the method is already running 429 is returned.

```ts edit
const lightA = new ds.Led()
const lightB = new ds.Led()
const temp = new ds.Temperature()
const hum = new ds.Humidity()

ds.cloud.onMethod("set_lights", (a, b) => {
    lightA.brightness.write(a)
    lightB.brightness.write(a)
})
ds.cloud.onMethod("get_temp_hum", () => {
    return [temp.temperature.read(), hum.humidity.read()]
})
```