import * as ds from "@devicescript/core"
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

/**
 * A buffer of RGB colors
 */
export class ColorBuffer {
    /**
     * Number of pixels in the buffer
     */
    readonly buffer: ds.Buffer
    readonly start: number
    readonly length: number

    constructor(buffer: ds.Buffer, start: number, length: number) {
        ds.assert(buffer.length >= (start + length) * 3, "buffer too small")
        this.buffer = buffer
        this.start = start
        this.length = length
    }

    /**
     * Set a pixel color in the buffer
     * @param pixeloffset pixel offset. if negative starts from the end
     * @param color RGB color
     */
    setPixelColor(pixeloffset: number, color: number) {
        while (pixeloffset < 0) pixeloffset += this.length
        const i = this.start + (pixeloffset << 0)
        if (i < this.start || i >= this.start + this.length) return
        const bi = i * 3
        this.buffer.setAt(bi, "u8", (color >> 16) & 0xff)
        this.buffer.setAt(bi + 1, "u8", (color >> 8) & 0xff)
        this.buffer.setAt(bi + 2, "u8", color & 0xff)
    }

    /**
     * Reads the pixel color at the given offsret
     * @param pixeloffset pixel offset. if negative starts from the end
     * @returns
     */
    getPixelColor(pixeloffset: number): number {
        while (pixeloffset < 0) pixeloffset += this.length
        const i = this.start + (pixeloffset << 0)
        if (i < this.start || i >= this.start + this.length) return undefined
        const bi = i * 3
        const r = this.buffer.getAt(bi, "u8")
        const g = this.buffer.getAt(bi + 1, "u8")
        const b = this.buffer.getAt(bi + 2, "u8")

        return rgb(r, g, b)
    }

    /**
     * Renders a bar grpah on the LEDs
     * @param value
     * @param high
     * @returns
     */
    setBarGraph(
        value: number,
        high: number,
        options?: {
            emptyRangeColor?: number
            zeroColor?: number
        }
    ): void {
        if (high <= 0) {
            const emptyRangeColor = options?.emptyRangeColor
            this.clear()
            this.setPixelColor(
                0,
                isNaN(emptyRangeColor) ? 0xffff00 : emptyRangeColor
            )
            return
        }

        value = Math.abs(value)
        const n = this.length
        const n1 = n - 1
        let v = Math.idiv(value * n, high)
        if (v === 0) {
            const zeroColor = options?.zeroColor
            this.setPixelColor(0, isNaN(zeroColor) ? 0x666600 : zeroColor)
            for (let i = 1; i < n; ++i) this.setPixelColor(i, 0)
        } else {
            for (let i = 0; i < n; ++i) {
                if (i <= v) {
                    const b = Math.idiv(i * 255, n1)
                    this.setPixelColor(i, rgb(b, 0, 255 - b))
                } else this.setPixelColor(i, 0)
            }
        }
    }

    /**
     * Clears the buffer to #000000
     */
    clear() {
        this.buffer.fillAt(this.start, this.length, 0)
    }

    /**
     * Creates a range view over the color buffer
     * @param start start index
     * @param length length of the range
     * @returns a view of the color buffer
     */
    range(start: number, length?: number): ColorBuffer {
        const rangeStart = this.start + (start << 0)
        const rangeLength =
            length === undefined
                ? this.length - start
                : Math.min(length, this.length - start)
        return new ColorBuffer(this.buffer, rangeStart, rangeLength)
    }
}

/**
 * Create a color buffer that allows you to manipulate a range of pixels
 * @param numPixels number of pixels
 */
export function colorBuffer(numPixels: number) {
    numPixels = numPixels << 0
    const buf = ds.Buffer.alloc(numPixels * 3)
    return new ColorBuffer(buf, 0, numPixels)
}
