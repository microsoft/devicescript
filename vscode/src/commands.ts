import {
    isAckError,
    isCancelError,
    isTimeoutError,
    JDService,
    PackedValues,
} from "jacdac-ts"
import * as vscode from "vscode"
import { showError } from "./telemetry"

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
            title: "DeviceScript - " + title,
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

export async function openDocUri(path: string) {
    const helpUri = vscode.Uri.parse(
        `https://microsoft.github.io/devicescript/${path}`
    )
    const success = await vscode.env.openExternal(helpUri)
    return success
}

export async function showInformationMessageWithHelp(
    message: string,
    path: string
): Promise<boolean | undefined> {
    const help = "Open Help"
    const res = await vscode.window.showInformationMessage(
        "DeviceScript - " + message,
        help
    )
    if (res === help) return await openDocUri(path)
    return undefined
}
