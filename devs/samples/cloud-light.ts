import * as ds from "@devicescript/core"

const led = new ds.LightBulb()

/* Todo
ds.cloud.onMethod("light", async (a, b) => {
    await led.intensity.write(a + b)
    return [1, a, b]
})
*/
