import {
    CloudDevice,
    CloudManager,
    CloudScript,
    CLOUD_DEVICE_NODE,
    CLOUD_SCRIPT_NODE,
    deviceCatalogImage,
    ellipse,
    identifierToUrlPath,
    JDNode,
    shortDeviceId,
    toHex,
} from "jacdac-ts"
import * as vscode from "vscode"
import { toMarkdownString } from "./catalog"
import { build } from "./build"
import { Utils } from "vscode-uri"
import { CloudExtensionState } from "./CloudExtensionState"

async function createFile(
    fileName: string,
    fileContent: string
): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders[0]
    const file = vscode.Uri.joinPath(workspaceFolder.uri, fileName)
    await vscode.workspace.fs.writeFile(
        file,
        new TextEncoder().encode(fileContent)
    )
    const document = await vscode.workspace.openTextDocument(file)
    await vscode.window.showTextDocument(document)
}

const CLOUD_SCRIPTS_NODE = "cloudScripts"
const CLOUD_DEVICES_NODE = "cloudDevices"

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

export class CloudTreeDataProvider implements vscode.TreeDataProvider<JDNode> {
    constructor(readonly state: CloudExtensionState) {
        const { deviceScriptState, context } = this.state
        const { subscriptions } = context
        const { bus } = deviceScriptState

        vscode.commands.registerCommand(
            "extension.devicescript.cloud.device.updateScript",
            async (device: CloudDevice) => {
                const manager = this.state.manager
                if (!manager) return
                const current = manager?.script(device.scriptId)
                const scripts = manager.scripts()

                const res = await vscode.window.showQuickPick(
                    scripts.map(
                        script =>
                            <vscode.QuickPickItem & { script: CloudScript }>{
                                script,
                                label: script.displayName,
                                description: `v${script.version}`,
                                detail: script.creationTime.toLocaleString(),
                                picked: script === current,
                            }
                    ),
                    {
                        title: "Select a script",
                    }
                )
                if (res === undefined) return

                const script = res.script
                await script.refreshVersions()
                const versions = script.versions()
                const v = await vscode.window.showQuickPick(
                    versions.map(
                        v =>
                            <vscode.QuickPickItem & { version: number }>{
                                version: v.version,
                                label: `v${v.version}`,
                                description: v.creationTime.toLocaleString(),
                            }
                    ),
                    {
                        title: "Select a version",
                    }
                )
                if (v === undefined) return

                await this.state.withProgress("Updating Script", async () => {
                    await device.updateScript(script.scriptId, v.version)
                    this.refresh(device)
                })
            },
            subscriptions
        )
        vscode.commands.registerCommand(
            "extension.devicescript.cloud.device.downloadScriptSource",
            async (script: CloudScript) => {
                const name = script.name
                const body = await script.refreshBody()
                if (!body) return
                const text = body.text
                await createFile(
                    `./${name}${name.endsWith(".ts") ? "" : ".ts"}`,
                    text
                )
            },
            subscriptions
        )
        vscode.commands.registerCommand(
            "extension.devicescript.cloud.device.uploadScriptSource",
            async () => {
                const manager = this.state.manager
                if (!manager) return

                const editor = vscode.window.activeTextEditor
                if (!editor || editor.document.languageId !== "typescript") {
                    vscode.window.showErrorMessage(
                        "DeviceScript Cloud: no DeviceScript file open."
                    )
                    return
                }

                const file = vscode.window.activeTextEditor.document.uri
                const base = Utils.basename(file).replace(/\.ts$/i, "")
                const text = new TextDecoder().decode(
                    await vscode.workspace.fs.readFile(file)
                )
                // try to build
                const status = await build(file.fsPath)
                if (!status?.success) {
                    vscode.window.showErrorMessage(
                        "DeviceScript Cloud: file have build errors."
                    )
                    return
                }

                const compiled = toHex(status.binary)

                // find script to override
                await manager.refreshScripts()
                const sres = await vscode.window.showQuickPick(
                    <(vscode.QuickPickItem & { script?: CloudScript })[]>[
                        ...manager.scripts().map(script => ({
                            script,
                            label: script.name,
                            description: `v${script.version}`,
                            picked: script.name === base,
                        })),
                        {
                            label: "Create new cloud script",
                        },
                    ],
                    {
                        title: `Select cloud script to override with '${base}'`,
                    }
                )
                if (sres === undefined) return
                const script = sres.script || (await manager.createScript(base))

                // upload
                this.state.withProgress("Uploading script", async () => {
                    await script.uploadBody({ compiled, text })
                    this.refresh(script)

                    vscode.window.showInformationMessage(
                        "DeviceScript Cloud: Script updated"
                    )
                })
            },
            subscriptions
        )
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
                    }
-  source preview

\`\`\`typescript
${ellipse(body.text, 1000, "...")}
\`\`\`\
                
                
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
                description = script
                    ? `${script.displayName} v${d.scriptVersion}`
                    : "no script"
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
                    spec ? `devices/${identifierToUrlPath(spec.id)}` : undefined
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

export function registerCloudTreeDataProvider(cloudState: CloudExtensionState) {
    const cloudTreeDataProvider = new CloudTreeDataProvider(cloudState)
    vscode.window.registerTreeDataProvider(
        "extension.devicescript.cloud-explorer",
        cloudTreeDataProvider
    )
}
