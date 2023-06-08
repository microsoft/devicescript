import { pins, board } from "@dsboard/adafruit_qt_py_c3"
// https://dev.blues.io/guides-and-tutorials/notecard-guides/serial-over-i2c-protocol/

import { _dcfgString, deviceIdentifier } from "@devicescript/core"
import { I2CStatus, delay } from "@devicescript/core"
import { I2CError, i2c } from "@devicescript/i2c"
import { readSetting } from "@devicescript/settings"

function debug(msg: string) {
    console.debug(`notes> ` + msg)
}

/**
 * A blues.io note request
 */
export interface Request {
    req: string
}

/**
 * A blues.io note response
 */
export interface Response {}

/**
 * hub requests
 */
export interface HubRequest extends Request {
    req:
        | "hub.status"
        | "hub.sync"
        | "hub.sync.status"
        | "hub.get"
        | "hub.set"
        | "hub.log"
}

export type EnvCommands = "get"

export interface EnvRequest extends Request {
    req: `env.${EnvCommands}`
}

export interface EnvGetRequest extends EnvRequest {
    req: "env.get"
    name: string
    time?: number
}

export interface EnvGetResponse extends Response {
    text: string
    time: number
}

export interface EnvGetMultipleRequest extends EnvRequest {
    req: "env.get"
    names: string[]
    time?: number
}

export interface EnvGetMultipleResponse extends Response {
    body: Record<string, string>
    time: number
}

/**
 * Setting a product io and serial number
 */
export interface HubSetRequest extends HubRequest {
    req: "hub.set"
    product?: string
    sn?: string
    mode?: "preriodic" | "continuous" | "minimum" | "off"
    /**
     * inbound data from Notehub to be synchronized to the Notecard as soon as it is detected.
     */
    sync?: boolean
    /**
     * Max wait time in minutes to sync outbound data
     */
    outbound?: number
    /**
     *  the max wait time (in minutes) to sync inbound data
     */
    inbound?: number
    /**
     * session duration in minutes
     */
    duration?: number
}

/**
 * Sends a log message to note
 */
export interface HubLogRequest extends HubRequest {
    req: "hub.log"
    text: string
}

/**
 * A blues.io note request
 */
export interface NoteRequest extends Request {
    req: "note.add" | "note.get" | "note.delete" | "note.udpate"
}

/**
 * A request to add a note
 */
export interface NoteAddRequest extends NoteRequest {
    req: "note.add"
    body: any
    file?: string
    note?: string
    sync?: boolean
    product?: string
    key?: string
    verify?: boolean
}

export type Requests =
    | HubRequest
    | HubSetRequest
    | NoteRequest
    | NoteAddRequest
    | EnvRequest
    | EnvGetRequest
    | EnvGetMultipleRequest

/**
 * Default 0x17 I2c address of notecard
 */
export let ADDRESS = 0x17
const CHUNK = 254
/**
 * Maximum number of pending note messages before dropping them.
 */
export let MAX_QUEUE = 5
// a queue of requests to avoid
const pending: Request[] = []

/**
 * The number of pending requests
 */
export function requestQueueLength() {
    return pending.length
}

/**
 * Sends a request to the notecard over i2c
 */
export async function request<T extends Requests>(req: T): Promise<Response> {
    if (!req || !req.req) {
        debug(`invalid request`)
        return undefined
    }

    if (pending.length > MAX_QUEUE) {
        debug(`request queue full`)
        return undefined
    }

    // block until it's our turn to send a message
    pending.push(req)
    // block until we can process this request
    while (pending[0] !== req) await delay(1000)
    // handle request
    let res: Response
    try {
        res = await internalRequest(req)
    } finally {
        pending.shift()
    }
    return res
}

async function internalRequest(req: Request): Promise<Response> {
    // handshake
    const handshake = await query()
    if (!handshake) return undefined

    // data write
    {
        const buf = encode(req)
        const error = await transmit(buf)
        if (error) return undefined
    } // allow release of buffer

    // data poll
    const res = await receive()
    if (!res) return { err: "i2c timeout" }
    const rstr = res.toString()
    // debug(`resp: ${rstr}`)
    let r: Response
    try {
        r = JSON.parse(rstr) as Response
    } catch (e) {
        debug(`invalid json output`)
    }
    // why?
    await delay(250)

    return r
}

