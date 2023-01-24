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
import {
    DevsDbgClient,
    DevsKeyValue,
    DevsValue,
    EV_SUSPENDED,
} from "./devsdbgclient"
import {
    BinFmt,
    BUILTIN_OBJECT__VAL,
    BUILTIN_STRING__VAL,
    DebugInfo,
    DebugVarType,
    Image,
    SrcFile,
    SrcMapEntry,
} from "@devicescript/compiler"
import {
    DevsDbgFunIdx,
    DevsDbgSuspensionType,
    DevsDbgValueSpecial,
    DevsDbgValueTag,
} from "../../runtime/jacdac-c/jacdac/dist/specconstants"
import { fromUTF8, toHex, uint8ArrayToString } from "jacdac-ts"

export { DevsDbgClient } from "./devsdbgclient"

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

const maxStrLen = 1024
const maxBytesFetch = 512

const varTypeStrToNum: Record<DebugVarType, number> = {
    loc: 1,
    glb: 2,
    arg: 3,
    tmp: 4,
}
const varTypeNumToStr: DebugVarType[] = []
for (const k0 of Object.keys(varTypeStrToNum)) {
    const k = k0 as DebugVarType
    varTypeNumToStr[varTypeStrToNum[k]] = k
}

export class DsDapSession extends LoggingDebugSession {
    private clearSusp: () => void
    private brkBySrc: number[][] = []

    img: Image

    constructor(
        public client: DevsDbgClient,
        dbg: string | Uint8Array | DebugInfo
    ) {
        super()

        this.img = new Image(dbg)

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
        response.body.supportsCompletionsRequest = false
        response.body.supportsRestartRequest = false
        response.body.supportsExceptionOptions = false
        response.body.supportsExceptionInfoRequest = false
        response.body.supportTerminateDebuggee = false
        response.body.supportsDelayedStackTraceLoading = false
        response.body.supportsLogPoints = false
        response.body.supportsTerminateThreadsRequest = false
        response.body.supportsTerminateRequest = false
        response.body.supportsDisassembleRequest = false
        response.body.supportsBreakpointLocationsRequest = false
        response.body.supportsSteppingGranularity = false
        response.body.supportsInstructionBreakpoints = false

        response.body.supportsLoadedSourcesRequest = true
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
        await this.client.clearAllBreakpoints()
        this.sendEvent(new InitializedEvent())
    }

    protected override threadsRequest(
        response: DebugProtocol.ThreadsResponse
    ): void {
        this.asyncReq(response, async () => {
            const fibs = await this.client.readFibers()
            response.body = {
                threads: fibs.map(f => ({
                    id: f.fiberId,
                    name: `${this.functionName(
                        f.currFn
                    )} ... ${this.functionName(f.initialFn)}`,
                })),
            }
        })
    }

    protected override stackTraceRequest(
        response: DebugProtocol.StackTraceResponse,
        args: DebugProtocol.StackTraceArguments
    ): void {
        this.asyncReq(response, async () => {
            const frames = await this.client.readStacktrace(args.threadId)
            let rframes = frames
            // TODO cache 'frames' ?
            if (args.startFrame) rframes = rframes.slice(args.startFrame)
            if (args.levels) rframes = rframes.slice(0, args.levels)
            response.body = {
                stackFrames: rframes.map(
                    (v): DebugProtocol.StackFrame => ({
                        id: v.index,
                        name: this.functionName(v.stackFrame.fnIdx),
                        instructionPointerReference: v.stackFrame.pc + "",
                        presentationHint: "normal",
                        ...this.pcToLocation(v.stackFrame.pc),
                    })
                ),
                totalFrames: frames.length,
            }
        })
    }

    protected override scopesRequest(
        response: DebugProtocol.ScopesResponse,
        args: DebugProtocol.ScopesArguments
    ): void {
        this.asyncReq(response, async () => {
            response.body = {
                scopes: [],
            }
            const fr = this.client.getCachedValue(
                DevsDbgValueTag.ObjStackFrame,
                args.frameId
            )
            if (!fr.stackFrame) return // ???

            const fn = this.img.functions[fr.stackFrame.fnIdx]

            const mkScope = (
                tp: DebugVarType,
                presentationHint: "arguments" | "locals" | "registers",
                name: string
            ) => {
                const namedVariables = fn.dbg.slots.filter(
                    s => s.type == tp
                ).length
                if (namedVariables == 0) return
                const v = this.client.mkSynthValue(
                    DevsDbgValueTag.User1,
                    varTypeStrToNum[tp],
                    fr
                )
                response.body.scopes.push({
                    name,
                    variablesReference: v.index,
                    namedVariables,
                    presentationHint,
                    expensive: false,
                })
            }

            if (fn) {
                mkScope("arg", "arguments", "Arguments")
                mkScope("loc", "locals", "Local variables")
                mkScope("tmp", "registers", "Temporaries")
            }
        })
    }

