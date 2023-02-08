import * as vscode from "vscode"
import TelemetryReporter from "@vscode/extension-telemetry"

// the application insights key (also known as instrumentation key)
const key = "06283122-cd76-493c-9641-fbceeeefd9c6"

export interface Telemetry {
    reportException: (error: Error, properties?: Record<string, string>) => void
    reportEvent: (
        eventName: string,
        properties?: Record<string, string>
    ) => void
    showErrorMessage: (
        eventName: string,
        message: string,
        ...items: string[]
    ) => Thenable<string>
}

export function activeTelemetry(context: vscode.ExtensionContext): Telemetry {
    const reporter = new TelemetryReporter(key)
    context.subscriptions.push(reporter)

    return {
        reportException: (error, properties) => {
            reporter.sendTelemetryException(error, properties)
        },
        reportEvent: (
            eventName: string,
            properties?: Record<string, string>
        ) => {
            reporter.sendTelemetryEvent(eventName, properties)
        },
        showErrorMessage: (
            eventName: string,
            message: string,
            ...items: string[]
        ) => {
            reporter.sendTelemetryErrorEvent(eventName)
            return vscode.window.showErrorMessage(message, ...items)
        },
    }
}
