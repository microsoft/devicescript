import {
    CHANGE,
    deviceCatalogImage,
    identifierToUrlPath,
    JDNode,
    shortDeviceId,
} from "jacdac-ts"
import * as vscode from "vscode"
import { toMarkdownString } from "../catalog"
import { GatewayExtensionState } from "./GatewayExtensionState"
import { CONNECTION_GATEWAY_RESOURCE_GROUP } from "../constants"
import { showConfirmBox, TaggedQuickPickItem } from "../pickers"
import {
    GatewayManager,
    GatewayScript,
    GatewayDevice,
    GATEWAY_SCRIPT_NODE,
    GATEWAY_DEVICE_NODE,
    GatewayCollection,
    GATEWAY_DEVICES_NODE,
    GATEWAY_SCRIPTS_NODE,
    GATEWAY_NODE,
} from "./gatewaydom"
import type { DebugInfo } from "@devicescript/interop"
import {
    SideConnectReq,
    WebSocketConnectReqArgs,
} from "../../../cli/src/sideprotocol"
import { sideRequest } from "../jacdac"

type GatewayScriptPickItem = TaggedQuickPickItem<GatewayScript>

function gatewayScriptToQuickPickItem(
    script: GatewayScript,
    options?: { picked?: boolean }
) {
    return <GatewayScriptPickItem>{
        data: script,
        label: script.name,
        description:
            script.version !== undefined ? `v${script.version}` : "no version",
        detail: script.creationTime.toLocaleString(),
        ...(options || {}),
    }
}

function gatewayScriptVersionToQuickPickItem(
    v: GatewayScript
): TaggedQuickPickItem<GatewayScript> {
    return <GatewayScriptPickItem>{
        data: v,
        label: `v${v.version}`,
        description: v.creationTime.toLocaleString(),
    }
}

