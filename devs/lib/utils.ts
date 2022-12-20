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

import * as ds from "@devicescript/core"

export function pktSlice(off: number, endp: number) {
    const len = Math.max(endp - off, 0)
    const r = Buffer.alloc(len)
    r.blitAt(0, ds.packet, off, len)
    return r
}

export function decode_bytes(off: number) {
    return pktSlice(off, ds.packet.length)
}

export function decode_string(off: number) {
    return decode_bytes(off).toString()
}

export function decode_string0(off: number) {
    let endp = off
    while (endp < ds.packet.length) {
        if (ds.packet[endp] == 0) break
        endp++
    }
    return pktSlice(off, endp).toString()
}

export function __ds_wait(seconds: number) {
    ds.sleepMs(seconds * 1000)
}
