export function throwError(msg: string, cancel?: boolean) {
    const e = new Error(msg)
    if (cancel)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e as any).__cancel = true
    throw e
}

export function isCancelError(e: Error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(e as any)?.__cancel
}

export function setAckError(e: Error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (e) (e as any).__ack = true
}

export function isAckError(e: Error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(e as any)?.__ack
}

export function delay<T>(millis: number, value?: T): Promise<T | undefined> {
    return new Promise(resolve => setTimeout(() => resolve(value), millis))
}

export function memcpy(
    trg: Uint8Array,
    trgOff: number,
    src: ArrayLike<number>,
    srcOff?: number,
    len?: number
) {
    if (srcOff === void 0) srcOff = 0
    if (len === void 0) len = src.length - srcOff
    for (let i = 0; i < len; ++i) trg[trgOff + i] = src[srcOff + i]
}

export function strcmp(a: string, b: string) {
    if (a == b) return 0
    if (a < b) return -1
    else return 1
}

export function bufferEq(a: Uint8Array, b: ArrayLike<number>, offset = 0) {
    if (a == b) return true
    if (!a || !b || a.length != b.length) return false
    for (let i = offset; i < a.length; ++i) {
        if (a[i] != b[i]) return false
    }
    return true
}

export function hash(buf: Uint8Array, bits: number) {
    bits |= 0
    if (bits < 1) return 0
    const h = fnv1(buf)
    if (bits >= 32) return h >>> 0
    else return ((h ^ (h >>> bits)) & ((1 << bits) - 1)) >>> 0
}

export function idiv(a: number, b: number) {
    return ((a | 0) / (b | 0)) | 0
}
export function fnv1(data: Uint8Array) {
    let h = 0x811c9dc5
    for (let i = 0; i < data.length; ++i) {
        h = Math.imul(h, 0x1000193) ^ data[i]
    }
    return h
}

export function crc(p: Uint8Array) {
    let crc = 0xffff
    for (let i = 0; i < p.length; ++i) {
        const data = p[i]
        let x = (crc >> 8) ^ data
        x ^= x >> 4
        crc = (crc << 8) ^ (x << 12) ^ (x << 5) ^ x
        crc &= 0xffff
    }
    return crc
}

export function ALIGN(n: number) {
    return (n + 3) & ~3
}

// this will take lower 8 bits from each character
export function stringToUint8Array(input: string) {
    const len = input.length
    const res = new Uint8Array(len)
    for (let i = 0; i < len; ++i) res[i] = input.charCodeAt(i) & 0xff
    return res
}

export function uint8ArrayToString(input: ArrayLike<number>) {
    const len = input.length
    let res = ""
    for (let i = 0; i < len; ++i) res += String.fromCharCode(input[i])
    return res
}

export function fromUTF8(binstr: string) {
    if (!binstr) return ""

    // escape function is deprecated
    let escaped = ""
    for (let i = 0; i < binstr.length; ++i) {
        const k = binstr.charCodeAt(i) & 0xff
        if (k == 37 || k > 0x7f) {
            escaped += "%" + k.toString(16)
        } else {
            escaped += binstr.charAt(i)
        }
    }

    // decodeURIComponent does the actual UTF8 decoding
    return decodeURIComponent(escaped)
}

export function toUTF8(str: string, cesu8?: boolean) {
    let res = ""
    if (!str) return res
    for (let i = 0; i < str.length; ++i) {
        let code = str.charCodeAt(i)
        if (code <= 0x7f) res += str.charAt(i)
        else if (code <= 0x7ff) {
            res += String.fromCharCode(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
        } else {
            if (!cesu8 && 0xd800 <= code && code <= 0xdbff) {
                const next = str.charCodeAt(++i)
                if (!isNaN(next))
                    code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00)
            }

            if (code <= 0xffff)
                res += String.fromCharCode(
                    0xe0 | (code >> 12),
                    0x80 | ((code >> 6) & 0x3f),
                    0x80 | (code & 0x3f)
                )
            else
                res += String.fromCharCode(
                    0xf0 | (code >> 18),
                    0x80 | ((code >> 12) & 0x3f),
                    0x80 | ((code >> 6) & 0x3f),
                    0x80 | (code & 0x3f)
                )
        }
    }
    return res
}

export type SMap<T> = Record<string, T>

/** @internal */
export class PromiseBuffer<T> {
    private waiting: ((v: T | Error) => void)[] = []
    private available: (T | Error)[] = []

    drain() {
        for (const f of this.waiting) {
            f(new Error("Promise Buffer Reset"))
        }
        this.waiting = []
        this.available = []
    }

