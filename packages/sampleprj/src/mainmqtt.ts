import { connectMQTT } from "@devicescript/net"
import { readSetting } from "@devicescript/settings"

const host = await readSetting<string>("MQTT_HOST")
const port = await readSetting<number>("MQTT_PORT", 8883)
const username = await readSetting<string>("MQTT_USER")
const password = await readSetting<string>("MQTT_PWD")
const mqtt = await connectMQTT({
    host,
    proto: "tls",
    port,
    username,
    password,
})
const payload = Buffer.from("hello")
await mqtt.subscribe("devs/tcp", async msg => {
    console.log(msg.content.toString("utf-8"))
})
await mqtt.publish("devs/tcp", payload)
