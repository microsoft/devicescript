import * as ds from "@devicescript/core"
import { blend, rgb } from "./colors"

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
    setColor(pixeloffset: number, color: number) {
        pixeloffset = pixeloffset | 0
        while (pixeloffset < 0) pixeloffset += this.length
        const i = this.start + (pixeloffset << 0)
        if (i < this.start || i >= this.start + this.length) return
        const bi = i * 3
        this.buffer[bi] = (color >> 16) & 0xff
        this.buffer[bi + 1] = (color >> 8) & 0xff
        this.buffer[bi + 2] = color & 0xff
    }

    /**
     * Reads the pixel color at the given offsret
     * @param pixeloffset pixel offset. if negative starts from the end
     * @returns
     */
    getColor(pixeloffset: number): number {
        pixeloffset = pixeloffset | 0
        while (pixeloffset < 0) pixeloffset += this.length
        const i = this.start + (pixeloffset << 0)
        if (i < this.start || i >= this.start + this.length) return undefined
        const bi = i * 3
        const r = this.buffer[bi]
        const g = this.buffer[bi + 1]
        const b = this.buffer[bi + 2]
        return rgb(r, g, b)
    }

    /**
     * Renders a bar graph on the LEDs
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
            this.setColor(
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
            this.setColor(0, isNaN(zeroColor) ? 0x666600 : zeroColor)
            for (let i = 1; i < n; ++i) this.setColor(i, 0)
        } else {
            for (let i = 0; i < n; ++i) {
                if (i <= v) {
                    const b = Math.idiv(i * 255, n1)
                    this.setColor(i, rgb(b, 0, 255 - b))
                } else this.setColor(i, 0)
            }
        }
    }

    /**
     * Writes a gradient between the two colors.
     * @param startColor
     * @param endColor
     */
    setGradient(
        startColor: number,
        endColor: number,
        start?: number,
        end?: number
    ): void {
        // normalize range
        if (start < 0) start += this.length
        start = start || 0
        if (end < 0) end += this.length
        end = end === undefined ? this.length - 1 : end
        // check if any work needed
        const steps = end - start
        if (steps < 1) return

        this.setColor(start, startColor)
        this.setColor(end, endColor)
        for (let i = start + 1; i < end - 1; ++i) {
            const alpha = Math.idiv(0xff * i, steps)
            const c = blend(startColor, alpha, endColor)
            this.setColor(i, c)
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
    view(start: number, length?: number): PixelBuffer {
        const rangeStart = this.start + (start << 0)
        const rangeLength =
            length === undefined
                ? this.length - start
                : Math.min(length, this.length - start)
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
