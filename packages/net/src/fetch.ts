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
    if (!hd.has("user-agent")) hd.set("user-agent", "DeviceScript fetch()")
    if (!hd.has("accept")) hd.set("accept", "*/*")
    hd.set("host", host)
    hd.set("connection", "close")
    const req = [`${options.method} ${path} HTTP/1.1`]
    hd.forEach((v, k) => {
        req.push(`${k}: ${v}`)
    })
    req.push("", "")
    const reqStr = req.join("\r\n")

    const s = await Socket.connect({
        host,
        port,
        proto,
    })
    console.debug(`req: ${JSON.stringify(reqStr)}`)
    await s.send(reqStr)
    for (;;) {
        const r = await s.recv()
        if (!r) break
        console.debug(r.toString("utf-8"))
    }
}
