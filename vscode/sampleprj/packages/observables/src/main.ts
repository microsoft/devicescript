import * as ds from "@devicescript/core"
import { describe, test, expect, runTests } from "@devicescript/test"
import { from, fromEvent, fromRegister, interval } from "./creation"
import { threshold, filter } from "./filter"
import { Observable, Subscription } from "./observable"
import { map, scan } from "./transform"
import { tap } from "./utility"
const btn = new ds.Button()
const temp = new ds.Temperature()

async function emits<T>(o: Observable<T>, sequence: T[]) {
    let s: Subscription
    const values: T[] = []
    try {
        s = await o.subscribe(v => {
            values.push(v)
        })
        expect(values.length).toBe(sequence.length)
        for (let i = 0; i < values.length; ++i) {
            expect(values[i]).toBe(sequence[i])
        }
    } finally {
        if (s) s.unsubscribe()
    }
}

describe("observable", () => {
    test("create observable", async () => {
        // simple example
        let obs = new Observable<string>(async observer => {
            await observer.next("HELLO")
            await observer.next("WORLD")
            if (observer.complete) await observer.complete()
        })
        obs = tap<string>(v => console.log(v))(obs)
        await emits(obs, ["HELLO", "WORLD"])
    })
})

describe("creation", () => {
    test("of", async () => {
        const obs = from([1, 2, 3, 4, 5])
        await obs.subscribe(v => console.log(v))
    })
    test("fromEvent", async () => {
        const obs = fromEvent(btn.down)
        const unsub = await obs.subscribe(ev => console.log("down"))
        if (unsub) await unsub.unsubscribe()
    })
    test("fromRegister", async () => {
        const obs = fromRegister(temp.temperature)
        await obs.subscribe(v => console.log(v))
    })
    test("interval", async () => {
        let obs = interval(1000)
        obs = tap<number>(v => console.log(`interval ${v}`))(obs)
        // start
        let count = 0
        const unsub = await obs.subscribe(() => {
            console.log(`next ${count}`)
            if (count++ === 2) unsub.unsubscribe()
        })
        // wait till done?
    })
})

describe("filter", () => {
    test("filter", async () => {
        let obs = await from([1, 2, 3])
        obs = filter<number>(x => x > 2)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [3])
    })
})

describe("transform", () => {
    test("map", async () => {
        let obs = await from([1, 2, 3])
        obs = map<number, number>(x => x * x)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [1, 4, 9])
    })
    test("map", async () => {
        let obs = await from([1, 2, 3])
        obs = scan<number, number>((x, v) => x + v, 0)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [1, 3, 6])
    })
})

await runTests()
