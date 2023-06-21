import { describe, expect, test } from "@devicescript/test"
import { URL } from "./url"
import { assert } from "@devicescript/core"

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
    })
})
