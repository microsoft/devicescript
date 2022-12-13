Math.clamp = function clamp(low, v, hi) {
    if (v < low) return low
    if (v > hi) return hi
    return v
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
