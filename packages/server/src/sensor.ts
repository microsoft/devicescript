import * as ds from "@devicescript/core"
import { Server } from "./servercore"

const minInterval = 100
const maxInterval = 3600 * 1000

export class SensorServer<T extends ds.ISensorServer>
    extends Server
    implements ds.ISensorServer
{
    _preferredInterval: number
    _streamingInterval: number
    _streamingSamples = 0
    _interval: number

    constructor(
        spec: ds.ServiceSpec,
        public readingName: keyof T & string,
        interval = 500
    ) {
        super(spec)
        this.set_streamingInterval(interval)
        this._preferredInterval = this._streamingInterval
    }

    private maybeStop() {
        if (this._streamingSamples <= 0) {
            this._streamingSamples = 0
            clearInterval(this._interval)
            this._interval = 0
        }
    }
    private async sendSample() {
        const v = await (this as any)[this.readingName]()
        const p = this.spec.lookup(this.readingName).encode(v)
        await this._send(p)
        this._streamingSamples--
        this.maybeStop()
    }
    streamingSamples() {
        return this._streamingSamples
    }
    async set_streamingSamples(value: number) {
        this._streamingSamples = value

        if (this._streamingSamples > 0 && !this._interval) {
            this._interval = setInterval(
                this.sendSample,
                this._streamingInterval
            )
            await this.sendSample()
        } else this.maybeStop()
    }
    streamingPreferredInterval() {
        return this._preferredInterval
    }
    streamingInterval() {
        return this._streamingInterval
    }
    set_streamingInterval(value: number) {
        this._streamingInterval = Math.clamp(minInterval, value, maxInterval)
        if (this._interval)
            updateInterval(this._interval, this._streamingInterval)
    }
}
