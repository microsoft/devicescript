import { PixelBuffer } from "./pixelbuffer"

/**
 * A 2D matrix of LED pixels
 */
export class PixelMatrix {
    /**
     * Number of pixels
     */
    readonly length: number
    /**
     * Height of matrix
     */
    readonly height: number

    constructor(
        /**
         * The underlying pixel buffer
         */
        readonly buffer: PixelBuffer,
        /**
         * Width of matrix
         */
        readonly width: number
    ) {
        this.length = buffer.length
        this.height = (this.length / this.width) | 0
        if (this.length !== this.width * this.height)
            throw new RangeError("Invalid buffer size")
    }

    /**
     * Sets the color of the pixel at the specified coordinates.
     * If the coordinates are out of bounds, the method does nothing.
     * @param x - The x-coordinate of the pixel.
     * @param y - The y-coordinate of the pixel.
     * @param color - The 24bit RGB color to set the pixel to.
     */
    setAt(x: number, y: number, color: number) {
        if (x < 0) x += this.width
        if (y < 0) y += this.height
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return

        this.buffer.setAt(y * this.width + x, color)
    }

    /**
     * Returns the value at the specified coordinates in the pixel matrix buffer.
     * @param x The x-coordinate of the pixel to retrieve.
     * @param y The y-coordinate of the pixel to retrieve.
     * @returns The 24bit RGB color of the pixel at the specified coordinates.
     */
    at(x: number, y: number) {
        return this.buffer.at(y * this.width + x)
    }
}
