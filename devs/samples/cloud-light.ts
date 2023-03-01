import * as ds from "@devicescript/core"

const led = new ds.LightBulb()

ds.cloud.onMethod("light", async (a, b) => {
    await led.brightness.write(a + b)
    return [1, a, b]
})
