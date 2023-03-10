import * as ds from "@devicescript/core"
import { describe, test, expect } from "@devicescript/test"
import { reduce } from "./aggregate"
import { from, fromEvent, fromRegister, interval } from "./creation"
import { threshold, filter, distinctUntilChanged } from "./filter"
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
        let obs = interval(100)
        obs = tap<number>(v => console.log(`interval ${v}`))(obs)
        // start
        let count = 0
        let res: number[] = []
        const unsub = await obs.subscribe(() => {
            console.log(`next ${count}`)
            res.push(count)
            if (count++ === 2) unsub.unsubscribe()
        })
        // wait till done?
        await ds.sleepMs(1000)
        expect(res.length).toBe(3)
    })
})

describe("filter", () => {
    test("filter", async () => {
        let obs = from([1, 2, 3])
        obs = filter<number>(x => x > 2)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [3])
    })
    test("distinctUntilChanged", async () => {
        let obs = from([1, 2, 2, 3, 3, 3, 3])
        obs = distinctUntilChanged<number>((x, y) => x === y)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [1, 2, 3])
    })
    test("threshold", async () => {
        let obs = from([1, 2, 3, 6, 5, 0])
        obs = threshold(2)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [1, 3, 6, 0])
    })
})

describe("transform", () => {
    test("map", async () => {
        let obs = from([1, 2, 3])
        obs = map<number, number>(x => x * x)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [1, 4, 9])
    })
    test("map", async () => {
        let obs = from([1, 2, 3])
        obs = scan<number, number>((x, v) => x + v, 0)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [1, 3, 6])
    })
})

describe("aggregate", () => {
    test("reduce", async () => {
        let obs = from([1, 2, 3])
        obs = reduce<number, number>((p, x) => p + x, 0)(obs)
        obs = tap<number>(v => console.log(v))(obs)
        await emits(obs, [6])
    })
})

describe("pipe", () => {
    test("of filter", async () => {
        const obs = from([1, 2, 3]).pipe(
            filter<number>(x => x > 2),
            tap<number>(v => console.log(v))
        )
        await emits(obs, [3])
    })
    test("of filter filter", async () => {
        const obs = from([1, 2, 3, 4, 5]).pipe(
            filter<number>(x => x > 2),
            tap<number>(v => console.log(v)),
            filter<number>(x => x < 4),
            tap<number>(v => console.log(v))
        )
        await emits(obs, [3])
    })
})
