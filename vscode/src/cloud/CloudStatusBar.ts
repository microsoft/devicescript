import * as vscode from "vscode"
import { CHANGE } from "jacdac-ts"
import { toMarkdownString } from "../catalog"
import { CloudExtensionState } from "./CloudExtensionState"

export async function registerCloudStatusBar(state: CloudExtensionState) {
    const { context } = state
    const { subscriptions } = context

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        119.9
    )
    statusBarItem.command = "extension.devicescript.cloud.configure"
    const updateStatusBar = async () => {
        const { manager, apiRoot } = state
        if (manager) {
            statusBarItem.text = `$(cloud)`
            statusBarItem.tooltip = toMarkdownString(`
DeviceScript Cloud connected.

- swagger: [${apiRoot}](${apiRoot}/swagger/)
        `)
            statusBarItem.show()
        } else {
            statusBarItem.hide()
        }
    }

    state.on(CHANGE, updateStatusBar)
    updateStatusBar()
    subscriptions.push(statusBarItem)
    statusBarItem.show()
}
