import * as ds from "@devicescript/core"

type SocketEvent = "open" | "close" | "message" | "error"
type DsSockets = typeof ds & {
    _socketOpen(host: string, port: number): number
    _socketClose(): number
    _socketWrite(buf: Buffer | string): number
    _socketOnEvent(event: SocketEvent, arg?: Buffer | string): void
}

let socket: Socket

export type SocketProto = "tcp" | "tls"

export enum ReadyState {
    Connecting = 0,
    Open = 1,
    Closing = 2,
    Closed = 3,
}

export interface SocketConnectOptions {
    host: string
    port: number
    proto?: SocketProto
    timeout?: number
}

export class SocketReader {
    private socket: Socket
    private lastError: Error
    private buffers: Buffer[] = []
    private unsubs: ds.Unsubscribe[] = []
    private emitter = ds.emitter()

    constructor(socket: Socket) {
        this.socket = socket
        this.unsubs.push(
            this.socket.onerror.subscribe(error => {
                this.lastError = error
                this.unsubscribe()
                this.emitter.emit(undefined)
            }),
            this.socket.onmessage.subscribe(data => {
                this.buffers.push(data)
                this.emitter.emit(undefined)
            }),
            this.socket.onclose.subscribe(() => {
                this.unsubscribe()
                this.emitter.emit(undefined)
            })
        )
    }

    /**
     * Receive next bit of data from the socket.
     * @param timeout in ms, defaults to Infinity
     * @returns Buffer or `undefined` on timeout or `null` when socket is closed
     */
    async read(timeout?: number): Promise<Buffer | undefined | null> {
        for (;;) {
            if (this.buffers.length) {
                const r = this.buffers.shift()
                return r
            }
            if (this.lastError) throw this.lastError
            if (this.socket.readyState === ReadyState.Closed) return null
            const v = await ds.wait(this.emitter, timeout)
            if (v === undefined) return undefined
        }
    }

    async readLine(): Promise<string> {
        let bufs: Buffer[] = []
        for (;;) {
            const b = await this.read()
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

    unsubscribe() {
        for (const unsub of this.unsubs) {
            unsub()
        }
        this.unsubs = []
    }
}

export class Socket {
    readyState: ReadyState
    private lastError: Error
    private emitter = ds.emitter<Buffer | boolean | Error>()

    public readonly onopen = ds.emitter()
    public readonly onclose = ds.emitter()
    public readonly onerror = ds.emitter<Error>()
    public readonly onmessage = ds.emitter<Buffer>()

    private constructor(public name: string) {}

    private error(msg: string): Error {
        return new Error(`socket ${this.name}: ${msg}`)
    }

    private check() {
        if (this !== socket) throw this.error(`old socket used`)
    }

    /**
     * Gets a socket reader
     * @returns
     */
    getReader() {
        return new SocketReader(this)
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
        this.readyState = ReadyState.Closed
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
        this.readyState = ReadyState.Closed
        socket = null
        this.emitter.emit(false)
    }

    static _socketOnEvent(event: SocketEvent, arg?: Buffer | string) {
        if (event !== "message")
            console.debug("socket", socket?.name, event, arg)

        if (!socket) return

        const s = socket
        switch (event) {
            case "open":
                s.emitter.emit(true)
                s.onopen.emit(undefined)
                break
            case "close":
                s.finish(null)
                s.onclose.emit(undefined)
                break
            case "error":
                s.finish(arg + "")
                s.onerror.emit(new Error(arg + ""))
                break
            case "message":
                s.emitter.emit(false)
                s.onmessage.emit(arg as Buffer)
                break
            default:
                console.warn("unknown event", event)
        }
    }

    static async _connect(options: SocketConnectOptions) {
        let { host, port, proto } = options
        if (!proto) proto = "tcp"
        const port2 = proto === "tls" ? -port : port
        ;(ds as DsSockets)._socketOnEvent = Socket._socketOnEvent
        socket?.finish("terminated")
        const sock = new Socket(`${proto}://${host}:${port}`)
        socket.readyState = ReadyState.Connecting
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

        sock.readyState = ReadyState.Open
        ds.assert(sock.readyState === ReadyState.Open)
        ds.assert(v === true)
        return socket
    }
}

/**
 * Create a new socket and connect it.
 * Throws on error or timeout.
 * @param options socket connection options
 */
export async function connect(options: SocketConnectOptions) {
    return await Socket._connect(options)
}
