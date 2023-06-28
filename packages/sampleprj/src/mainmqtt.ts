import { MQTTClient } from "@devicescript/net"

const client = new MQTTClient({
    broker: "broker.hivemq.com",
    port: 8000,
})

await client.connect()

client.publish("test", "Hello World!")
