import {
    InitializedEvent,
    logger,
    LoggingDebugSession,
    OutputEvent,
    StoppedEvent,
    TerminatedEvent,
} from "@vscode/debugadapter"
import { LogLevel } from "@vscode/debugadapter/lib/logger"
import { DebugProtocol } from "@vscode/debugprotocol"
import { DevsDbgClient, EV_SUSPENDED } from "./devsdbgclient"
import { DebugInfo } from "@devicescript/compiler"
import { DevsDbgSuspensionType } from "../../runtime/jacdac-c/jacdac/dist/specconstants"

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
    private clearSusp: () => void

    constructor(public client: DevsDbgClient, public dbginfo: DebugInfo) {
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

    dispose() {
        super.dispose()
        const f = this.clearSusp
        if (f) {
            this.clearSusp = null
            f()
        }
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
        args: DebugProtocol.LaunchRequestArguments
    ): void {
        this.asyncReq(response, () => this.startDebugger(response, args, true))
    }

    protected override attachRequest(
        response: DebugProtocol.AttachResponse,
        args: DebugProtocol.AttachRequestArguments
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

        if (!this.clearSusp)
            this.clearSusp = this.client.subscribe(EV_SUSPENDED, () => {
                const type = this.client.suspensionReason
                switch (type) {
                    case DevsDbgSuspensionType.Panic:
                        this.sendEvent(new TerminatedEvent())
                        break

                    case DevsDbgSuspensionType.Breakpoint:
                    case DevsDbgSuspensionType.UnhandledException:
                    case DevsDbgSuspensionType.HandledException:
                    case DevsDbgSuspensionType.DebuggerStmt:
                    case DevsDbgSuspensionType.Halt:
                    case DevsDbgSuspensionType.Restart:
                    default:
                        this.sendEvent(
                            new StoppedEvent(
                                DevsDbgSuspensionType[type] || "stop_" + type,
                                this.client.suspendedFiber
                            )
                        )
                        break
                }
            })

        this.sendEvent(new OutputEvent("Welcome to DsDap!", "console"))
        if (isLaunch) await this.client.restartAndHalt()
        else await this.client.halt()
        await this.client.waitSuspended()
        this.sendEvent(new InitializedEvent())
    }

    protected override threadsRequest(
        response: DebugProtocol.ThreadsResponse
    ): void {}

    protected override stackTraceRequest(
        response: DebugProtocol.StackTraceResponse,
        args: DebugProtocol.StackTraceArguments
    ): void {}

    protected override scopesRequest(
        response: DebugProtocol.ScopesResponse,
        args: DebugProtocol.ScopesArguments
    ): void {}

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
