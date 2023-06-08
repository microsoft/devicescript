import * as ds from "@devicescript/core"

type SocketEvent = "open" | "close" | "data" | "error"
type DsSockets = typeof ds & {
    _socketOpen(host: string, port: number): number
    _socketClose(): number
    _socketWrite(buf: Buffer | string): number
    _socketOnEvent(event: SocketEvent, arg?: Buffer | string): void
}

let socket: Socket

export type SocketProto = "tcp" | "tls"

export class Socket {
    private buffers: Buffer[] = []
    private lastError: Error
    private closed: boolean
    private emitter = ds.emitter<Buffer | boolean | Error>()

    private constructor(public name: string) {}

    private error(msg: string): Error {
        return new Error(`socket ${this.name}: ${msg}`)
    }

    private check() {
        if (this !== socket) throw this.error(`old socket used`)
    }

    /**
     * Attempt to close the current socket.
     */
    async close() {
        if (this === socket) {
            const _r = (ds as DsSockets)._socketClose()
            // ignore errors
            socket = null
        }
    }

    /**
     * Receive next bit of data from the socket.
     * @param timeout in ms, defaults to Infinity
     * @returns Buffer or `undefined` on timeout or `null` when socket is closed
     */
    async recv(timeout?: number) {
        for (;;) {
            if (this.buffers.length) {
                const r = this.buffers.shift()
                return r
            }
            if (this.lastError) throw this.lastError
            if (this.closed) return null
            const v = await ds.wait(this.emitter, timeout)
            if (v === undefined) return undefined
        }
    }

    async readLine(): Promise<string> {
        let bufs: Buffer[] = []
        for (;;) {
            const b = await this.recv()
            if (b == null) break
            let nlPos = b.indexOf(10)
            if (nlPos >= 0) {
                const rest = b.slice(nlPos + 1)
                if (rest.length) this.buffers.unshift(rest)
                if (nlPos > 0 && b[nlPos - 1] === 13) nlPos--
                bufs.push(b.slice(0, nlPos))
                break
            }
            bufs.push(b)
        }
        if (bufs.length === 0) return null
        const r = Buffer.concat(...bufs)
        return r.toString("utf-8")
    }

    /**
     * Send given buffer over the socket.
     * Throws when connection is closed or there is an error.
     */
    async send(buf: Buffer | string) {
        for (;;) {
            this.check()
            const r = (ds as DsSockets)._socketWrite(buf)
            if (r === 0) break
            if (r === -1) await ds.sleep(10)
            throw this.error(`send error ${r}`)
        }
    }

    private finish(msg: string) {
        if (msg !== null) this.lastError = this.error(msg)
        this.closed = true
        socket = null
        this.emitter.emit(false)
    }

    static _socketOnEvent(event: SocketEvent, arg?: Buffer | string) {
        if (event !== "data") console.debug("socket", socket?.name, event, arg)

        if (!socket) return

        switch (event) {
            case "open":
                socket.emitter.emit(true)
                break
            case "close":
                socket.finish(null)
                break
            case "error":
                socket.finish(arg + "")
                break
            case "data":
                socket.buffers.push(arg as Buffer)
                socket.emitter.emit(false)
                break
            default:
                console.warn("unknown event", event)
        }
    }

    /**
     * Create a new socket and connect it.
     * Throws on error or timeout.
     */
    static async connect(options: {
        host: string
        port: number
        proto?: SocketProto
        timeout?: number
    }) {
        let { host, port, proto } = options
        if (!proto) proto = "tcp"
        const port2 = proto === "tls" ? -port : port
        ;(ds as DsSockets)._socketOnEvent = Socket._socketOnEvent
        socket?.finish("terminated")
        const sock = new Socket(`${proto}://${host}:${port}`)
        socket = sock
        console.debug(`connecting to ${socket.name}`)
        const r = (ds as DsSockets)._socketOpen(options.host, port2)
        if (r !== 0) {
            const e = sock.error(`can't connect: ${r}`)
            socket = null
            throw e
        }
        const v = await ds.wait(sock.emitter, options.timeout || 30000)
        if (sock.lastError) throw sock.lastError
        if (v === undefined) throw sock.error("Timeout")
        ds.assert(!socket?.closed)
        ds.assert(v === true)
        return socket
    }
}
