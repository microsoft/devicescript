import * as ds from "@devicescript/core"
import { PixelBuffer, fillSolid, pixelBuffer } from "./pixelbuffer"

interface LedWithBuffer {
    _buffer: PixelBuffer
}

declare module "@devicescript/core" {
    interface Led {
        /**
         * Gets the pixel buffer to perform coloring operations.
         * Call `show` to send the buffer to the LED strip.
         */
        buffer(): Promise<PixelBuffer>

        /**
         * Sends the pixel buffer to the LED driver
         */
        show(): Promise<void>

        /**
         * Sets all pixel color to the given color and renders the buffer
         */
        showAll(c: number): Promise<void>
    }
}

ds.Led.prototype.buffer = async function () {
    let b = (this as any as LedWithBuffer)._buffer
    if (!b) {
        const n = await this.numPixels.read();
        ; (this as any as LedWithBuffer)._buffer = b = pixelBuffer(n)
    }
    return b
}

ds.Led.prototype.show = async function () {
    const b = (this as any as LedWithBuffer)._buffer
    if (b && b.length <= 64) await this.pixels.write(b.buffer)
}

ds.Led.prototype.showAll = async function (c: number) {
    const b = await this.buffer()
    fillSolid(b, c)
    await this.show()
}
