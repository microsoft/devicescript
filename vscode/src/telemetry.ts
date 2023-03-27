import * as vscode from "vscode"
import TelemetryReporter from "@vscode/extension-telemetry"
import { isAckError, isCancelError, isTimeoutError } from "jacdac-ts"
import { MESSAGE_PREFIX } from "./constants"

// the application insights key (also known as instrumentation key)
const key = "06283122-cd76-493c-9641-fbceeeefd9c6"

export interface AppTelemetry {
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

export let telemetry: AppTelemetry

export function activateTelemetry(context: vscode.ExtensionContext): void {
    const reporter = new TelemetryReporter(key)
    context.subscriptions.push(reporter)

    telemetry = {
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

/**
 * Reports the error as an event and shows the message. The message is NOT passed to telemetry.
 * @param eventName
 * @param message
 * @param items
 * @returns
 */
export function showErrorMessage(
    eventName: string,
    message: string,
    ...items: string[]
): Thenable<string> {
    if (message.indexOf("-") < 0) message = MESSAGE_PREFIX + message
    return telemetry
        ? telemetry.showErrorMessage("error." + eventName, message, ...items)
        : vscode.window.showErrorMessage(message, ...items)
}

export function showError(error: Error) {
    if (!error || isCancelError(error)) return

    console.error(error)
    telemetry?.reportException(error)

    const messagePrefix = MESSAGE_PREFIX
    if (isTimeoutError(error))
        vscode.window.showErrorMessage(
            messagePrefix + "the operation timed out."
        )
    else if (isAckError(error))
        vscode.window.showErrorMessage(
            messagePrefix + "the device did not respond to this command."
        )
    else vscode.window.showErrorMessage(messagePrefix + error?.message)
}
