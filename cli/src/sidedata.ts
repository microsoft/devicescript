import { assert, JDBus, JSONTryParse, serviceSpecifications } from "jacdac-ts"
import {
    BuildReqArgs,
    BuildStatus,
    ConnectReqArgs,
    OutputFrom,
    SideBcastReq,
    SideBoardsReq,
    SideBoardsResp,
    SideBuildReq,
    SideBuildResp,
    SideConnectReq,
    SideErrorResp,
    SideEvent,
    SideKillReq,
    SideKillResp,
    SideOutputEvent,
    SideReq,
    SideResp,
    SideSpecsReq,
    SideSpecsResp,
    SideWatchEvent,
    SideWatchReq,
    SideWatchResp,
} from "./sideprotocol"
import { runtimeVersion, boardSpecifications } from "@devicescript/compiler"
import { packageVersion } from "./version"

export interface DevToolsIface {
    bus: JDBus
    clients: DevToolsClient[]
    lastOKBuild: BuildStatus
    mainClient: DevToolsClient

    build: (args: BuildReqArgs) => Promise<BuildStatus>
    watch: (
        args: BuildReqArgs,
        watchCb?: (st: BuildStatus) => void
    ) => Promise<void>

    connect: (req: ConnectReqArgs) => Promise<void>
}

export interface DevToolsClient {
    __devsSender: string
    __devsWantsSideChannel: boolean

    send(data: Buffer | string): void
}

const msgHandlers: Record<
    string,
    (msg: SideReq<string>, sender: DevToolsClient) => Promise<any>
> = {}

export function addReqHandler<
    Req extends SideReq,
    Resp extends SideResp<Req["req"]> = SideResp<Req["req"]>
>(
    req: Req["req"],
    cb: (msg: Req, sender: DevToolsClient) => Promise<Resp["data"]>
) {
    msgHandlers[req] = cb as any
}

export let devtoolsIface: DevToolsIface

export function initSideProto(devtools_: DevToolsIface) {
    assert(devtoolsIface === undefined)
    devtoolsIface = devtools_
    addReqHandler<SideBcastReq>("bcast", async (msg, client) => {
        client.__devsWantsSideChannel = msg.data.enabled
    })
    addReqHandler<SideBuildReq, SideBuildResp>("build", async msg => {
        return await devtoolsIface.build(msg.data)
    })
    addReqHandler<SideWatchReq, SideWatchResp>("watch", async (msg, client) => {
        return await devtoolsIface.watch(msg.data, st =>
            sendEvent<SideWatchEvent>(client, "watch", st)
        )
    })
    addReqHandler<SideConnectReq>("connect", msg => {
        return devtoolsIface.connect(msg.data)
    })
    addReqHandler<SideSpecsReq, SideSpecsResp>("specs", async () => {
        return {
            specs: serviceSpecifications(),
            version: packageVersion(),
            runtimeVersion: runtimeVersion(),
            nodeVersion: process.version,
        }
    })
    addReqHandler<SideBoardsReq, SideBoardsResp>("boards", async () => {
        return {
            boards: Object.values(boardSpecifications.boards),
        }
    })
    addReqHandler<SideKillReq, SideKillResp>("kill", async () => {
        // allow send answer
        setTimeout(() => process.exit(0), 500)
    })
}

export function sendError(req: SideReq, cl: DevToolsClient, err: any) {
    const info: SideErrorResp = {
        resp: "error",
        seq: req.seq,
        data: {
            message: err.message || "" + err,
            stack: err.stack,
        },
    }
    cl.send(JSON.stringify(info))
}

export function sendEvent<T extends SideEvent>(
    cl: DevToolsClient,
    ev: T["ev"],
    data: T["data"]
) {
    cl?.send(
        JSON.stringify({
            ev,
            data,
        })
    )
}

export function sendOutput(
    cl: DevToolsClient,
    from: OutputFrom,
    lines: string[]
) {
    return sendEvent<SideOutputEvent>(cl, "output", {
        from,
        lines,
    })
}

export async function processSideMessage(
    devtools_: DevToolsIface,
    message: string,
    client: DevToolsClient
) {
    const msg: SideReq = JSONTryParse(message)
    if (!msg) return

    assert(devtoolsIface === devtools_)

    const handler = msgHandlers[msg.req]
    if (handler) {
        try {
            devtoolsIface.mainClient = client
            const data = await handler(msg, client)
            const resp: SideResp = {
                resp: msg.req,
                seq: msg.seq,
                data: data ?? {},
            }
            client.send(JSON.stringify(resp))
        } catch (err) {
            sendError(msg, client, err)
        }
    }

    if (!msg.seq)
        for (const client of devtoolsIface.clients) {
            if (client != client && client.__devsWantsSideChannel)
                client.send(message)
        }

    if (msg.seq && !handler)
        sendError(msg, client, new Error(`unknown msg type: ${msg.req}`))
}
