import {
    bufferConcat,
    read16,
    read32,
    write32,
    flatClone,
    sha256,
    toHex,
} from "jacdac-ts"
import { verboseLog } from "./command"

export interface EspSegment {
    addr: number
    isMapped: boolean
    isDROM: boolean
    data: Uint8Array
}

/* layout:
  u8 magic 0xE9
  u8 numsegs
  u8 flash_mode
  u8 flash_size_freq
  u32 entrypoint // 4
  u8 wp_pin // 8
  u8 clk/q drv // 9
  u8 d/cs drv // 10
  u8 hd/wp drv // 11
  u16 chip_id // 12
  */

interface MemSegment {
    from: number
    to: number
    id: string
}

interface ChipDesc {
    name: string
    chipId: number
    memmap: MemSegment[]
}

const chips: ChipDesc[] = [
    {
        name: "esp32",
        chipId: 0,
        memmap: [
            { from: 0x00000000, to: 0x00010000, id: "PADDING" },
            { from: 0x3f400000, to: 0x3f800000, id: "DROM" },
            { from: 0x3f800000, to: 0x3fc00000, id: "EXTRAM_DATA" },
            { from: 0x3ff80000, to: 0x3ff82000, id: "RTC_DRAM" },
            { from: 0x3ff90000, to: 0x40000000, id: "BYTE_ACCESSIBLE" },
            { from: 0x3ffae000, to: 0x40000000, id: "DRAM" },
            { from: 0x3ffe0000, to: 0x3ffffffc, id: "DIRAM_DRAM" },
            { from: 0x40000000, to: 0x40070000, id: "IROM" },
            { from: 0x40070000, to: 0x40078000, id: "CACHE_PRO" },
            { from: 0x40078000, to: 0x40080000, id: "CACHE_APP" },
            { from: 0x40080000, to: 0x400a0000, id: "IRAM" },
            { from: 0x400a0000, to: 0x400bfffc, id: "DIRAM_IRAM" },
            { from: 0x400c0000, to: 0x400c2000, id: "RTC_IRAM" },
            { from: 0x400d0000, to: 0x40400000, id: "IROM" },
            { from: 0x50000000, to: 0x50002000, id: "RTC_DATA" },
        ],
    },
    {
        name: "esp32-s2",
        chipId: 2,
        memmap: [
            { from: 0x00000000, to: 0x00010000, id: "PADDING" },
            { from: 0x3f000000, to: 0x3ff80000, id: "DROM" },
            { from: 0x3f500000, to: 0x3ff80000, id: "EXTRAM_DATA" },
            { from: 0x3ff9e000, to: 0x3ffa0000, id: "RTC_DRAM" },
            { from: 0x3ff9e000, to: 0x40000000, id: "BYTE_ACCESSIBLE" },
            { from: 0x3ff9e000, to: 0x40072000, id: "MEM_INTERNAL" },
            { from: 0x3ffb0000, to: 0x40000000, id: "DRAM" },
            { from: 0x40000000, to: 0x4001a100, id: "IROM_MASK" },
            { from: 0x40020000, to: 0x40070000, id: "IRAM" },
            { from: 0x40070000, to: 0x40072000, id: "RTC_IRAM" },
            { from: 0x40080000, to: 0x40800000, id: "IROM" },
            { from: 0x50000000, to: 0x50002000, id: "RTC_DATA" },
        ],
    },
    {
        name: "esp32-s3",
        chipId: 4,
        memmap: [
            { from: 0x00000000, to: 0x00010000, id: "PADDING" },
            { from: 0x3c000000, to: 0x3d000000, id: "DROM" },
            { from: 0x3d000000, to: 0x3e000000, id: "EXTRAM_DATA" },
            { from: 0x600fe000, to: 0x60100000, id: "RTC_DRAM" },
            { from: 0x3fc88000, to: 0x3fd00000, id: "BYTE_ACCESSIBLE" },
            { from: 0x3fc88000, to: 0x403e2000, id: "MEM_INTERNAL" },
            { from: 0x3fc88000, to: 0x3fd00000, id: "DRAM" },
            { from: 0x40000000, to: 0x4001a100, id: "IROM_MASK" },
            { from: 0x40370000, to: 0x403e0000, id: "IRAM" },
            { from: 0x600fe000, to: 0x60100000, id: "RTC_IRAM" },
            { from: 0x42000000, to: 0x42800000, id: "IROM" },
            { from: 0x50000000, to: 0x50002000, id: "RTC_DATA" },
        ],
    },
    {
        name: "esp32-c3",
        chipId: 5,
        memmap: [
            { from: 0x00000000, to: 0x00010000, id: "PADDING" },
            { from: 0x3c000000, to: 0x3c800000, id: "DROM" },
            { from: 0x3fc80000, to: 0x3fce0000, id: "DRAM" },
            { from: 0x3fc88000, to: 0x3fd00000, id: "BYTE_ACCESSIBLE" },
            { from: 0x3ff00000, to: 0x3ff20000, id: "DROM_MASK" },
            { from: 0x40000000, to: 0x40060000, id: "IROM_MASK" },
            { from: 0x42000000, to: 0x42800000, id: "IROM" },
            { from: 0x4037c000, to: 0x403e0000, id: "IRAM" },
            { from: 0x50000000, to: 0x50002000, id: "RTC_IRAM" },
            { from: 0x50000000, to: 0x50002000, id: "RTC_DRAM" },
            { from: 0x600fe000, to: 0x60100000, id: "MEM_INTERNAL2" },
        ],
    },
]

