import { parseAnyInt } from "@devicescript/interop"
import { toHex } from "jacdac-ts"
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
    bufferEq,
    fromHex,
    stringToUint8Array,
} from "./jdutil"

export const DCFG_MAGIC0 = 0x47464344 // DCFG
export const DCFG_MAGIC1 = 0xcab49b0a // '\n' + random
export const DCFG_KEYSIZE = 15

export const DCFG_TYPE_BITS = 2
export const DCFG_TYPE_MASK = (1 << DCFG_TYPE_BITS) - 1
export const DCFG_SIZE_BITS = 16 - DCFG_TYPE_BITS
export const DCFG_HASH_BITS = 16
export const DCFG_HASH_JUMP_BITS = 5
export const DCFG_HASH_JUMP_ENTRIES = 1 << DCFG_HASH_JUMP_BITS
export const DCFG_HASH_SHIFT = DCFG_HASH_BITS - DCFG_HASH_JUMP_BITS
export const DCFG_TYPE_U32 = 0
export const DCFG_TYPE_I32 = 1
export const DCFG_TYPE_STRING = 2
export const DCFG_TYPE_BLOB = 3
export const DCFG_TYPE_INVALID = 0xff
export const DCFG_HEADER_HASH_JUMP_OFFSET = 6 * 4
export const DCFG_HEADER_SIZE =
    DCFG_HEADER_HASH_JUMP_OFFSET + 2 * DCFG_HASH_JUMP_ENTRIES
export const DCFG_ENTRY_SIZE = DCFG_KEYSIZE + 1 + 2 * 4

/*
typedef struct {
    char key[DCFG_KEYSIZE + 1];
    uint16_t hash;
    uint16_t type_size;
    uint32_t value;
} dcfg_entry_t;

static inline unsigned dcfg_entry_type(const dcfg_entry_t *e) {
    return e ? (e->type_size & DCFG_TYPE_MASK) : DCFG_TYPE_INVALID;
}
static inline unsigned dcfg_entry_size(const dcfg_entry_t *e) {
    return e->type_size >> DCFG_TYPE_BITS;
}

typedef struct {
    uint32_t magic0;
    uint32_t magic1;
    uint32_t total_bytes; // including the header the data after entries[]
    uint16_t num_entries;
    uint16_t reserved[5];
    // entries are ordered by hash
    // hash_jump[x] points to first entry where (entry.hash >> DCFG_HASH_SHIFT) >= x
    uint16_t hash_jump[DCFG_HASH_JUMP_ENTRIES];
    dcfg_entry_t entries[];
} dcfg_header_t;*/

export type DcfgValue = string | Uint8Array | number
export type DcfgSettings = Record<string, DcfgValue>

const entoff = DCFG_KEYSIZE + 1
function entrySize(e: Uint8Array, off = 0) {
    return read16(e, off + entoff + 2) >> DCFG_TYPE_BITS
}
function entryType(e: Uint8Array, off = 0) {
    return read16(e, off + entoff + 2) & DCFG_TYPE_MASK
}
function entryHash(e: Uint8Array, off = 0) {
    return read16(e, off + entoff)
}
function entryValue(e: Uint8Array, off = 0) {
    return read32(e, off + entoff + 4)
}
function keyhash(key: string | Uint8Array) {
    if (typeof key == "string") key = stringToUint8Array(key)
    const h = fnv1a(key)
    return (h >>> 16) ^ (h & 0xffff)
}

