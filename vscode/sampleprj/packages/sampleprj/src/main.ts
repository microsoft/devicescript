import { millis } from "@devicescript/core"

setInterval(() => {
    console.data({ msg: millis() })
}, 1000)
