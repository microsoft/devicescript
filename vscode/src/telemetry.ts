import * as vscode from "vscode"
import TelemetryReporter from "@vscode/extension-telemetry"

// the application insights key (also known as instrumentation key)
const key = "06283122-cd76-493c-9641-fbceeeefd9c6"

export interface Telemetry {
    reportException: (error: Error, properties?: Record<string, string>) => void
    registerCommand: (
        command: string,
        callback: (...args: any[]) => any | Thenable<any>,
        thisArg?: any
    ) => void
}

function instrumentCommand(
    reporter: TelemetryReporter,
    command: string,
    callback: (...args: any[]) => any | Thenable<any>,
    thisArg?: any
): (...args: any[]) => any {
    return async (...args: any[]) => {
        reporter.sendTelemetryEvent(command, {
            type: "command",
        })
        try {
            return await callback.apply(thisArg, args)
        } catch (error) {
            reporter.sendTelemetryException(error, {
                type: "command",
                command,
            })
            vscode.window.showErrorMessage(
                `DeviceScript: ${(error as Error).message || error}`
            )
            return undefined
        }
    }
}

export function activeTelemetry(context: vscode.ExtensionContext): Telemetry {
    const reporter = new TelemetryReporter(key)
    context.subscriptions.push(reporter)

    return {
        reportException: (error, properties) => {
            reporter.sendTelemetryException(error, properties)
        },
        registerCommand: (command, callback, thisArg) => {
            context.subscriptions.push(
                vscode.commands.registerCommand(
                    command,
                    instrumentCommand(reporter, command, callback),
                    undefined
                )
            )
        },
    }
}
