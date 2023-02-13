import {
    isAckError,
    isCancelError,
    isTimeoutError,
    JDService,
    PackedValues,
} from "jacdac-ts"
import * as vscode from "vscode"

export const MESSAGE_PREFIX = "DeviceScript - "

export function showError(error: Error) {
    if (!error || isCancelError(error)) return

    console.error(error)

    if (isTimeoutError(error))
        vscode.window.showErrorMessage(
            MESSAGE_PREFIX + "the operation timed out."
        )
    else if (isAckError(error))
        vscode.window.showErrorMessage(
            MESSAGE_PREFIX + "the device did not respond to this command."
        )
    else vscode.window.showErrorMessage(MESSAGE_PREFIX + error?.message)
}

export async function sendCmd(
    service: JDService,
    cmd: number,
    values?: PackedValues
) {
    try {
        if (values) await service.sendCmdPackedAsync(cmd, values, true)
        else await service.sendCmdAsync(cmd, undefined, true)
    } catch (error) {
        showError(error)
    }
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
            title: MESSAGE_PREFIX + title,
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
