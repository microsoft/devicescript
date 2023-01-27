import * as vscode from "vscode"
import TelemetryReporter from "@vscode/extension-telemetry"

// the application insights key (also known as instrumentation key)
const key = "06283122-cd76-493c-9641-fbceeeefd9c6"

// telemetry reporter
export let reporter: TelemetryReporter

export function activateAnalytics(context: vscode.ExtensionContext) {
    // create telemetry reporter on extension activation
    reporter = new TelemetryReporter(key)
    // ensure it gets properly disposed. Upon disposal the events will be flushed
    context.subscriptions.push(reporter)
}

