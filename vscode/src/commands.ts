import { isAckError, isCancelError } from "jacdac-ts"
import * as vscode from "vscode"

export function withProgress(
    title: string,
    handler: (
        progress: vscode.Progress<{ message?: string; increment?: number }>
    ) => Promise<void>
) {
    vscode.window.withProgress(
        {
            title,
            location: vscode.ProgressLocation.Notification,
        },
        async progress => {
            try {
                await handler(progress)
            } catch (e) {
                if (isCancelError(e)) return
                if (isAckError(e)) vscode.window.showErrorMessage("")
            }
        }
    )
}
