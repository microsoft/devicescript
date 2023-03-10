import * as ds from "@devicescript/core"

/**
 * The cloud adapter client
 */
const cloud = new ds.CloudAdapter()

export interface TrackMessageOptions {
    properties?: Record<string, string>
    measurements?: Record<string, number>
}

/**
 * Uploads a application telemetry event to the cloud
 */
export async function trackEvent(
    name: string,
    options?: TrackMessageOptions
): Promise<void> {
    const { properties: p, measurements: m } = options || {}
    const msg: any = {
        ["_"]: "tev",
        n: name,
    }
    if (p) msg.p = p
    if (m) msg.m = m
    await cloud.uploadJson(msg)
}

/**
 * Uploads a message to the cloud
 */
export async function uploadMessage(topicName: string, payload: any) {
    const json = JSON.stringify({
        _: topicName,
        d: payload,
    })
    await cloud.uploadJson(json)
}

/**
 * Subscribes to the incoming cloud message
 * @param next called on every message
 * @returns unsubscribe handler
 */
export function subscribeMessages<TMessage = any>(
    next: (curr: TMessage) => ds.AsyncVoid
) {
    return cloud.onJson.subscribe(async (json: string) => {
        const payload = JSON.parse(json) as TMessage
        await next(payload)
    })
}
