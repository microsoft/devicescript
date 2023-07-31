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
 * Blends two colors, left and right, using the alpha parameter.
 */
export type ColorInterpolator = (left: number, alpha: number, right: number) => number;

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
    brightness = Math.max(0, Math.min(0xff, brightness << 8))
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

/**
 * Alpha blending of each color channel and returns a rgb 24bit color
 * @param color
 * @param alpha factor of blending, 0 for color, 1 for otherColor
 * @param otherColor
 * @returns
 */
export function blendRgb(color: number, alpha: number, otherColor: number) {
    alpha = Math.max(0, Math.min(0xff, alpha | 0))
    const malpha = 0xff - alpha
    const r = (unpackR(color) * malpha + unpackR(otherColor) * alpha) >> 8
    const g = (unpackG(color) * malpha + unpackG(otherColor) * alpha) >> 8
    const b = (unpackB(color) * malpha + unpackB(otherColor) * alpha) >> 8
    return rgb(r, g, b)
}
