import { subscribeMessage, publishMessage } from "@devicescript/cloud"

setInterval(async () => {
    const data = {
        temp: 20 + Math.random() / 10,
        humi: 80 + Math.random() / 100,
    }
    console.data(data)
    await publishMessage("data", data)
    await publishMessage("/humi", data.humi)
}, 1000)

subscribeMessage("test", msg => console.log(msg))
