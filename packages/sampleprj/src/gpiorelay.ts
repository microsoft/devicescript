import { AsyncValue, RelayVariant, Relay } from "@devicescript/core"
import { RelayServerSpec, OutputPin } from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"

class GPIORelayServer extends Server implements RelayServerSpec {
    private _active: boolean = false
    private _variant: RelayVariant | undefined
    constructor(
        readonly pin: OutputPin,
        options?: ServerOptions & { variant?: RelayVariant }
    ) {
        super(Relay.spec, options)
        this._variant = options?.variant

        this.sync()
    }
    active(): AsyncValue<boolean> {
        return this._active
    }
    set_active(value: boolean): AsyncValue<void> {
        this._active = value
        this.sync()
    }
    private sync() {
        this.pin.write(this._active ? 1 : 0)
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
    startServer(server)
    // create client
    return undefined
}
