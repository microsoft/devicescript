import {
    decodeU32LE,
    fromUTF8,
    read16,
    read32,
    toHex,
    uint8ArrayToString,
} from "./jdutil"

const JD_LSTORE_MAGIC0 = 0x0a4c444a
const JD_LSTORE_MAGIC1 = 0xb5d1841e
const JD_LSTORE_VERSION = 5
const JD_LSTORE_ENTRY_HEADER_SIZE = 4

const SECTOR_SHIFT = 9
const SECTOR_SIZE = 1 << SECTOR_SHIFT

/*
#define JD_LSTORE_BLOCK_OVERHEAD                                                                   \
    (sizeof(jd_lstore_block_header_t) + sizeof(jd_lstore_block_footer_t))

typedef struct {
    uint32_t block_magic0;
    uint32_t generation;
    uint64_t timestamp; // in ms
    uint8_t data[0];
} jd_lstore_block_header_t;

typedef struct {
    uint32_t block_magic1;
    uint32_t crc32;
} jd_lstore_block_footer_t;

*/

function getString(buf: Uint8Array) {
    let end = buf.indexOf(0)
    if (end < 0) end = buf.length
    return fromUTF8(uint8ArrayToString(buf.slice(0, end)))
}

/*
typedef struct {
    uint64_t device_id;
    char firmware_name[64];
    char firmware_version[32];
    uint8_t reserved[32];
} jd_lstore_device_info_t;
*/

export interface DeviceInfo {
    deviceIdentifier: string
    firmwareName: string
    firmwareVersion: string
}
function parseDevInfo(buf: Uint8Array): DeviceInfo {
    return {
        deviceIdentifier: toHex(buf.slice(0, 8)),
        firmwareName: getString(buf.slice(8, 8 + 64)),
        firmwareVersion: getString(buf.slice(8 + 64, 8 + 64 + 32)),
    }
}

interface Block {
    generation: number
    timestamp: number
    data: Uint8Array
}
export interface TraceEvent {
    generation: number
    timestamp: number
    type: number
    payload: Uint8Array
    decoded?: any
    human?: string
}

const JD_LSTORE_TYPE_DEVINFO = 0x01
const JD_LSTORE_TYPE_DMESG = 0x02
const JD_LSTORE_TYPE_LOG = 0x03
const JD_LSTORE_TYPE_JD_FRAME = 0x04
const JD_LSTORE_TYPE_PANIC_LOG = 0x05
const DEVS_TRACE_EV_NOW = 0x40
const DEVS_TRACE_EV_INIT = 0x41
const DEVS_TRACE_EV_SERVICE_PACKET = 0x42
const DEVS_TRACE_EV_NON_SERVICE_PACKET = 0x43
const DEVS_TRACE_EV_BROADCAST_PACKET = 0x44
const DEVS_TRACE_EV_ROLE_CHANGED = 0x45
const DEVS_TRACE_EV_FIBER_RUN = 0x46
const DEVS_TRACE_EV_FIBER_YIELD = 0x47

const typeLookup: Record<number, string> = {
    [JD_LSTORE_TYPE_DEVINFO]: "devinfo",
    [JD_LSTORE_TYPE_DMESG]: "dmesg",
    [JD_LSTORE_TYPE_LOG]: "log",
    [JD_LSTORE_TYPE_PANIC_LOG]: "panic_log",
    [JD_LSTORE_TYPE_JD_FRAME]: "frame",
    [DEVS_TRACE_EV_NOW]: "NOW",
    [DEVS_TRACE_EV_INIT]: "INIT",
    [DEVS_TRACE_EV_SERVICE_PACKET]: "PKT",
    [DEVS_TRACE_EV_NON_SERVICE_PACKET]: "PKT[?]",
    [DEVS_TRACE_EV_BROADCAST_PACKET]: "PKT[*]",
    [DEVS_TRACE_EV_ROLE_CHANGED]: "ROLE",
    [DEVS_TRACE_EV_FIBER_RUN]: "FIBER_RUN",
    [DEVS_TRACE_EV_FIBER_YIELD]: "FIBER_YIELD",
}

