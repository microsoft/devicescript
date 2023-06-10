declare type ptr = number
declare type int32 = number

export declare type DevsModule = EmscriptenModule &
    typeof Exts & {
        _jd_em_set_device_id_2x_i32(id0: int32, id1: int32): void
        _jd_em_set_device_id_string(str: ptr): void
        _jd_em_init(): void
        _jd_em_process(): number
        _jd_em_frame_received(frame: ptr): int32
        _jd_em_devs_deploy(img: ptr, size: int32): int32
        _jd_em_devs_verify(img: ptr, size: int32): int32
        _jd_em_devs_client_deploy(img: ptr, size: int32): int32
        _jd_em_devs_enable_gc_stress(en: int32): void
        _jd_em_tcpsock_on_event(ev: int32, arg: ptr, len: int32): void
        sendPacket(pkt: Uint8Array): void

        /**
         * Overrideable metod called when deployment is done.
         * @param code error code, 0 is success.
         */
        deployHandler(code: int32): void

        /**
         * Overrideable method called when a panic code is raiserd.
         * @param exitCode the panic code
         */
        panicHandler(exitCode: int32): void

        /**
         * Overridable. Read contents of flash.
         */
        flashLoad(): Uint8Array

        /**
         * Overridable. Write contents of flash.
         * Currently, we save up to 128k.
         */
        flashSave(data: Uint8Array): void
    }

declare var Module: DevsModule

// devs_timeout === undefined - program is not running
// devs_timeout === null - the C code is executing, program running
// devs_timeout is number - we're waiting for timeout, program running
var devs_timeout: number = undefined

function copyToHeap<T>(buf: Uint8Array, fn: (p: ptr) => T): T {
    const ptr = Module._malloc(buf.length)
    Module.HEAPU8.set(buf, ptr)
    const r = fn(ptr)
    Module._free(ptr)
    return r
}

function bufferConcat(a: Uint8Array, b: Uint8Array) {
    const r = new Uint8Array(a.length + b.length)
    r.set(a, 0)
    r.set(b, a.length)
    return r
}

export module Exts {
    /**
     * Debug output and stack traces are sent here.
     */
    export let dmesg = (s: string) => console.debug("    " + s)

    /**
     * Logging function
     */
    export let log = console.log

    /**
     * Error logging function
     */
    export let error = console.error

    /**
     * Callback to invoke when a packet needs to be handled by the virtual machine
     * TODO: frame or packet?
     * @param pkt a Jacdac frame
     */
    export function handlePacket(pkt: Uint8Array) {
        if (devs_timeout) {
            try {
                copyToHeap(pkt, Module._jd_em_frame_received)
            } catch {}
            clearDevsTimeout()
            process()
        }
    }

    export interface TransportResult {
        /**
         * Callback to close the transport
         */
        close: () => void
    }

    /**
     * Starts a packet transport over a TCP socket in a node.js application
     * @param require module resolution function, requires "net" package
     * @param host socket url host
     * @param port socket port
     */
    export function setupNodeTcpSocketTransport(
        require: (moduleName: string) => any,
        host: string,
        port: number
    ): Promise<TransportResult> {
        return new Promise<TransportResult>((resolve, reject) => {
            const net = require("net")
            let sock: any = null

            const send = (data: Uint8Array) => {
                if (data.length >= 0xff) return
                const buf = new Uint8Array(1 + data.length)
                buf[0] = data.length
                buf.set(data, 1)
                if (sock) sock.write(buf)
            }

            const disconnect = (err: any) => {
                Module.log("disconnect", err?.message)
                if (sock)
                    try {
                        sock.end()
                    } catch {
                    } finally {
                        sock = undefined
                    }
                if (resolve) {
                    resolve = null
                    reject(new Error(`can't connect to ${host}:${port}`))
                }
            }

            const close = () => disconnect(undefined)

            Module["sendPacket"] = send

            sock = net.createConnection(port, host, () => {
                Module.log(`connected to ${host}:${port}`)
                const f = resolve
                if (f) {
                    resolve = null
                    reject = null
                    f({ close })
                }
            })
            sock.on("error", disconnect)
            sock.on("end", disconnect)
            sock.setNoDelay()

            let acc: Uint8Array = null
            sock.on("data", (buf: Uint8Array) => {
                if (acc) {
                    buf = bufferConcat(acc, buf)
                    acc = null
                } else {
                    buf = new Uint8Array(buf)
                }
                while (buf) {
                    const endp = buf[0] + 1
                    if (buf.length >= endp) {
                        const pkt = buf.slice(1, endp)
                        if (buf.length > endp) buf = buf.slice(endp)
                        else buf = null
                        Module.handlePacket(pkt)
                    } else {
                        acc = buf
                        buf = null
                    }
                }
            })
        })
    }

