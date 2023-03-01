import * as ds from "@devicescript/core"

function callIt(x: any) {
    x()
}
function callNew(x: any) {
    new x()
}
function getFoo(x: any) {
    return x.foo
}
function setFoo(x: any) {
    x.foo = 1
}

function expectExn(f: () => void, ex: Function) {
    try {
        f()
        ds.assert(false, "missing exn")
    } catch (e: any) {
        ds.assert(e instanceof ex, "wrong exn")
    }
}

async function expectExnAsync(f:  ds.Callback, ex: Function) {
    try {
        await f()
        ds.assert(false, "missing exn")
    } catch (e: any) {
        ds.assert(e instanceof ex, "wrong exn")
    }
}

const airp = new ds.AirPressure()

function testTooLarge(tooLarge: number) {
    expectExn(() => {
        Buffer.alloc(tooLarge)
    }, RangeError)
    const arr = [1]
    expectExn(() => {
        arr[tooLarge] = 1
    }, RangeError)
    expectExn(() => {
        arr.insert(0, tooLarge)
    }, RangeError)
}

function instOf(a: any, b: any) {
    return a instanceof b
}

async function testExn() {
    getFoo("foo")
    getFoo(true)
    expectExn(() => getFoo(null), TypeError)

    expectExn(() => setFoo(null), TypeError)
    expectExn(() => setFoo(true), TypeError)

    const b = Buffer.alloc(10)
    b[1] = b[9] + 1
    expectExn(() => {
        b[10] = 1
    }, RangeError)
    ds.assert(b[10] === undefined)

    const b2 = hex`001122`
    expectExn(() => {
        b2[0] = 1
    }, TypeError)
    expectExn(() => {
        b2.fillAt(0, 1, 1)
    }, TypeError)
    expectExn(() => {
        b2.blitAt(0, "a", 0, 1)
    }, TypeError)

    testTooLarge(1000000000)
    testTooLarge(1000000)
    testTooLarge(2000000000)

    await expectExnAsync(async () => {
        await airp.sendCommand(100000)
    }, RangeError)
    await expectExnAsync(async () => {
        await airp.sendCommand(0x80, Buffer.alloc(300))
    }, RangeError)

    callIt(() => {})
    callIt(Error)
    callIt(TypeError)
    ds.assert(Error() instanceof Error)
    ds.assert(new Error() instanceof Error)
    ds.assert(new Error() instanceof Error)
    ds.assert(TypeError() instanceof Error)
    ds.assert(TypeError() instanceof TypeError)

    expectExn(() => callIt(null), TypeError)
    expectExn(() => callIt(1), TypeError)
    expectExn(() => callIt({}), TypeError)
    expectExn(() => callIt([]), TypeError)
    expectExn(() => callIt(Array.prototype), TypeError)

    expectExn(() => Math.pow.start(1), TypeError) // fiber started with builtin

    expectExn(() => Object.keys(null), TypeError)
    expectExn(() => Object.values(null), TypeError)
    Object.keys("")

    instOf(null, Object)
    instOf(null, Array)
    instOf("", Array)

    expectExn(() => instOf("", {}), TypeError)
    expectExn(() => instOf("", Array.prototype), TypeError)
    expectExn(() => instOf("", null), TypeError)

    expectExn(() => {
        throw null
    }, TypeError)

    callNew(Error)
    expectExn(() => callNew(null), TypeError)
    expectExn(() => callNew(Math.pow), TypeError)
}

await testExn()