export class GenerationInfo {
    firstBlock: number
    lastBlock: number

    get numBlocks() {
        return this.lastBlock - this.firstBlock + 1
    }

    constructor(public parent: LogInfo, public index: number) {}

    toString() {
        return `gen ${this.index}, ${bytes(
            this.numBlocks * this.parent.blockSize
        )}`
    }

    async dump() {
        return {
            generation: this.index,
            size: this.numBlocks * this.parent.blockSize,
        }
    }

    async blockEvents(blockIdx: number, r: TraceEvent[] = []) {
        if (this.firstBlock <= blockIdx && blockIdx <= this.lastBlock) {
            const bl = await this.parent._readBlock(blockIdx)
            parseBlock(bl, r)
        }
        return r
    }

    async devInfo() {
        for (const ev of await this.blockEvents(this.firstBlock)) {
            if (ev.type == JD_LSTORE_TYPE_DEVINFO)
                return ev.decoded as DeviceInfo
        }
        return undefined
    }

    async readEvents(maxBlocks: number = 0xffffffff) {
        const startIdx = Math.max(this.firstBlock, this.lastBlock - maxBlocks)
        const events: TraceEvent[] = []
        for (let i = startIdx; i <= this.lastBlock; ++i) {
            this.blockEvents(i, events)
        }
        return events
    }

    async computeStats() {
        let dataSize = 0
        let utilizedSize = 0
        let numEvents = 0
        for (let i = this.firstBlock; i <= this.lastBlock; ++i) {
            const bl = await this.parent._readBlock(i)
            if (!bl.generation) {
                console.log("bad block " + i)
                continue
            }
            const r: TraceEvent[] = []
            const st: BlockStats = {} as any
            parseBlock(bl, r, st)
            numEvents += r.length
            dataSize += bl.data.length
            utilizedSize += st.endptr
        }
        return {
            dataSize,
            utilizedSize,
            numEvents,
            avgEventSize: utilizedSize / numEvents,
            utilization: utilizedSize / dataSize,
        }
    }

    async forEachEvent(cb?: (ev: TraceEvent) => Promise<void>) {
        if (!cb)
            cb = ev => {
                console.log(ev.human)
                return Promise.resolve()
            }
        for (let i = this.firstBlock; i <= this.lastBlock; ++i) {
            for (const ev of await this.blockEvents(i)) {
                await cb(ev)
            }
        }
    }
}

export class LogInfo {
    deviceInfo: DeviceInfo
    purpose: string
    comment: string
    firstGeneration: number
    lastGeneration: number
    blockSize: number

    private generations: GenerationInfo[] = []
    private dataBlocks: number
    private block0Idx: number
    _readBlock: (idx: number) => Promise<Block>

    async generation(gen: number) {
        if (this.firstGeneration <= gen && gen <= this.lastGeneration) {
            let g = this.generations[gen]
            if (!g) {
                this.generations[gen] = g = new GenerationInfo(this, gen)
                g.firstBlock =
                    (await this.findLastBlock(b => b.generation < gen)) + 1
                g.lastBlock = await this.findLastBlock(b => b.generation <= gen)
            }
            return g
        } else {
            return undefined
        }
    }

    async dump() {
        const r = {
            deviceInfo: this.deviceInfo,
            purpose: this.purpose,
            comment: this.comment,
            size: this.dataBlocks * this.blockSize,
            generations: [] as any[],
        }
        for (let i = this.firstGeneration; i <= this.lastGeneration; ++i) {
            const g = await this.generation(i)
            r.generations.push(await g.dump())
        }
        return r
    }

    constructor(
        private readfn: (off: number, size: number) => Promise<Uint8Array>
    ) {}

