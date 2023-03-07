import * as ds from "@devicescript/core"
import {
    delay,
    filter,
    fromEvent,
    map,
    Observable,
    of,
    span,
    threshold,
} from "./index"

const btn = new ds.Button()
const temp = new ds.Temperature()

async function testObservable() {
    // simple example
    const obs = new Observable<string>(async observer => {
        await observer.next("HELLO")
        await observer.next("WORLD")
        await observer.complete?.()
    })
    await obs.subscribe(v => console.log(v))
}

async function testOf() {
    const obs = of([1, 2, 3, 4, 5])
    await obs.subscribe(v => console.log(v))
}

async function testThreshold() {
    const obs = of([1, 1.2, 1.3, 1.4, 1.5])
    await obs.pipe(threshold(0.2)).subscribe(v => console.log(v))
}

async function testFromEvent() {
    // turn events into observables
    const obs = fromEvent(btn.down)
    const unsub = await obs.subscribe(ev => console.log("down"))
    await unsub?.unsubscribe()
}

async function testRegisterNumber() {
    await temp.temperature.subscribe(v => console.log(v))
}

async function testMap() {
    of([1, 2, 3])
        .pipe(map(x => x * x))
        .subscribe(t => console.log(t))
}

async function testFilter() {
    of([1, 2, 3])
        .pipe(filter(t => t > 2))
        .subscribe(t => console.log(t))
}

async function testSpan() {
    of([1, 2, 3])
        .pipe(span(t => t + 1, 0))
        .subscribe(t => console.log(t))
}

async function testDelay() {
    of([1, 2, 3])
        .pipe(delay(100))
        .subscribe(t => console.log(t))
}

await testObservable()
await testOf()
await testFromEvent()
await testRegisterNumber()
await testThreshold()
await testMap()
await testFilter()
await testDelay()
await testSpan()
