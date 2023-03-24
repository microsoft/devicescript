import { settings } from "./client"

/**
 * Serializes a JSON object to a setting
 * @param key name of the setting
 * @param value object to serialize
 */
export async function writeSetting(key: string, value: any): Promise<void> {
    // TODO json -> buffer
    const s = JSON.stringify(value)
    const b = Buffer.from(s)
    await settings.set(key, b)
}

/**
 * Deserializes a JSON object from a setting
 * @param key name of the setting
 * @param missingValue default value if missing
 * @param value object to serialize
 */
export async function readSetting<T = any>(
    key: string,
    missingValue?: T
): Promise<T> {
    const [k, b] = await settings.get(key)
    if (k !== key || !b) return missingValue

    try {
        const s = b.toString()
        const o = JSON.parse(s)
        return o
    } catch (e) {
        return missingValue
    }
}

/**
 * Deletes the given key from the settings
 * @param key name of the key
 */
export async function deleteSetting(key: string) {
    await settings.delete(key)
}
