import * as ds from "@devicescript/core"

Math.sign = function sign(v) {
    if (v > 0) return 1
    if (v < 0) return -1
    if (v === 0) return 0
    return NaN
}

Math.clamp = function clamp(low, v, hi) {
    if (v < low) return low
    if (v > hi) return hi
    return v
}

Math.sqrt = function sqrt(x) {
    return Math.pow(x, 0.5)
}

Math.cbrt = function cbrt(x) {
    return Math.pow(x, 0.333333333333333333)
}

Math.exp = function exp(x) {
    return Math.pow(Math.E, x)
}

Math.log10 = function log10(x) {
    return Math.log(x) * 0.43429448190325176
}

Math.log2 = function log2(x) {
    return Math.log(x) * 1.4426950408889634
}

Math.map = function map(x, inMin, inMax, outMin, outMax) {
    const inRange = inMax - inMin
    const outRange = outMax - outMin
    return ((x - inMin) / inRange) * outRange + outMin
}
;(ds as typeof ds).assert = function assert(cond: boolean, msg?: string): void {
    if (!cond)
        throw new Error("Assertion failed: " + (msg !== undefined ? msg : ""))
}
;(ds as typeof ds).isSimulator = function isSimulator(): boolean {
    const a = ds._dcfgString("archId")
    return a === "wasm" || a === "native"
}

// TODO timeout
// TODO retry policy
;(ds as typeof ds).actionReport = async function actionResponse<
    T extends ds.Role
>(
    role: T,
    meth: string & keyof T,
    fn: ds.Callback,
    filter?: (p: ds.Packet) => boolean
) {
    const sp = role.spec.lookup(meth)
    const fib = ds.Fiber.self()
    const unsub = role.report().subscribe(pkt => {
        if (pkt.serviceCommand === sp.code && (!filter || filter(pkt))) {
            unsub()
            fib.resume(pkt)
        }
    })
    await fn()
    return await ds.suspend<ds.Packet>()
}
// this is overridden byt the gpio package
;(ds as typeof ds).gpio = gpio => ({ gpio } as any)
