import * as ds from "@devicescript/core"

export type color = number

/**
 * Represents monochromatic or color 2D image.
 *
 * @ds-native Image
 */
export declare class Image {
    private constructor()

    /**
     * Get the width of the image
     */
    width: number

    /**
     * Get the height of the image
     */
    height: number

    /**
     * Bits-per-pixel, currently 1 or 4.
     */
    bpp: number

    /**
     * Get a pixel color
     */
    get(x: number, y: number): number

    /**
     * Return a copy of the current image
     */
    clone(): Image

    /**
     * Set pixel color
     */
    set(x: number, y: number, c: color): void

    /**
     * Fill entire image with a given color
     */
    fill(c: color): void

    /**
     * Flips (mirrors) pixels horizontally in the current image
     */
    flipX(): void

    /**
     * Flips (mirrors) pixels vertically in the current image
     */
    flipY(): void

    /**
     * Returns a transposed image (with X/Y swapped)
     */
    transposed(): Image

    /**
     * Draw given image on the current image
     */
    drawImage(from: Image, x: number, y: number): void

    /**
     * Draw given image with transparent background on the current image.
     * If `from` is mono, paint it using color `c` (defaults to `1`).
     */
    drawTransparentImage(from: Image, x: number, y: number, c?: color): void

    /**
     * Check if the current image "collides" with another
     */
    overlapsWith(other: Image, x: number, y: number): boolean

    /**
     * Fill a rectangle
     */
    fillRect(x: number, y: number, w: number, h: number, c: color): void

    /**
     * Draw a line
     */
    drawLine(x0: number, y0: number, x1: number, y1: number, c: color): void

    /**
     * Returns true if the provided image is the same as this image,
     * otherwise returns false.
     */
    equals(other: Image): boolean

    /**
     * Fills a circle
     */
    fillCircle(cx: number, cy: number, r: number, c: color): void

    /**
     * Scale and copy a row of pixels from a texture.
     */
    blitRow(
        from: Image,
        dstX: number,
        dstY: number,
        fromX: number,
        fromH: number
    ): void

    /**
     * Copy an image from a source rectangle to a destination rectangle, stretching or
     * compressing to fit the dimensions of the destination rectangle, if necessary.
     */
    blit(
        xDst: number,
        yDst: number,
        wDst: number,
        hDst: number,
        src: Image,
        xSrc: number,
        ySrc: number,
        wSrc: number,
        hSrc: number,
        transparent: boolean,
        check: boolean
    ): boolean

    /**
     * Allocate a new image, backed by the buffer is specified (otherwise a new buffer is allocated)
     *
     * @param width in pixels
     * @param height in pixels
     * @param bpp bits per pixel
     * @param init initial contents of the image
     * @param offset byte offset in `init`
     */
    static alloc(
        width: number,
        height: number,
        bpp: 1 | 4,
        init?: Buffer,
        offset?: number
    ): Image

    //
    // Non-native methods
    //

    /**
     * Draw a circle
     */
    drawCircle(cx: number, cy: number, r: number, c: color): void

    /**
     * Draw an empty rectangle
     */
    drawRect(x: number, y: number, w: number, h: number, c: color): void

    /**
     * Returns an image rotated by -90, 0, 90, 180, 270 deg clockwise
     */
    rotated(deg: number): Image
}

Image.prototype.drawCircle = function (
    cx: number,
    cy: number,
    r: number,
    c: color
): void {
    cx = cx | 0
    cy = cy | 0
    r = r | 0
    // short cuts
    if (r < 0) return

    // Bresenham's algorithm
    let x = 0
    let y = r
    let d = 3 - 2 * r

    while (y >= x) {
        this.set(cx + x, cy + y, c)
        this.set(cx - x, cy + y, c)
        this.set(cx + x, cy - y, c)
        this.set(cx - x, cy - y, c)
        this.set(cx + y, cy + x, c)
        this.set(cx - y, cy + x, c)
        this.set(cx + y, cy - x, c)
        this.set(cx - y, cy - x, c)
        x++
        if (d > 0) {
            y--
            d += 4 * (x - y) + 10
        } else {
            d += 4 * x + 6
        }
    }
}

Image.prototype.drawRect = function (
    x: number,
    y: number,
    w: number,
    h: number,
    c: color
): void {
    if (w === 0 || h === 0) return
    w--
    h--
    this.drawLine(x, y, x + w, y, c)
    this.drawLine(x, y, x, y + h, c)
    this.drawLine(x + w, y + h, x + w, y, c)
    this.drawLine(x + w, y + h, x, y + h, c)
}

Image.prototype.rotated = function (deg: number): Image {
    if (deg === -90 || deg === 270) {
        let r = this.transposed()
        r.flipY()
        return r
    } else if (deg === 180 || deg === -180) {
        let r = this.clone()
        r.flipX()
        r.flipY()
        return r
    } else if (deg === 90) {
        let r = this.transposed()
        r.flipX()
        return r
    } else {
        return null
    }
}

/**
 * Make an Image object from ASCII art
 * @ds-native
 */
export function img(lits: any, ...args: any[]): Image {
    return null
}

