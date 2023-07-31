import * as ds from "@devicescript/core"
import { ColorInterpolator, blendRgb, hsv, rgb } from "./colors"
import { Palette } from "./palette"

/**
 * A buffer of RGB colors
 */
export class PixelBuffer {
    /**
     * Array of RGB colors
     * @internal
     */
    readonly buffer: ds.Buffer
    /**
     * Starting pixel index in the original buffer
     */
    readonly start: number
    /**
     * Number of pixels in the buffer
     */
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
    setAt(pixeloffset: number, color: number) {
        pixeloffset = pixeloffset | 0
        while (pixeloffset < 0) pixeloffset += this.length
        const i = this.start + pixeloffset
        if (i < this.start || i >= this.start + this.length) return
        const bi = i * 3
        this.buffer[bi] = (color >> 16) & 0xff
        this.buffer[bi + 1] = (color >> 8) & 0xff
        this.buffer[bi + 2] = color & 0xff
    }

    /**
     * Setter for individual RGB colors. Does not check bounds and should be used with care.
     * @param pixeloffset
     * @param r
     * @param g
     * @param b
     */
    setRgbAt(pixeloffset: number, r: number, g: number, b: number) {
        const i = (this.start + (pixeloffset | 0)) * 3
        this.buffer[i] = r
        this.buffer[i + 1] = g
        this.buffer[i + 2] = b
    }

    /**
     * Reads the pixel color at the given offsret
     * @param pixeloffset pixel offset. if negative starts from the end
     * @returns
     */
    at(pixeloffset: number): number {
        pixeloffset = pixeloffset | 0
        while (pixeloffset < 0) pixeloffset += this.length
        const i = this.start + pixeloffset
        if (i < this.start || i >= this.start + this.length) return undefined
        const bi = i * 3
        const r = this.buffer[bi]
        const g = this.buffer[bi + 1]
        const b = this.buffer[bi + 2]
        return rgb(r, g, b)
    }

    /**
     * Apply a conversion function to all pixels
     * @param converter
     */
    apply(converter: (c: number, index: number) => number) {
        const n = this.length
        const buf = this.buffer
        for (let i = 0; i < n; ++i) {
            const bi = (this.start + i) * 3

            const r = buf[bi]
            const g = buf[bi + 1]
            const b = buf[bi + 2]
            const c = rgb(r, g, b)

            const cr = converter(c, i)

            buf[bi] = (cr >> 16) & 0xff
            buf[bi + 1] = (cr >> 8) & 0xff
            buf[bi + 2] = cr & 0xff
        }
    }

    /**
     * Allocates a clone of the buffer view
     * @returns
     */
    allocClone() {
        const res = new PixelBuffer(
            this.buffer.slice(this.start * 3, (this.start + this.length) * 3),
            0,
            this.length
        )
        return res
    }

    /**
     * Clears the buffer to #000000
     */
    clear() {
        this.buffer.fillAt(this.start * 3, this.length * 3, 0)
    }

    /**
     * Creates a range view over the color buffer
     * @param start start index
     * @param length length of the range
     * @returns a view of the color buffer
     */
    view(start: number, length?: number): PixelBuffer {
        const rangeStart = this.start + (start << 0)
        const rangeLength = Math.max(0,
            length === undefined
                ? this.length - start
                : Math.min(length, this.length - start))
        return new PixelBuffer(this.buffer, rangeStart, rangeLength)
    }
}

/**
 * Create a color buffer that allows you to manipulate a range of pixels
 * @param numPixels number of pixels
 */
export function pixelBuffer(numPixels: number) {
    numPixels = numPixels | 0
    const buf = ds.Buffer.alloc(numPixels * 3)
    return new PixelBuffer(buf, 0, numPixels)
}

/**
 * Writes a gradient between the two colors.
 * @param startColor
 * @param endColor
 */
export function fillGradient(
    pixels: PixelBuffer,
    startColor: number,
    endColor: number
): void {
    const start = pixels.start
    const end = pixels.start + pixels.length
    // check if any work needed
    const steps = end - start
    if (steps < 1) return

    pixels.setAt(start, startColor)
    pixels.setAt(end, endColor)
    for (let i = start + 1; i < end - 1; ++i) {
        const alpha = Math.idiv(0xff * i, steps)
        const c = blendRgb(startColor, alpha, endColor)
        pixels.setAt(i, c)
    }
}

/**
 * Renders a bar graph of value (absolute value) on a pixel buffer
 * @param pixels
 * @param value
 * @param high
 * @param options
 * @returns
 */