    protected override variablesRequest(
        response: DebugProtocol.VariablesResponse,
        args: DebugProtocol.VariablesArguments
    ): void {
        this.asyncReq(response, async () => {
            const v = this.client.getValueByIndex(args.variablesReference)
            let lst: (DevsKeyValue | DevsValue)[] = []

            const wantNamed = !args.filter || args.filter == "named"
            const wantIndexed = !args.filter || args.filter == "indexed"

            if (v.tag == DevsDbgValueTag.User1) {
                if (wantNamed) {
                    const tp = varTypeNumToStr[v.v0]
                    const fn = this.img.functions[v.arg.stackFrame.fnIdx]
                    const vals = await v.arg.readIndexed()
                    for (let idx = 0; idx < fn.dbg.slots.length; ++idx) {
                        const s = fn.dbg.slots[idx]
                        if (s.type == tp && vals[idx]) {
                            lst.push({
                                key: s.name,
                                value: vals[idx],
                            })
                        }
                    }
                }
            } else {
                if (wantNamed) lst.push(...(await v.readNamed()))
                if (wantIndexed) lst.push(...(await v.readIndexed()))
            }

            response.body = {
                variables: [],
            }

            const start = args.start ?? 0
            const endp = args.count ? start + args.count : lst.length

            let idx = 0
            let arridx = 0
            for (const ent of lst) {
                if (start <= idx && idx < endp) {
                    if (ent instanceof DevsValue) {
                        const v = await this.toVariable(ent)
                        v.name = `[${arridx}]`
                        response.body.variables.push(v)
                    } else {
                        const v = await this.toVariable(ent.value)
                        if (typeof ent.key == "string") v.name = ent.key
                        else
                            v.name = this.unquote(
                                await this.valueToString(ent.key)
                            )
                        response.body.variables.push(v)
                    }
                }
                if (ent instanceof DevsValue) arridx++
                idx++
            }
        })
    }

    protected override setBreakPointsRequest(
        response: DebugProtocol.SetBreakpointsResponse,
        args: DebugProtocol.SetBreakpointsArguments
    ): void {
        this.asyncReq(response, async () => {
            response.body.breakpoints = []
            const srcIdx = this.findSource(args.source)
            const srcmap = this.img.srcmap
            const map = srcmap.srcMapForPos(srcmap.filePos(srcIdx))
            if (map.length == 0) return

            const brkPos = args.breakpoints.map(b =>
                srcmap.locationToPos(srcIdx, b.line, b.column ?? 1)
            )
            const brkEntry: SrcMapEntry[] = []

            // exact matching
            for (const e of map) {
                for (let i = 0; i < brkPos.length; ++i) {
                    const pos = brkPos[i]
                    if (e.pos <= pos && pos < e.end) {
                        if (!brkEntry[i] || brkEntry[i].pos < e.pos)
                            brkEntry[i] = e
                    }
                }
            }

            // whole-line matching as fallback
            for (const e of map) {
                const r = srcmap.resolvePos(e.pos)
                const pos0 = r.fileOff + r.lineOff
                for (let i = 0; i < brkPos.length; ++i) {
                    if (brkEntry[i]) continue
                    const pos = brkPos[i]
                    if (pos0 <= pos && pos <= e.end) {
                        brkEntry[i] = e
                    }
                }
            }

            const pcs = brkEntry.filter(e => !!e).map(e => e.pc)
            if (!this.brkBySrc[srcIdx]) this.brkBySrc[srcIdx] = []
            await this.client.clearBreakpoints(
                this.brkBySrc[srcIdx].filter(e => pcs.indexOf(e) < 0)
            )
            await this.client.setBreakpoints(
                pcs.filter(e => this.brkBySrc[srcIdx].indexOf(e) < 0)
            )
            this.brkBySrc[srcIdx] = pcs

            response.body.breakpoints = args.breakpoints.map(
                (b, idx): DebugProtocol.Breakpoint => {
                    const e = brkEntry[idx]
                    if (e) {
                        const l = this.pcToLocation(e.pc)
                        return {
                            verified: true,
                            line: l.line,
                            column: l.column,
                            endLine: l.endLine,
                            endColumn: l.endColumn,
                            instructionReference: "" + e.pc,
                        }
                    } else {
                        return {
                            verified: false,
                            message: "could not find break",
                            line: b.line,
                            column: b.column,
                        }
                    }
                }
            )
        })
    }

