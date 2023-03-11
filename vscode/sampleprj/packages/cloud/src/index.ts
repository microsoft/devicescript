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
    value: number
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
 * A metric accumulator
 */
export class Metric {
    private sum = 0
    private count = 0
    private min: number = undefined
    private max: number = undefined

    /**
     * Creates a new named metric
     * @param name
     */
    constructor(readonly name: string, value?: number | number[]) {
        this.add(value)
    }

    /**
     * Aggregate values in metric. Timestamp are not maintained
     * @param value
     */
    add(value: number | number[]) {
        if (typeof value === "number") this.addOne(value)
        else if (Array.isArray(value)) for (const v of value) this.addOne(v)
    }

    private addOne(v: number) {
        if (isNaN(v)) return
        this.sum += v
        this.count++
        this.min = this.min === undefined ? v : Math.min(this.min, v)
        this.min = this.max === undefined ? v : Math.max(this.min, v)
    }

    /**
     * Upload current aggregated values and reset
     */
    async upload() {
        const value = this.count === 0 ? 0 : this.sum / this.count
        await trackMetric(this.name, {
            value,
            count: this.count,
            min: this.min,
            max: this.max,
        })
        this.sum = 0
        this.count = 0
        this.min = undefined
        this.max = undefined
    }
}

/**
 * Creates a new metric accumulator
 * @param name name of the metric
 * @param value optional value or array of value
 */
export function createMetric(name: string, value?: number | number[]) {
    return new Metric(name, value)
}

/**
 * Uploads a metric in the application analytics. It is recommended to use `createMetric` to accumulate data.
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
