import { ClientRegister, clientRegisterFrom } from "@devicescript/core"
import { readSetting, writeSetting } from "./api"

const ENV_KEY = "env"

let _env: ClientRegister<any>
/**
 * Reads the environment variables from the settings
 */
export async function env() {
    if (!_env) {
        const current = (await readSetting(ENV_KEY)) || {}
        _env = clientRegisterFrom(current)
    }
    return _env
}

/**
 * Updates the environment with given settings
 * @param value
 */
export async function writeEnv(value: any) {
    const current = (await readSetting(ENV_KEY)) || {}
    if (JSON.stringify(current) !== JSON.stringify(value)) {
        await writeSetting(ENV_KEY, value)
        if (_env) {
            await _env.emit(value)
        }
    }
}
