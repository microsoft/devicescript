import { JDBus, JSONTryParse } from "jacdac-ts"
import {
    BuildReqArgs,
    BuildStatus,
    SideConnectRequest,
    SideErrorResponse,
    SideMessage,
} from "./sideprotocol"

export interface DevToolsIface {
    bus: JDBus
    clients: DevToolsClient[]

    build: (
        args: BuildReqArgs,
        watchCb?: (st: BuildStatus) => void
    ) => Promise<BuildStatus>
    connect: (req: SideConnectRequest) => Promise<void>
}

export interface DevToolsClient {
    __devsSender: string
    __devsWantsSideChannel: boolean

    send(data: Buffer | string): void
}

const msgHandlers: Record<
    string,
    (
        devtools: DevToolsIface,
        msg: SideMessage,
        sender: DevToolsClient
    ) => Promise<any>
> = {
    enableBCast: async (devtools, msg, client) => {
        client.__devsWantsSideChannel = true
    },
    build: async (devtools, msg, client) => {
        return await devtools.build(msg.data, st =>
            sendEvent(client, "watch", st)
        )
    },
    connect: async (devtools, msg) => devtools.connect(msg.data),
}

export function sendError(req: SideMessage, cl: DevToolsClient, err: any) {
    const info: SideErrorResponse = {
        type: "error",
        seq: req.seq,
        data: {
            message: err.message || "" + err,
            stack: err.stack,
        },
    }
    cl.send(JSON.stringify(info))
}

export function sendEvent(cl: DevToolsClient, type: string, data: any) {
    cl.send(
        JSON.stringify({
            type,
            data,
        })
    )
}

export async function processSideMessage(
    devtools: DevToolsIface,
    message: string,
    client: DevToolsClient
) {
    const msg: SideMessage = JSONTryParse(message)
    if (!msg) return

    const handler = msgHandlers[msg.type]
    if (handler) {
        try {
            const data = await handler(devtools, msg, client)
            const resp: SideMessage = {
                type: msg.type,
                seq: msg.seq,
                data: data ?? {},
            }
            client.send(JSON.stringify(resp))
        } catch (err) {
            sendError(msg, client, err)
        }
    }

    if (!msg.seq)
        for (const client of devtools.clients) {
            if (client != client && client.__devsWantsSideChannel)
                client.send(message)
        }

    if (msg.seq && !handler)
        sendError(msg, client, new Error(`unknown msg type: ${msg.type}`))
}
