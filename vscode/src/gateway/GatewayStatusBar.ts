import * as vscode from "vscode"
import { CHANGE } from "jacdac-ts"
import { toMarkdownString } from "../catalog"
import { GatewayExtensionState } from "./GatewayExtensionState"

export async function registerGatewayStatusBar(state: GatewayExtensionState) {
    const { context } = state
    const { subscriptions } = context

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        119.9
    )
    statusBarItem.command = "extension.devicescript.gateway.configure"
    const updateStatusBar = async () => {
        const { manager, apiRoot } = state
        if (manager) {
            statusBarItem.text = `$(cloud)`
            statusBarItem.tooltip = toMarkdownString(`
DeviceScript Gateway connected.

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
