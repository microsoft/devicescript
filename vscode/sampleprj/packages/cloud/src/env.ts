import { subscribeMessages, uploadMessage } from "./messages"
import { writeEnv } from "@devicescript/settings"
import { cloud } from "./client"
import { Unsubscribe } from "@devicescript/core"

const ENV_TOPIC = "env"

async function pollEnv() {
    await uploadMessage(ENV_TOPIC, {})
}

let _unsub: Unsubscribe
/**
 * Starts synching the environment values from the cloud.
 * @returns unsubscribe function
 */
export async function startSyncEnv() {
    if (_unsub) return _unsub

    // query env when cloud restarts
    const unsubConnected = cloud.connected.subscribe(async curr => {
        if (curr) await pollEnv()
    })
    if (await cloud.connected.read()) await pollEnv()

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
