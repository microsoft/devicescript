import { cloud } from "./client"
import { publishMessage } from "./messages"

const EVENT_TOPIC = "tev"
const METRIC_TOPIC = "tme"

export interface TrackEventOptions {
    properties?: Record<string, string>
    measurements?: Record<string, number>
}

export interface TrackMetricOptions {
    value: number
    min?: number
    max?: number
    variance?: number
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
    await publishMessage(EVENT_TOPIC, {
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

    private mean = 0
    private M2 = 0

    /**
     * Don't upload when count is 0
     */
    skipEmpty = true

    /**
     * Creates a new named metric
     * @param name
     */
    constructor(
        readonly name: string,
        value?: number | number[]
    ) {
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
        this.max = this.max === undefined ? v : Math.max(this.max, v)

        const delta = v - this.mean
        this.mean += delta / this.count
        this.M2 += delta * (v - this.mean)
    }

    variance(): number {
        return this.M2 / (this.count - 1)
    }

    asString() {
        return "" + this.mean
    }

    /**
     * Upload current aggregated values and reset
     */
    async upload() {
        // no data
        if (this.skipEmpty && this.count === 0) return

        // not bound
        if (!cloud.isBound) return

        // not connected to cloud, don't send
        const connected = await cloud.connected.read()
        if (!connected) return

        // ready to send
        const value = this.mean
        const variance = this.variance()
        const payload = {
            value,
            count: this.count,
            min: this.min,
            max: this.max,
            variance,
        }
        this.sum = 0
        this.count = 0
        this.min = undefined
        this.max = undefined
        this.mean = 0
        this.M2 = 0
        await trackMetric(this.name, payload)
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
        variance: a,
        properties: p,
    } = options || {}
    await publishMessage(METRIC_TOPIC, {
        n: name,
        v,
        mi,
        ma,
        c,
        a,
        p,
    })
}

/**
 * Track error in the cloud
 * @param error
 */
export function trackException(error: Error) {
    if (error) error.print()
}
