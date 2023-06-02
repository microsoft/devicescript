import * as ds from "@devicescript/core"

type SocketEvent = "open" | "close" | "data" | "error"
type DsSockets = typeof ds & {
    _socketOpen(host: string, port: number): number
    _socketClose(): number
    _socketWrite(buf: Buffer): number
    _socketOnEvent(event: SocketEvent, arg?: Buffer | string): void
}

let socket: Socket

export class Socket {
    private buffers: Buffer[] = []
    private lastError: Error
    private closed: boolean
    private emitter = ds.emitter<Buffer | boolean | Error>()

    private constructor(public name: string) {
        const self = this
        this.emitter.subscribe(v => {
            if (v instanceof Buffer) self.buffers.push(v)
            if (v instanceof Error) {
                self.lastError = v
                self.closed = true
            }
            if (v === false) {
                self.closed = true
            }
        })
    }

    private terminate() {
        socket = null
        this.emitter.emit(this.error("terminated"))
    }

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
            if (this.lastError) throw this.lastError
            if (this.closed) return null
            if (this.buffers.length) {
                const r = this.buffers.shift()
                return r
            }
            const v = await ds.wait(this.emitter, timeout)
            if (v === undefined) return undefined
        }
    }

    /**
     * Send given buffer over the socket.
     * Throws when connection is closed or there is an error.
     */
    async send(buf: Buffer) {
        for (;;) {
            this.check()
            const r = (ds as DsSockets)._socketWrite(buf)
            if (r == 0) break
            if (r == -1) await ds.sleep(10)
            throw this.error(`send error ${r}`)
        }
    }

    static _socketOnEvent(event: SocketEvent, arg?: Buffer | string) {
        if (!socket) return
        const e = socket.emitter
        switch (event) {
            case "open":
                e.emit(true)
                break
            case "close":
                e.emit(false)
                socket = null
                break
            case "error":
                e.emit(socket.error(arg + ""))
                socket = null
                break
            case "data":
                if (arg instanceof Buffer) e.emit(arg)
                break
        }
    }

    /**
     * Create a new socket and connect it.
     * Throws on error or timeout.
     */
    static async connect(options: {
        host: string
        port: number
        proto?: "tcp" | "tls"
        timeout?: number
    }) {
        const { host, port, proto = "tcp" } = options
        const port2 = proto === "tls" ? -port : port
        ;(ds as DsSockets)._socketOnEvent = Socket._socketOnEvent
        socket?.terminate()
        socket = new Socket(`${proto}://${host}:${port}`)
        const r = (ds as DsSockets)._socketOpen(options.host, port2)
        if (r != 0) {
            const e = socket.error(`can't connect: ${r}`)
            socket = null
            throw e
        }
        const v = await ds.wait(socket.emitter, options.timeout || 30000)
        if (v instanceof Error) throw v
        if (v === undefined) throw socket.error("Timeout")
        ds.assert(v === true)
        return socket
    }
}
