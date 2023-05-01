import * as ds from "@devicescript/core"
import { cloud } from "./client"

/**
 * Uploads a message to the cloud
 */
export async function publishMessage(topicName: string, payload: any) {
    // reduce payload size
    if (typeof payload === "object")
        Object.keys(payload)
            .filter(k => payload[k] === undefined)
            .forEach(k => delete payload[k])
    await cloud.uploadJson(topicName, JSON.stringify(payload))
}

/**
 * Subscribes to the incoming cloud message
 * @param next called on every message
 * @returns unsubscribe handler
 */
export function subscribeMessage<TMessage = any>(
    topicName: "*" | string,
    next: (curr: TMessage) => ds.AsyncVoid
) {
    return cloud.onJson.subscribe(async (arg: string[]) => {
        const [topic, json] = arg
        if (topicName === "*" || topic === topicName) {
            const payload = JSON.parse(json) as TMessage
            await next(payload)
        }
    })
}
