import * as vscode from "vscode"
import { JDEventSource } from "jacdac-ts"
import { ExtensionContext } from "vscode"
import { DeviceScriptExtensionState } from "./state"
import { logo } from "./assets"

class SimulatorsSerializer implements vscode.WebviewPanelSerializer {
    constructor(readonly deserialize: (view: vscode.WebviewPanel) => void) {}
    async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
    ) {
        this.deserialize(webviewPanel)
    }
}

function getNonce() {
    let text = ""
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

export class SimulatorsWebView extends JDEventSource {
    // devtool web panel
    private simulatorsWebviewPanel: vscode.WebviewPanel

    private async generateSimulatorsHtml() {
        const { kind: colorThemeKind } = vscode.window.activeColorTheme
        const darkMode =
            colorThemeKind === vscode.ColorThemeKind.Dark ||
            colorThemeKind === vscode.ColorThemeKind.HighContrast
                ? "dark"
                : "light"
        const fullWebServerUri = await vscode.env.asExternalUri(
            vscode.Uri.parse(`http://localhost:8081/`)
        )
        const cspSource = this.simulatorsWebviewPanel.webview.cspSource
        const nonce = getNonce()

        return `
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; frame-src ${fullWebServerUri} ${cspSource} https:; img-src ${fullWebServerUri} ${cspSource} https:; script-src ${fullWebServerUri} ${cspSource} 'nonce-${nonce}'; style-src ${fullWebServerUri} ${cspSource} 'nonce-${nonce}';"
        />
        <style nonce="${nonce}">
        body {
            margin: 0;
            padding: 0; 
            background-color: transparent;  
        }
        iframe {
            position: absolute;
            left: 0; right: 0;
            width: 100%; height: 100%;
            border: none;
        }
        </style>
        </head>
        <body>
        <iframe src="${fullWebServerUri}?${darkMode}=1" />
        </body>
        </html>                
                        `
    }

    private async updateDeveloperToolsPanelUrl() {
        const panel = this.simulatorsWebviewPanel
        if (!panel) return
        panel.webview.html = await this.generateSimulatorsHtml()
    }

    constructor(readonly extensionState: DeviceScriptExtensionState) {
        super()
        const { context } = this.extensionState
        const { subscriptions } = context

        // open ui command
        subscriptions.push(
            vscode.commands.registerCommand(
                "extension.devicescript.openSimulators",
                this.handleOpen,
                this
            )
        )

        // reloaded from previous run
        subscriptions.push(
            vscode.window.registerWebviewPanelSerializer(
                "extension.devicescript.simulators",
                new SimulatorsSerializer(async view =>
                    this.handleDeserialize(view)
                )
            )
        )

        // track color theme
        vscode.window.onDidChangeActiveColorTheme(
            this.updateDeveloperToolsPanelUrl,
            this,
            subscriptions
        )
    }

    private async handleDeserialize(view: vscode.WebviewPanel) {
        if (!this.simulatorsWebviewPanel) {
            await this.extensionState.devtools.spawn()
            this.simulatorsWebviewPanel = view
        }
        await this.updateDeveloperToolsPanelUrl()
    }

    private async handleOpen() {
        if (this.simulatorsWebviewPanel) {
            this.simulatorsWebviewPanel.reveal(vscode.ViewColumn.Nine)
            return
        }

        console.log("Opening Developer Tools...")
        await this.extensionState.devtools.spawn()
        // http://localhost:8081/
        this.simulatorsWebviewPanel = vscode.window.createWebviewPanel(
            "extension.devicescript.simulators",
            "DeviceScript Simulators",
            vscode.ViewColumn.Nine,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        )
        this.simulatorsWebviewPanel.iconPath = logo(this.extensionState.context)
        this.simulatorsWebviewPanel.onDidDispose(
            () => {
                this.simulatorsWebviewPanel = undefined
            },
            undefined,
            this.extensionState.context.subscriptions
        )
        await this.updateDeveloperToolsPanelUrl()
    }
}
