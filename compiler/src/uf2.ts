import {
    arrayConcatMany,
    bufferConcatMany,
    fromUTF8,
    memcpy,
    stringToBuffer,
    uint8ArrayToString,
} from "./jdutil"

export const UF2_MAGIC_START0 = 0x0a324655 // "UF2\n"
export const UF2_MAGIC_START1 = 0x9e5d5157 // Randomly selected
export const UF2_MAGIC_END = 0x0ab16f30 // Ditto

export const UF2_FLAG_NONE = 0x00000000
export const UF2_FLAG_NOFLASH = 0x00000001
export const UF2_FLAG_FILE = 0x00001000
export const UF2_FLAG_FAMILY_ID_PRESENT = 0x00002000

export interface UF2Block {
    flags: number
    targetAddr: number
    payloadSize: number
    blockNo: number
    numBlocks: number
    fileSize: number
    familyId: number
    filename?: string
    data: Uint8Array
    origData?: Uint8Array
}

function parseUF2Block(block: Uint8Array): UF2Block {
    let wordAt = (k: number) => {
        return (
            (block[k] +
                (block[k + 1] << 8) +
                (block[k + 2] << 16) +
                (block[k + 3] << 24)) >>>
            0
        )
    }
    if (
        !block ||
        block.length != 512 ||
        wordAt(0) != UF2_MAGIC_START0 ||
        wordAt(4) != UF2_MAGIC_START1 ||
        wordAt(block.length - 4) != UF2_MAGIC_END
    )
        return null
    let flags = wordAt(8)
    let payloadSize = wordAt(16)
    if (payloadSize > 476) payloadSize = 256
    let filename: string = null
    let familyId = 0
    let fileSize = 0
    if (flags & UF2_FLAG_FILE) {
        let fnbuf = block.slice(32 + payloadSize)
        let len = fnbuf.indexOf(0)
        if (len >= 0) {
            fnbuf = fnbuf.slice(0, len)
        }
        filename = fromUTF8(uint8ArrayToString(fnbuf))
        fileSize = wordAt(28)
    }

    if (flags & UF2_FLAG_FAMILY_ID_PRESENT) {
        familyId = wordAt(28)
    }

    return {
        flags,
        targetAddr: wordAt(12),
        payloadSize,
        blockNo: wordAt(20),
        numBlocks: wordAt(24),
        fileSize,
        familyId,
        data: block.slice(32, 32 + payloadSize),
        filename,
        origData: block,
    }
}

export function parseUF2File(blocks: Uint8Array) {
    let r: UF2Block[] = []
    for (let i = 0; i < blocks.length; i += 512) {
        let b = parseUF2Block(blocks.slice(i, i + 512))
        if (b) r.push(b)
    }
    return r
}

export interface ShiftedBuffer {
    start: number
    buf: Uint8Array
}

export function uf2ToBin(
    blocks: Uint8Array,
    endAddr: number = undefined
): ShiftedBuffer {
    if (blocks.length < 512) return null
    let curraddr = -1
    let appstartaddr = -1
    let bufs: Uint8Array[] = []
    for (let i = 0; i < blocks.length; ++i) {
        let ptr = i * 512
        let bl = parseUF2Block(blocks.slice(ptr, ptr + 512))
        if (!bl) continue
        if (endAddr && bl.targetAddr + 256 > endAddr) break
        if (curraddr == -1) {
            curraddr = bl.targetAddr
            appstartaddr = curraddr
        }
        let padding = bl.targetAddr - curraddr
        if (padding < 0 || padding % 4 || padding > 1024 * 1024) continue
        if (padding > 0) bufs.push(new Uint8Array(padding))
        bufs.push(blocks.slice(ptr + 32, ptr + 32 + bl.payloadSize))
        curraddr = bl.targetAddr + bl.payloadSize
    }
    let len = 0
    for (let b of bufs) len += b.length
    if (len == 0) return null
    let r = new Uint8Array(len)
    let dst = 0
    for (let b of bufs) {
        for (let i = 0; i < b.length; ++i) r[dst++] = b[i]
    }
    return {
        buf: r,
        start: appstartaddr,
    }
}

function hasAddr(b: UF2Block, a: number) {
    if (!b) return false
    return b.targetAddr <= a && a < b.targetAddr + b.payloadSize
}

export function readBytesFromUF2(
    blocks: UF2Block[],
    addr: number,
    length: number
) {
    let res = new Uint8Array(length)
    let bl: UF2Block
    for (let i = 0; i < length; ++i, ++addr) {
        if (!hasAddr(bl, addr)) bl = blocks.filter(b => hasAddr(b, addr))[0]
        if (bl) res[i] = bl.data[addr - bl.targetAddr]
    }
    return res
}

function setWord(block: Uint8Array, ptr: number, v: number) {
    block[ptr] = v & 0xff
    block[ptr + 1] = (v >> 8) & 0xff
    block[ptr + 2] = (v >> 16) & 0xff
    block[ptr + 3] = (v >> 24) & 0xff
}

export class UF2File {
    currBlock: Uint8Array = null
    currPtr = -1
    blocks: Uint8Array[] = []
    ptrs: number[] = []
    filename: string
    filesize = 0
    familyId = 0

