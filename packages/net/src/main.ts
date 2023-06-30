import { describe, expect, test } from "@devicescript/test"
import { URL } from "./url"
import { assert, delay, emitter, wait } from "@devicescript/core"
import { fetch } from "./fetch"
import { connectMQTT } from "./mqtt"

describe("net", () => {
    test("URL", () => {
        const u = new URL(
            "https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash"
        )
        assert(u.username === "user")
        assert(u.password === "pass")
        assert(u.hostname === "sub.example.com")
        assert(u.port === "8080")
        assert(u.pathname === "/p/a/t/h")
        assert(u.search === "?query=string")
        assert(u.hash === "#hash")
        assert(u.protocol === "https:")

        assert(u.host() === "sub.example.com:8080")

        function checkURL(u: URL, exp: string) {
            assert(u.href() === exp)
            assert(new URL(exp).href() === exp)
        }

        checkURL(
            u,
            "https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash"
        )

        u.password = ""
        checkURL(
            u,
            "https://user@sub.example.com:8080/p/a/t/h?query=string#hash"
        )

        u.port = ""
        checkURL(u, "https://user@sub.example.com/p/a/t/h?query=string#hash")

        u.hash = ""
        checkURL(u, "https://user@sub.example.com/p/a/t/h?query=string")

        u.username = ""
        checkURL(u, "https://sub.example.com/p/a/t/h?query=string")

        u.search = ""
        checkURL(u, "https://sub.example.com/p/a/t/h")

        const u2 = new URL("https://foobar.com/foo#bar")
        assert(u2.pathname === "/foo")
        assert(u2.hash === "#bar")
    })

    /*
    test("fetch test.json", async () => {
        const res = await fetch(
            "https://microsoft.github.io/devicescript/test.json"
        )
        assert(res.ok)
        assert(res.status === 200)
        const json = await res.json()
        console.log(json)
        assert(json.data === "test")
    })*/

    test("fetch gthub status", async () => {
        const res = await fetch("https://github.com/status.json")
        console.log({ ok: res.ok, status: res.status })
        assert(res.ok)
        assert(res.status === 200)
        const json = await res.json()
        console.log(json)
        assert(!!json.status)
    })

    test("mqtt eqmx tls", async () => {
        const mqtt = await connectMQTT({
            host: "broker.emqx.io",
            proto: "tls",
            port: 8883,
        })
        let received = false
        const recv = emitter()
        const payload = Buffer.from(Math.random() + "")
        //console.log({ payload: payload.toString("hex") })
        const obs = await mqtt.subscribe("devs/tcp")
        obs.subscribe(async msg => {
            // console.log(msg)
            if (msg.content.toString("hex") === payload.toString("hex")) {
                received = true
                recv.emit(undefined)
            }
        })
        await mqtt.publish("devs/tcp", payload)
        await wait(recv, 5000)
        await mqtt.close()

        assert(received, "mqtt msg sent and received")
    })

    test("mqtt hivemq tcp", async () => {
        const mqtt = await connectMQTT({
            host: "broker.hivemq.com",
            proto: "tcp",
            port: 1883,
        })
        let received = false
        const recv = emitter()
        const payload = Buffer.from(Math.random() + "")
        //console.log({ payload: payload.toString("hex") })
        const obs = await mqtt.subscribe("devs/tcp")
        obs.subscribe(async msg => {
            // console.log(msg)
            if (msg.content.toString("hex") === payload.toString("hex")) {
                received = true
                recv.emit(undefined)
            }
        })
        await mqtt.publish("devs/tcp", payload)
        await wait(recv, 5000)
        await mqtt.close()

        assert(received, "mqtt msg sent and received")
    })
})
