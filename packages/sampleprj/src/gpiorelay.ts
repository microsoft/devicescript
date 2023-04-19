import { AsyncValue, RelayVariant, Relay } from "@devicescript/core"
import { RelayServerSpec } from "@devicescript/core"
import { Server } from "@devicescript/server"

export class GPIORelayServer extends Server implements RelayServerSpec {
    constructor(name: string) {
        super(Relay.spec, { instanceName: name })
    }
    active(): AsyncValue<boolean> {
        throw new Error("Method not implemented.")
    }
    set_active(value: boolean): AsyncValue<void> {
        throw new Error("Method not implemented.")
    }
    variant(): AsyncValue<RelayVariant> {
        return RelayVariant.SolidState
    }
}
