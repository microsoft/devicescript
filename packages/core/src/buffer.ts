import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface Buffer {
        /**
         * Reads the bit at the given bit index.
         * @param bitindex
         */
        getBit(bitindex: number): boolean
        /**
         * Sets the bit at the given index
         * @param bitindex
         * @param on
         */
        setBit(bitindex: number, on: boolean): void
    }
}

ds.Buffer.prototype.getBit = function getBit(bitindex: number) {
    // find bit to flip
    const byte = this[bitindex >> 3]
    const bit = bitindex % 8
    const on = 1 === ((byte >> bit) & 1)
    return on
}

ds.Buffer.prototype.setBit = function setBit(bitindex: number, on: boolean) {
    const i = bitindex >> 3
    // find bit to flip
    let byte = this[i]
    const bit = bitindex % 8
    // flip bit
    if (on) {
        byte |= 1 << bit
    } else {
        byte &= ~(1 << bit)
    }
    // save
    this[i] = byte
}
