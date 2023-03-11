import * as ds from "@devicescript/core"

/**
 * The cloud adapter client
 */
const cloud = new ds.CloudAdapter()

export interface TrackEventOptions {
    properties?: Record<string, string>
    measurements?: Record<string, number>
}

export interface TrackMetricOptions {
    value?: number
    min?: number
    max?: number
    stdDev?: number
    count?: number
    properties?: Record<string, string>
}

/**
 * Tracks an event in the application analytics
 */
export async function trackEvent(
    name: string,
    options?: TrackEventOptions
): Promise<void> {
    const { properties: p, measurements: m } = options || {}
    await uploadMessage("tev", {
        n: name,
        p,
        m,
    })
}

/**
 * Tracks a metric in the application analytics
 * @param name
 * @param options
 */
export async function trackMetric(
    name: string,
    options: TrackMetricOptions
): Promise<void> {
    const {
        value: v,
        min: mi,
        max: ma,
        count: c,
        stdDev: d,
        properties: p,
    } = options || {}
    await uploadMessage("tme", {
        n: name,
        v,
        mi,
        ma,
        c,
        d,
        p,
    })
}

/**
 * Uploads a message to the cloud
 */
export async function uploadMessage(topicName: string, payload: any) {
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
