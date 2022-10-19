type ptr = number
type int32 = number

export type JacsModule = EmscriptenModule &
    typeof Exts & {
        _jd_em_set_device_id_2x_i32(id0: int32, id1: int32): void
        _jd_em_set_device_id_string(str: ptr): void
        _jd_em_init(): void
        _jd_em_process(): void
        _jd_em_frame_received(frame: ptr): int32
        _jd_em_jacs_deploy(img: ptr, size: int32): int32
        _jd_em_jacs_client_deploy(img: ptr, size: int32): int32
        sendPacket(pkt: Uint8Array): void
    }

declare var Module: JacsModule

var jacs_interval: number

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

module Exts {
    export function handlePacket(pkt: Uint8Array) {
        copyToHeap(pkt, Module._jd_em_frame_received)
        Module._jd_em_process()
    }

    export function setupNodeTcpSocketTransport(
        require: any,
        host: string,
        port: number
    ) {
        return new Promise<void>((resolve, reject) => {
            const net = require("net")
            let sock: any = null

            const send = (data: Uint8Array) => {
                const buf = new Uint8Array(1 + data.length)
                buf[0] = data.length
                buf.set(data, 1)
                if (sock) sock.write(buf)
            }

            const disconnect = () => {
                console.log("disconnect")
                if (sock) sock.end()
                sock = undefined
                if (resolve) {
                    resolve = null
                    reject(new Error(`can't connect to ${host}:${port}`))
                }
            }

            Module["sendPacket"] = send

            sock = net.createConnection(port, host, () => {
                const f = resolve
                resolve = null
                f()
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

    export function jacsDeploy(binary: Uint8Array) {
        return copyToHeap(binary, ptr =>
            Module._jd_em_jacs_deploy(ptr, binary.length)
        )
    }

    export function jacsClientDeploy(binary: Uint8Array) {
        // this will call exit(0) when done
        const ptr = Module._malloc(binary.length)
        Module.HEAPU8.set(binary, ptr)
        return Module._jd_em_jacs_client_deploy(ptr, binary.length)
    }

    export function jacsInit() {
        Module._jd_em_init()
    }

    export function jacsStart() {
        if (jacs_interval) return
        Module.jacsInit()
        jacs_interval = setInterval(() => {
            try {
                Module._jd_em_process()
            } catch (e) {
                console.error(e)
                jacsStop()
            }
        }, 10)
    }

    export function jacsStop() {
        if (jacs_interval) {
            clearInterval(jacs_interval)
            jacs_interval = undefined
        }
    }

    export function jacsSetDeviceId(id0: string | number, id1?: number) {
        if (typeof id0 == "string") {
            const s = allocateUTF8(id0)
            Module._jd_em_set_device_id_string(s)
            Module._free(s)
        } else if (typeof id0 == "number" && typeof id1 == "number") {
            Module._jd_em_set_device_id_2x_i32(id0, id1)
        } else {
            throw new Error("invalid args")
        }
    }
}

for (const kn of Object.keys(Exts)) {
    ;(Module as any)[kn] = (Exts as any)[kn]
}

function factory(): Promise<JacsModule> {
    return null
}

export default factory
