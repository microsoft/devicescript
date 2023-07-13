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

        /**
         * Reads an unsigned, low-endian 16-bit integer at the specified offset.
         */
        readUInt16LE(offset: number): number

        /**
         * Reads an unsigned, big-endian 16-bit integer at the specified offset.
         */
        readUInt16BE(offset: number): number

        /**
         * Reads an unsigned, low-endian 32-bit integer at the specified offset.
         */
        readUInt32LE(offset: number): number

        /**
         * Reads an unsigned, big-endian 32-bit integer at the specified offset.
         */
        readUInt32BE(offset: number): number
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

ds.Buffer.prototype.readUInt16LE = function readUInt16LE(offset: number) {
    return this.getAt(offset, "u16")
}

ds.Buffer.prototype.readUInt16BE = function readUInt16BE(offset: number) {
    if (offset < 0 || offset + 2 > this.length) return 0
    return (this[offset] << 8) | this[offset + 1]
}

ds.Buffer.prototype.readUInt32LE = function readUInt32LE(offset: number) {
    return this.getAt(offset, "u32")
}

ds.Buffer.prototype.readUInt32BE = function readUInt32BE(offset: number) {
    if (offset < 0 || offset + 4 > this.length) return 0
    return (
        (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        this[offset + 3]
    )
}
