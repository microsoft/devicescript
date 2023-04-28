import { subscribeMessage } from "@devicescript/cloud"
import { configureHardware } from "@devicescript/servers"

configureHardware({ devNetwork: true})

setInterval(() => {
    console.data({
        temp: 20 + Math.random() / 10,
        humi: 80 + Math.random() / 100,
    })
}, 1000)

subscribeMessage("test", msg => console.log(msg))