    async _load() {
        const hd = await this.readfn(0, SECTOR_SIZE)
        const [
            magic0,
            magic1,
            version,
            sector_size,
            sectors_per_block,
            header_blocks,
            num_blocks,
            num_rewrites,
            hd_block_magic0,
            hd_block_magic1,
        ] = decodeU32LE(hd)

        if (magic0 != JD_LSTORE_MAGIC0 || magic1 != JD_LSTORE_MAGIC1)
            oops("bad magic")
        if (version != JD_LSTORE_VERSION) oops("bad version")
        if (sector_size != SECTOR_SIZE) oops("bad sector size")
        this.blockSize = sector_size * sectors_per_block
        const file_size = num_blocks * this.blockSize
        if (file_size >= 4 * 1024 * 1024 * 1024) oops("file too big (over 4GB)")
        this.dataBlocks = num_blocks - header_blocks
        this.block0Idx = 0

        this._readBlock = async off => {
            off += this.block0Idx
            off %= this.dataBlocks
            if (off < 0) off += this.dataBlocks

            const buf = await this.readfn(
                (header_blocks + off) * this.blockSize,
                this.blockSize
            )
            const [block_magic0, _generation, timestamp_lo, timestamp_hi] =
                decodeU32LE(buf.slice(0, 4 * 4))
            const [block_magic1, _crc32] = decodeU32LE(buf.slice(-2 * 4))
            let timestamp = timestamp_lo + timestamp_hi * 0x100000000
            let generation = _generation
            if (
                block_magic0 != hd_block_magic0 ||
                block_magic1 != hd_block_magic1 ||
                crc32(buf.slice(0, -4)) != _crc32
            ) {
                timestamp = 0
                generation = 0
            }
            return {
                generation,
                timestamp,
                data: buf.slice(4 * 4, -2 * 4),
            }
        }

        function block_le(a: Block, b: Block) {
            return (
                a.generation < b.generation ||
                (a.generation == b.generation && a.timestamp <= b.timestamp)
            )
        }

        const bl0 = await this._readBlock(0)
        const lastBl = await this.findLastBlock(b => block_le(bl0, b))
        if (lastBl < 0) oops("empty file")
        this.block0Idx = lastBl + 1

        const devInfoOff = 16 * 4
        const afterDevInfo = devInfoOff + 8 + 64 + 64

        this.deviceInfo = parseDevInfo(hd.slice(devInfoOff, afterDevInfo))
        this.purpose = getString(hd.slice(afterDevInfo, afterDevInfo + 32))
        this.comment = getString(
            hd.slice(afterDevInfo + 32, afterDevInfo + 32 + 64)
        )
        this.firstGeneration = (await this._readBlock(0)).generation
        // gen0 is a placeholder
        if (this.firstGeneration == 0) this.firstGeneration = 1
        this.lastGeneration = (await this._readBlock(-1)).generation

        function oops(msg: string): never {
            throw new Error("failed to parse LSTOR log: " + msg)
        }
    }

    private async findLastBlock(cond: (b: Block) => boolean) {
        let l = 0
        let r = this.dataBlocks - 1

        if (!cond(await this._readBlock(l))) return -1

        // inv: cond(l)
        // inv: !cond(r+1)
        while (l < r) {
            let m = ((l + r) >> 1) + 1
            // inv: l < m <= r
            const b = await this._readBlock(m)
            if (cond(b)) {
                l = m
            } else {
                r = m - 1
            }
        }

        return l
    }
}

interface BlockStats {
    endptr: number
}

/*
    typedef struct {
        uint8_t type;
        uint8_t size;    // of 'data'
        uint16_t tdelta; // wrt to block timestamp
        uint8_t data[0];
    } jd_lstore_entry_t;
    */
