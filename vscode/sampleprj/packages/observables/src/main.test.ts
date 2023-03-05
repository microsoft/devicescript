import * as ds from "@devicescript/core"
import {
    delay,
    filter,
    fromArray,
    fromEvent,
    fromRegisterNumber,
    map,
    Observable,
} from "./index"

const btn = new ds.Button()
const temp = new ds.Temperature()

async function testObservable() {
    // simple example
    const obs = new Observable<string>(observer => {
        observer("HELLO")
        observer("WORLD")
    })
    await obs.subscribe(v => console.log(v))
}

async function testObservables() {
    const obs = fromArray([1, 2, 3, 4, 5])
    await obs.subscribe(v => console.log(v))
}

async function testFromEvent() {
    // turn events into observables
    const obs = fromEvent(btn.down)
    const unsub = await obs.subscribe(ev => console.log(ev.code)) // todo: value

    await unsub?.unsubscribe()
}

async function testRegisterNumber() {
    const obs = fromRegisterNumber(temp.temperature, 1)
    await obs.subscribe(async reg => console.log(await reg.read()))
}

async function testMap() {
    const obs = fromRegisterNumber(temp.temperature, 1)
    await obs
        .pipe(map(async reg => await reg.read()))
        .subscribe(t => console.log(t))
}

async function testFilter() {
    const obs = fromRegisterNumber(temp.temperature, 1)
    await obs
        .pipe(
            map(async reg => await reg.read()),
            filter(t => t > 30)
        )
        .subscribe(t => console.log("too hot!"))
}

async function testDelay() {
    const obs = fromRegisterNumber(temp.temperature, 1)
    await obs
        .pipe(
            map(async reg => await reg.read()),
            delay(100),
            filter(t => t > 30)
        )
        .subscribe(t => console.log("too hot!"))
}

await testObservable()
await testObservables()
await testFromEvent()
await testRegisterNumber()
await testMap()
await testFilter()
await testDelay()
