import * as ds from "@devicescript/core"
import { describe, test, expect } from "@devicescript/test"
import { reduce } from "./aggregate"
import { from, iif, interval } from "./creation"
import { ewma, fir, levelDetector, rollingAverage } from "./dsp"
import { catchError, throwError } from "./error"
import { threshold, filter, distinctUntilChanged } from "./filter"
import { collect, collectTime } from "./join"
import { Observable, Subscription, unusbscribe } from "./observable"
import { map, scan } from "./transform"
import { tap } from "./utility"
import { register } from "./value"
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
        unusbscribe(s)
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
    test("interval", async () => {
        let obs = interval(100)
        obs = tap<number>(v => console.log(`interval ${v}`))(obs)
        // start
        let count = 0
        let res: number[] = []
        const unsub = await obs.subscribe(() => {
            console.log(`next ${count}`)
            res.push(count)
            if (count++ === 2) unusbscribe(unsub)
        })
        // wait till done?
        await ds.sleep(1000)
        expect(res.length).toBe(3)
    })
    test("iif,true", async () => {
        const obs = iif(() => true, from([0, 1, 2]), from([-1, 2]))
        await emits(obs, [0, 1, 2])
    })
    test("iif,false", async () => {
        const obs = iif(() => false, from([0, 1, 2]), from([-1, 2]))
        await emits(obs, [-1, 2])
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

describe("join", () => {
    test("collect", async () => {
        let obs = collect(
            {
                a: from([0, 1, 2]),
                b: from([4, 5, 6]),
            },
            interval(50)
        )
        const unsub = await obs.subscribe(({ a, b }) =>
            console.log(`a: ${a}, b: ${b}`)
        )
        await ds.sleep(100)
        return unsub
    })
    test("collectTime", async () => {
        let obs = collectTime(
            {
                a: from([0, 1, 2]),
                b: from([4, 5, 6]),
            },
            50
        )
        const unsub = await obs.subscribe(({ a, b }) =>
            console.log(`a: ${a}, b: ${b}`)
        )
        await ds.sleep(100)
        return unsub
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

describe("dsp", () => {
    test("emwa", async () => {
        const a = [1, 2]
        const obs = from(a).pipe(ewma())
        await emits(obs, [1, 1 * 0.8 + 2 * 0.2])
    })
    test("fir", async () => {
        const a = [1, 2]
        const obs = from(a).pipe(fir([1, 1]))
        await emits(obs, [1, 1 / 2 + 2 / 2])
    })
    test("ravg", async () => {
        const a = [1, 2]
        const obs = from(a).pipe(rollingAverage(2))
        await emits(obs, [1, 1 / 2 + 2 / 2])
    })
    test("levelDetector", async () => {
        const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]
        const obs = from(a).pipe(levelDetector(2,5))
        await emits(obs, [-1, 0, 1, -1])
    })
})

describe("value", () => {
    test("emit", async () => {
        const obs = register<number>(0)
        const res: number[] = []
        await obs.subscribe(v => {
            res.push(v)
        })
        await obs.emit(1)
        await obs.emit(2)
        await obs.emit(3)
        expect(res.length).toBe(3)
        expect(res[0]).toBe(1)
        expect(res[1]).toBe(2)
        expect(res[2]).toBe(3)
    })
})

describe("error", () => {
    test("subscribe", async () => {
        const obs = new Observable(observer => {
            throw Error("error")
        })
        let error = 0
        await obs.subscribe({
            error: () => {
                error++
            },
        })
        expect(error).toBe(1)
    })
    test("map", async () => {
        const obs = from([0, 1, 2]).pipe(
            map(v => {
                throw new Error()
            })
        )
        let error = 0
        await obs.subscribe({
            error: () => {
                error++
            },
        })
        expect(error).toBe(1)
    })
    test("map,tap,filter", async () => {
        const obs = from([0, 1, 2]).pipe(
            filter(v => v > 1),
            tap(v => console.log(v)),
            map(v => {
                throw new Error()
            })
        )
        let error = 0
        await obs.subscribe({
            error: () => {
                error++
            },
        })
        expect(error).toBe(1)
    })
    test("throwError", async () => {
        const obs = from([0, 1, 2]).pipe(throwError(() => new Error("hi")))
        let error = 0
        await obs.subscribe({
            error: () => {
                error++
            },
        })
        expect(error).toBe(1)
    })
    test("throwErrorasync", async () => {
        const obs = from([0, 1, 2]).pipe(throwError(() => new Error("hi")))
        let error = 0
        await obs.subscribe({
            error: async () => {
                error++
            },
        })
        expect(error).toBe(1)
    })
    test("catchError,map", async () => {
        const obs = from([0, 1, 2]).pipe(
            map(() => {
                throw new Error()
            }),
            catchError(e => {
                console.log(`catch error ` + e)
                return from([5])
            })
        )
        await emits(obs, [5])
    })
    test("catchError", async () => {
        const obs = from([0, 1, 2]).pipe(
            throwError(() => new Error()),
            catchError(e => {
                console.log(`catch error ` + e)
                return from([5])
            })
        )
        await emits(obs, [5])
    })
})