    pushError(v: Error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.push(v as any)
    }

    push(v: T) {
        const f = this.waiting.shift()
        if (f) f(v)
        else this.available.push(v)
    }

    shiftAsync(timeout = 0) {
        if (this.available.length > 0) {
            const v = this.available.shift()
            if (v instanceof Error) return Promise.reject<T>(v)
            else return Promise.resolve<T | undefined>(v)
        } else
            return new Promise<T>((resolve, reject) => {
                const f = (v: T | Error) => {
                    if (v instanceof Error) reject(v)
                    else resolve(v)
                }
                this.waiting.push(f)
                if (timeout > 0) {
                    delay(timeout).then(() => {
                        const idx = this.waiting.indexOf(f)
                        if (idx >= 0) {
                            this.waiting.splice(idx, 1)
                            reject(new Error("Timeout"))
                        }
                    })
                }
            })
    }
}

/** @internal */
export class PromiseQueue {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly promises: SMap<(() => Promise<any>)[]> = {}

    enqueue<T>(id: string, f: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let arr = this.promises[id]
            if (!arr) {
                arr = this.promises[id] = []
            }
            const cleanup = () => {
                arr.shift()
                if (arr.length == 0) delete this.promises[id]
                else arr[0]()
            }
            arr.push(() =>
                f().then(
                    v => {
                        cleanup()
                        resolve(v)
                    },
                    err => {
                        cleanup()
                        reject(err)
                    }
                )
            )
            if (arr.length == 1) arr[0]()
        })
    }
}

export function rgbToHtmlColor(rgb: number) {
    return `#${("000000" + rgb.toString(16)).slice(-6)}`
}

export function toFullHex(n: number[]) {
    return (
        "0x" + n.map(id => ("000000000" + id.toString(16)).slice(-8)).join("")
    )
}

export function toHex(bytes: ArrayLike<number>, sep?: string) {
    if (!bytes) return undefined
    let r = ""
    for (let i = 0; i < bytes.length; ++i) {
        if (sep && i > 0) r += sep
        r += ("0" + bytes[i].toString(16)).slice(-2)
    }
    return r
}

export function fromHex(hex: string) {
    const r = new Uint8Array(hex.length >> 1)
    for (let i = 0; i < hex.length; i += 2)
        r[i >> 1] = parseInt(hex.slice(i, i + 2), 16)
    return r
}

export function isSet(v: unknown) {
    return v !== null && v !== undefined
}

export function toArray<T>(a: ArrayLike<T>): T[] {
    if (!a) return undefined
    const r: T[] = new Array(a.length)
    for (let i = 0; i < a.length; ++i) r[i] = a[i]
    return r
}

export interface MutableArrayLike<T> {
    readonly length: number
    [n: number]: T
}

export function hexNum(n: number): string {
    if (isNaN(n)) return undefined
    if (n < 0) return "-" + hexNum(-n)
    return "0x" + n.toString(16)
}

export function write32(buf: MutableArrayLike<number>, pos: number, v: number) {
    buf[pos + 0] = (v >> 0) & 0xff
    buf[pos + 1] = (v >> 8) & 0xff
    buf[pos + 2] = (v >> 16) & 0xff
    buf[pos + 3] = (v >> 24) & 0xff
}

export function write24(buf: MutableArrayLike<number>, pos: number, v: number) {
    buf[pos + 0] = (v >> 0) & 0xff
    buf[pos + 1] = (v >> 8) & 0xff
    buf[pos + 2] = (v >> 16) & 0xff
}

export function write16(buf: MutableArrayLike<number>, pos: number, v: number) {
    buf[pos + 0] = (v >> 0) & 0xff
    buf[pos + 1] = (v >> 8) & 0xff
}

export function read32(buf: ArrayLike<number>, pos: number) {
    return (
        (buf[pos] |
            (buf[pos + 1] << 8) |
            (buf[pos + 2] << 16) |
            (buf[pos + 3] << 24)) >>>
        0
    )
}

export function read16(buf: ArrayLike<number>, pos: number) {
    return buf[pos] | (buf[pos + 1] << 8)
}

export function encodeU32LE(words: number[]) {
    const r = new Uint8Array(words.length * 4)
    for (let i = 0; i < words.length; ++i) write32(r, i * 4, words[i])
    return r
}

export function decodeU32LE(buf: Uint8Array) {
    const res: number[] = []
    for (let i = 0; i < buf.length; i += 4) res.push(read32(buf, i))
    return res
}

