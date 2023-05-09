// This file contains implementation for actions/registers marked `client` in the spec,
// as well as additional functionality on different service clients (Roles)

import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface Led {
        /**
         * Allocates a buffer of size `numPixels * 3` to write RGB values to.
         */
        allocateBuffer(): Promise<Buffer>

        /**
         * Sets all the pixels to the given RGB color.
         * @param rgb 24bit color number
         */
        setAll(rgb: number): Promise<void>
    }
}

ds.Led.prototype.allocateBuffer = async function() {
    const len = await this.numPixels.read()
    const buflen = len * 3
    const buf = Buffer.alloc(buflen)
    return buf
}

ds.Led.prototype.setAll = async function (rgb) {
    const buf = await this.allocateBuffer()
    const buflen = buf.length
    let idx = 0
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = rgb & 0xff
    while (idx < buflen) {
        buf.setAt(idx, "u8", r)
        buf.setAt(idx + 1, "u8", g)
        buf.setAt(idx + 2, "u8", b)
        idx = idx + 3
    }
    await this.pixels.write(buf)
}
