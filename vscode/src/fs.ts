import * as vscode from "vscode"

export async function checkFileExists(
    cwd: vscode.Uri,
    filePath: string
): Promise<boolean> {
    try {
        const file = vscode.Uri.joinPath(cwd, filePath)
        await vscode.workspace.fs.stat(file)
        return true
    } catch (error) {
        return false
    }
}

export async function writeFile(
    folder: vscode.Uri,
    fileName: string,
    fileContent: string
): Promise<void> {
    const file = vscode.Uri.joinPath(folder, fileName)
    await vscode.workspace.fs.writeFile(
        file,
        new TextEncoder().encode(fileContent)
    )
    const document = await vscode.workspace.openTextDocument(file)
    await vscode.window.showTextDocument(document)
}
