import { JSONTryParse, stringToBuffer } from "jacdac-ts"

function stringToSettingValue(s: string) {
    if (!s?.length) return undefined // delete key
    // string -> any
    const v: any = JSONTryParse(s, undefined) ?? s
    // value -> json
    const jv = JSON.stringify(v)
    // json -> utf8
    const encoded = stringToBuffer(jv)
    return encoded
}

export function parseToSettings(
    source: string,
    secret: boolean
): Record<string, Uint8Array> {
    const res: Record<string, Uint8Array> = {}
    source
        ?.split(/\r?\n/g)
        .filter(line => !/\s*#/.test(line)) // skip empty lines and commands
        .map(line => /(?<key>[^=]+)\s*=(?<value>[^#]*)#?/.exec(line))
        .filter(line => !!line)
        .forEach(({ groups }) => {
            const { key, value } = groups
            delete res[key]
            res[secret ? `${key}` : key] = stringToSettingValue(value)
        })
    return res
}
