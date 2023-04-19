import {
    AsyncValue,
    Packet,
    RelayVariant,
    ServiceSpec,
    gpio,
} from "@devicescript/core"
import { RelayServerSpec } from "@devicescript/core"
import { Server } from "@devicescript/server"

export class GPIORelayServer extends Server implements RelayServerSpec {
    active(): AsyncValue<boolean> {
        throw new Error("Method not implemented.")
    }
    set_active(value: boolean): AsyncValue<void> {
        throw new Error("Method not implemented.")
    }
    variant?(): AsyncValue<RelayVariant> {
        return RelayVariant.SolidState
    }
    maxSwitchingCurrent?(): AsyncValue<number> {
        throw new Error("Method not implemented.")
    }
    statusCode?(): AsyncValue<[number, number]> {
        throw new Error("Method not implemented.")
    }
}
