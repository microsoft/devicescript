import { JSON5TryParse } from "@devicescript/interop"
import * as vscode from "vscode"

export function splitNameValuePair(line: string) {
    const i = line.indexOf("=")
    if (i < 0) return undefined
    return [line.slice(0, i).trim(), line.slice(i + 1)]
}

export async function parseDotEnv(envFile: vscode.Uri) {
    const content = new TextDecoder().decode(
        await vscode.workspace.fs.readFile(envFile)
    )
    const env: Record<string, any> = {}
    content
        .split("\n")
        .filter(line => !!line && !/^#/.test(line)) // filter out comments
        .map(line => splitNameValuePair(line))
        .filter(kv => !!kv) // filter out empty names
        .map(([name, value]) => ({
            name,
            value: JSON5TryParse<any>(value) ?? value,
        }))
        .forEach(({ name, value }) => {
            env[name] = value
        })
    return env
}

export function unparseDotEnv(env: Record<string, any>) {
    const lines = Object.entries(env || {}).map(
        ([name, value]) => `${name}=${JSON.stringify(value)}`
    )
    return lines.join("\n")
}
