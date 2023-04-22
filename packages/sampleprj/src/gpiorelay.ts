import { AsyncValue, RelayVariant, Relay } from "@devicescript/core"
import { RelayServerSpec, OutputPin } from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import * as ds from "@devicescript/core"
import "@devicescript/gpio"

class GPIORelayServer extends Server implements RelayServerSpec {
    private _active: boolean = false
    private _variant: RelayVariant | undefined
    constructor(
        readonly pin: OutputPin,
        options?: ServerOptions & { variant?: RelayVariant }
    ) {
        super(Relay.spec, options)
        this._variant = options?.variant

        this.sync.start()
    }
    active(): AsyncValue<boolean> {
        return this._active
    }
    async set_active(value: boolean): Promise<void> {
        this._active = value
        await this.sync()
    }
    private async sync() {
        await this.pin.write(this._active ? 1 : 0)
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
const v = await p0.read()

