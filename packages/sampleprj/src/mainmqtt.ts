import { connectMQTT } from "@devicescript/net"

const mqtt = await connectMQTT({
    host: "broker.hivemq.com",
    proto: "tcp",
    port: 1883,
    clientId: "devs",
})
const payload = Buffer.from("hello")
await mqtt.subscribe("devs/tcp", async msg => {
    console.log(msg.content.toString("utf-8"))
})
await mqtt.publish("devs/tcp", payload)
