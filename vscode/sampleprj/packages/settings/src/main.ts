import { describe, expect, test } from "@devicescript/test"
import { deleteSetting, readSetting, writeSetting } from "./api"
import { env, writeEnv } from "./env"

describe("json", () => {
    const key = "test"
    test("write,read", async () => {
        const obj = { [Math.random() + ""]: Math.random() }
        await writeSetting(key, obj)
        const r = await readSetting(key)

        expect(JSON.stringify(r)).toBe(JSON.stringify(obj))
    })

    test("delete", async () => {
        const obj = { [Math.random() + ""]: Math.random() }
        await writeSetting(key, obj)
        await deleteSetting(key)
        const r = await readSetting(key)
        expect(r).toBe(undefined)
    })
})

describe("env", () => {
    test("write,read", async () => {
        const obj = { [Math.random() + ""]: Math.random() }
        await writeEnv(obj)
        const e = await env()
        const r = await e.read()

        expect(JSON.stringify(r)).toBe(JSON.stringify(obj))
    })
})
