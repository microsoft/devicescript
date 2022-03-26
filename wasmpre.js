function copyToHeap(buf, fn) {
    const ptr = Module._malloc(buf.length)
    Module.HEAP8.set(buf, ptr)
    fn(ptr)
    Module._free(ptr)
}

Module.handlePacket = function handlePacket(pkt) {
    copyToHeap(pkt, Module._jd_em_frame_received)
    Module._jd_em_process()
}

Module.setupNodeTcpSocketTransport = function setupNodeTcpSocketTransport(host, port) {
    function bufferConcat(a, b) {
        const r = new Uint8Array(a.length + b.length)
        r.set(a, 0)
        r.set(b, a.length)
        return r
    }

    return new Promise(resolve => {
        const net = require("net")
        let sock = null

        const send = data => {
            const buf = new Uint8Array(1 + data.length)
            buf[0] = data.length
            buf.set(data, 1)
            if (sock)
                sock.write(buf)
        }

        const disconnect = () => {
            if (sock)
                sock.end()
            sock = undefined
        }

        Module["sendPacket"] = send

        sock = net.createConnection(port, host, () => {
            resolve(Module)
        })
        sock.on("error", disconnect)
        sock.on("end", disconnect)
        sock.setNoDelay()

        let acc = null
        sock.on("data", (buf) => {
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

Module.jacsDeploy = function handlePacket(binary) {
    copyToHeap(binary, ptr => Module._jd_em_jacs_deploy(ptr, binary.length))
}

var jacs_interval

Module.jacsStart = function jacsStart() {
    if (jacs_interval) return
    Module._jd_em_init()
    jacs_interval = setInterval(() => Module._jd_em_process(), 10)
}

Module.jacsSetDeviceId = function jacsSetDeviceId(id0, id1) {
    if (typeof id0 == "string") {
        const s = allocateUTF8(id0)
        Module._jd_em_set_device_id_string(s)
        _free(s)
    } else if (typeof id0 == "number" && typeof id1 == "number") {
        Module._jd_em_set_device_id_2x_i32(id0, id1)
    } else {
        throw new Error("invalid args")
    }
}
