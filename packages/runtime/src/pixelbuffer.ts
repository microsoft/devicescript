import * as ds from "@devicescript/core"
import { blendRgb, hsv, rgb } from "./colors"

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
     * Create a color buffer that allows you to manipulate a range of pixels
     * @param numPixels number of pixels
     */
    static alloc(numPixels: number): PixelBuffer {
        if (numPixels <= 0) throw new RangeError("invalid number of pixels")
        numPixels = numPixels | 0
        const buf = ds.Buffer.alloc(numPixels * 3)
        return new PixelBuffer(buf, 0, numPixels)
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
        const rangeLength = Math.max(
            0,
            length === undefined
                ? this.length - start
                : Math.min(length, this.length - start)
        )
        return new PixelBuffer(this.buffer, rangeStart, rangeLength)
    }

    /**
     * Applies a inplace gamma correction to the pixel colors
     * @param pixels
     * @param gamma
     */
    correctGamma(gamma: number = 2.7) {
        const s = this.start * 3
        const e = (this.start + this.length) * 3
        const buf = this.buffer

        for (let i = s; i < e; ++i) {
            const c = buf[i]
            const o = correctGammaChannel(c, gamma)
            buf[i] = o
        }
    }

    /**
     * Rotates in place the colors by the given shift amount
     * @param shift
     */
    rotate(shift: number) {
        shift = shift | 0
        this.buffer.rotate(
            shift * 3,
            this.start * 3,
            (this.start + this.length) * 3
        )
    }
}

/**
 * Writes a gradient between the two colors.
 * @param startColor
 * @param endColor
 */
export function fillGradient(
    pixels: PixelBuffer,
    startColor: number,
    endColor: number,
    options?: {
        reversed?: boolean
        circular?: boolean
    }
): void {
    const render = (alpha: number) => blendRgb(startColor, alpha, endColor)
    fillMap(pixels, render, options)
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
 * @param alpha
 */
export function fillFade(pixels: PixelBuffer, alpha: number) {
    alpha = Math.constrain(alpha * 0xff, 0, 0xff)

    const s = pixels.start * 3
    const e = (pixels.start + pixels.length) * 3
    const buf = pixels.buffer

    for (let i = s; i < e; ++i) {
        buf[i] = (buf[i] * alpha) >> 8
    }
}

/**
 * Fills the buffer with colors of increasing Hue (or decreasing)
 * @param pixels
 * @param startHue start hue channel between 0 and 255. eg: 255
 * @param endHue end hue channel between 0 and 255. eg: 255
 * @returns
 */
export function fillRainbow(
    pixels: PixelBuffer,
    options?: {
        startHue?: number
        endHue?: number
        reversed?: boolean
        circular?: boolean
        saturation?: number
        brightness?: number
    }
) {
    let { startHue, endHue, saturation, brightness } = options || {}
    startHue = startHue ?? 0
    endHue = endHue ?? 255
    saturation = saturation ?? 240
    brightness = brightness ?? 255
    const dh = endHue - startHue
    const render = (alpha: number) =>
        hsv(startHue + alpha * dh, saturation, brightness)
    fillMap(pixels, render, options)
}

/**
 * Applies a gamma correction to a single color channel ([0,0xff])
 * @param c
 * @param gamma
 * @returns
 */
export function correctGammaChannel(c: number, gamma: number) {
    let o =
        c <= 0
            ? 0
            : c >= 0xff
            ? 0xff
            : Math.round(Math.pow(c / 255.0, gamma) * 255.0)
    if (c > 0 && o === 0) o = 1
    return 0
}

/**
 * General purpose helper to create a color fill function.
 * @param pixels
 * @param render
 * @param options
 * @internal
 * @returns
 */
export function fillMap(
    pixels: PixelBuffer,
    render: (alpha: number) => number,
    options?: { reversed?: boolean; circular?: boolean }
) {
    if (!pixels.length) return
    if (options?.circular) fillCircular(pixels, render, options)
    else fillLinear(pixels, render, options)
}

function fillLinear(
    pixels: PixelBuffer,
    render: (alpha: number) => number,
    options?: { reversed?: boolean }
) {
    const n = pixels.length
    const { reversed } = options || {}
    for (let i = 0; i < n; ++i) {
        let alpha = i / (n - 1)
        if (i === n - 1) alpha = 1
        if (reversed) alpha = 1 - alpha
        const c = render(alpha)
        pixels.setAt(i, c)
    }
}

function fillCircular(
    pixels: PixelBuffer,
    render: (alpha: number) => number,
    options?: { reversed?: boolean }
) {
    const n = pixels.length
    const n2 = n >> 1
    const { reversed } = options || {}
    let c: number
    for (let i = 0; i < n2; ++i) {
        let alpha = (2 * i) / (n - 1)
        if (reversed) alpha = 1 - alpha
        const c = render(alpha)
        pixels.setAt(i, c)
        pixels.setAt(n - 1 - i, c)
    }
    if (n % 2 === 1) pixels.setAt(n2, c)
}
