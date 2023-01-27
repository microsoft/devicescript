import {
    createWebSocketTransport,
    ERROR,
    JDBus,
    JDEventSource,
    SIDE_DATA,
    WebSocketTransport,
} from "jacdac-ts"
import type { SideMessage } from "../../cli/src/sideprotocol"
import * as vscode from "vscode"

let __bus: JDBus
let ws: WebSocketTransport
let seqNo = 1
let awaiters: Record<string, (resp: SideMessage) => void> = {}

const sideEvents = new JDEventSource()

export function startJacdacBus() {
    return __bus || (__bus = uncachedStartJacdacBus())
}

export async function sideRequest<T extends string, S extends SideMessage<T>>(
    req: SideMessage<T>
) {
    if (!ws) throw new Error("not connected yet")
    const seq = ++seqNo
    req.seq = seq
    await ws.sendSideData(req)
    return new Promise<S>((resolve, reject) => {
        awaiters["" + seq] = resp => {
            if (resp.type == req.type) resolve(resp as S)
            else
                reject(
                    new Error(
                        `invalid response type: ${resp.type}, ${resp.data?.message}`
                    )
                )
        }
    })
}

export function subSideEvent<
    T extends string,
    S extends SideMessage & { type: T }
>(ev: T, cb: (msg: S) => void) {
    return sideEvents.subscribe(ev, cb)
}

function uncachedStartJacdacBus() {
    try {
        ws = createWebSocketTransport("ws://127.0.0.1:8081/")
        ws.on(SIDE_DATA, (msg: SideMessage) => {
            if (typeof msg.type == "string") {
                if (msg.seq) {
                    const f = awaiters["" + msg.seq]
                    if (f) {
                        delete awaiters["" + msg.seq]
                        f(msg)
                    } else {
                        console.warn(
                            "orphaned response: " + JSON.stringify(msg)
                        )
                    }
                } else {
                    sideEvents.emit(msg.type, msg)
                }
            } else {
                console.warn("invalid msg: " + JSON.stringify(msg))
            }
        })
        const bus = new JDBus([ws], { client: false })
        bus.on(ERROR, err => {
            console.error("Bus error", err)
        })
        // connect in foreground, otherwise we'll have no clue why it failed
        bus.connect(false)
        return bus
    } catch (err) {
        console.error(err.stack)
        return undefined
    }
}

export async function stopJacdacBus() {
    const bus = __bus
    if (bus) {
        __bus = undefined
        await bus.disconnect()
        await bus.dispose()
    }
}
