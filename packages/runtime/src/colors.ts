/**
 * Encodes an RGB color into a 24bit color number.
 * @param r unsigned 8bit red
 * @param g unsigned 8bit green
 * @param b unsigned 8bit blue
 * @returns 24 bit color number
 */
export function rgb(r: number, g: number, b: number) {
    return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff)
}

/**
 * Converts a hue saturation luminosity value into a RGB color
 * @param h hue from 0 to 360
 * @param s saturation from 0 to 99
 * @param l luminosity from 0 to 99
 */
//% blockId=neopixelHSL block="hue %h|saturation %s|luminosity %l"
export function hsl(h: number, s: number, l: number): number {
    h = Math.round(h)
    s = Math.round(s)
    l = Math.round(l)

    h = h % 360
    s = Math.clamp(0, 99, s)
    l = Math.clamp(0, 99, l)
    const c = Math.idiv(((100 - Math.abs(2 * l - 100)) * s) << 8, 10000) //chroma, [0,255]
    const h1 = Math.idiv(h, 60) //[0,6]
    const h2 = Math.idiv((h - h1 * 60) * 256, 60) //[0,255]
    const temp = Math.abs((h1 % 2 << 8) + h2 - 256)
    const x = (c * (256 - temp)) >> 8 //[0,255], second largest component of this color
    let r$: number
    let g$: number
    let b$: number
    if (h1 === 0) {
        r$ = c
        g$ = x
        b$ = 0
    } else if (h1 === 1) {
        r$ = x
        g$ = c
        b$ = 0
    } else if (h1 === 2) {
        r$ = 0
        g$ = c
        b$ = x
    } else if (h1 === 3) {
        r$ = 0
        g$ = x
        b$ = c
    } else if (h1 === 4) {
        r$ = x
        g$ = 0
        b$ = c
    } else if (h1 === 5) {
        r$ = c
        g$ = 0
        b$ = x
    }
    const m = Math.idiv(Math.idiv((l * 2) << 8, 100) - c, 2)
    const r = r$ + m
    const g = g$ + m
    const b = b$ + m
    return rgb(r, g, b)
}
