import * as ds from "@devicescript/core"

/**
 * Well known colors
 */
export const enum Colors {
    Red = 0xff0000,
    Orange = 0xff7f00,
    Yellow = 0xffff00,
    Green = 0x00ff00,
    Blue = 0x0000ff,
    Indigo = 0x4b0082,
    Violet = 0x8a2be2,
    Purple = 0xa033e5,
    Pink = 0xff007f,
    White = 0xffffff,
    Black = 0x000000,
}

/**
 * Well known color hues
 */
export const enum ColorHues {
    Red = 0,
    Orange = 29,
    Yellow = 43,
    Green = 86,
    Aqua = 125,
    Blue = 170,
    Purple = 191,
    Magenta = 213,
    Pink = 234,
}

/**
 * Encodes an RGB color into a 24bit color number.
 * @param r byte red
 * @param g byte green
 * @param b byte blue
 * @returns 24 bit color number
 */
export function rgb(r: number, g: number, b: number) {
    return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff)
}

/**
 * Convert an HSV (hue, saturation, value) color to RGB
 * @param hue value of the hue channel between 0 and 255. eg: 255
 * @param sat value of the saturation channel between 0 and 255. eg: 255
 * @param val value of the value channel between 0 and 255. eg: 255
 */
export function hsv(hue: number, sat: number = 255, val: number = 255): number {
    let h = hue % 255 >> 0
    if (h < 0) h += 255
    // scale down to 0..192
    h = ((h * 192) / 255) >> 0

    //reference: based on FastLED's hsv2rgb rainbow algorithm [https://github.com/FastLED/FastLED](MIT)
    const invsat = 255 - sat
    const brightness_floor = ((val * invsat) / 255) >> 0
    const color_amplitude = val - brightness_floor
    const section = (h / 0x40) >> 0 // [0..2]
    const offset = h % 0x40 >> 0 // [0..63]

    const rampup = offset
    const rampdown = 0x40 - 1 - offset

    const rampup_amp_adj = ((rampup * color_amplitude) / (255 / 4)) >> 0
    const rampdown_amp_adj = ((rampdown * color_amplitude) / (255 / 4)) >> 0

    const rampup_adj_with_floor = rampup_amp_adj + brightness_floor
    const rampdown_adj_with_floor = rampdown_amp_adj + brightness_floor

    let r: number
    let g: number
    let b: number
    if (section) {
        if (section === 1) {
            // section 1: 0x40..0x7F
            r = brightness_floor
            g = rampdown_adj_with_floor
            b = rampup_adj_with_floor
        } else {
            // section 2; 0x80..0xBF
            r = rampup_adj_with_floor
            g = brightness_floor
            b = rampdown_adj_with_floor
        }
    } else {
        // section 0: 0x00..0x3F
        r = rampdown_adj_with_floor
        g = rampup_adj_with_floor
        b = brightness_floor
    }
    return rgb(r, g, b)
}

/**
 * Fade the color by the brightness
 * @param color color to fade
 * @param brightness the amount of brightness to apply to the color between 0 and 1.
 */
export function fade(color: number, brightness: number): number {
    brightness = Math.max(0, Math.min(0xff, brightness * 0xff))
    if (brightness < 0xff) {
        let red = (color >> 16) & 0xff
        let green = (color >> 8) & 0xff
        let blue = color & 0xff

        red = (red * brightness) >> 8
        green = (green * brightness) >> 8
        blue = (blue * brightness) >> 8

        color = rgb(red, green, blue)
    }
    return color
}

function unpackR(rgb: number): number {
    return (rgb >> 16) & 0xff
}
function unpackG(rgb: number): number {
    return (rgb >> 8) & 0xff
}
function unpackB(rgb: number): number {
    return (rgb >> 0) & 0xff
}

export function blend(color: number, alpha: number, otherColor: number) {
    alpha = Math.max(0, Math.min(0xff, alpha | 0))
    const malpha = 0xff - alpha
    const r = (unpackR(color) * malpha + unpackR(otherColor) * alpha) >> 8
    const g = (unpackG(color) * malpha + unpackG(otherColor) * alpha) >> 8
    const b = (unpackB(color) * malpha + unpackB(otherColor) * alpha) >> 8
    return rgb(r, g, b)
}

/**
 * A buffer of RGB colors
 */
export class PixelBuffer {
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
    setColor(pixeloffset: number, color: number) {
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
    getColor(pixeloffset: number): number {
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
    range(start: number, length?: number): PixelBuffer {
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
    numPixels = numPixels << 0
    const buf = ds.Buffer.alloc(numPixels * 3)
    return new PixelBuffer(buf, 0, numPixels)
}

declare module "@devicescript/core" {
    interface Led {
        /**
         * Allocates a pixel buffer for the LED string.
         */
        allocateBuffer(): Promise<PixelBuffer>

        /**
         * Writes the pixels to the LED client
         * @param led LED client
         */
        write(pixels: PixelBuffer): Promise<void>
    }
}

ds.Led.prototype.allocateBuffer = async function () {
    const numPixels = await this.numPixels.read()
    return pixelBuffer(numPixels)
}

ds.Led.prototype.write = async function (pixels: PixelBuffer) {
    if (!pixels) return
    await this.pixels.write(pixels.buffer)
}
