import { BinFmt } from "./bytecode"

export const IMAGE_MIN_LENGTH = 100

function read32(buf: Uint8Array, pos: number) {
    return (
        (buf[pos] |
            (buf[pos + 1] << 8) |
            (buf[pos + 2] << 16) |
            (buf[pos + 3] << 24)) >>>
        0
    )
}


export function checkMagic(img: Uint8Array) {
    return read32(img, 0) === BinFmt.MAGIC0 && read32(img, 4) === BinFmt.MAGIC1
}
