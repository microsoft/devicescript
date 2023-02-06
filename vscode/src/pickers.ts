import * as vscode from "vscode"
import { Utils } from "vscode-uri"

export type TaggedQuickPickItem<T> = vscode.QuickPickItem & { data?: T }

export async function pickDeviceScriptFile(
    folder: vscode.WorkspaceFolder,
    options: vscode.QuickPickOptions
) {
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
                <TaggedQuickPickItem<vscode.Uri>>{
                    data: file,
                    label: file.path,
                }
        ),
        {
            ...options,
            canPickMany: false,
        }
    )
    return res?.data
}
