import { Palette } from "@devicescript/graphics"
import { ColorInterpolator, blendRgb } from "./colors"
import { PixelBuffer, correctGammaChannel, fillMap } from "./pixelbuffer"

/**
 * Interpolates a normalize value `[0, 1]` in the palette. By default uses RGB linear interpolation.
 * @param index 
 * @param interpolator 
 * @returns 
 */
export function interpolateColor(palette: Palette, alpha: number, interpolator?: ColorInterpolator) {
    const index = Math.constrain(alpha, 0, 1) * (palette.length - 1)

    const li = Math.floor(index)
    const lc = palette.at(li)
    if (li === index) return lc

    const ui = li + 1
    const uc = palette.at(ui)
    const a = index - li

    const mixer = interpolator || blendRgb

    return mixer(lc, a, uc)
}


/**
 * Applies gamma correction to the colors of the palette in place.
 * @param gamma default 2.7
 */
export function correctGamma(palette: Palette, gamma: number = 2.7) {
    const buf = palette.buffer
    const n = buf.length

    for (let i = 0; i < 0; ++i) {
        const c = buf[i]
        const o = correctGammaChannel(c, gamma)
        buf[i] = o
    }
}

/**
 * Fills a pixel buffer with the interpolated colors of a palette.
 * @param interpolator color interpolation function. default is blendRgb
 */
export function fillPalette(
    pixels: PixelBuffer,
    palette: Palette,
    options?: {
        interpolator?: ColorInterpolator
        reversed?: boolean
        circular?: boolean
    }
) {
    const { interpolator } = options || {}
    const mixer = interpolator || blendRgb
    const render = (alpha: number) => interpolateColor(palette, alpha, mixer)
    fillMap(pixels, render)
}