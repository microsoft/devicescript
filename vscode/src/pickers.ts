import * as vscode from "vscode"
import { Utils } from "vscode-uri"

type FilePickItem = vscode.QuickPickItem & { file: vscode.Uri }

export async function pickDeviceScriptFile(options: vscode.QuickPickOptions) {
    const folder = vscode.workspace.workspaceFolders?.[0]
    if (!folder) return undefined

    // find file marker
    const configs = await vscode.workspace.findFiles(
        new vscode.RelativePattern(folder, "**/devsconfig.json"),
        "**​/node_modules/**"
    )
    // get all typescript files next to config fie
    const files = (
        await Promise.all(
            configs.map(async cfg => {
                const d = Utils.dirname(cfg).fsPath
                const res = await vscode.workspace.findFiles(
                    new vscode.RelativePattern(d, "*.ts")
                )
                return res
            })
        )
    ).flat()
    // sort
    files.sort((l, r) => l.path.localeCompare(r.path))

    if (!files.length) return undefined

    // ask user
    const res = await vscode.window.showQuickPick(
        files.map(
            file =>
                <FilePickItem>{
                    file,
                    label: file.path,
                }
        ),
        {
            ...options,
            canPickMany: false,
        }
    )
    return res?.file
}
