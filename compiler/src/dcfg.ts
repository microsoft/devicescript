import {
    stringToBuffer,
    fnv1a,
    read16,
    write16,
    write32,
    bufferConcatMany,
    assert,
    read32,
    fromUTF8,
    uint8ArrayToString,
    bufferConcat,
} from "./jdutil"

export const DCFG_MAGIC0 = 0x47464344 // DCFG
export const DCFG_MAGIC1 = 0xcab49b0a // '\n' + random
export const DCFG_KEYSIZE = 15
export const DCFG_HASH_BITS = 5
export const DCFG_HASH_SHIFT = 8 - DCFG_HASH_BITS
export const DCFG_HASH_JUMP_SIZE = 1 << DCFG_HASH_BITS
export const DCFG_TYPE_OFFSET_MASK = 0x80
export const DCFG_TYPE_EMPTY = 0xff
export const DCFG_TYPE_U32 = 0x01
export const DCFG_TYPE_I32 = 0x02
// export const DCFG_TYPE_F32 = 0x03
export const DCFG_TYPE_STRING = 0x81
export const DCFG_TYPE_BLOB = 0x82
// export const DCFG_TYPE_F64 = 0x83

export const DCFG_HEADER_HASH_JUMP_OFFSET = 4 * 4
export const DCFG_HEADER_SIZE =
    DCFG_HEADER_HASH_JUMP_OFFSET + DCFG_HASH_JUMP_SIZE
export const DCFG_ENTRY_SIZE = DCFG_KEYSIZE + 1 + 2 * 4

/*
typedef struct {
    char key[DCFG_KEYSIZE + 1];
    uint8_t hash;
    uint8_t type;
    uint16_t size;
    uint32_t value;
} dcfg_entry_t;

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint16_t num_entries;
    uint16_t reserved[3];
    // let A(key) = fn1v(key) & DCFG_HASH_MASK
    // let B(key) = fn1v(key) & 0xff
    // entries are ordered lexicographically by (A, B)
    // hash_jump[A(key)] is either 0 when no entry e with A(e)==A(key) exists,
    // or index+1 into entries where a run of entries e with A(e)==A(key) starts
    uint8_t hash_jump[DCFG_HASH_MASK + 1];
    dcfg_entry_t entries[];
} dcfg_header_t;
*/

export type DcfgValue = string | Uint8Array | number
export type DcfgSettings = Record<string, DcfgValue>

export function serializeDcfg(entries: DcfgSettings) {
    const numEntries = Object.keys(entries).length
    if (numEntries > 0xf0) throw new Error("dcfg: too many entries")
    let dataOff = DCFG_HEADER_SIZE + (numEntries + 1) * DCFG_ENTRY_SIZE
    let dataEntries: Uint8Array[] = []
    const doff = DCFG_KEYSIZE + 1
    const binEntries = Object.keys(entries).map(mkEntry)
    binEntries.sort((a, b) => a[doff] - b[doff])
    const hd = new Uint8Array(DCFG_HEADER_SIZE)
    write32(hd, 0, DCFG_MAGIC0)
    write32(hd, 4, DCFG_MAGIC1)
    write16(hd, 8, numEntries)
    for (let i = 0; i < DCFG_HASH_JUMP_SIZE; ++i) {
        hd[DCFG_HEADER_HASH_JUMP_OFFSET + i] =
            binEntries.findIndex(e => i == e[doff] >> DCFG_HASH_SHIFT) + 1
    }

    const finalEntry = new Uint8Array(DCFG_ENTRY_SIZE)
    finalEntry.fill(0xff)
    finalEntry[0] = 0

    const res = bufferConcatMany([
        hd,
        ...binEntries,
        finalEntry,
        ...dataEntries,
    ])
    assert(res.length == dataOff)

    return res

    function pushBuffer(b: Uint8Array) {
        b = bufferConcat(b, new Uint8Array(1))
        dataOff += b.length
        dataEntries.push(b)
        return b.length - 1
    }

    function mkEntry(k: string) {
        const v = entries[k]
        const kb = stringToBuffer(k)
        if (kb.length > DCFG_KEYSIZE)
            throw new Error(`dcfg key too long: '${k}' (limit ${DCFG_KEYSIZE})`)
        let value = 0
        let type = 0
        let size = 4
        if (typeof v == "string") {
            value = dataOff
            size = pushBuffer(stringToBuffer(v))
            type = DCFG_TYPE_STRING
        } else if (v instanceof Uint8Array) {
            value = dataOff
            size = pushBuffer(v)
            type = DCFG_TYPE_BLOB
        } else {
            if ((v | 0) == v) {
                value = v
                type = DCFG_TYPE_I32
            } else if (v >>> 0 == v) {
                value = v
                type = DCFG_TYPE_U32
            } else {
                throw new Error(`dcfg number has to be i32 or u32: ${k}=${v}`)
            }
        }
        const e = new Uint8Array(DCFG_ENTRY_SIZE)
        e.set(kb)
        e[doff + 0] = fnv1a(kb) & 0xff
        e[doff + 1] = type
        write16(e, doff + 2, size)
        write32(e, doff + 4, value)
        return e
    }
}

