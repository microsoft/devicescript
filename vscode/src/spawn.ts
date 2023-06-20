import * as vscode from "vscode"
import { readFileText } from "./fs"

/**
 * Launches a terminal and watches for an output files
 * @param options
 * @returns
 */
export function spawnAndWatch(
    options: vscode.TerminalOptions & {
        text?: string
        outFile: vscode.Uri
        timeout?: number
    }
): Promise<string> {
    return new Promise((resolve, reject) => {
        const { outFile, text, timeout = 10000, ...rest } = options
        // handle terminal crash
        let onclose = vscode.window.onDidCloseTerminal(e => {
            if (e === terminal) {
                cleanup()
                reject(new Error("Terminal closed"))
            }
        })
        let terminal: vscode.Terminal
        let watcher: vscode.FileSystemWatcher
        let timeoutId: any

        const cleanup = () => {
            terminal?.dispose?.()
            watcher?.dispose?.()
            onclose?.dispose?.()
            clearTimeout(timeoutId)
            terminal = undefined
            watcher = undefined
            onclose = undefined
        }

        const ready = async () => {
            cleanup()
            const text = await readFileText(outFile)
            resolve(text)
        }

        timeoutId = setTimeout(() => {
            cleanup()
            if (terminal) reject(new Error("Terminal not responding"))
        }, timeout)

        try {
            terminal = vscode.window.createTerminal(rest)
            terminal.show()
            if (outFile) {
                const glob = vscode.workspace.asRelativePath(outFile)
                watcher = vscode.workspace.createFileSystemWatcher(glob)
                watcher.onDidChange(ready)
                watcher.onDidCreate(ready)
            }
            if (text) terminal.sendText(text, true)
        } catch (e) {
            cleanup()
            reject(e)
        }
    })
}

export async function tryGetNodeVersion() {
    const outFile = vscode.Uri.file("./.devicescript/node.version")
    const v = await spawnAndWatch({
        name: "Node.js resolution",
        shellPath: "node",
        shellArgs: [
            "-e",
            `require('fs').writeFileSync('${outFile.fsPath}',process.version, { encoding: 'utf8' })`,
        ],
        outFile,
    })
    return v
}
