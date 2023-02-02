import * as vscode from "vscode"
import TelemetryReporter from "@vscode/extension-telemetry"

// the application insights key (also known as instrumentation key)
const key = "06283122-cd76-493c-9641-fbceeeefd9c6"

// telemetry reporter
export let reporter: TelemetryReporter

export function activateAnalytics(context: vscode.ExtensionContext) {
    reporter = new TelemetryReporter(key)
    context.subscriptions.push(reporter)
    return reporter
}
