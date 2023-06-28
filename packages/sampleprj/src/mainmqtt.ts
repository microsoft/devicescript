import { MQTTClient } from "@devicescript/net"

const client = new MQTTClient({
    host: "broker.hivemq.com",
    port: 8000,
    clientId: "devs",
})

await client.connect()
await client.publish("test", "Hello World!")
