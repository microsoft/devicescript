import { describe, expect, test } from "@devicescript/test"
import { URL } from "./url"
import { assert } from "@devicescript/core"
import { fetch } from "./fetch"
import { MQTTClient } from "./mqtt"

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

    test("mqtt hivemq public tls", async () => {
        const mqtt = new MQTTClient({
            host: "broker.hivemq.com",
            proto: "tls",
            port: 8884,
            clientId: "devs",
        })
        await mqtt.connect()
        await mqtt.publish("devs/tls", "hello world")
        await mqtt.close()
    })

    test("mqtt hivemq public tcp", async () => {
        const mqtt = new MQTTClient({
            host: "broker.hivemq.com",
            port: 8000,
            clientId: "devs",
        })
        await mqtt.connect()
        await mqtt.publish("devs/tcp", "hello world")
        await mqtt.close()
    })
})
