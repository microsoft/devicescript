import * as vscode from "vscode"
import { Utils } from "vscode-uri"
import { activateDebugger } from "./debugger"
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
import { JDDevice } from "jacdac-ts"
import { resolvePythonEnvironment } from "./python"
import { MARKETPLACE_EXTENSION_ID } from "@devicescript/interop"
import { showConfirmBox } from "./pickers"
import { checkFileExists, readFileText } from "./fs"

export function activateDeviceScript(context: vscode.ExtensionContext) {
    const { subscriptions } = context
    activateTelemetry(context)
    // setup bus
    const bus = startJacdacBus()
    context.subscriptions.push({
        dispose: stopJacdacBus,
    })
    const extensionState = new DeviceScriptExtensionState(context, bus)

    // build
    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.project.new",
            async () => {
                let askOpen = false
                let folder: vscode.Uri
                if (!vscode.workspace.workspaceFolders?.length) {
                    // need to open a new workspace
                    const folders = await vscode.window.showOpenDialog({
                        title: "Select a folder to create project",
                        canSelectMany: false,
                        canSelectFiles: false,
                        canSelectFolders: true,
                    })
                    folder = folders?.[0]
                    if (!folder) return

                    // pick name
                    const name = await vscode.window.showInputBox({
                        title: "Pick a name for your project (optional)",
                    })
                    if (name === undefined) return
                    else if (name) folder = Utils.joinPath(folder, name)
                    askOpen = true
                } else {
                    const workspaceFolder =
                        vscode.workspace.workspaceFolders?.length === 1
                            ? vscode.workspace.workspaceFolders[0]
                            : await vscode.window.showWorkspaceFolderPick()
                    if (workspaceFolder === undefined) return
                    folder = workspaceFolder.uri
                }

                // is this project empty?
                let projectName: string
                const projetFiles = await vscode.workspace.findFiles(
                    new vscode.RelativePattern(folder, "**/*"),
                    "**/node_modules/*",
                    1
                )
                if (projetFiles.length) {
                    projectName = await vscode.window.showInputBox({
                        title: "Pick project subfolder (optional)",
                        prompt: "It will be used as a root for the new DeviceScript project. Leave empty to create project on root.",
                    })
                    if (projectName === undefined) return
                }
                const cwd = projectName
                    ? Utils.joinPath(folder, projectName)
                    : folder

                const yarnLock = await checkFileExists(cwd, "yarn.lock")
                const packageLock = await checkFileExists(cwd, "package.lock")
                const yarn = yarnLock
                    ? true
                    : packageLock
                    ? false
                    : "yarn" ===
                      (await vscode.window.showQuickPick(["npm", "yarn"], {
                          title: "What package manager do you use?",
                          placeHolder: "npm",
                      }))
                const devToolsConfig = vscode.workspace.getConfiguration(
                    "devicescript.devtools"
                )
                const verbose = devToolsConfig.get("verbose")
                await vscode.workspace.fs.createDirectory(cwd)
                const terminal = vscode.window.createTerminal({
                    isTransient: true,
                    cwd,
                })

                let cmd = "npx --yes @devicescript/cli@latest init"
                if (yarn) cmd += " --yarn"
                if (verbose) cmd += "  --verbose"
                else cmd += "  --quiet"
                terminal.sendText(cmd)
                terminal.show()

                if (askOpen) {
                    const res = await vscode.window.showInformationMessage(
                        "Would you like to open the project?",
                        "Yes"
                    )
                    if (res === "Yes") {
                        await vscode.commands.executeCommand(
                            "vscode.openFolder",
                            folder,
                            true // don't destroy terminal while reopening
                        )
                    }
                }
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
            (device?: JDomDeviceTreeItem | JDDevice) =>
                extensionState.flashFirmware(
                    device instanceof JDomDeviceTreeItem
                        ? device.device
                        : device
                )
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.device.clean",
            (device?: JDomDeviceTreeItem | JDDevice) =>
                extensionState.cleanFirmware(
                    device instanceof JDomDeviceTreeItem
                        ? device.device
                        : device
                )
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
            "extension.devicescript.settings.add",
            async () => extensionState.addSettings()
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.npm",
            async () => extensionState.addNpm()
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
            async (file: vscode.Uri) =>
                extensionState.runFile(file, { debug: false })
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.editor.debug",
            async (file: vscode.Uri) =>
                extensionState.runFile(file, { debug: true })
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
        ),
        vscode.commands.registerCommand(
            "extension.devicescript.openIssueReporter",
            async () => {
                const projectFolder = extensionState.projectFolder
                const includeProject =
                    projectFolder &&
                    (await showConfirmBox(
                        `Include '${vscode.workspace.asRelativePath(
                            projectFolder
                        )}' sources in the GitHub issue?`
                    ))
                const issueBody: string[] = [
                    `## Describe the issue`,
                    `A clear and concise description of what the bug is.`,
                    ``,
                    `## To Reproduce`,
                    `Steps to reproduce the behavior`,
                    ``,
                    `## Expected behavior`,
                    `A clear and concise description of what you expected to happen.`,
                    ``,
                    `## Environment`,
                    ``,
                ]
                const versions = extensionState.devtools?.versions()
                const py = await resolvePythonEnvironment()
                issueBody.push(`vscode: ${vscode.version}`)
                issueBody.push(
                    `extension: ${
                        context.extension?.packageJSON?.version || "?"
                    }`
                )
                if (versions) {
                    Object.entries(versions).forEach(([k, v]) =>
                        issueBody.push(`${k}: ${v}`)
                    )
                }
                if (py)
                    issueBody.push(
                        `python: ${py.version.major}.${py.version.minor}.${py.version.micro}`
                    )

                if (includeProject) {
                    const files = [
                        ...(await vscode.workspace.findFiles(
                            new vscode.RelativePattern(
                                projectFolder,
                                "src/*.{ts,tsx}"
                            )
                        )),
                        ...(await vscode.workspace.findFiles(
                            new vscode.RelativePattern(
                                projectFolder,
                                "boards/*.json"
                            )
                        )),
                        ...(await vscode.workspace.findFiles(
                            new vscode.RelativePattern(
                                projectFolder,
                                "services/*.md"
                            )
                        )),
                    ]
                    issueBody.push(``, `## Sources`)
                    for (const file of files) {
                        const src = await readFileText(file)
                        const fn = vscode.workspace.asRelativePath(file)
                        issueBody.push(
                            `-  ${fn}}`,
                            `\`\`\`${Utils.extname(file).slice(
                                1
                            )} title="${fn}"`,
                            src,
                            "```"
                        )
                    }
                }

                issueBody.push(
                    ``,
                    `## Devices`,
                    bus.describe({ ignoreSimulators: true, physical: true })
                )
                await vscode.commands.executeCommand(
                    "workbench.action.openIssueReporter",
                    {
                        extensionId: MARKETPLACE_EXTENSION_ID,
                        issueBody: issueBody.join("\n"),
                    }
                )
            }
        )
    )

    activateDebugger(extensionState)
    activateGateway(context, extensionState)
    activateTreeViews(extensionState)
    activateMainStatusBar(extensionState)
    activateJacdacOutputChannel(extensionState)
    activateDeviceScriptI2COutputChannel(extensionState)
    activateDeviceScriptOutputChannel(extensionState)
    activateDeviceScriptDataChannel(extensionState)

    // launch devtools in background
    const devToolsConfig = vscode.workspace.getConfiguration(
        "devicescript.devtools"
    )
    if (devToolsConfig.get("autoStart")) {
        extensionState.devtools.start({ build: true })
    }
}