    protected override loadedSourcesRequest(
        response: DebugProtocol.LoadedSourcesResponse,
        args: DebugProtocol.LoadedSourcesArguments
    ): void {
        this.asyncReq(response, async () => {
            response.body = {
                sources: this.img.dbg.sources.map(s => this.mapSrcFile(s)),
            }
        })
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

    private mapSrcFile(sf: SrcFile): DebugProtocol.Source {
        return {
            sourceReference: sf.index + 1,
            path: sf.path,
            name: sf.path,
        }
    }

    private pcToLocation(pc: number): DebugProtocol.BreakpointLocation & {
        source: DebugProtocol.Source
    } & {
        column: number
    } {
        const srcmap = this.img.srcmap
        const [pos, len] = srcmap.resolvePc(pc)
        const start = srcmap.resolvePos(pos)
        const end = srcmap.resolvePos(pos + len)
        const sf = start.src
        return {
            line: start.line,
            column: start.col,
            endLine: end.line,
            endColumn: end.col,
            source: this.mapSrcFile(sf),
        }
    }

    private async toVariable(v: DevsValue) {
        const res: DebugProtocol.Variable = {
            name: "",
            value: await this.valueToString(v),
            variablesReference: v.index,
        }

        return res
    }

    private functionName(idx: number) {
        if (idx == DevsDbgFunIdx.None) return "null"
        if (idx == DevsDbgFunIdx.Main) idx = 0
        if (idx >= DevsDbgFunIdx.FirstBuiltIn) {
            const bidx = idx - DevsDbgFunIdx.FirstBuiltIn
            return `BuiltIn #${bidx}`
        }
        const f = this.img.functions[idx]
        if (f) return f.name
        return `#${idx}`
    }

    private unquote(s: string) {
        if (s[0] == '"' && s[s.length - 1] == '"')
            return s.slice(1, s.length - 1)
        return s
    }

    private async valueToString(v: DevsValue): Promise<string> {
        const str = await this.valueToStringCore(v)
        if (str === undefined || str === null) return v.genericText
        else return str
    }

    private async valueToStringCore(v: DevsValue): Promise<string> {
        switch (v.tag) {
            case DevsDbgValueTag.ImgBuffer:
                const buf = this.img.bufferTable[v.v0]
                if (buf) return `hex\`${buf}\``
                break
            case DevsDbgValueTag.ImgStringUTF8:
            case DevsDbgValueTag.ImgStringBuiltin:
            case DevsDbgValueTag.ImgStringAscii:
                return this.img.describeString(
                    v.tag - DevsDbgValueTag.ImgBuffer,
                    v.v0
                )
            case DevsDbgValueTag.Number:
                return v.v0 + ""

            case DevsDbgValueTag.Special:
                switch (v.v0) {
                    case DevsDbgValueSpecial.Null:
                        return "null"
                    case DevsDbgValueSpecial.False:
                        return "false"
                    case DevsDbgValueSpecial.True:
                        return "true"
                }
                break

            case DevsDbgValueTag.ImgFunction: {
                let r = `[Function ${this.functionName(v.v0)}]`
                if (v.arg) {
                    const pref =
                        v.arg.tag == DevsDbgValueTag.ImgFunction
                            ? v.arg.genericText
                            : await this.valueToString(v.arg)
                    return pref + "." + r
                } else {
                    return r
                }
            }

            case DevsDbgValueTag.ImgRole: {
                const r = this.img.roles[v.v0]
                if (r) return `[Role ${r.name}]`
                break
            }

            case DevsDbgValueTag.Fiber:
                return `[Fiber #${v.v0}]`

            case DevsDbgValueTag.BuiltinObject:
                return BUILTIN_OBJECT__VAL[v.v0]?.replace(/_/g, ".")

            case DevsDbgValueTag.ObjBuffer:
            case DevsDbgValueTag.ObjString:
                if (!v.cachedBytes)
                    v.cachedBytes = await this.client.readBytes(
                        v,
                        0,
                        maxBytesFetch
                    )
                let r =
                    v.tag == DevsDbgValueTag.ObjBuffer
                        ? toHex(v.cachedBytes)
                        : JSON.stringify(
                              fromUTF8(uint8ArrayToString(v.cachedBytes))
                          )
                if (v.cachedBytes.length == maxBytesFetch) r += "..."
                return r

            case DevsDbgValueTag.ImgRoleMember: {
                const mask = (1 << BinFmt.ROLE_BITS) - 1
                const r = this.img.roles[v.v0 & mask]
                if (r)
                    return `[RoleMember ${r.name} @${
                        v.v0 >>> BinFmt.ROLE_BITS
                    }]`
                break
            }

            case DevsDbgValueTag.ObjArray:
                return `[Array(${v.numIndexed ?? "?"})]`

            case DevsDbgValueTag.ObjMap:
                return v.numNamed === 0
                    ? `{}`
                    : v.numNamed === undefined
                    ? `{...}`
                    : `{...${v.numNamed}...}`

            case DevsDbgValueTag.ObjStackFrame:
            case DevsDbgValueTag.ObjPacket:
            case DevsDbgValueTag.ObjBoundFunction:
            case DevsDbgValueTag.ObjOpaque:
            case DevsDbgValueTag.ObjAny:
            case DevsDbgValueTag.Exotic:
            case DevsDbgValueTag.Unhandled:
            default:
                break
        }
    }

    private findSource(src: DebugProtocol.Source) {
        if (src.sourceReference) return src.sourceReference - 1
        const srcIdx = this.img.dbg.sources.findIndex(s => s.path == src.path)
        return srcIdx
    }
}
