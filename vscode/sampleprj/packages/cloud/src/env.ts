import { subscribeMessages, uploadMessage } from "./messages"
import { cloud } from "./client"
import { readSetting, writeSetting } from "@devicescript/settings"
import { ObservableValue, register } from "@devicescript/observables"

const ENV_TOPIC = "env"
let _env: ObservableValue<any>

/**
 * Gets an observable environment register that may get updated by the cloud.
 * @returns environment
 */
export async function env<T = any>(): Promise<ObservableValue<T>> {
    if (_env) return _env

    const old = await readSetting(ENV_TOPIC, {})
    _env = register(old || {})

    // query env when cloud restarts
    cloud.connected.subscribe(async curr => {
        if (curr) await uploadMessage(ENV_TOPIC, {})
    })
    if (await cloud.connected.read()) await uploadMessage(ENV_TOPIC, {})
    // receive env messages
    await subscribeMessages(ENV_TOPIC, async (newValue: any) => {
        console.debug(`cloud: received env`)
        await writeSetting(ENV_TOPIC, newValue)
        _env.emit(newValue)
    })

    return _env
}
