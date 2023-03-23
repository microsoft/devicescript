import { subscribeMessages, uploadMessage } from "./messages"
import { writeEnv } from "@devicescript/settings"
import { cloud } from "./client"
import { Unsubscribe } from "@devicescript/core"

const ENV_TOPIC = "env"

function pollEnv() {
    uploadMessage(ENV_TOPIC, {})
}

let _unsub: Unsubscribe
/**
 * Starts synching the environment values from the cloud
 * @returns
 */
export async function startSyncEnv() {
    if (_unsub) return _unsub

    // query env when cloud restarts
    const unsubConnected = cloud.connected.subscribe(curr => {
        if (curr) pollEnv()
    })
    if (await cloud.connected.read()) pollEnv()

    // receive env messages
    const unsubMessages = await subscribeMessages(
        ENV_TOPIC,
        async (newValue: any) => {
            console.debug(`cloud: received env`)
            await writeEnv(newValue)
        }
    )

    // cleanup
    _unsub = async () => {
        _unsub = undefined
        await unsubConnected()
        await unsubMessages()
    }
    return _unsub
}
