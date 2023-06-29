import { connect, fetch } from "@devicescript/net"

// fetch
console.log(`using fetch...`)
const res = await fetch("https://github.com/status.json")
const json = await res.json()
console.log(json)

// socket
console.log(`using socket...`)
const socket = await connect({ proto: "tls", host: "github.com", port: 443 })
await socket.send(`GET /status.json HTTP/1.1
user-agent: DeviceScript fetch()
accept: */*
host: github.com
connection: close

`)
const status = await socket.readLine()
console.log(status)
await socket.close()
