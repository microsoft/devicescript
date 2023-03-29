import { parse } from "json5"

export function parseJSON5<T = unknown>(
    text: string,
    options?: { defaultValue?: T; errorAsDefaultValue?: boolean }
): T | undefined | null {
    try {
        const res = parse(text)
        return res as T
    } catch (e) {
        if (options?.errorAsDefaultValue) return options?.defaultValue
        throw e
    }
}

export function JSON5TryParse<T = unknown>(
    text: string,
    defaultValue?: T
): T | undefined | null {
    if (text === undefined) return undefined
    if (text === null) return null
    return parseJSON5<T>(text, { defaultValue, errorAsDefaultValue: true })
}
