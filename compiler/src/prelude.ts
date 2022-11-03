export const prelude: Record<string, string> = {
    "clientcmds.ts":
`BuzzerRole.prototype.playNote = function (frequency, volume, duration) {
    var p = 1000000 / frequency
    volume = clamp(0, volume, 1)
    this.playTone(p, p * volume * 0.5, duration)
}

LedRole.prototype.setAll = function (r, g, b) {
    var buflen = this.numPixels.read() * 3
    var idx = 0
    packet.setLength(buflen)
    while (idx < buflen) {
        packet.setAt(idx, "u0.8", r)
        packet.setAt(idx + 1, "u0.8", g)
        packet.setAt(idx + 2, "u0.8", b)
        idx = idx + 3
    }
    this.pixels.write(packet)
}
`,
    "corelib.d.ts":
`/// <reference no-default-lib="true"/>

declare var NaN: number
declare var Infinity: number

/**
 * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a number).
 * @param number A numeric value.
 */
declare function isNaN(number: number): boolean

interface Object {}

interface Function {}

interface CallableFunction extends Function {}

interface NewableFunction extends Function {}

interface IArguments {
    [index: number]: any
    length: number
    callee: Function
}

interface String {}

interface Boolean {}

interface Number {}

interface RegExp {}


interface Array<T> {
    /**
     * Gets or sets the length of the array. This is a number one higher than the highest index in the array.
     */
    length: number;
    [n: number]: T;
}
`,
    "utils.ts":
`function clamp(low, v, hi) {
    if (v < low) return low
    if (v > hi) return hi
    return v
}
`,
}
