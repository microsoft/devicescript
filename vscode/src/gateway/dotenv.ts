import { JSON5TryParse } from "@devicescript/interop"
import * as vscode from "vscode"

export async function parseDotEnv(envFile: vscode.Uri) {
    const content = new TextDecoder().decode(
        await vscode.workspace.fs.readFile(envFile)
    )
    const env: Record<string, any> = {}
    content
        .split("\n")
        .filter(line => !!line && !/^#/.test(line)) // filter out comments
        .map(line => ({
            line,
            name: line.slice(0, line.indexOf("=")),
        }))
        .filter(({ name }) => name) // filter out empty names
        .map(({ line, name }) => ({
            line,
            name,
            value:
                JSON5TryParse<any>(line.slice(name.length + 1)) ??
                line.slice(name.length + 1),
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
