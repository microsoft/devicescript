import { settings } from "./client"

/**
 * Serializes a JSON objec to a setting
 * @param key name of the setting
 * @param value object to serialize
 */
export async function writeSettingJSON(key: string, value: any): Promise<void> {
    // TODO json -> buffer
}

/**
 * Deserializes a JSON objec to a setting
 * @param key name of the setting
 * @param value object to serialize
 */
export async function readSettingJSON(key: string): Promise<any> {
    // TODO buffer -> json
    return undefined
}

/**
 * Deletes all settings
 */
export async function clearSettings() {
    settings.clear()
}

/**
 * Deletes the given key from the settings
 * @param key name of the key
 */
export async function deleteSetting(key: string) {
    await settings.delete(key)
}
