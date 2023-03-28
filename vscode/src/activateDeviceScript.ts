import * as vscode from "vscode"
import { Utils } from "vscode-uri"
import { activateDebugger } from "./debugger"
import { checkFileExists } from "./fs"
import { activateGateway } from "./gateway/activateGateway"
import { startJacdacBus, stopJacdacBus } from "./jacdac"
import { JDomDeviceTreeItem, activateTreeViews } from "./JDomTreeDataProvider"
import { activateMainStatusBar } from "./mainstatusbar"
import {
    activateJacdacOutputChannel,
    activateDeviceScriptOutputChannel,
    activateDeviceScriptI2COutputChannel,
    activateDeviceScriptDataChannel,
} from "./output"
import { DeviceScriptExtensionState } from "./state"
import { activateTelemetry } from "./telemetry"

export function activateDeviceScript(context: vscode.ExtensionContext) {
    const { subscriptions } = context
    activateTelemetry(context)
    const devToolsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools"
    )
    activateDeviceScriptOutputChannel(context)
    activateDeviceScriptDataChannel(context)

    // setup bus
    const bus = startJacdacBus()
    context.subscriptions.push({
        dispose: stopJacdacBus,
    })
    const extensionState = new DeviceScriptExtensionState(context, bus)

    const debugFile = async (file: vscode.Uri, noDebug: boolean) => {
        if (!file) return
        const folder = vscode.workspace.getWorkspaceFolder(file)
        if (!folder) return
        await vscode.debug.startDebugging(folder, {
            type: "devicescript",
            request: "launch",
            name: "DeviceScript: Run File",
            stopOnEntry: false,
            noDebug,
            program: file.fsPath,
        } as vscode.DebugConfiguration)
        if (noDebug)
            vscode.commands.executeCommand("extension.devicescript.jdom.focus")
    }

    // build
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.project.new",
            async () => {
                const folder =
                    vscode.workspace.workspaceFolders?.length === 1
                        ? vscode.workspace.workspaceFolders[0]
                        : await vscode.window.showWorkspaceFolderPick()
                if (folder === undefined) return

                // is this project empty?
                let projectName: string
                const projetFiles = await vscode.workspace.findFiles(
                    new vscode.RelativePattern(folder, "**/*"),
                    "**/node_modules/*",
                    1
                )
                if (projetFiles.length) {
                    projectName = await vscode.window.showInputBox({
                        title: "Pick project subfolder",
                        prompt: "It will be used as a root for the new DeviceScript project",
                    })
                    if (!projectName) return
                }
                const cwd = projectName
                    ? Utils.joinPath(folder.uri, projectName)
                    : folder.uri
                await vscode.workspace.fs.createDirectory(cwd)
                const terminal = vscode.window.createTerminal({
                    isTransient: true,
                    cwd,
                })
                terminal.sendText(
                    "npx --yes @devicescript/cli@latest init --quiet"
                )
                terminal.show()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.configure",
            async () => await extensionState.configure()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.identify",
            async (item: JDomDeviceTreeItem) => {
                const device =
                    item?.device ||
                    (
                        await extensionState.pickDeviceScriptManager({
                            skipUpdate: true,
                        })
                    )?.device
                await device?.identify()
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.reset",
            async (item: JDomDeviceTreeItem) => {
                const device = item?.device
                await device?.reset()
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
            "extension.devicescript.simulator.clear",
            async () => {
                await extensionState.clearSimulatorFlash()
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
            async (file: vscode.Uri) => debugFile(file, true)
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.editor.debug",
            async (file: vscode.Uri) => debugFile(file, false)
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.editor.build",
            async (file: vscode.Uri) => {
                if (!file) return

                await extensionState.build(file)
            }
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.editor.configure",
            async (file: vscode.Uri) => {
                const editor = await vscode.window.showTextDocument(file)
                if (!editor) return
                await extensionState.configureHardware(editor)
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
        extensionState.devtools.start({ build: true })
    }
}