export function isBufferEmpty(data: Uint8Array): boolean {
    if (!data) return true
    const n = data.length
    for (let i = 0; i < n; ++i) {
        if (data[i]) return false
    }
    return true
}

export function bufferToString(buf: Uint8Array) {
    return fromUTF8(uint8ArrayToString(buf))
}

export function stringToBuffer(str: string) {
    return stringToUint8Array(toUTF8(str))
}

export function bufferConcat(a: Uint8Array, b: Uint8Array) {
    const r = new Uint8Array(a.length + b.length)
    r.set(a, 0)
    r.set(b, a.length)
    return r
}

export function bufferConcatMany(bufs: Uint8Array[]) {
    let sz = 0
    for (const buf of bufs) sz += buf.length
    const r = new Uint8Array(sz)
    sz = 0
    for (const buf of bufs) {
        r.set(buf, sz)
        sz += buf.length
    }
    return r
}

export function arrayConcatMany<T>(arrs: T[][]): T[] {
    if (!arrs) return undefined

    // weed out empty array
    arrs = arrs.filter(a => !!a?.length)

    let sz = 0
    for (const buf of arrs) sz += buf.length
    const r: T[] = new Array(sz)
    sz = 0
    for (const arr of arrs) {
        for (let i = 0; i < arr.length; ++i) r[i + sz] = arr[i]
        sz += arr.length
    }
    return r
}

export function jsonCopyFrom<T>(trg: T, src: T) {
    const v = clone(src)
    for (const k of Object.keys(src)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-extra-semi
        ;(trg as any)[k] = (v as any)[k]
    }
}
export function assert(
    cond: boolean,
    msg = "Assertion failed",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debugData?: any
) {
    if (!cond) {
        if (debugData) console.debug(`assertion filed ${msg}`, debugData)
        // eslint-disable-next-line no-debugger
        debugger
        throw new Error(msg)
    }
}

export function flatClone<T extends unknown>(obj: T | null): T {
    if (obj == null) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = {}
    Object.keys(obj).forEach(k => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        r[k] = (obj as any)[k]
    })
    return r
}

export function clone<T>(v: T): T {
    if (v == null) return null
    return JSON.parse(JSON.stringify(v))
}

export function throttle(handler: () => void, delay: number): () => void {
    let enableCall = true
    return function () {
        if (!enableCall) return
        enableCall = false
        handler()
        setTimeout(() => (enableCall = true), delay)
    }
}

export interface Signal {
    signalled: Promise<boolean>
    signal: () => void
}
export function signal(): Signal {
    let resolve: (v: boolean) => void
    return {
        signalled: new Promise(r => {
            resolve = r
        }),
        signal: () => resolve(true),
    }
}

export function readBlobToUint8Array(blob: Blob): Promise<Uint8Array> {
    if (blob?.arrayBuffer) {
        return blob.arrayBuffer().then(data => new Uint8Array(data))
    }

    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            resolve(new Uint8Array(fileReader.result as ArrayBuffer))
        }
        fileReader.onerror = e => {
            //console.log(e)
            reject(e)
        }
        try {
            fileReader.readAsArrayBuffer(blob)
        } catch (e) {
            reject(e)
        }
    })
}

export function readBlobToText(blob: Blob): Promise<string> {
    if (blob.text) {
        return blob.text()
    }

    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = () => resolve(fileReader.result as string)
        fileReader.onerror = e => {
            //console.log(e)
            reject(e)
        }
        try {
            fileReader.readAsText(blob)
        } catch (e) {
            reject(e)
        }
    })
}

export function debounce(handler: () => void, delay: number): () => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeOutId: any
    return function () {
        if (timeOutId) {
            clearTimeout(timeOutId)
        }
        timeOutId = setTimeout(async () => {
            handler()
        }, delay)
    }
}

export function debounceAsync(
    handler: () => Promise<void>,
    delay: number
): () => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeOutId: any
    return function () {
        if (timeOutId) {
            clearTimeout(timeOutId)
        }
        timeOutId = setTimeout(async () => {
            await handler()
        }, delay)
    }
}

export function JSONTryParse<T = unknown>(
    src: string,
    defaultValue?: T
): T | undefined | null {
    if (src === undefined) return undefined
    if (src === null) return null

    try {
        return JSON.parse(src) as T
    } catch (e) {
        return defaultValue
    }
}

export function roundWithPrecision(
    x: number,
    digits: number,
    round = Math.round
): number {
    digits = digits | 0
    // invalid digits input
    if (digits <= 0) return round(x)
    if (x == 0) return 0
    let r = 0
    while (r == 0 && digits < 21) {
        const d = Math.pow(10, digits++)
        r = round(x * d + Number.EPSILON) / d
    }
    return r
}

