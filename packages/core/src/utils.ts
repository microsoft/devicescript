import * as ds from "@devicescript/core"

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
;(ds as typeof ds).assert = function assert(cond: boolean, msg?: string): void {
    if (!cond) throw new Error("Assertion failed: " + msg)
}
;(ds as typeof ds).isSimulator = function isSimulator(): boolean {
    const a = ds._dcfgString("archId")
    return a === "wasm" || a === "native"
}
