import {
    CHANGE,
    deviceCatalogImage,
    identifierToUrlPath,
    JDNode,
    shortDeviceId,
} from "jacdac-ts"
import * as vscode from "vscode"
import { toMarkdownString } from "../catalog"
import { Utils } from "vscode-uri"
import { GatewayExtensionState } from "./GatewayExtensionState"
import { sideRequest } from "../jacdac"
import type {
    SideConnectReq,
    WebSocketConnectReqArgs,
} from "../../../cli/src/sideprotocol"
import {
    CLOUD_DEVICES_NODE,
    CLOUD_SCRIPTS_NODE,
    CONNECTION_RESOURCE_GROUP,
} from "../constants"
import { showConfirmBox, TaggedQuickPickItem } from "../pickers"
import { readFileJSON } from "../fs"
import {
    CloudManager,
    CloudScript,
    CloudDevice,
    CLOUD_SCRIPT_NODE,
    CLOUD_DEVICE_NODE,
} from "./clouddom"
import { DebugInfo } from "@devicescript/compiler"

class CloudCollection extends JDNode {
    constructor(
        readonly manager: CloudManager,
        private readonly _nodeKind: string,
        private readonly _name: string,
        private readonly _children: (manager: CloudManager) => JDNode[]
    ) {
        super()
    }
    get id(): string {
        return `${this.manager.id}.${this.nodeKind}`
    }
    get nodeKind(): string {
        return this._nodeKind
    }
    get name(): string {
        return this._name
    }
    get qualifiedName(): string {
        return `${this.parent.qualifiedName}.${this.name}`
    }
    get parent(): JDNode {
        return this.manager
    }
    get children(): JDNode[] {
        return this._children(this.manager).sort((l, r) =>
            l.name.localeCompare(r.name)
        )
    }
}

type CloudScriptPickItem = TaggedQuickPickItem<CloudScript>

function cloudScriptToQuickPickItem(
    script: CloudScript,
    options?: { picked?: boolean }
) {
    return <CloudScriptPickItem>{
        data: script,
        label: script.name,
        description:
            script.version !== undefined ? `v${script.version}` : "no version",
        detail: script.creationTime.toLocaleString(),
        ...(options || {}),
    }
}

function cloudScriptVersionToQuickPickItem(
    v: CloudScript
): TaggedQuickPickItem<CloudScript> {
    return <CloudScriptPickItem>{
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
                async (device: CloudDevice) => {
                    const manager = this.state.manager
                    if (!manager || !device) return

                    const { url, protocol } =
                        (await device.createConnection()) || {}
                    if (!url) {
                        vscode.window.showErrorMessage(
                            "DeviceScript Gateway: Unable to open connection."
                        )
                        return
                    }

                    await sideRequest<SideConnectReq>({
                        req: "connect",
                        data: <WebSocketConnectReqArgs>{
                            transport: "websocket",
                            background: false,
                            resourceGroupId: CONNECTION_RESOURCE_GROUP,
                            url,
                            protocol,
                        },
                    })
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.unregister",
                async (device: CloudDevice) => {
                    if (await showConfirmBox("Unregister device?"))
                        await this.state.withProgress(
                            "Unregistering device...",
                            async () => await device?.delete()
                        )
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.device.refreshToken",
                async (device: CloudDevice) => {
                    const manager = this.state.manager
                    if (!manager || !device) return
                    const dev = manager.bus.device(device.deviceId, true)
                    if (dev) await manager.registerDevice(dev, device.name)
                }
            ),
            vscode.commands.registerCommand(
                "extension.devicescript.gateway.script.delete",
                async (script: CloudScript) => {
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
                "extension.devicescript.gateway.device.updateScript",
                async (device: CloudDevice) => {
                    const manager = this.state.manager
                    if (!manager || !device) return
                    const current = manager?.script(device.scriptId)
                    const scripts = manager.scripts()

                    const res = await vscode.window.showQuickPick(
                        [
                            ...scripts.map(script =>
                                cloudScriptToQuickPickItem(script, {
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
                        versions.map(v => cloudScriptVersionToQuickPickItem(v)),
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
                "extension.devicescript.gateway.script.upload",
                async (script: CloudScript) => {
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
                "extension.devicescript.gateway.device.uploadScript",
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
                    const pkg = await readFileJSON<{ name: string }>(
                        this.state.deviceScriptState.projectFolder,
                        "package.json"
                    )
                    const base = `${pkg?.name || "no-package"}/${Utils.basename(
                        file
                    ).replace(/\.ts$/i, "")}`

                    // find script to override
                    await manager.refreshScripts()
                    const sres = await vscode.window.showQuickPick(
                        <CloudScriptPickItem[]>[
                            ...manager.scripts().map(script =>
                                cloudScriptToQuickPickItem(script, {
                                    picked: script.name === base,
                                })
                            ),
                            {
                                label: "Create new cloud script",
                            },
                        ],
                        {
                            title: `Select cloud script to override with '${base}'`,
                        }
                    )
                    if (sres === undefined) return
                    const script =
                        sres.data || (await manager.createScript(base))

                    if (!script) {
                        vscode.window.showErrorMessage(
                            "DeviceScript Gateway: failed to create new script."
                        )
                        return
                    }

                    // upload
                    await this.uploadScriptProgram(script, program)
                }
            )
        )
    }

    private async uploadScriptProgram(script: CloudScript, program: DebugInfo) {
        await this.state.withProgress("Uploading script...", async () => {
            await script.uploadBody({
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
            case CLOUD_SCRIPT_NODE: {
                const script = node as CloudScript
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
        const contextValue = node.nodeKind
        let iconPath: vscode.ThemeIcon | vscode.Uri = new vscode.ThemeIcon(
            {
                [CLOUD_DEVICE_NODE]: "circuit-board",
                [CLOUD_SCRIPT_NODE]: "file-code",
                [CLOUD_DEVICES_NODE]: "circuit-board",
                [CLOUD_SCRIPTS_NODE]: "file-code",
            }[contextValue] || "question"
        )

        switch (node.nodeKind) {
            case CLOUD_DEVICES_NODE:
            case CLOUD_SCRIPTS_NODE: {
                collapsibleState = vscode.TreeItemCollapsibleState.Expanded
                break
            }
            case CLOUD_SCRIPT_NODE: {
                const script = node as CloudScript
                description = `v${script.version}`
                break
            }
            case CLOUD_DEVICE_NODE: {
                const d = node as CloudDevice
                const meta = d.meta
                const connected = d.connected
                const script = this.state.manager?.script(d.scriptId)
                const spec =
                    this.state.bus.deviceCatalog.specificationFromProductIdentifier(
                        meta.productId
                    )

                label = `${shortDeviceId(d.deviceId)}, ${d.name}`
                description = script ? script.displayName : "no script"
                const iconName = connected
                    ? "circle-large-filled"
                    : "circle-slash"
                iconPath = new vscode.ThemeIcon(iconName)
                tooltip = toMarkdownString(
                    `
$(${iconName}) ${connected ? `connected` : `disconnected`}

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
        }
    }

    async getChildren(element?: JDNode) {
        if (!element) {
            await this.state.connect()
            const manager = this.state.manager
            if (!manager) return undefined

            const items = [
                new CloudCollection(manager, CLOUD_SCRIPTS_NODE, "scripts", _ =>
                    _.scripts()
                ),
                new CloudCollection(manager, CLOUD_DEVICES_NODE, "devices", _ =>
                    _.devices()
                ),
            ]
            return items
        } else return element?.children as JDNode[]
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