    /**
     * Starts a packet transport over a WebSocket using arraybuffer binary type.
     * @param url socket url
     * @param port socket port
     */
    export function setupWebsocketTransport(
        url: string | URL,
        protocols?: string | string[]
    ): Promise<TransportResult> {
        return new Promise<TransportResult>((resolve, reject) => {
            let sock: WebSocket = new WebSocket(url, protocols)

            if (sock.binaryType != "arraybuffer")
                sock.binaryType = "arraybuffer"

            const send = (data: Uint8Array) => {
                if (sock && sock.readyState == WebSocket.OPEN) {
                    sock.send(data)
                    return 0
                } else {
                    return -1
                }
            }

            const disconnect = (err: any) => {
                Module.log("disconnect", err?.message)
                if (sock)
                    try {
                        sock.close()
                    } catch {
                    } finally {
                        sock = undefined
                    }
                if (resolve) {
                    resolve = null
                    reject(
                        new Error(`can't connect to ${url}; ${err?.message}`)
                    )
                }
            }

            const close = () => disconnect(undefined)

            Module["sendPacket"] = send

            sock.onopen = () => {
                Module.log(`connected to ${url}`)
                const f = resolve
                if (f) {
                    resolve = null
                    reject = null
                    f({ close })
                }
            }
            sock.onerror = disconnect
            sock.onclose = disconnect
            sock.onmessage = ev => {
                const data = ev.data
                if (typeof data == "string") {
                    Module.error("got string msg")
                    return
                } else {
                    const pkt = new Uint8Array(ev.data)
                    Module.handlePacket(pkt)
                }
            }
        })
    }

    /**
     * Utility that converts a base64-encoded buffer into a Uint8Array
     * TODO: nobody is using this?
     * @param s
     * @returns
     */
    export function b64ToBin(s: string): Uint8Array {
        s = atob(s)
        const r = new Uint8Array(s.length)
        for (let i = 0; i < s.length; ++i) r[i] = s.charCodeAt(i)
        return r
    }

    /**
     * Deploys a DeviceScript bytecode to the virtual machine
     * @param binary
     * @returns error code, 0 if deployment is successful
     */
    export function devsDeploy(binary: Uint8Array) {
        return copyToHeap(binary, ptr =>
            Module._jd_em_devs_deploy(ptr, binary.length)
        )
    }

    /**
     * Verifies the format and version of the bytecode
     * @param binary DeviceScript bytecode
     * @returns error code, 0 if verification is successful
     */
    export function devsVerify(binary: Uint8Array) {
        return copyToHeap(binary, ptr =>
            Module._jd_em_devs_verify(ptr, binary.length)
        )
    }

    /**
     * Deploys to the first virtual machine on Jacdac stack (experimental)
     * @internal
     * @alpha
     * @param binary
     * @returns error code, 0 if deployment is successful
     */
    export function devsClientDeploy(binary: Uint8Array) {
        // this will call exit(0) when done
        const ptr = Module._malloc(binary.length)
        Module.HEAPU8.set(binary, ptr)
        return Module._jd_em_devs_client_deploy(ptr, binary.length)
    }

    /**
     * Initalises the virtual machine data structure.
     */
    export function devsInit() {
        Module._jd_em_init()
    }

    /**
     * Enables/disables GC stress testing.
     */
    export function devsGcStress(en: boolean) {
        Module._jd_em_devs_enable_gc_stress(en ? 1 : 0)
    }

    /**
     * Clear settings.
     */
    export function devsClearFlash() {
        if (Module.flashSave) Module.flashSave(new Uint8Array([0, 0, 0, 0]))
    }

