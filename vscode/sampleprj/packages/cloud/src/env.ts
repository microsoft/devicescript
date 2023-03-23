import { subscribeMessages, uploadMessage } from "./messages"
import { env, writeEnv } from "@devicescript/settings"
import { AsyncVoid, ClientRegister } from "@devicescript/core"
import { cloud } from "./client"
import {
    fromCallback,
    Observable,
    wrapSubscriptions,
} from "@devicescript/observables"

const ENV_TOPIC = "env"

function pollEnv() {
    uploadMessage(ENV_TOPIC, {})
}

function notifyEnvChange() {

}

export const envChange: ClientRegister<void> = new Cli

export async function syncEnv() {
    // query env when cloud restarts
    cloud.connected.subscribe(curr => {
        if (curr) pollEnv()
    })
    if (await cloud.connected.read()) pollEnv()

    // receive env messages
    await subscribeMessages(ENV_TOPIC, async (newValue: any) => {
        const current = env()
        if (JSON.stringify(current) !== JSON.stringify(newValue)) {
            writeEnv(newValue)
            envChange.e
        }
    })
}
