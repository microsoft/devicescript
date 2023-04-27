import { subscribeMessage } from "@devicescript/cloud"

setInterval(() => {
    console.data({
        temp: 20 + Math.random() / 10,
        humi: 80 + Math.random() / 100,
    })
}, 500)

subscribeMessage("test", msg => console.log(msg))
