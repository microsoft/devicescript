import * as vscode from "vscode"
import TelemetryReporter from "@vscode/extension-telemetry"

// the application insights key (also known as instrumentation key)
const key = "06283122-cd76-493c-9641-fbceeeefd9c6"

export interface Telemetry {
    reportException: (error: Error, properties?: Record<string, string>) => void
    registerCommand: (
        command: string,
        callback: (...args: any[]) => any | Thenable<any>
    ) => void
}
export function activeTelemetry(context: vscode.ExtensionContext): Telemetry {
    const reporter = new TelemetryReporter(key)
    context.subscriptions.push(reporter)

    return {
        reportException: (error, properties) => {
            reporter.sendTelemetryException(error, properties)
        },
        registerCommand: (command, callback) => {
            context.subscriptions.push(
                vscode.commands.registerCommand(command, async args => {
                    reporter.sendTelemetryEvent(command, { type: "command" })
                    try {
                        await callback(...args)
                    } catch (error) {
                        reporter.sendTelemetryException(error, {
                            type: "command",
                            command,
                        })
                    }
                })
            )
        },
    }
}
