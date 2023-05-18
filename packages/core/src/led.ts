// This file contains implementation for actions/registers marked `client` in the spec,
// as well as additional functionality on different service clients (Roles)

import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface Led {
        /**
         * Sets all the pixels to the given RGB color.
         * @param rgb 24bit color number
         */
        setAll(rgb: number): Promise<void>

        /**
         * Sets the brightness between 0 (off) and 1 (full).
         * @param brightness
         */
        setBrightness(brightness: number): Promise<void>

        /**
         * Turns off the LEDs.
         */
        off(): Promise<void>
    }
}

ds.Led.prototype.setAll = async function (rgb) {
    const len = await this.numPixels.read()
    const buflen = len * 3
    const buf = Buffer.alloc(buflen)

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

ds.Led.prototype.setBrightness = async function (brightness) {
    await this.intensity.write(brightness)
}

ds.Led.prototype.off = async function () {
    const len = await this.numPixels.read()
    const buflen = len * 3
    const buf = Buffer.alloc(buflen)
    await this.pixels.write(buf)
}
