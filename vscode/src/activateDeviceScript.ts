import * as vscode from "vscode"
import { activateDebugger } from "./debugger"
import { activateGateway } from "./gateway/activateGateway"
import { startJacdacBus, stopJacdacBus } from "./jacdac"
import { JDomDeviceTreeItem, activateTreeViews } from "./JDomTreeDataProvider"
import { activateMainStatusBar } from "./mainstatusbar"
import {
    activateJacdacOutputChannel,
    activateDeviceScriptOutputChannel,
    activateDeviceScriptI2COutputChannel,
} from "./output"
import { DeviceScriptExtensionState } from "./state"

export function activateDeviceScript(context: vscode.ExtensionContext) {
    const { subscriptions, extensionMode } = context
    const devToolsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools"
    )
    activateDeviceScriptOutputChannel(extensionMode)

    // setup bus
    const bus = startJacdacBus()
    context.subscriptions.push({
        dispose: stopJacdacBus,
    })
    const extensionState = new DeviceScriptExtensionState(context, bus)

    // build
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.configure",
            async () => await extensionState.configure()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.identify",
            async (item: JDomDeviceTreeItem) => {
                const device =
                    item?.device ||
                    (await extensionState.pickDeviceScriptManager(true))?.device
                await device?.identify()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.reset",
            async (item: JDomDeviceTreeItem) => {
                const device =
                    item?.device ||
                    (await extensionState.pickDeviceScriptManager(true))?.device
                await device.reset() // async
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.flash",
            (device?: JDomDeviceTreeItem) =>
                device ? device.flash() : extensionState.flashFirmware()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.connect",
            async () => extensionState.connect()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.sims.add",
            async () => extensionState.addSim()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.services.add",
            async () => extensionState.addService()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.boards.add",
            async () => extensionState.addBoard()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.variables.simulator",
            () => extensionState.simulatorScriptManagerId
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.simulator.stop",
            async () => {
                await extensionState.stopSimulator()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.simulator.start",
            async () => {
                await extensionState.startSimulator()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.pickDeviceScriptManager",
            () => extensionState.pickDeviceScriptManager()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.editor.run",
            async () => {
                const editor = vscode.window.activeTextEditor
                const file = editor?.document?.uri
                if (file) {
                    const folder = vscode.workspace.getWorkspaceFolder(file)
                    await vscode.debug.startDebugging(folder, {
                        type: "devicescript",
                        request: "launch",
                        name: "DeviceScript: Run File",
                        stopOnEntry: false,
                        noDebug: true,
                        program: file.fsPath,
                    } as vscode.DebugConfiguration)
                }
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.editor.build",
            async () => {
                const editor = vscode.window.activeTextEditor
                const file = editor?.document?.uri
                if (file) await extensionState.build(file)
            }
        )
    )

    activateDebugger(extensionState)
    activateGateway(context, extensionState)
    activateTreeViews(extensionState)
    activateMainStatusBar(extensionState)
    activateJacdacOutputChannel(extensionState)
    activateDeviceScriptI2COutputChannel(extensionState)

    // launch devtools in background
    if (devToolsConfig.get("autoStart")) {
        extensionState.devtools.start()
    }
}
