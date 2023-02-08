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
    // get all typescript files next to config file
    let files = (
        await Promise.all(
            configs
                .filter(cfg => !/\/node_modules\//.test(cfg.fsPath))
                .map(async cfg => {
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
    // unique
    files = [...new Set(files)]

    if (!files.length) {
        vscode.window.showErrorMessage("DeviceScript: could not find any file to debug.")
        return undefined
    }

    // ask user
    const res = await vscode.window.showQuickPick(
        files.map(
            file =>
                <TaggedQuickPickItem<vscode.Uri>>{
                    data: file,
                    label: Utils.basename(file),
                    description: Utils.dirname(file).fsPath,
                }
        ),
        {
            ...options,
            canPickMany: false,
        }
    )
    return res?.data
}
