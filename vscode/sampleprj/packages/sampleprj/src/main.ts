import { millis } from "@devicescript/core"

setInterval(() => {
    console.log({ msg: millis() })
}, 1000)
