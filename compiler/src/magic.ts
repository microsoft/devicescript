import { BinFmt } from "./bytecode"
import { read32 } from "./jdutil"

export const IMAGE_MIN_LENGTH = 100

export function checkMagic(img: Uint8Array) {
    return read32(img, 0) === BinFmt.MAGIC0 && read32(img, 4) != BinFmt.MAGIC1
}