async function query() {
    // https://dev.blues.io/guides-and-tutorials/notecard-guides/serial-over-i2c-protocol/#data-query
    try {
        await i2c.writeBuf(ADDRESS, hex`0000`)
    } catch (e) {
        if (e instanceof I2CError) return undefined
        throw e
    }
    const sz = await i2c.readBuf(ADDRESS, 2)
    debug(`query ${sz.toString("hex")}`)
    return sz
}

function encode(req: Request): Buffer {
    // notes will reconstruct the JSON message until \n is found
    const str = JSON.stringify(req) + "\n"
    const buf = Buffer.from(str)
    return buf
}

async function receive(): Promise<Buffer> {
    let sz = Buffer.alloc(2)
    let retry = 20
    while (sz !== undefined && sz[0] === 0 && sz[1] === 0 && retry-- > 0) {
        await delay(25)
        sz = await query()
    }
    if (sz === undefined) return undefined // error

    let res = Buffer.alloc(0)
    while (sz[0] > 0) {
        debug(`reading ${sz[0]} bytes`)
        const readReq = Buffer.alloc(2)
        readReq[0] = 0
        readReq[1] = sz[0]
        await i2c.writeBuf(ADDRESS, readReq)
        const buf = await i2c.readBuf(ADDRESS, sz[0])
        res = res.concat(buf.slice(2))
        sz = buf.slice(0, 2)
    }
    return res
}

async function transmit(buf: Buffer) {
    debug(`transmit ${buf.toString("hex")}`)
    let error = 0
    let index = 0
    while (index < buf.length) {
        const chunk = buf.slice(index, Math.min(CHUNK, buf.length - index))
        error = await send(chunk)
        if (error) break
        index += chunk.length
        await delay(20)
    }
    debug(`write > ${error}`)
    return error
}

async function send(buf: Buffer): Promise<number> {
    const sbuf = Buffer.alloc(buf.length + 1)
    sbuf[0] = buf.length
    await sbuf.blitAt(1, buf, 0, buf.length)
    try {
        await i2c.writeBuf(ADDRESS, sbuf)
        return 0
    } catch (e) {
        if (e instanceof I2CError) {
            const status: number = e.status
            switch (status) {
                case I2CStatus.OK:
                    break
                case 1:
                    debug("data too long to fit in transmit buffer")
                    break
                case I2CStatus.NoI2C:
                    debug("received NACK on transmit of address")
                    break
                case I2CStatus.NAckData:
                    debug("received NACK on transmit of data")
                    break
                case 4:
                    debug("unknown error on TwoWire::endTransmission()")
                    break
                case 5:
                    debug("timeout")
                    break
                default:
                    debug(
                        `unknown error encounter during I2C transmission ${status}`
                    )
            }
            return status
        } else throw e
    }
}

/**
 * Initial connection to the nodecard and configures the product, serial number.
 *
 * The product and serial are read from arguments, or settings (BLUES_PID, BLUES_SN).
 * If not provided, the serial number is `dev:device id`.
 * @param options optional overrides
 */
export async function init(options?: { product?: string; sn?: string }) {
    const product = options?.product || (await readSetting("BLUES_PID"))
    const sn =
        options?.sn ||
        (await readSetting("BLUES_SN")) ||
        "devs:" + deviceIdentifier("self")
    await request(<HubSetRequest>{
        req: "hub.set",
        product,
        sn,
    })
}

await init()
await request(<HubSetRequest>{
    req: "hub.set",
    mode: "continuous",
    sync: true,
})

let i = 0
while (true) {
    await delay(5000)
    await request<HubLogRequest>({ req: "hub.log", text: "counter: " + i })
    await request(<NoteAddRequest>{
        req: "note.add",
        body: {
            i,
        },
    })
    console.log(await request({ req: "hub.status" }))
}
