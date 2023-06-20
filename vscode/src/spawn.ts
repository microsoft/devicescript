import * as vscode from "vscode"
import { checkFileExists, readFileText } from "./fs"
import { versionTryParse } from "jacdac-ts"
import { Utils } from "vscode-uri"

function spawnAndWatch(
    options: vscode.TerminalOptions & {
        text?: string
        outFile: vscode.Uri
        timeout?: number
    }
): Promise<string> {
    return new Promise(resolve => {
        const { outFile, text, timeout = 10000, ...rest } = options
        // handle terminal crash
        let onclose = vscode.window.onDidCloseTerminal(e => {
            if (e === terminal) {
                ready()
            }
        })
        let terminal: vscode.Terminal
        let timeoutId: any

        const cleanup = () => {
            const canResolve = !!terminal || !!timeoutId
            terminal?.dispose?.()
            onclose?.dispose?.()
            clearTimeout(timeoutId)
            terminal = undefined
            onclose = undefined
            timeoutId = undefined
            return canResolve
        }

        const ready = async () => {
            if (cleanup()) {
                const text = await readFileText(outFile)
                resolve(text)
            }
        }

        timeoutId = setTimeout(() => {
            if (cleanup()) resolve(undefined)
        }, timeout)

        try {
            terminal = vscode.window.createTerminal(rest)
            terminal.show()
            if (text) terminal.sendText(text, true)
        } catch (e) {
            console.debug(e)
            if (cleanup()) resolve(undefined)
        }
    })
}

export async function tryGetNodeVersion(nodePath: string, outFile: vscode.Uri) {
    await vscode.workspace.fs.createDirectory(Utils.dirname(outFile))
    if (await checkFileExists(outFile))
        await vscode.workspace.fs.delete(outFile, { useTrash: false })
    const v = await spawnAndWatch({
        name: "DeviceScript - Installation Diagnostics",
        shellPath: nodePath,
        shellArgs: [
            "-e",
            `require('fs').writeFileSync('${outFile.fsPath}',process.version, { encoding: 'utf8' })`,
        ],
        outFile,
    })
    return versionTryParse(v)
}
