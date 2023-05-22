import * as ds from "@devicescript/core"

/*
StaticImage type for img`...`
ds.native() as method body - check in compiler

is the view interesting?
staticimage contains size I guess


*/

type DsGraphics = typeof ds & {
    spiConfigure(
        miso: number,
        mosi: number,
        sck: number,
        mode: number,
        hz: number
    ): void
    spiXfer(tx: Buffer, rx: Buffer): Promise<void>
}

export type color = number

export declare class ImageBase {
    protected constructor()

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
     * Sets all pixels in the current image from the other image, which has to be of the same size and
     * bpp.
     */
    copyFrom(from: Image): void

    /**
     * Set pixel color
     */
    setPixel(x: number, y: number, c: color): void

    /**
     * Get a pixel color
     */
    getPixel(x: number, y: number): number

    /**
     * Fill entire image with a given color
     */
    fill(c: color): void

    /**
     * Return a copy of the current image
     */
    clone(): Image

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
     * Every pixel in image is moved by (dx,dy)
     */
    scroll(dx: number, dy: number): void

    /**
     * Stretches the image horizontally by 100%
     */
    doubledX(): Image

    /**
     * Stretches the image vertically by 100%
     */
    doubledY(): Image

    /**
     * Replaces one color in an image with another
     */
    replace(from: number, to: number): void

    /**
     * Stretches the image in both directions by 100%
     */
    doubled(): Image

    /**
     * Draw given image on the current image
     */
    drawImage(from: Image, x: number, y: number): void

    /**
     * Draw given image with transparent background on the current image
     */
    drawTransparentImage(from: Image, x: number, y: number): void

    /**
     * Check if the current image "collides" with another
     */
    overlapsWith(other: Image, x: number, y: number): boolean

    /**
     * Fill a rectangle
     */
    fillRect(x: number, y: number, w: number, h: number, c: color): void

    /**
     * Replace colors in a rectangle
     */
    mapRect(x: number, y: number, w: number, h: number, colorMap: Buffer): void

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
     * Returns true if the image cannot be modified.
     */
    isReadOnly(): boolean

    /**
     * Draw an icon (monochromatic image) using given color
     */
    drawIcon(icon: Buffer, x: number, y: number, c: color): void

    /**
     * Fills a circle
     */
    fillCircle(cx: number, cy: number, r: number, c: color): void

    /**
     * Scale and copy a row of pixels from a texture.
     */
    blitRow(
        dstX: number,
        dstY: number,
        from: Image,
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
}

export class Image extends ImageBase {
    private constructor() {
        super()
    }

    /**
     * Allocate a new image, with the initial contents from the buffer,
     * or filled with color 0 when buffer is not provided.
     *
     * @param width in pixels
     * @param height in pixels
     * @param bpp bits per pixel
     * @param init initial contents of the image
     * @param offset byte offset in `init`
     * @param stride how many bytes each row in `init` has
     */
    static alloc(
        width: number,
        height: number,
        bpp: 1 | 4,
        init?: Buffer,
        offset?: number,
        stride?: number
    ): Image {
        return null
    }

    /**
     * Draw a circle
     */
    drawCircle(cx: number, cy: number, r: number, c: color): void {
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
            this.setPixel(cx + x, cy + y, c)
            this.setPixel(cx - x, cy + y, c)
            this.setPixel(cx + x, cy - y, c)
            this.setPixel(cx - x, cy - y, c)
            this.setPixel(cx + y, cy + x, c)
            this.setPixel(cx - y, cy + x, c)
            this.setPixel(cx + y, cy - x, c)
            this.setPixel(cx - y, cy - x, c)
            x++
            if (d > 0) {
                y--
                d += 4 * (x - y) + 10
            } else {
                d += 4 * x + 6
            }
        }
    }

    /**
     * Draw an empty rectangle
     */
    drawRect(x: number, y: number, w: number, h: number, c: color): void {
        if (w == 0 || h == 0) return
        w--
        h--
        this.drawLine(x, y, x + w, y, c)
        this.drawLine(x, y, x, y + h, c)
        this.drawLine(x + w, y + h, x + w, y, c)
        this.drawLine(x + w, y + h, x, y + h, c)
    }

    /**
     * Returns an image rotated by -90, 0, 90, 180, 270 deg clockwise
     */
    rotated(deg: number): Image {
        if (deg == -90 || deg == 270) {
            let r = this.transposed()
            r.flipY()
            return r
        } else if (deg == 180 || deg == -180) {
            let r = this.clone()
            r.flipX()
            r.flipY()
            return r
        } else if (deg == 90) {
            let r = this.transposed()
            r.flipX()
            return r
        } else {
            return null
        }
    }
}