    function process() {
        devs_timeout = null
        try {
            const us = Module._jd_em_process()
            devs_timeout = setTimeout(process, us / 1000)
        } catch (e) {
            Module.error(e)
            devsStop()
        }
    }

    function clearDevsTimeout() {
        if (devs_timeout) clearInterval(devs_timeout)
        devs_timeout = undefined
    }

    /**
     * Initializes and start the virtual machine (calls init).
     */
    export function devsStart(): void {
        if (devs_timeout) return
        Module.devsInit()
        devs_timeout = setTimeout(process, 10)
    }

    /**
     * Stops the virtual machine
     */
    export function devsStop(): void {
        clearDevsTimeout()
    }

    /**
     * Indicates if the virtual machine is running
     * @returns true if the virtual machine is started.
     */
    export function devsIsRunning() {
        return devs_timeout !== undefined
    }

    /**
     * Specifices the virtual macine device id.
     * @remarks
     *
     * Must be called before `devsStart`.
     *
     * @param id0 a hex-encoded device id string or the first 32bit of the device id
     * @param id1 the second 32 bits of the device id, undefined if id0 is a string
     */
    export function devsSetDeviceId(id0: string | number, id1?: number) {
        if (devsIsRunning())
            throw new Error("cannot change deviceid while running")
        Module.devsInit()
        if (typeof id0 == "string") {
            if (id1 !== undefined) throw new Error("invalid arguments")
            const s = allocateUTF8(id0)
            Module._jd_em_set_device_id_string(s)
            Module._free(s)
        } else if (typeof id0 == "number" && typeof id1 == "number") {
            Module._jd_em_set_device_id_2x_i32(id0, id1)
        } else {
            throw new Error("invalid arguments")
        }
    }

    let currSock: any

    export function sockClose() {
        if (!currSock) return -10
        currSock.end()
        currSock = null
        return 0
    }

    export function sockWrite(data: ptr, len: number) {
        if (!currSock) return -10
        const buf = Module.HEAPU8.slice(data, data + len)
        currSock.write(buf)
        return 0
    }

    declare var require: any

    export function sockIsAvailable() {
        try {
            require("node:tls")
            return true
        } catch {
            return false
        }
    }

    export function sockOpen(hostptr: ptr, port: int32) {
        const host = UTF8ToString(hostptr, 256)

        const JD_CONN_EV_OPEN = 0x01
        const JD_CONN_EV_CLOSE = 0x02
        const JD_CONN_EV_ERROR = 0x03
        const JD_CONN_EV_MESSAGE = 0x04

        const isTLS = port < 0
        if (isTLS) port = -port
        const name = `${isTLS ? "tls" : "tcp"}://${host}:${port}`
        currSock?.end()
        currSock = null
        const sock = isTLS
            ? require("tls").connect({
                  host,
                  port,
              })
            : require("net").createConnection({ host, port })
        currSock = sock
        currSock.once("connect", () => {
            if (sock === currSock) cb(JD_CONN_EV_OPEN)
        })
        currSock.on("data", (buf: Uint8Array) => {
            if (sock === currSock) cb(JD_CONN_EV_MESSAGE, buf)
        })
        currSock.on("error", (err: Error) => {
            if (sock === currSock) {
                cb(JD_CONN_EV_ERROR, `${name}: ${err.message}`)
                currSock = null
            }
        })
        currSock.on("close", (hadError: boolean) => {
            if (sock === currSock) {
                cb(JD_CONN_EV_CLOSE)
                currSock = null
            }
        })

        function cb(tp: number, arg?: Uint8Array | string) {
            let len = arg ? arg.length : 0
            let ptr = 0
            if (typeof arg === "string") {
                len = lengthBytesUTF8(arg)
                ptr = allocateUTF8(arg)
            } else if (arg) {
                ptr = Module._malloc(len)
                Module.HEAPU8.set(arg, ptr)
            }
            Module._jd_em_tcpsock_on_event(tp, ptr, len)
            if (ptr) Module._free(ptr)
        }
    }
}

for (const kn of Object.keys(Exts)) {
    ;(Module as any)[kn] = (Exts as any)[kn]
}

function factory(): Promise<DevsModule> {
    return null
}

export default factory