export function renderWithPrecision(
    x: number,
    digits: number,
    round = Math.round
): string {
    const r = roundWithPrecision(x, digits, round)
    let rs = r.toLocaleString()
    if (digits > 0) {
        let doti = rs.indexOf(".")
        if (doti < 0) {
            rs += "."
            doti = rs.length - 1
        }
        while (rs.length - 1 - doti < digits) rs += "0"
    }
    return rs
}

export function randomRange(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
}

export function unique(values: string[]): string[] {
    return Array.from(new Set(values).keys())
}

export function uniqueMap<T, U>(
    values: T[],
    id: (value: T) => string,
    converter: (value: T) => U
) {
    const r: SMap<T> = {}
    for (let i = 0; i < values.length; ++i) {
        const value = values[i]
        const idv = id(value)
        if (!r[idv]) {
            r[idv] = value
        }
    }
    return Object.values(r).map(converter)
}

export function toMap<T, V>(
    a: T[],
    keyConverter: (value: T, index: number) => string,
    valueConverter: (value: T, index: number) => V,
    ignoreMissingValues?: boolean
): SMap<V> {
    const m: SMap<V> = {}
    if (a)
        for (let i = 0; i < a.length; ++i) {
            const key = keyConverter(a[i], i)
            if (key === undefined || key === null) continue
            const v = valueConverter(a[i], i)
            if (ignoreMissingValues && (v === undefined || v === null)) continue
            m[key] = v
        }
    return m
}

export function ellipse(text: string, maxChars: number, suffix = "...") {
    if (
        !isNaN(maxChars) &&
        maxChars > 0 &&
        text?.length > maxChars - suffix.length
    )
        return text.slice(0, maxChars) + suffix
    return text
}

export function ellipseFirstSentence(text: string) {
    const i = text.indexOf(".")
    if (i < 0) return text
    else return text.slice(0, i + 1)
}

export function ellipseJoin(
    values: string[],
    maxChars: number,
    ellipse = "..."
) {
    let r = ""
    for (let i = 0; i < values.length && r.length < maxChars; ++i) {
        if (r) r += ", "
        r += values[i]
    }
    if (r.length > maxChars - ellipse.length)
        return r.slice(0, maxChars) + ellipse
    else return r
}

export function arrayShuffle<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export function uniqueName(
    names: string[],
    name: string,
    separator = ""
): string {
    if (names.indexOf(name) < 0) return name
    // allocate names
    let count = 2
    while (names.indexOf(`${name}${separator}${count}`) > -1) count++
    return `${name}${separator}${count}`
}

export function groupBy<T>(list: T[], key: (value: T) => string): SMap<T[]> {
    if (!list) return {}

    const r: SMap<T[]> = {}
    list.forEach(item => {
        const k = key(item)
        const a = r[k] || (r[k] = [])
        a.push(item)
    })
    return r
}

export function pick(...values: number[]) {
    return values?.find(x => x !== undefined)
}

/**
 * Applies filters and returns array of [yays, nays]
 * @param values
 * @param condition
 */
export function splitFilter<T>(
    values: ArrayLike<T>,
    condition: (t: T) => boolean
): [T[], T[]] {
    const yays: T[] = []
    const nays: T[] = []
    const n = values.length
    for (let i = 0; i < n; ++i) {
        const v = values[i]
        if (condition(v)) yays.push(v)
        else nays.push(v)
    }
    return [yays, nays]
}

export function range(end: number): number[] {
    return Array(end)
        .fill(0)
        .map((_, i) => i)
}

export function toggleBit(data: Uint8Array, bitindex: number) {
    data[bitindex >> 3] ^= 1 << (bitindex & 7)
}

export function getBit(data: Uint8Array, bitindex: number) {
    return !!(data[bitindex >> 3] & (1 << (bitindex & 7)))
}

export function setBit(data: Uint8Array, bitindex: number, on: boolean) {
    if (on) data[bitindex >> 3] |= 1 << (bitindex & 7)
    else data[bitindex >> 3] &= ~(1 << (bitindex & 7))
}

export function parseIdentifier(value: number | string) {
    if (typeof value === "string" && /^0x[0-9a-f]+$/i.test(value as string)) {
        return parseInt(value, 16)
    } else if (typeof value === "string" && /^[0-9]+$/i.test(value as string))
        return parseInt(value)
    return Number(value)
}