export function serializeDcfg(
    entries: DcfgSettings,
    noVerify = false,
    noHash = false
) {
    const numEntries = Object.keys(entries).length
    if (numEntries > 0xf000) throw new Error("dcfg: too many entries")
    let dataOff = DCFG_HEADER_SIZE + (numEntries + 1) * DCFG_ENTRY_SIZE
    let dataEntries: Uint8Array[] = []
    const binEntries = Object.keys(entries).map(mkEntry)
    binEntries.sort((a, b) => entryHash(a) - entryHash(b))
    const hd = new Uint8Array(DCFG_HEADER_SIZE)
    write32(hd, 0, DCFG_MAGIC0)
    write32(hd, 4, DCFG_MAGIC1)
    write32(hd, 8, dataOff)
    write16(hd, 12, numEntries)

    const finalEntry = new Uint8Array(DCFG_ENTRY_SIZE)
    finalEntry.fill(0xff)
    finalEntry[0] = 0
    binEntries.push(finalEntry)

    for (let i = 0; i < DCFG_HASH_JUMP_ENTRIES; ++i) {
        const idx = binEntries.findIndex(
            e => entryHash(e) >> DCFG_HASH_SHIFT >= i
        )
        // console.log(`${i} => ${idx}`)
        write16(hd, DCFG_HEADER_HASH_JUMP_OFFSET + 2 * i, idx)
    }

    if (!noHash) {
        const tmp: DcfgSettings = {}
        Object.entries(entries).forEach(([k, v]) => {
            if (k.startsWith("@")) return
            tmp[k] = v
        })
        if (Object.keys(tmp).length == 0) {
            // special value - no config
            write32(hd, 16, 1)
            write32(hd, 20, 0)
        } else {
            const filtered = serializeDcfg(tmp, true, true)
            // compute some hash; sha256 would be better
            write32(hd, 16, fnv1a(filtered))
            write32(hd, 20, fnv1a(filtered.slice(4)))
        }
    }

    const res = bufferConcatMany([hd, ...binEntries, ...dataEntries])
    assert(res.length == dataOff)

    if (!noVerify) {
        const decoded = decodeDcfg(res)
        if (decoded.errors.length == 0) {
            for (const k of Object.keys(entries)) {
                if (entries[k] != decoded.settings[k])
                    decoded.errors.push(`mismatch at ${k}`)
            }
            for (const k of Object.keys(decoded.settings)) {
                if (entries[k] != decoded.settings[k])
                    decoded.errors.push(`mismatch at ${k}`)
            }
        }
        if (decoded.errors.length) throw new Error(decoded.errors.join("\n"))
    }

    return res

    function pushBuffer(b: Uint8Array) {
        b = bufferConcat(b, new Uint8Array(1))
        dataOff += b.length
        dataEntries.push(b)
        return b.length - 1
    }

    function mkEntry(k: string) {
        const v = entries[k]
        const kb = stringToUint8Array(k)
        if (kb.length > DCFG_KEYSIZE)
            throw new Error(`dcfg key too long: '${k}' (limit ${DCFG_KEYSIZE})`)
        let value = 0
        let type = 0
        let size = 0
        if (typeof v == "string") {
            value = dataOff
            size = pushBuffer(stringToBuffer(v))
            type = DCFG_TYPE_STRING
        } else if (v instanceof Uint8Array) {
            value = dataOff
            size = pushBuffer(v)
            type = DCFG_TYPE_BLOB
        } else if (typeof v == "number") {
            if ((v | 0) == v) {
                value = v
                type = DCFG_TYPE_I32
            } else if (v >>> 0 == v) {
                value = v
                type = DCFG_TYPE_U32
            } else {
                throw new Error(`dcfg number has to be i32 or u32: ${k}=${v}`)
            }
        } else {
            throw new Error(`invalid dcfg value: ${k}=${v}`)
        }
        if (size >= 1 << DCFG_SIZE_BITS)
            throw new Error(
                `value for '${k}' too big (${size} bytes, max ${
                    1 << DCFG_SIZE_BITS
                })`
            )
        const e = new Uint8Array(DCFG_ENTRY_SIZE)
        e.set(kb)
        write16(e, entoff, keyhash(kb))
        write16(e, entoff + 2, type | (size << DCFG_TYPE_BITS))
        write32(e, entoff + 4, value)
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
    for (let i = 0; i < 20000; ++i) {
        const k = `k${i}`
        const idx = keyhash(k)
        if (!tree[idx]) tree[idx] = []
        tree[idx].push(k)
    }
    for (const e of tree) {
        if (e?.length >= 2) console.log(e)
    }
}

function getEntry(buf: Uint8Array, key: string) {
    const kb = stringToUint8Array(key)
    if (kb.length > DCFG_KEYSIZE) return null

    const hash = keyhash(kb)
    const hidx = hash >> DCFG_HASH_SHIFT
    let idx = read16(buf, DCFG_HEADER_HASH_JUMP_OFFSET + 2 * hidx)
    const num = read16(buf, 12)

    const kb0 = [...kb, 0]

    while (idx < num) {
        const eoff = DCFG_HEADER_SIZE + idx * DCFG_ENTRY_SIZE
        if (!(entryHash(buf, eoff) <= hash)) break
        if (
            entryHash(buf, eoff) == hash &&
            bufferEq(buf.slice(eoff, eoff + kb0.length), kb0)
        )
            return buf.slice(eoff, eoff + DCFG_ENTRY_SIZE)
        idx++
    }

    return null
}

export function decodeDcfg(buf: Uint8Array) {
    const res = {
        errors: [] as string[],
        hash: toHex(buf.slice(16, 24)),
        settings: {} as DcfgSettings,
    }

    // collisions()

    if (!buf || buf.length < DCFG_HEADER_SIZE) return error("too small buffer")

    if (read32(buf, 0) != DCFG_MAGIC0 || read32(buf, 4) != DCFG_MAGIC1)
        return error("bad magic")

    const totalBytes = read32(buf, 8)

    if (buf.length < totalBytes)
        return error(
            `buffer declared ${totalBytes} bytes but only ${buf.length} long`
        )

    buf = new Uint8Array(buf.slice(0, totalBytes)) // make sure we're not working with a node.js buffer
    const numEntries = read16(buf, 12)

    {
        const eoff = DCFG_HEADER_SIZE + numEntries * DCFG_ENTRY_SIZE
        const doff = eoff + entoff
        if (entryHash(buf, eoff) != 0xffff || read16(buf, doff + 2) != 0xffff)
            error("final entry hash non 0xffff hash/size/type")
    }

    const hash_jump = buf.slice(
        DCFG_HEADER_HASH_JUMP_OFFSET,
        DCFG_HEADER_HASH_JUMP_OFFSET + DCFG_HASH_JUMP_ENTRIES * 2
    )

    const hashAt = (idx: number) =>
        entryHash(buf, DCFG_HEADER_SIZE + idx * DCFG_ENTRY_SIZE) >>
        DCFG_HASH_SHIFT

    for (let i = 0; i < DCFG_HASH_JUMP_ENTRIES; ++i) {
        let idx = read16(hash_jump, i * 2)
        if (idx > numEntries) error(`hash jump idx out of range`)
        else if (hashAt(idx) < i) error(`hash jump too large at ${i}`)
        else if (idx > 0 && hashAt(idx - 1) >= i)
            error(`hash jump too small at ${i}`)
    }

    const dataPtrMin = DCFG_HEADER_SIZE + (numEntries + 1) * DCFG_ENTRY_SIZE

    let prevHash = 0

    for (let i = 0; i < numEntries; ++i) {
        const eoff = DCFG_HEADER_SIZE + i * DCFG_ENTRY_SIZE

        let ep = eoff
        while (buf[ep]) ep++
        const keylen = ep - eoff
        if (keylen > DCFG_KEYSIZE) {
            error(`no NUL termination in key #${i}`)
            continue
        }
        const kb = buf.slice(eoff, ep)
        const key = uint8ArrayToString(kb)

        const ent = buf.slice(eoff, eoff + DCFG_ENTRY_SIZE)

        {
            const ent2 = getEntry(buf, key)
            if (!ent2 || !bufferEq(ent2, ent))
                error(`invalid lookup at '${key}'`)
        }

        const hash = entryHash(ent)
        const type = entryType(ent)
        const size = entrySize(ent)
        const value = entryValue(ent)
        let realValue: DcfgValue

        if (!(prevHash <= hash)) error(`hash not in order at '${key}'`)
        prevHash = hash

        if (keyhash(kb) != hash) error(`invalid hash at key '${key}'`)

        switch (type) {
            case DCFG_TYPE_I32:
                if (size != 0)
                    error(`invalid size ${size} for i32 entry '${key}'`)
                realValue = value | 0
                break
            case DCFG_TYPE_U32:
                if (size != 0)
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
                    realValue = buf.slice(value, value + size)
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

    return res

    function error(msg: string) {
        res.errors.push(msg)
        return res
    }
}

export function decompileDcfg(settings: DcfgSettings) {
    const res: any = {}
    const dot = ".".charCodeAt(0)
    for (const key of Object.keys(settings)) {
        let prevI = 0
        let obj: any = res
        for (let i = 0; i < key.length; ++i) {
            const c = key.charCodeAt(i)
            const isArrayElt = c >= 0x80
            const isObjSep = c == dot
            if (isArrayElt || isObjSep) {
                let pref = key.slice(prevI, i)
                prevI = i + 1
                if (pref == "") pref = "services"

                if (obj[pref] === undefined) obj[pref] = isArrayElt ? [] : {}
                obj = obj[pref]
                if (isArrayElt != Array.isArray(obj))
                    throw new Error(`obj/array mismatch at ${key}`)

                if (isArrayElt) {
                    const aidx = c - 0x80
                    if (i == key.length - 1) {
                        obj[aidx] = settings[key]
                        prevI = -1
                    } else {
                        if (obj[aidx] === undefined) obj[aidx] = {}
                        obj = obj[aidx]
                    }
                }
            }
        }
        if (prevI != -1) obj[key.slice(prevI)] = settings[key]
    }
    return res
}

export function jsonToDcfg(obj: any, interpretStrings = false) {
    const res: DcfgSettings = {}
    const flattenObj = (val: any, key: string) => {
        if (typeof val == "boolean") val = val ? 1 : 0
        if (typeof val == "string") {
            if (interpretStrings) {
                const tmp = parseAnyInt(val)
                if (tmp != undefined) val = tmp
                else if (/^hex:[0-9a-f ]+$/.test(val)) {
                    val = fromHex(val.slice(4).replace(/ /g, ""))
                }
            }
            res[key] = val
        } else if (typeof val == "number") {
            if ((val | 0) != val && val >>> 0 != val)
                throw new Error("non u32/i32 number")
            res[key] = val
        } else if (Array.isArray(val)) {
            for (let i = 0; i < val.length; ++i) {
                if (val[i] != null)
                    flattenObj(val[i], key + String.fromCharCode(0x80 + i))
            }
        } else if (typeof val == "object") {
            for (const subkey of Object.keys(val)) {
                if (subkey.startsWith("$")) continue
                if (subkey.startsWith("#")) continue
                let suff = !key && subkey == "services" ? "" : subkey
                if (
                    suff.length &&
                    key.length &&
                    key.charCodeAt(key.length - 1) < 0x80
                )
                    suff = "." + suff
                flattenObj(val[subkey], key + suff)
            }
        } else {
            throw new Error(`invalid value ${key}: ${val}`)
        }
    }
    flattenObj(obj, "")
    return res
}

export async function expandDcfgJSON(
    fn: string,
    readFile: (fn: string) => Promise<string>
) {
    return await expand(fn)

    async function expand(fn: string): Promise<any> {
        const mainJson = await readJSON(fn)
        if (mainJson["$include"]) {
            const prev = await expand(mainJson["$include"])
            delete mainJson["$include"]

            for (const serv of ["$services", "services"]) {
                if (
                    Array.isArray(mainJson[serv]) &&
                    Array.isArray(prev[serv])
                ) {
                    for (const p of prev[serv]) {
                        const ex = mainJson[serv].findIndex(
                            (e: any) => e.service == p.service
                        )
                        if (ex >= 0) {
                            Object.assign(p, mainJson[serv][ex])
                            mainJson[serv][ex] = p
                        } else {
                            mainJson[serv].push(p)
                        }
                    }
                    delete prev[serv]
                }
            }
            for (const k of Object.keys(prev)) {
                if (mainJson[k] === undefined) mainJson[k] = prev[k]
            }
        }
        return mainJson
    }

    async function readJSON(fn: string) {
        const input = await readFile(fn)
        try {
            const r = JSON.parse(input)
            if (!r || typeof r != "object" || Array.isArray(r))
                throw new Error("expecting JSON object")
            return r
        } catch (e) {
            throw new Error(`${fn}: JSON parsing: ${e.message}`)
        }
    }
}