    constructor(familyId?: string | number) {
        this.familyId =
            typeof familyId == "string" ? parseInt(familyId) : familyId
    }

    static concat(fs: UF2File[]) {
        for (let f of fs) {
            f.finalize()
            f.filename = null
        }
        let r = new UF2File()
        r.blocks = arrayConcatMany(fs.map(f => f.blocks))
        for (let f of fs) {
            f.blocks = []
        }
        return r
    }

    static isUF2(uf2: Uint8Array) {
        return parseUF2Block(uf2.slice(0, 512)) != null
    }

    static fromFile(uf2: Uint8Array) {
        const blocks = parseUF2File(uf2)
        const r = new UF2File(blocks[0].familyId)
        r.blocks = blocks.map(b => new Uint8Array(b.origData))
        r.ptrs = blocks.map(b => b.targetAddr >> 8)
        r.filename = blocks[0].filename
        return r
    }

    finalize() {
        for (let i = 0; i < this.blocks.length; ++i) {
            setWord(this.blocks[i], 20, i)
            setWord(this.blocks[i], 24, this.blocks.length)
            if (this.filename) setWord(this.blocks[i], 28, this.filesize)
        }
    }

    serialize() {
        this.finalize()
        return bufferConcatMany(this.blocks)
    }

    readBytes(addr: number, length: number): Uint8Array {
        //console.log(`read @${addr} len=${length}`)
        let needAddr = addr >> 8
        let bl: Uint8Array
        if (needAddr == this.currPtr) bl = this.currBlock
        else {
            for (let i = 0; i < this.ptrs.length; ++i) {
                if (this.ptrs[i] == needAddr) {
                    bl = this.blocks[i]
                    break
                }
            }
            if (bl) {
                this.currPtr = needAddr
                this.currBlock = bl
            }
        }
        if (!bl) return null
        let res = new Uint8Array(length)
        let toRead = Math.min(length, 256 - (addr & 0xff))
        memcpy(res, 0, bl, (addr & 0xff) + 32, toRead)
        let leftOver = length - toRead
        if (leftOver > 0) {
            let le = this.readBytes(addr + toRead, leftOver)
            memcpy(res, toRead, le)
        }
        return res
    }

    writeBytes(addr: number, bytes: ArrayLike<number>, flags = 0) {
        let currBlock = this.currBlock
        let needAddr = addr >> 8

        // account for unaligned writes
        let thisChunk = 256 - (addr & 0xff)
        if (bytes.length > thisChunk) {
            let b = new Uint8Array(bytes)
            this.writeBytes(addr, b.slice(0, thisChunk))
            while (thisChunk < bytes.length) {
                let nextOff = Math.min(thisChunk + 256, bytes.length)
                this.writeBytes(addr + thisChunk, b.slice(thisChunk, nextOff))
                thisChunk = nextOff
            }
            return
        }

        if (needAddr != this.currPtr) {
            let i = 0
            currBlock = null
            for (let i = 0; i < this.ptrs.length; ++i) {
                if (this.ptrs[i] == needAddr) {
                    currBlock = this.blocks[i]
                    break
                }
            }
            if (!currBlock) {
                currBlock = new Uint8Array(512)
                if (this.filename) flags |= UF2_FLAG_FILE
                else if (this.familyId) flags |= UF2_FLAG_FAMILY_ID_PRESENT
                setWord(currBlock, 0, UF2_MAGIC_START0)
                setWord(currBlock, 4, UF2_MAGIC_START1)
                setWord(currBlock, 8, flags)
                setWord(currBlock, 12, needAddr << 8)
                setWord(currBlock, 16, 256)
                setWord(currBlock, 20, this.blocks.length)
                setWord(currBlock, 28, this.familyId)
                setWord(currBlock, 512 - 4, UF2_MAGIC_END)
                // if bytes are not written, leave them at erase value
                for (let i = 32; i < 32 + 256; ++i) currBlock[i] = 0xff
                if (this.filename) {
                    memcpy(currBlock, 32 + 256, stringToBuffer(this.filename))
                }
                this.blocks.push(currBlock)
                this.ptrs.push(needAddr)
            }
            this.currPtr = needAddr
            this.currBlock = currBlock
        }
        let p = (addr & 0xff) + 32
        for (let i = 0; i < bytes.length; ++i) currBlock[p + i] = bytes[i]
        this.filesize = Math.max(this.filesize, bytes.length + addr)
    }

    writeHex(hex: string[]) {
        let upperAddr = "0000"

        for (let i = 0; i < hex.length; ++i) {
            let m = /:02000004(....)/.exec(hex[i])
            if (m) {
                upperAddr = m[1]
            }
            m = /^:..(....)00(.*)[0-9A-F][0-9A-F]$/.exec(hex[i])
            if (m) {
                let newAddr = parseInt(upperAddr + m[1], 16)
                let hh = m[2]
                let arr: number[] = []
                for (let j = 0; j < hh.length; j += 2) {
                    arr.push(parseInt(hh[j] + hh[j + 1], 16))
                }
                this.writeBytes(newAddr, arr)
            }
        }
    }
}
