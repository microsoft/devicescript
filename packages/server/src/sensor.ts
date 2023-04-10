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

    constructor(
        spec: ds.ServiceSpec,
        public readingName: keyof T & string,
        interval = 500
    ) {
        super(spec)
        this.set_streamingInterval(interval)
        this._preferredInterval = this._streamingInterval
    }

    private async sendSample() {
        const v = await (this as any)[this.readingName]()
        const p = this.spec.lookup(this.readingName).encode(v)
        await this._send(p)
        if (this._streamingSamples > 0) {
            this._streamingSamples--
            setTimeout(this.sendSample, this._streamingInterval)
        }
    }
    private scheduleSample() {
        setTimeout(this.sendSample, this._streamingInterval)
    }
    streamingSamples() {
        return this._streamingSamples
    }
    set_streamingSamples(value: number) {
        if (value > 0 && this._streamingSamples === 0) this.scheduleSample()
        this._streamingSamples = value
    }
    streamingPreferredInterval() {
        return this._preferredInterval
    }
    streamingInterval() {
        return this._streamingInterval
    }
    set_streamingInterval(value: number) {
        this._streamingInterval = Math.clamp(minInterval, value, maxInterval)
    }
}
