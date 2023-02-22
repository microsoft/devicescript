import "websocket-polyfill"
import { Blob } from "buffer"
globalThis.Blob = Blob as any
import customServices from "../.devicescript/services.json"
import { createWebSocketBus } from "jacdac-ts"

export const bus = createWebSocketBus({
    busOptions: {
        services: customServices as jdspec.ServiceSpec[],
    },
})
