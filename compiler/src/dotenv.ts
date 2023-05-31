import { JSON5TryParse } from "@devicescript/interop"
import { stringToBuffer } from "jacdac-ts"

function stringToSettingValue(s: string) {
    // string -> any
    const v: any = JSON5TryParse(s, undefined) ?? s
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
            res[secret ? `${key}` : key] = stringToSettingValue(value)
        })
}

export function parseToSettings(
    secrets: string,
    publics?: string
): Record<string, Uint8Array> {
    const res = {}
    parseInto(secrets, true, res)
    parseInto(publics, false, res)
    return res
}
