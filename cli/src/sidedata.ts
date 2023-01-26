import { JSONTryParse } from "jacdac-ts"

export interface DevToolsClient {
    __devsSender: string
    __devsWantsSideChannel: boolean

    send(data: Buffer | string): void
}

export interface DevToolsSideMessage {
    type: string
    bcast?: boolean
}

export interface DevToolsErrorResponse {
    type: "error"
    message: string
    stack?: string
}

const msgHandlers: Record<
    string,
    (msg: DevToolsSideMessage, sender: DevToolsClient) => Promise<void>
> = {
    enableBCast: async (msg, sender) => {
        sender.__devsWantsSideChannel = true
    },
}

export function sendError(cl: DevToolsClient, err: any) {
    const info: DevToolsErrorResponse = {
        type: "error",
        message: err.message || "" + err,
        stack: err.stack,
    }
    cl.send(JSON.stringify(info))
}

export async function processSideMessage(
    message: string,
    client: DevToolsClient,
    clients: DevToolsClient[]
) {
    const msg: DevToolsSideMessage = JSONTryParse(message)
    if (!msg) return

    const handler = msgHandlers[msg.type]
    if (handler) {
        try {
            await handler(msg, client)
        } catch (err) {
            sendError(client, err)
        }
    }

    if (msg.bcast)
        for (const client of clients) {
            if (client != client && client.__devsWantsSideChannel)
                client.send(message)
        }

    if (!msg.bcast && !handler)
        sendError(client, new Error(`unknown msg type: ${msg.type}`))
}
