import { isAckError, isCancelError, isTimeoutError } from "jacdac-ts"
import * as vscode from "vscode"

export function showError(error: Error) {
    if (!error || isCancelError(error)) return

    console.error(error)

    if (isTimeoutError(error))
        vscode.window.showErrorMessage("DeviceScript: the operation timed out.")
    else if (isAckError(error))
        vscode.window.showErrorMessage(
            "DeviceScript: the service did not respond to this command."
        )
    else vscode.window.showErrorMessage("DeviceScript: Unexpected error.")
}

export async function execute(handler: () => Promise<void>) {
    try {
        await handler?.()
    } catch (error) {
        showError(error)
    }
}

export async function withProgress(
    title: string,
    handler: (
        progress: vscode.Progress<{ message?: string; increment?: number }>
    ) => Promise<void>
) {
    let error: Error
    await vscode.window.withProgress(
        {
            title,
            location: vscode.ProgressLocation.Notification,
        },
        async progress => {
            try {
                await handler(progress)
            } catch (e) {
                error = e
            }
        }
    )

    showError(error)
}