function parseBlock(b: Block, r: TraceEvent[] = [], statsRes?: BlockStats) {
    let ptr = 0
    while (ptr < b.data.length - 1) {
        const tp = b.data[ptr]
        const sz = b.data[ptr + 1]
        const tdelta = read16(b.data, ptr + 2)
        if (tp == 0 && sz == 0) break
        const endp = ptr + 4 + sz
        const ev: TraceEvent = {
            generation: b.generation,
            timestamp: b.timestamp + tdelta,
            type: tp,
            payload: b.data.slice(ptr + 4, endp),
        }
        if (!statsRes) decodeEvent(ev)
        r.push(ev)
        ptr = endp
    }
    if (statsRes) statsRes.endptr = ptr
    return r
}

function decodeEvent(ev: TraceEvent) {
    const tp = typeLookup[ev.type] || "tp:0x" + ev.type.toString(16)
    const ts = (ev.timestamp / 1000).toFixed(3)
    const pref = ts + " " + tp + " "
    switch (ev.type) {
        case JD_LSTORE_TYPE_DEVINFO:
            ev.decoded = parseDevInfo(ev.payload)
            ev.human = pref + JSON.stringify(ev.decoded)
            break
        case JD_LSTORE_TYPE_DMESG:
        case JD_LSTORE_TYPE_LOG:
        case JD_LSTORE_TYPE_PANIC_LOG:
            ev.decoded = uint8ArrayToString(ev.payload)
            try {
                ev.decoded = fromUTF8(ev.decoded)
            } catch {}
            ev.human = prefix(pref, ev.decoded.replace(/\x1B\[[0-9;]+m/g, ""))
            break
        case DEVS_TRACE_EV_BROADCAST_PACKET:
        case DEVS_TRACE_EV_SERVICE_PACKET:
        case DEVS_TRACE_EV_NON_SERVICE_PACKET:
            ev.decoded = toHex(ev.payload)
            ev.human = ts + " " + ev.decoded
            break
        case DEVS_TRACE_EV_NOW:
            ev.decoded = read32(ev.payload, 0)
            ev.human = pref + ev.decoded
            break
        default:
            ev.human = pref + toHex(ev.payload)
            break
    }
}

function prefix(pref: string, lines: string) {
    while (lines[lines.length - 1] == "\n") lines = lines.slice(0, -1)
    lines = pref + lines
    if (lines.indexOf("\n") >= 0) lines = lines.replace(/\n/g, "\n" + pref)
    return lines
}

function bytes(num: number) {
    const K = 1024
    const M = K * K
    const G = K * K * K
    if (num < 2 * K) return num + " B"
    else if (num < M) return (num >>> 10) + " kB"
    else if (num < 100 * M) return (num / M).toFixed(1) + " MB"
    else if (num < G) return Math.round(num / M) + " MB"
    else return (num / G).toFixed(1) + " GB"
}

export async function parseLog(
    readfn: (off: number, size: number) => Promise<Uint8Array>
) {
    const logInfo = new LogInfo(readfn)
    await logInfo._load()
    return logInfo
}

export function parseLogFile(f: File) {
    return parseLog((off: number, size: number) =>
        f
            .slice(off, off + size)
            .arrayBuffer()
            .then(buf => new Uint8Array(buf))
    )
}

/* USAGE:
    const info = await parseLogFile(f)
    for (const ev:TraceEvent of await info.readGeneration(info.lastGeneration)) {
        // ...
    }
*/

const crc32_lookup = [
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f,
    0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988,
    0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2,
    0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
    0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
    0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
    0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c,
    0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
    0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423,
    0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
    0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106,
    0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
    0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d,
    0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e,
    0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
    0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
    0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7,
    0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0,
    0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa,
    0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
    0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81,
    0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a,
    0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84,
    0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
    0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
    0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
    0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e,
    0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
    0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55,
    0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
    0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28,
    0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
    0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f,
    0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38,
    0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
    0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
    0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69,
    0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2,
    0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc,
    0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693,
    0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94,
    0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d,
]

export function crc32(data: Uint8Array) {
    let crc = 0
    crc = ~crc
    for (let i = 0; i < data.length; ++i)
        crc = crc32_lookup[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
    return ~crc >>> 0
}
