import { Socket, SocketProto } from "./sockets"

export interface FetchOptions {
    method?:
        | "GET"
        | "HEAD"
        | "POST"
        | "PUT"
        | "DELETE"
        | "OPTIONS"
        | "PATCH"
        | string
    headers?: Record<string, string> | Headers
    body?: string | Buffer
}

/**
 * Represents HTTP request or response headers.
 *
 * @devsWhenUsed
 */
export class Headers {
    private data: Record<string, string> = {}
    constructor() {}
    append(name: string, value: string): void {
        name = name.toLowerCase()
        if (this.has(name)) this.data[name] = this.data[name] + ", " + value
        else this.data[name] = value
    }
    delete(name: string): void {
        delete this.data[name.toLowerCase()]
    }
    get(name: string): string | null {
        const r = this.data[name.toLowerCase()]
        if (r === undefined) return null
        return r
    }
    has(name: string): boolean {
        return this.data[name.toLowerCase()] !== undefined
    }
    set(name: string, value: string): void {
        this.data[name.toLowerCase()] = value
    }
    forEach(
        callbackfn: (value: string, key: string, parent: Headers) => void
    ): void {
        for (const k of Object.keys(this.data)) {
            callbackfn(this.data[k], k, this)
        }
    }
    serialize() {
        const req: string[] = []
        this.forEach((v, k) => {
            req.push(`${k}: ${v}`)
        })
        req.push("")
        return req.join("\r\n")
    }
}

/**
 * Represents a HTTP response.
 *
 * @devsWhenUsed
 */
export class Response {
    status: number
    statusText: string
    headers: Headers
    ok: boolean
    private _buffer: Buffer

    constructor(private socket: Socket) {
        this.headers = new Headers()
    }

    async buffer() {
        if (this._buffer) return this._buffer
        const explen = parseInt(this.headers.get("content-length"))
        const buffers: Buffer[] = []
        let buflen = 0
        for (;;) {
            const buf = await this.socket.recv()
            if (!buf) break
            buflen += buf.length
            buffers.push(buf)
            // note: explen can be NaN
            if (buflen >= explen) break
        }
        await this.socket.close()
        this._buffer = Buffer.concat(...buffers)
        return this._buffer
    }

    async text() {
        return (await this.buffer()).toString("utf-8")
    }

    async json() {
        return JSON.parse(await this.text())
    }

    async close() {
        await this.socket.close()
    }
}

export async function fetch(url: string, options?: FetchOptions) {
    if (!options) options = {}
    if (!options.method) options.method = "GET"
    if (!options.headers) options.headers = new Headers()
    if (!options.body) options.body = ""

    let proto: SocketProto = "tcp"
    let port = 80
    let urlsuff: string
    if (url.startsWith("https://")) {
        proto = "tls"
        port = 443
        urlsuff = url.slice(8)
    } else if (url.startsWith("http://")) {
        urlsuff = url.slice(7)
    } else {
        throw new TypeError(`invalid url: ${url}`)
    }
    let slash = urlsuff.indexOf("/")
    if (slash < 0) slash = urlsuff.length
    let host = urlsuff.slice(0, slash)
    let path = urlsuff.slice(slash) || "/"
    if (host.includes("@"))
        throw new TypeError(`credentials in URL not supported: ${url}`)
    let colon = host.indexOf(":")
    if (colon > 0) {
        host = host.slice(0, colon)
        port = +host.slice(colon + 1)
        if (!port) throw new TypeError(`invalid port in url: ${url}`)
    }

    let hd: Headers
    if (options.headers instanceof Headers) {
        hd = options.headers
    } else {
        hd = new Headers()
        for (const k of Object.keys(options.headers)) {
            hd.set(k, options.headers[k])
        }
    }

    let bodyLen = 0
    if (typeof options.body === "string") bodyLen = options.body.byteLength
    else if (options.body instanceof Buffer) bodyLen = options.body.length
    else
        throw new TypeError(
            `body has to be string or buffer; got ${options.body}`
        )

    if (!hd.has("user-agent")) hd.set("user-agent", "DeviceScript fetch()")
    if (!hd.has("accept")) hd.set("accept", "*/*")
    hd.set("host", host)
    hd.set("connection", "close")
    if (bodyLen) hd.set("content-length", bodyLen + "")

    const reqStr = `${options.method} ${path} HTTP/1.1\r\n${hd.serialize()}\r\n`
    const s = await Socket.connect({
        host,
        port,
        proto,
    })
    console.debug(`req: ${reqStr}`)
    await s.send(reqStr)
    if (bodyLen) await s.send(options.body)

    const resp = new Response(s)

    let status = await s.readLine()
    if (status.startsWith("HTTP/1.1 ")) {
        status = status.slice(9)
        resp.status = parseInt(status)
        const sp = status.indexOf(" ")
        if (sp > 0) resp.statusText = status.slice(sp + 1)
        else resp.statusText = ""
        if (200 <= resp.status && resp.status <= 299) resp.ok = true
    } else {
        resp.status = 0
        resp.statusText = status
    }

    console.debug(`HTTP ${resp.status}: ${resp.statusText}`)

    for (;;) {
        const hd = await s.readLine()
        if (hd === "") break
        const colon = hd.indexOf(":")
        if (colon > 0) {
            const name = hd.slice(0, colon).trim()
            const val = hd.slice(colon + 1).trim()
            resp.headers.append(name, val)
        }
    }

    console.debug(resp.headers.serialize())
    return resp
}