export function findDcfgOffsets(buf: Uint8Array) {
    const idx: number[] = []
    for (let i = 0; i < buf.length - 32; i += 4) {
        if (read32(buf, i) == DCFG_MAGIC0 && read32(buf, i + 4) == DCFG_MAGIC1)
            idx.push(i)
    }
    return idx
}

function collisions() {
    const tree: string[][] = []
    for (let i = 0; i < 300; ++i) {
        const k = `k${i}`
        const idx = (fnv1a(stringToBuffer(k)) & 0xff) >> DCFG_HASH_SHIFT
        if (!tree[idx]) tree[idx] = []
        tree[idx].push(k)
    }
    console.log(tree)
}

export function decodeDcfg(buf: Uint8Array) {
    const res = {
        errors: [] as string[],
        settings: {} as DcfgSettings,
    }

    // collisions()

    if (!buf || buf.length < DCFG_HEADER_SIZE) return error("too small buffer")

    if (read32(buf, 0) != DCFG_MAGIC0 || read32(buf, 4) != DCFG_MAGIC1)
        return error("bad magic")

    const numEntries = read16(buf, 8)

    {
        const eoff = DCFG_HEADER_SIZE + numEntries * DCFG_ENTRY_SIZE
        const doff = eoff + DCFG_KEYSIZE + 1
        if (buf[doff + 0] != 0xff || buf[doff + 1] != 0xff)
            error("final entry hash non 0xff hash/type")
    }

    const dataPtrMin = DCFG_HEADER_SIZE + (numEntries + 1) * DCFG_ENTRY_SIZE

    for (let i = 0; i < numEntries; ++i) {
        const eoff = DCFG_HEADER_SIZE + i * DCFG_ENTRY_SIZE
        const doff = eoff + DCFG_KEYSIZE + 1

        let ep = eoff
        while (buf[ep]) ep++
        const keylen = ep - eoff
        if (keylen > DCFG_KEYSIZE) {
            error(`no NUL termination in key #${i}`)
            continue
        }
        const kb = buf.slice(eoff, ep)
        const key = fromUTF8(uint8ArrayToString(kb))

        const hash = buf[doff + 0]
        const type = buf[doff + 1]
        const size = read16(buf, doff + 2)
        const value = read32(buf, doff + 4)
        let realValue: DcfgValue

        if ((fnv1a(kb) & 0xff) != hash) error(`invalid hash at key '${key}'`)

        switch (type) {
            case DCFG_TYPE_I32:
                if (size != 4)
                    error(`invalid size ${size} for i32 entry '${key}'`)
                realValue = value | 0
                break
            case DCFG_TYPE_U32:
                if (size != 4)
                    error(`invalid size ${size} for u32 entry '${key}'`)
                realValue = value >>> 0
                break
            case DCFG_TYPE_BLOB:
            case DCFG_TYPE_STRING:
                if (value < dataPtrMin || value + size >= buf.length) {
                    error(`string offset out of range ${value} at '${key}'`)
                    continue
                } else {
                    if (buf[value + size] != 0)
                        error(`string not NUL terminated '${key}'`)
                    realValue = new Uint8Array(buf.slice(value, value + size))
                    if (type == DCFG_TYPE_STRING) {
                        realValue = fromUTF8(uint8ArrayToString(realValue))
                        if (realValue.includes("\u0000"))
                            error(`NUL character in string at '${key}'`)
                    }
                }
                break
            default:
                error(`invalid entry type ${type} at '${key}'`)
                continue
        }

        res.settings[key] = realValue
    }

    let prev_hash_idx = -1
    const hash_jump = buf.slice(
        DCFG_HEADER_HASH_JUMP_OFFSET,
        DCFG_HEADER_HASH_JUMP_OFFSET + DCFG_HASH_JUMP_SIZE
    )

    for (let i = 0; i < numEntries; ++i) {
        if (i > 0 && eHash(i - 1) > eHash(i)) error("unordered hash")

        let curr_hidx = eHash(i) >> DCFG_HASH_SHIFT
        if (i == 0 || eHash(i - 1) >> DCFG_HASH_SHIFT != curr_hidx) {
            for (prev_hash_idx++; prev_hash_idx < curr_hidx; prev_hash_idx++)
                if (hash_jump[prev_hash_idx] != 0) error("non-0 hash jump")
            if (hash_jump[prev_hash_idx] != i + 1) error("invalid hash jump")
        } else {
        }
    }

    return res

    function eHash(i: number) {
        const eoff = DCFG_HEADER_SIZE + i * DCFG_ENTRY_SIZE
        const doff = eoff + DCFG_KEYSIZE + 1
        return buf[doff + 0]
    }

    function error(msg: string) {
        res.errors.push(msg)
        return res
    }
}