const segHdLen = 8

function segToString(seg: EspSegment) {
    return (
        `0x${seg.addr.toString(16)} 0x${seg.data.length.toString(16)} bytes; ` +
        `${seg.isDROM ? "drom " : ""}${seg.isMapped ? "mapped " : ""}${toHex(
            seg.data.slice(0, 20)
        )}...`
    )
}

export class EspImage {
    header: Uint8Array
    chipName: string
    segments: EspSegment[] = []

    private constructor() {}

    clone() {
        const res = new EspImage()
        res.header = this.header
        res.chipName = this.chipName
        res.segments = this.segments.map(flatClone)
        return res
    }

    get size() {
        let sz = 0
        for (const s of this.segments) sz += s.data.length
        return sz
    }

    get looksValid() {
        return this.segments.some(s => s.isDROM) && this.size > 128 * 1024
    }

    getLastDROM() {
        return this.segments
            .filter(s => s.isDROM)
            .sort((a, b) => b.addr - a.addr)[0]
    }

    async toBuffer(digest = true) {
        const image = this.padSegments()
        let size = image.header.length
        for (const seg of image.segments) {
            size += segHdLen + seg.data.length
        }
        size = (size + 16) & ~15 // align to 16 bytes - last byte will be weak checksum
        let res = new Uint8Array(size)
        res.set(image.header)
        res[1] = image.segments.length
        let off = image.header.length
        let checksum = 0xef
        for (const seg of image.segments) {
            write32(res, off, seg.addr)
            write32(res, off + 4, seg.data.length)
            res.set(seg.data, off + segHdLen)
            off += segHdLen + seg.data.length
            for (let i = 0; i < seg.data.length; ++i) checksum ^= seg.data[i]
        }
        res[res.length - 1] = checksum

        if (digest) {
            res[23] = 1
            const digest = await sha256([res])
            res = bufferConcat(res, digest)
        } else {
            res[23] = 0 // disable digest
        }

        // console.log("reparsed\n" + parseBuffer(res).segments.map(segToString).join("\n") + "\n")

        return res
    }

