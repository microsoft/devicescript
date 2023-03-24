import * as ds from "@devicescript/core"
import { readSetting, writeSetting } from "./api"

const ENV_KEY = "env"

let _env: ds.ClientRegister<any>
async function init() {
    if (!_env) {
        const current = (await readSetting(ENV_KEY)) || {}
        _env = ds.register(current)
    }
    return _env
}

/**
 * Reads the environment variables from the settings
 */
export async function env() {
    const env = await init()
    return (await env.read()) || {}
}

/**
 * Subscribes to an environment cha ge
 * @param next
 */
export async function subscribeEnv(next: (newValue: any) => ds.AsyncVoid) {
    const env = await init()
    return await env.subscribe(next)
}

/**
 * Updates the environment with given settings
 * @param value
 */
export async function writeEnv(value: any) {
    const current = await readSetting(ENV_KEY)
    if (JSON.stringify(current) !== JSON.stringify(value)) {
        await writeSetting(ENV_KEY, value)
        if (_env) {
            await _env.emit(value)
        }
    }
}
