import {
    InitializedEvent,
    logger,
    LoggingDebugSession,
    OutputEvent,
} from "@vscode/debugadapter"
import { LogLevel } from "@vscode/debugadapter/lib/logger"
import { DebugProtocol } from "@vscode/debugprotocol"

let trace = true
function exnToString(err: unknown) {
    if (err instanceof Error)
        return trace ? err.stack || err.message : err.message
    return err + ""
}

export interface StartArgs
    extends DebugProtocol.AttachRequestArguments,
        DebugProtocol.LaunchRequestArguments {
    // ...
}

export class DsDapSession extends LoggingDebugSession {
    constructor() {
        super()
        this.setDebuggerLinesStartAt1(true)
        this.setDebuggerColumnsStartAt1(true)

        process
            .on("unhandledRejection", (reason, promise) => {
                logger.error("Unhandled Rejection: " + exnToString(reason))
                process.exit(1)
            })
            .on("uncaughtException", err => {
                logger.error("Uncaught Exception: " + exnToString(err))
                process.exit(1)
            })
    }

    protected override initializeRequest(
        response: DebugProtocol.InitializeResponse,
        args: DebugProtocol.InitializeRequestArguments
    ): void {
        // these we might potentially support
        response.body.supportsStepInTargetsRequest = false
        response.body.supportsGotoTargetsRequest = false
        response.body.supportsCompletionsRequest = false
        response.body.supportsRestartRequest = false
        response.body.supportsExceptionOptions = false
        response.body.supportsExceptionInfoRequest = false
        response.body.supportTerminateDebuggee = false
        response.body.supportsDelayedStackTraceLoading = false
        response.body.supportsLoadedSourcesRequest = false
        response.body.supportsLogPoints = false
        response.body.supportsTerminateThreadsRequest = false
        response.body.supportsTerminateRequest = false
        response.body.supportsDisassembleRequest = false
        response.body.supportsBreakpointLocationsRequest = false
        response.body.supportsSteppingGranularity = false
        response.body.supportsInstructionBreakpoints = false
        this.sendResponse(response)
    }

    protected override launchRequest(
        response: DebugProtocol.LaunchResponse,
        args: DebugProtocol.LaunchRequestArguments,
        request?: DebugProtocol.Request
    ): void {
        this.asyncReq(response, () => this.startDebugger(response, args, true))
    }

    protected override attachRequest(
        response: DebugProtocol.AttachResponse,
        args: DebugProtocol.AttachRequestArguments,
        request?: DebugProtocol.Request
    ): void {
        this.asyncReq(response, () => this.startDebugger(response, args, false))
    }

    private async startDebugger(
        response: DebugProtocol.Response,
        args: StartArgs,
        isLaunch: boolean
    ) {
        logger.init(e => this.sendEvent(e))
        logger.setup(LogLevel.Verbose)

        this.sendEvent(new OutputEvent("Welcome to DsDap!", "console"))
        this.sendEvent(new InitializedEvent())
    }

    private async asyncReq(
        response: DebugProtocol.Response,
        fn: () => Promise<void>
    ) {
        try {
            fn()
        } catch (err) {
            response.success = false
            response.message = exnToString(err)
        }
        this.sendResponse(response)
    }
}
