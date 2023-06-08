// https://dev.blues.io/guides-and-tutorials/notecard-guides/serial-over-i2c-protocol/

import { I2CStatus, delay } from "@devicescript/core"
import { I2CError, i2c } from "@devicescript/i2c"

function log(msg: string) {
    console.log(`notes> ` + msg)
}
function debug(msg: string) {
    // console.debug(`notes> ` + msg)
}

export interface Request {
    req: string
}

export interface Response {}

export interface HubRequest extends Request {
    req: "hub.status" | "hub.sync" | "hub.sync.status" | "hub.get" | "hub.set"
}

export interface LogRequest extends Request {
    req: "hub.log"
    text: string
}

export interface NoteRequest extends Request {
    req: "note.add" | "note.get" | "note.delete" | "note.udpate"
}

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
export async function request(req: Request): Promise<Response> {
    if (!req || !req.req) {
        log(`invalid request`)
        return undefined
    }

    if (pending.length > MAX_QUEUE) {
        log(`request queue full`)
        return undefined
    }

    // block until it's our turn to send a message
    pending.push(req)
    while (pending[0] !== req) await delay(1000)

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
    const rstr = res.toString()
    log(rstr)
    const r = JSON.parse(rstr) as Response
    await delay(250)
    return r
}

async function query() {
    // debug(`query`)
    try {
        await i2c.writeBuf(ADDRESS, Buffer.alloc(2))
    } catch (e) {
        if (e instanceof I2CError) return undefined
        throw e
    }
    const sz = await i2c.readBuf(ADDRESS, 2)
    // debug(`query > ${sz.toHex()}`)
    return sz
}

function encode(req: Request): Buffer {
    // notes will reconstruct the JSON message until \n is found
    const str = JSON.stringify(req) + "\n"
    const buf = Buffer.from(str)
    log(str)
    return buf
}

async function receive(): Promise<Buffer> {
    let sz = Buffer.alloc(2)
    while (sz !== undefined && sz[0] === 0 && sz[1] === 0) {
        await delay(25)
        sz = await query()
    }
    if (sz === undefined) return undefined // error

    let res = Buffer.alloc(0)
    while (sz[0] > 0) {
        // debug(`reading ${sz[0]} bytes`)
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
    let error = 0
    let index = 0
    while (index < buf.length) {
        const chunk = buf.slice(index, Math.min(CHUNK, buf.length - index))
        const sent = await send(chunk)
        if (!sent) break
        index += chunk.length
        await delay(20)
    }
    // debug(`write > ${error}`)
    return error
}

async function send(buf: Buffer): Promise<boolean> {
    const sbuf = Buffer.alloc(buf.length + 1)
    sbuf[0] = buf.length
    await sbuf.blitAt(1, buf, 0, buf.length)
    try {
        await i2c.writeBuf(ADDRESS, sbuf)
        return true
    } catch (e) {
        if (e instanceof I2CError) {
            const status: number = e.status
            switch (status) {
                case I2CStatus.OK:
                    break
                case 1:
                    log("data too long to fit in transmit buffer")
                    break
                case I2CStatus.NoI2C:
                    log("received NACK on transmit of address")
                    break
                case I2CStatus.NAckData:
                    log("received NACK on transmit of data")
                    break
                case 4:
                    log("unknown error on TwoWire::endTransmission()")
                    break
                case 5:
                    log("timeout")
                    break
                default:
                    log(
                        `unknown error encounter during I2C transmission ${status}`
                    )
            }
            return false
        } else throw e
    }
}