    static fromBuffer(buf: Uint8Array) {
        if (buf[0] != 0xe9) throw new Error("ESP: invalid magic: " + buf[0])

        let ptr = 24

        const chipId = read16(buf, 12)
        const chipdesc = chips.find(c => c.chipId == chipId)

        if (!chipdesc) throw new Error("ESP: unknown chipid: " + chipId)

        const image = new EspImage()
        image.header = buf.slice(0, ptr)
        image.chipName = chipdesc.name

        const numseg = buf[1]
        for (let i = 0; i < numseg; ++i) {
            const offset = read32(buf, ptr)
            const size = read32(buf, ptr + 4)

            ptr += segHdLen

            const data = buf.slice(ptr, ptr + size)
            if (data.length != size) throw new Error("too short file")
            ptr += size

            if (isInSection(offset, "PADDING")) continue

            const ex = image.segments.filter(
                seg => seg.addr + seg.data.length == offset
            )[0]
            if (ex) ex.data = bufferConcat(ex.data, data)
            else
                image.segments.push({
                    addr: offset,
                    isMapped:
                        isInSection(offset, "DROM") ||
                        isInSection(offset, "IROM"),
                    isDROM: isInSection(offset, "DROM"),
                    data: data,
                })
        }

        verboseLog(`loaded:\n${image.toString()}\n`)

        return image

        function isInSection(addr: number, sect: string) {
            return chipdesc.memmap.some(
                m => m.id == sect && m.from <= addr && addr <= m.to
            )
        }
    }

    toString() {
        return this.segments.map(segToString).join("\n")
    }

    private padSegments() {
        const align = 0x10000
        const alignMask = align - 1

        const image = this.clone()
        image.segments.sort((a, b) => a.addr - b.addr)

        verboseLog("esp padding:\n" + image.toString() + "\n")

        const mapped = image.segments.filter(s => s.isMapped)
        const nonMapped = image.segments.filter(s => !s.isMapped)
        image.segments = []
        let foff = image.header.length

        for (const seg of mapped) {
            // there's apparently a bug in ESP32 bootloader, that doesn't map the last page if it's smaller than 0x24
            const leftoff = (seg.addr + seg.data.length) & alignMask
            if (leftoff < 0x24) {
                const padding = new Uint8Array(0x24 - leftoff)
                seg.data = bufferConcat(seg.data, padding)
            }
        }

        while (mapped.length > 0) {
            let seg = mapped[0]
            const padLen = alignmentNeeded(seg)
            if (padLen > 0) {
                seg = getPaddingSegment(padLen)
            } else {
                if (((foff + segHdLen) & alignMask) != (seg.addr & alignMask)) {
                    throw new Error(
                        `pad oops 0 ${foff}+${segHdLen} != ${seg.addr} (mod mask)`
                    )
                }
                mapped.shift()
            }
            image.segments.push(seg)
            foff += segHdLen + seg.data.length
            if (foff & 3) throw new Error("pad oops 1")
        }

        // append any remaining non-mapped segments
        image.segments = image.segments.concat(nonMapped)

        verboseLog("esp padded:\n" + image.toString() + "\n")

        return image

        function alignmentNeeded(seg: EspSegment) {
            const reqd = (seg.addr - segHdLen) & alignMask
            let padLen = (reqd - foff) & alignMask
            if (padLen == 0) return 0
            padLen -= segHdLen
            if (padLen < 0) padLen += align
            return padLen
        }

        function getPaddingSegment(bytes: number): EspSegment {
            if (!nonMapped.length || bytes <= segHdLen)
                return {
                    addr: 0,
                    isMapped: false,
                    isDROM: false,
                    data: new Uint8Array(bytes),
                }
            const seg = nonMapped[0]
            const res: EspSegment = {
                addr: seg.addr,
                isMapped: seg.isMapped,
                isDROM: seg.isDROM,
                data: seg.data.slice(0, bytes),
            }
            seg.data = seg.data.slice(bytes)
            seg.addr += res.data.length
            if (seg.data.length == 0) nonMapped.shift()
            return res
        }
    }
}
