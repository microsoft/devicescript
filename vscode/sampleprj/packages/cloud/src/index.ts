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
    const { properties, measurements } = options || {}
    await uploadMessage("tev", {
        n: name,
        p: properties || undefined,
        m: measurements || undefined,
    })
}

/**
 * Uploads a message to the cloud
 */
export async function uploadMessage(topicName: string, payload: any) {
    await cloud.uploadJson(topicName, JSON.stringify(payload))
}

/**
 * Subscribes to the incoming cloud message
 * @param next called on every message
 * @returns unsubscribe handler
 */
export function subscribeMessages<TMessage = any>(
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
