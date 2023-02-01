import {
    CHANGE,
    CloudData,
    CloudDevice,
    CloudManager,
    CloudNode,
    CloudScript,
    CLOUD_DEVICE_NODE,
    CLOUD_SCRIPT_NODE,
    deviceCatalogImage,
    ellipse,
    identifierToUrlPath,
    JDBus,
    JDDevice,
    JDNode,
    shortDeviceId,
    SRV_CLOUD_ADAPTER,
} from "jacdac-ts"
import * as vscode from "vscode"
import { ExtensionState } from "./state"
import "isomorphic-fetch"
import { deviceIconUri, toMarkdownString } from "./catalog"

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
    private _manager: CloudManager
    private firstLoad = false

    constructor(readonly bus: JDBus, readonly state: ExtensionState) {
        this.handleChange = this.handleChange.bind(this)
        const { context } = this.state
        const { subscriptions } = context

        // track config changes
        vscode.workspace.onDidChangeConfiguration(
            () => {
                if (this._manager?.apiRoot !== this.apiRoot)
                    this.handleRefreshConnection()
            },
            undefined,
            subscriptions
        )

        // track secret changes
        state.context.secrets.onDidChange(
            async () => {
                const token = await this.token
                if (this._manager?.token !== token)
                    this.handleRefreshConnection()
            },
            undefined,
            subscriptions
        )

        // commands
        vscode.commands.registerCommand(
            "extension.devicescript.cloud.registerDevice",
            async () => {
                const manager = this._manager
                if (!manager) return

                const simId = this.state.simulatorScriptManagerId
                const devices = this.bus
                    .devices({
                        serviceClass: SRV_CLOUD_ADAPTER,
                    })
                    .filter(d => d.deviceId !== simId)
                const cloudDevices = manager.devices()
                const unregisteredDevices = devices.filter(
                    dev => !cloudDevices.find(cd => cd.deviceId === dev.id)
                )

                if (!unregisteredDevices.length) {
                    vscode.window.showInformationMessage(
                        "DeviceScript Cloud: no cloud adapter device found to register."
                    )
                    return
                }

                const res = await vscode.window.showQuickPick(
                    unregisteredDevices.map(
                        device =>
                            <vscode.QuickPickItem & { device: JDDevice }>{
                                device,
                                label: device.shortId,
                                description: device.deviceId,
                                detail: device.describe(),
                            }
                    ),
                    {
                        title: "Register a Device",
                        placeHolder: "Select a device",
                        matchOnDescription: true,
                        matchOnDetail: true,
                    }
                )
                if (res === undefined) return
                const device = res.device
                const name = await vscode.window.showInputBox({
                    title: "Enter a name for your device",
                    placeHolder: "my device",
                })

                if (!name) return

                await this.withProgress("Registering Device", async () => {
                    await manager.registerDevice(device, name)
                    this.refresh()
                })
            },
            subscriptions
        )
        vscode.commands.registerCommand(
            "extension.devicescript.cloud.refresh",
            async () => {
                const apiRoot = this.apiRoot
                const token = await this.token
                if (!apiRoot || !token) await this.configure()
                else await this._manager.refresh()
            },
            subscriptions
        )
        vscode.commands.registerCommand(
            "extension.devicescript.cloud.device.updateScript",
            async (device: CloudDevice) => {
                const current = this._manager?.script(device.scriptId)
                const scripts = this._manager.scripts()

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
                    )
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
                    )
                )
                if (v === undefined) return

                await this.withProgress("Updating Script", async () => {
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
                const version = script.version
                const body = await script.refreshBody()
                if (!body) return
                const text = body.text
                await createFile(`./cloud/${name}.ts`, text)
            },
            subscriptions
        )

        // first connection - async
        this.handleRefreshConnection()
    }

    get apiRoot(): string {
        return vscode.workspace
            .getConfiguration("devicescript.cloud")
            .get("apiRoot")
    }

    async setApiRoot(apiRoot: string) {
        await vscode.workspace
            .getConfiguration("devicescript.cloud")
            .update("apiRoot", apiRoot)
    }

    async configure() {
        let changed = false
        const apiRoot = this.apiRoot
        const newApiRoot = await vscode.window.showInputBox({
            placeHolder: "Enter Cloud Web API Root",
            value: apiRoot || "https://jacdac-portal2.azurewebsites.net",
        })
        if (newApiRoot !== undefined && newApiRoot !== apiRoot) {
            await this.setApiRoot(apiRoot)
            changed = true
        }
        const token = await vscode.window.showInputBox({
            placeHolder: "Enter Cloud Authentication Token",
            value: "",
        })
        if (token !== undefined) {
            await this.setToken(token)
            changed = true
        }
        if (changed) this.handleRefreshConnection()
    }

    get token() {
        return this.state.context.secrets.get("devicescript.cloud.token")
    }

    async setToken(token: string) {
        await this.state.context.secrets.store(
            "devicescript.cloud.token",
            token
        )
    }

    private async handleRefreshConnection() {
        const token = await this.token
        const apiRoot = this.apiRoot

        // unmount
        this._manager?.off(CHANGE, this.handleChange)

        // mount new manager
        if (token && apiRoot) {
            this._manager = new CloudManager(this.bus, apiRoot, token)
            this._manager.on(CHANGE, this.handleChange)
            this.firstLoad = true
        } else {
            this._manager = undefined
        }

        // refresh tree
        this.refresh()
    }

    private handleChange() {
        console.debug(`cloud: manager change`)
        this.refresh()
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
                const script = this._manager?.script(d.scriptId)
                const spec =
                    this.bus.deviceCatalog.specificationFromProductIdentifier(
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
            if (!this._manager) return undefined
            const items = [
                new CloudCollection(
                    this._manager,
                    CLOUD_SCRIPTS_NODE,
                    "scripts",
                    _ => _.scripts()
                ),
                new CloudCollection(
                    this._manager,
                    CLOUD_DEVICES_NODE,
                    "devices",
                    _ => _.devices()
                ),
            ]
            if (this.firstLoad) {
                this.firstLoad = false
                this._manager
                    .refreshScripts()
                    .then(() => this.refresh(items[0]))
                this._manager
                    .refreshDevices()
                    .then(() => this.refresh(items[1]))
            }
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

    private withProgress(title: string, transaction: () => Promise<void>) {
        return vscode.window.withProgress(
            {
                title,
                location: vscode.ProgressLocation.SourceControl,
            },
            async () => {
                try {
                    await transaction()
                } catch (e) {
                    console.error(e)
                    vscode.window.showErrorMessage(
                        "DeviceScript Cloud: Updated failed."
                    )
                    // async
                    this._manager?.refresh()
                }
            }
        )
    }
}