export class GatewayTreeDataProvider
    implements vscode.TreeDataProvider<JDNode>
{
    constructor(readonly state: GatewayExtensionState) {
        const { context } = this.state
        const { subscriptions } = context

        state.on(CHANGE, () => this.refresh(undefined))

        subscriptions.push(
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.connect",
                async (device: GatewayDevice) => {
                    const manager = this.state.manager
                    if (!manager || !device) return

                    const { url, protocol } =
                        (await device.createConnection("logs")) || {}
                    if (!url) {
                        vscode.window.showErrorMessage(
                            "DeviceScript Gateway - Unable to open connection."
                        )
                        return
                    }

                    await sideRequest<SideConnectReq>({
                        req: "connect",
                        data: <WebSocketConnectReqArgs>{
                            transport: "websocket",
                            background: false,
                            resourceGroupId: CONNECTION_GATEWAY_RESOURCE_GROUP,
                            url,
                            protocol,
                        },
                    })
                    vscode.commands.executeCommand(
                        "extension.devicescript.terminal.show"
                    )
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.ping",
                async (device: GatewayDevice) => {
                    await device.ping()
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.unregister",
                async (device: GatewayDevice) => {
                    if (await showConfirmBox("Unregister device?"))
                        await this.state.withProgress(
                            "Unregistering device...",
                            async () => await device?.delete()
                        )
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.refreshToken",
                async (device: GatewayDevice) => {
                    const manager = this.state.manager
                    if (!manager || !device) return
                    const dev = manager.bus.device(device.deviceId, true)
                    if (!dev) {
                        vscode.window.showErrorMessage(
                            "DeviceScript Gateway: device not connected."
                        )
                        return
                    }
                    await manager.registerDevice(dev, device.name)
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.script.delete",
                async (script: GatewayScript) => {
                    if (
                        await showConfirmBox(
                            "Delete script and all its versions?"
                        )
                    )
                        await this.state.withProgress(
                            "Updating Script",
                            async () => await script?.delete()
                        )
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.script.configure",
                async (device: GatewayDevice) => {
                    const manager = this.state.manager
                    if (!manager || !device) return
                    const current = manager?.script(device.scriptId)
                    const scripts = manager.scripts()

                    const res = await vscode.window.showQuickPick(
                        [
                            ...scripts.map(script =>
                                gatewayScriptToQuickPickItem(script, {
                                    picked: script === current,
                                })
                            ),
                            {
                                label: "no script",
                                description: "unassign script to this device",
                            },
                        ],
                        {
                            title: "Select a script",
                        }
                    )
                    if (res === undefined) return

                    const script = res.data
                    if (!script) {
                        // unassign
                        await this.state.withProgress(
                            "Updating Script",
                            async () => {
                                await device.updateScript("")
                                await device.refresh()
                                this.refresh(device)
                            }
                        )
                        return
                    }

                    // get version and such
                    await script.refreshVersions()
                    const versions = script.versions()
                    const v = await vscode.window.showQuickPick(
                        versions.map(v =>
                            gatewayScriptVersionToQuickPickItem(v)
                        ),
                        {
                            title: "Select a version",
                        }
                    )
                    if (v === undefined) return

                    await this.state.withProgress(
                        "Updating Script",
                        async () => {
                            await device.updateScript(
                                script.scriptId,
                                v.data.version
                            )
                            await device.refresh()
                            this.refresh(device)
                        }
                    )
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.script.update.latest",
                async (device: GatewayDevice) => {
                    const manager = this.state.manager
                    if (!manager || !device) return
                    const script = manager.script(device.scriptId)
                    if (!script) return
                    // get version and such
                    await script.refreshVersions()
                    const versions = script.versions()
                    const v = versions?.[0]
                    if (!v) return

                    if (v.version === device.scriptVersion) {
                        vscode.window.showInformationMessage(
                            "DeviceScript Gateway: script version already at latest"
                        )
                        return
                    }

                    await this.state.withProgress(
                        `Updating Script to ${v.version}`,
                        async () => {
                            await device.updateScript(
                                device.scriptId,
                                v.version
                            )
                            await device.refresh()
                            this.refresh(device)
                        }
                    )
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.script.upload",
                async (script: GatewayScript) => {
                    const manager = this.state.manager
                    if (!manager) return
                    const file =
                        await this.state.deviceScriptState.pickDeviceScriptFile(
                            { title: "Pick an entry point file." }
                        )
                    const status =
                        await this.state.deviceScriptState.devtools.build(
                            file.fsPath
                        )
                    if (!status?.success) {
                        vscode.window.showErrorMessage(
                            `DeviceScript Gateway: project has build errors.`
                        )
                        return
                    }
                    const program = status.dbg
                    this.state.withProgress("Uploading script", async () => {
                        await script.uploadBody({ program })
                        this.refresh(script)

                        vscode.window.showInformationMessage(
                            "DeviceScript Gateway: Script updated"
                        )
                    })
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.scripts.upload",
                async () => {
                    const manager = this.state.manager
                    if (!manager) return

                    const file =
                        await this.state.deviceScriptState.pickDeviceScriptFile(
                            { title: "Pick an entry point file." }
                        )

                    // TODOtry to build
                    const status =
                        await this.state.deviceScriptState.devtools.build(
                            file.fsPath
                        )
                    if (!status?.success) {
                        vscode.window.showErrorMessage(
                            `DeviceScript Gateway: project has build errors.`
                        )
                        return
                    }
                    const program = status.dbg
                    const base = program?.localConfig.hwInfo.progName

                    // find script to override
                    await manager.refreshScripts()
                    const script = manager.scripts().find(s => s.name === base)
                    if (script) await this.uploadScriptProgram(script, program)
                    else await this.createScript(manager, base, program)
                }
            )
        )
    }

    private async uploadScriptProgram(
        script: GatewayScript,
        program: DebugInfo
    ) {
        await this.state.withProgress("Uploading script...", async () => {
            await script.uploadBody({
                versions: this.state.deviceScriptState.devtools.versions(),
                program,
            })
            this.refresh(script)
        })
    }

    private async createScript(
        manager: GatewayManager,
        name: string,
        program: DebugInfo
    ) {
        await this.state.withProgress("Uploading script...", async () => {
            const script = await manager.createScript(name, {
                versions: this.state.deviceScriptState.devtools.versions(),
                program,
            })
            this.refresh(script)
        })
    }

    async resolveTreeItem(
        item: vscode.TreeItem,
        node: JDNode,
        token: vscode.CancellationToken
    ) {
        const { nodeKind } = node
        switch (nodeKind) {
            case GATEWAY_SCRIPT_NODE: {
                const script = node as GatewayScript
                const body = await script.refreshBody()
                if (body)
                    item.tooltip =
                        toMarkdownString(`-  creation time: ${script.creationTime.toLocaleString()}
`)
                break
            }
        }
        return item
    }

    getTreeItem(node: JDNode) {
        const id = `cloud:` + node.id
        let collapsibleState = vscode.TreeItemCollapsibleState.None
        let label = node.name
        let description = ""
        let tooltip: vscode.MarkdownString = undefined
        let command: vscode.Command
        const contextValue = node.nodeKind
        let iconPath: vscode.ThemeIcon | vscode.Uri = new vscode.ThemeIcon(
            {
                [GATEWAY_NODE]: "cloud",
                [GATEWAY_DEVICE_NODE]: "circuit-board",
                [GATEWAY_SCRIPT_NODE]: "file-code",
                [GATEWAY_DEVICES_NODE]: "circuit-board",
                [GATEWAY_SCRIPTS_NODE]: "file-code",
            }[contextValue] || "question"
        )

        switch (node.nodeKind) {
            case GATEWAY_NODE: {
                const mgr = node as GatewayManager
                description = mgr.lastFetchStatus || ""
                tooltip = toMarkdownString(`
-   API root: [${mgr.apiRoot}](${mgr.apiRoot}/swagger/)
-   Last fetch: ${mgr.lastFetchStatus}
                `)
                break
            }
            case GATEWAY_DEVICES_NODE:
            case GATEWAY_SCRIPTS_NODE: {
                collapsibleState = vscode.TreeItemCollapsibleState.Expanded
                break
            }
            case GATEWAY_SCRIPT_NODE: {
                const script = node as GatewayScript
                description = `v${script.version}`
                break
            }
            case GATEWAY_DEVICE_NODE: {
                const d = node as GatewayDevice
                const { meta, connected, scriptId, scriptVersion } = d
                const script = this.state.manager?.script(scriptId)
                const spec =
                    this.state.bus.deviceCatalog.specificationFromProductIdentifier(
                        meta.productId
                    )

                label = `${shortDeviceId(d.deviceId)}, ${d.name}`
                command = {
                    title: "Ping device",
                    command: "extension.devicescript.gateway.device.ping",
                    arguments: [d],
                }
                description = script
                    ? `${script.friendlyName} v${scriptVersion}`
                    : "no script"
                const iconName = connected
                    ? "circle-large-filled"
                    : "circle-slash"
                iconPath = new vscode.ThemeIcon(iconName)
                tooltip = toMarkdownString(
                    `
$(${iconName}) ${connected ? `connected` : `disconnected`}

- device id: ${d.deviceId}
- last activity: ${d.lastActivity}
- product: ${spec?.name || meta.productId?.toString(16) || ""}
- firmware version: ${meta.fwVersion || ""}

${spec ? `![Device image](${deviceCatalogImage(spec, "list")})` : ""}

`,
                    spec
                        ? `jacdac:devices/${identifierToUrlPath(spec.id)}`
                        : undefined
                )

                break
            }
        }

        return <vscode.TreeItem>{
            id,
            label,
            contextValue,
            iconPath,
            tooltip,
            description,
            collapsibleState,
            command,
        }
    }

    async getChildren(element?: JDNode) {
        if (!element) {
            await this.state.connect()
            const manager = this.state.manager
            if (!manager) return undefined

            const items = [
                manager,
                new GatewayCollection(
                    manager,
                    GATEWAY_SCRIPTS_NODE,
                    "scripts",
                    _ => _.scripts()
                ),
                new GatewayCollection(
                    manager,
                    GATEWAY_DEVICES_NODE,
                    "devices",
                    _ => _.devices()
                ),
            ]
            return items
        } else if (element === this.state.manager) {
            return []
        } else {
            return element?.children as JDNode[]
        }
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
        void | JDNode | JDNode[]
    > = new vscode.EventEmitter<void | JDNode | JDNode[]>()
    readonly onDidChangeTreeData: vscode.Event<void | JDNode | JDNode[]> =
        this._onDidChangeTreeData.event

    refresh(treeItem?: JDNode): void {
        this._onDidChangeTreeData.fire(treeItem)
    }
}

export function registerCloudTreeDataProvider(
    cloudState: GatewayExtensionState
) {
    const treeDataProvider = new GatewayTreeDataProvider(cloudState)
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.gateway",
        treeDataProvider
    )
}
