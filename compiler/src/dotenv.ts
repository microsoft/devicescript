import { JSONTryParse, stringToBuffer } from "jacdac-ts"

function stringToSettingValue(s: string) {
    // string -> any
    const v: any = JSONTryParse(s, undefined) ?? s
    // value -> json
    const jv = JSON.stringify(v)
    // json -> utf8
    const encoded = stringToBuffer(jv)
    return encoded
}

function parseInto(
    source: string,
    secret: boolean,
    res: Record<string, Uint8Array>
) {
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
}

export function parseToSettings(options: {
    envDefaults: string
    envLocal: string
}): Record<string, Uint8Array> {
    const res = {}
    parseInto(options.envDefaults, false, res)
    parseInto(options.envLocal, true, res)
    return res
}
