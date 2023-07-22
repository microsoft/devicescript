import { AsyncValue, RelayVariant, Relay } from "@devicescript/core"
import { RelayServerSpec, OutputPin } from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import * as ds from "@devicescript/core"
import "@devicescript/gpio"

class GPIORelayServer extends Server implements RelayServerSpec {
    private _enabled: boolean = false
    private _variant: RelayVariant | undefined
    constructor(
        readonly pin: OutputPin,
        options?: ServerOptions & { variant?: RelayVariant }
    ) {
        super(Relay.spec, options)
        this._variant = options?.variant

        this.sync.start()
    }
    enabled(): AsyncValue<boolean> {
        return this._enabled
    }
    async set_enabled(value: boolean): Promise<void> {
        this._enabled = value
        await this.sync()
    }
    private async sync() {
        await this.pin.write(this._enabled ? 1 : 0)
    }

    variant(): AsyncValue<RelayVariant> {
        return this._variant
    }
}

export function startRelay(
    pin: OutputPin,
    options?: ServerOptions & { variant?: RelayVariant }
): Relay {
    const server = new GPIORelayServer(pin, options)
    return new Relay(startServer(server))
}

const p0 = ds.gpio(0)

await p0.setMode(ds.GPIOMode.Output)
await p0.write(1)
await p0.write(0)
await p0.setMode(ds.GPIOMode.InputPullDown)

const relay = new Relay(startServer(new GPIORelayServer(p0)))
setInterval(async () => {
    const enabled = await relay.enabled.read()
    await relay.enabled.write(!enabled)
}, 1000)
