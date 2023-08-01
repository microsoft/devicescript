import { Palette } from "@devicescript/graphics"
import { interpolateColor } from "./palette"
import { PixelBuffer } from "./pixelbuffer"

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
        /**
         * Palette to interpolate color from
         */
        palette?: Palette
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
    const palette = options?.palette
    let v = Math.idiv(value * n, high)
    if (v === 0) {
        const zeroColor = options?.zeroColor
        pixels.setAt(0, isNaN(zeroColor) ? 0x666600 : zeroColor)
        for (let i = 1; i < n; ++i) pixels.setAt(i, 0)
    } else {
        for (let i = 0; i < n; ++i) {
            if (i <= v) {
                if (palette) {
                    const c = interpolateColor(palette, i / (n - 1))
                    pixels.setAt(i, c)
                } else {
                    const b = Math.idiv(i * 255, n1)
                    pixels.setRgbAt(i, b, 0, 255 - b)
                }
            } else pixels.setRgbAt(i, 0, 0, 0)
        }
    }
}