export function fillBarGraph(
    pixels: PixelBuffer,
    value: number,
    high: number,
    options?: {
        /**
         * Color used when the range is empty
         */
        emptyRangeColor?: number
        /**
         * Color used when the value is 0
         */
        zeroColor?: number
    }
) {
    if (high <= 0) {
        const emptyRangeColor = options?.emptyRangeColor
        pixels.clear()
        pixels.setAt(0, isNaN(emptyRangeColor) ? 0xffff00 : emptyRangeColor)
        return
    }

    value = Math.abs(value)
    const n = pixels.length
    const n1 = n - 1
    let v = Math.idiv(value * n, high)
    if (v === 0) {
        const zeroColor = options?.zeroColor
        pixels.setAt(0, isNaN(zeroColor) ? 0x666600 : zeroColor)
        for (let i = 1; i < n; ++i) pixels.setAt(i, 0)
    } else {
        for (let i = 0; i < n; ++i) {
            if (i <= v) {
                const b = Math.idiv(i * 255, n1)
                pixels.setRgbAt(i, b, 0, 255 - b)
            } else pixels.setRgbAt(i, 0, 0, 0)
        }
    }
}

/**
 * Sets all the color in the buffer to the given color
 * @param c 24bit rgb color
 */
export function fillSolid(pixels: PixelBuffer, c: number) {
    const r = (c >> 16) & 0xff
    const g = (c >> 8) & 0xff
    const b = c & 0xff
    const n = pixels.length
    for (let i = 0; i < n; ++i) {
        pixels.setRgbAt(i, r, g, b)
    }
}

/**
 * Fades each color channels according to the brigthness value between 0 dark and 1 full brightness.
 * @param brightness
 */
export function fillFade(pixels: PixelBuffer, brightness: number) {
    brightness = Math.max(0, Math.min(0xff, (brightness | 0) << 8))

    const s = pixels.start * 3
    const e = (pixels.start + pixels.length) * 3
    const buf = pixels.buffer

    for (let i = s; i < e; ++i) {
        buf[i] = (buf[i] * brightness) >> 8
    }
}

/**
 * Fills the buffer with colors of increasing Hue (or decreasing)
 * @param pixels 
 * @param startHue start hue channel between 0 and 255. eg: 255
 * @param endHue end hue channel between 0 and 255. eg: 255
 * @returns 
 */
export function fillRainbow(pixels: PixelBuffer, startHue = 0, endHue = 0xff) {
    const val = 255;
    const sat = 240;
    const n = pixels.length
    if (!n) return
    const dh = (endHue - startHue) / (n - 1)
    for (let i = 0; i < n; ++i) {
        const hue = startHue + i * dh
        const c = hsv(hue, sat, val)
        pixels.setAt(i, c)
    }
}

/**
 * Applies a inplace gamma correction to the pixel colors
 * @param pixels
 * @param gamma
 */
export function correctGamma(pixels: PixelBuffer, gamma: number = 2.7) {
    const s = pixels.start * 3
    const e = (pixels.start + pixels.length) * 3
    const buf = pixels.buffer

    for (let i = s; i < e; ++i) {
        const c = buf[i]
        let o =
            c === 0
                ? 0
                : c === 0xff
                    ? 0xff
                    : Math.round(Math.pow(c / 255.0, gamma) * 255.0)
        if (c > 0 && o === 0) o = 1
        buf[i] = o
    }
}

/**
 * Fills a pixel buffer with the interpolated colors of a palette.
 * @param interpolator color interpolation function. default is blendRgb
 */
export function fillPalette(pixels: PixelBuffer, palette: Palette, interpolator?: ColorInterpolator) {
    const n = pixels.length
    if (!n) return

    const mixer = interpolator || blendRgb
    for (let i = 0; i < n; ++i) {
        const alpha = i / (n - 1)
        const c = palette.interpolate(alpha, mixer)
        pixels.setAt(i, c)
    }
}

/**
 * Fill a range of LEDs with a sequence of entries from a palette, so that the entire palette smoothly covers the range of LEDs.
 * @param interpolator color interpolation function. default is blendRgb
 */
export function fillPaletteCircular(pixels: PixelBuffer, palette: Palette, interpolator?: ColorInterpolator) {
    const n = pixels.length
    if (!n) return

    const mixer = interpolator || blendRgb
    const n2 = n >> 1
    let c: number
    for (let i = 0; i < n2; ++i) {
        const alpha = 2 * i / (n - 1)
        const c = palette.interpolate(alpha, mixer)
        pixels.setAt(i, c)
        pixels.setAt(n - 1 - i, c)
    }
    if (n % 2 === 1)
        pixels.setAt(n2, c)
}
