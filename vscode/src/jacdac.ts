import {
    createWebSocketTransport,
    ERROR,
    JDBus,
    JDEventSource,
    SIDE_DATA,
    WebSocketTransport,
} from "jacdac-ts"
import type { SideEvent, SideReq, SideResp } from "../../cli/src/sideprotocol"

let __bus: JDBus
let ws: WebSocketTransport
let seqNo = 1
let awaiters: Record<string, (resp: SideResp) => void> = {}

const sideEvents = new JDEventSource()

export function startJacdacBus() {
    return __bus || (__bus = uncachedStartJacdacBus())
}

export async function sideRequest<
    Req extends SideReq,
    Resp extends SideResp<Req["req"]> = SideResp<Req["req"]>
>(req: Req) {
    if (!ws) throw new Error("not connected yet")
    const seq = ++seqNo
    req.seq = seq
    await ws.sendSideData(req)
    return new Promise<Resp>((resolve, reject) => {
        awaiters["" + seq] = resp => {
            if (resp.resp == req.req) resolve(resp as Resp)
            else
                reject(
                    new Error(
                        `invalid response type: ${resp.resp}, ${resp.data?.message}`
                    )
                )
        }
    })
}

export function subSideEvent<T extends SideEvent>(
    ev: T["ev"],
    cb: (msg: T) => void
) {
    return sideEvents.subscribe(ev, cb)
}

function uncachedStartJacdacBus() {
    try {
        ws = createWebSocketTransport("ws://127.0.0.1:8081/")
        ws.on(SIDE_DATA, (msg: SideResp | SideEvent) => {
            const ev = msg as SideEvent
            const resp = msg as SideResp
            if (typeof resp.resp == "string") {
                const f = awaiters["" + resp.seq]
                if (f) {
                    delete awaiters["" + resp.seq]
                    f(resp)
                } else {
                    console.warn("orphaned response: " + JSON.stringify(resp))
                }
            } else if (typeof ev.ev == "string") {
                sideEvents.emit(ev.ev, ev)
            } else {
                console.warn("invalid msg: " + JSON.stringify(msg))
            }
        })
        const bus = new JDBus([ws], { client: false, disableRoleManager: true })
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
