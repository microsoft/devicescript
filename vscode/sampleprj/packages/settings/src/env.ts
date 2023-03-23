import { ClientRegister, clientRegisterFrom } from "@devicescript/core"
import { readSettingJSON, writeSettingJSON } from "./api"

const ENV_KEY = "env"

let _env: ClientRegister<any>
/**
 * Reads the environment variables from the settings
 */
export async function env() {
    if (!_env) {
        const current = (await readSettingJSON(ENV_KEY)) || {}
        _env = clientRegisterFrom(current)
    }
    return _env
}

/**
 * Updates the environment with given settings
 * @param value
 */
export async function writeEnv(value: any) {
    const current = (await readSettingJSON(ENV_KEY)) || {}
    if (JSON.stringify(current) !== JSON.stringify(value)) {
        await writeSettingJSON(ENV_KEY, value)
        if (_env) {
            _env.emit(value)
        }
    }
}
