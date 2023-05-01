import { subscribeMessage, publishMessage } from "@devicescript/cloud"
import { configureHardware } from "@devicescript/servers"

setInterval(async () => {
    const data = {
        temp: 20 + Math.random() / 10,
        humi: 80 + Math.random() / 100,
    }
    console.data(data)
    await publishMessage("data", data)
}, 1000)

subscribeMessage("test", msg => console.log(msg))
