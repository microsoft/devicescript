import {
    DebugSession,
    InitializedEvent,
    OutputEvent,
    StoppedEvent,
    TerminatedEvent,
} from "@vscode/debugadapter"
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
    DebugInfo,
    DebugVarType,
    Image,
    SrcFile,
    SrcMapEntry,
    DevsDbgFunIdx,
    DevsDbgReg,
    DevsDbgStepFlags,
    DevsDbgSuspensionType,
    DevsDbgValueSpecial,
    DevsDbgValueTag,
} from "@devicescript/compiler"
import {
    assert,
    delay,
    DISCONNECT,
    fromUTF8,
    JDBus,
    JDService,
    SRV_DEVS_DBG,
    toHex,
    uint8ArrayToString,
} from "jacdac-ts"

export { DevsDbgClient } from "./devsdbgclient"

let trace = true
function exnToString(err: unknown) {
    if (err instanceof Error)
        return trace ? err.stack || err.message : err.message
    return err + ""
}

export interface StartArgs {
    deviceId?: string
    serviceInstance?: number
    stopOnEntry?: boolean
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

export class DsDapSession extends DebugSession {
    private brkBySrc: number[][] = []
    public client: DevsDbgClient
    img: Image
    private resumeOnSuspend = false

    constructor(
        public bus: JDBus,
        dbg: string | Uint8Array | DebugInfo,
        private resolvePath = (s: SrcFile) => s.path
    ) {
        super()

        this.img = new Image(dbg)

        this.setDebuggerLinesStartAt1(true)
        this.setDebuggerColumnsStartAt1(true)

        this.on("error", (event: DebugProtocol.Event) => {
            this.sendLog("proto-error", event.body)
        })
    }

    dispose() {
        super.dispose()
        this.client?.unmount()
        this.client = null
    }

    async finish() {
        if (!this.client) return
        try {
            await this.client?.disable()
        } catch {}
    }

    private async createClient(cfg: StartArgs, timeout = 2000) {
        const did = cfg?.deviceId
        const t0 = Date.now()
        while (Date.now() - t0 < timeout) {
            let s: JDService
            if (did) {
                const dev = this.bus.device(did, true)
                s = dev?.services({
                    serviceClass: SRV_DEVS_DBG,
                })[cfg.serviceInstance ?? 0]
            } else {
                s = this.bus.services({
                    serviceClass: SRV_DEVS_DBG,
                })[0]
            }
            if (s) return new DevsDbgClient(s, this.img)
            await delay(100)
        }
        throw new Error(`no debugger on the bus; timeout=${timeout}ms`)
    }

    private async startClient(cfg: StartArgs) {
        assert(!this.client)
        this.client = await this.createClient(cfg)
        this.client.mount(
            this.client.subscribe(
                EV_SUSPENDED,
                this.handleSuspendedEvent.bind(this)
            )
        )
    }

    protected override initializeRequest(
        response: DebugProtocol.InitializeResponse,
        args: DebugProtocol.InitializeRequestArguments
    ): void {
        response.body.exceptionBreakpointFilters = [
            {
                filter: "unhandled",
                label: "Uncaught Exceptions",
                description:
                    "Break on errors not handled with try{...}catch{...}",
                default: true,
            },
            {
                filter: "handled",
                label: "Caught Exceptions",
                description:
                    "Break on all errors, regardless if handled with try{...}catch{...}",
                default: false,
            },
        ]

        // these we might potentially support
        response.body.supportsStepInTargetsRequest = false
        response.body.supportsCompletionsRequest = false
        response.body.supportsRestartRequest = false
        response.body.supportsExceptionOptions = false
        response.body.supportTerminateDebuggee = false
        response.body.supportsDelayedStackTraceLoading = false
        response.body.supportsLogPoints = false
        response.body.supportsTerminateThreadsRequest = false
        response.body.supportsTerminateRequest = false
        response.body.supportsDisassembleRequest = false
        response.body.supportsBreakpointLocationsRequest = false
        response.body.supportsInstructionBreakpoints = false

        response.body.supportsConfigurationDoneRequest = true
        response.body.supportsSteppingGranularity = true
        response.body.supportsLoadedSourcesRequest = true
        response.body.supportsExceptionInfoRequest = true
        this.sendResponse(response)
    }

    protected override launchRequest(
        response: DebugProtocol.LaunchResponse,
        args: DebugProtocol.LaunchRequestArguments
    ): void {
        this.asyncReq(response, () =>
            this.startDebugger(response, args as any, true)
        )
    }

    protected override attachRequest(
        response: DebugProtocol.AttachResponse,
        args: DebugProtocol.AttachRequestArguments
    ): void {
        this.asyncReq(response, () =>
            this.startDebugger(response, args as any, false)
        )
    }

    private mapSuspensionReason(type: DevsDbgSuspensionType) {
        switch (type) {
            case DevsDbgSuspensionType.Panic:
                return "terminated"
            case DevsDbgSuspensionType.UnhandledException:
            case DevsDbgSuspensionType.HandledException:
                return "exception"
            case DevsDbgSuspensionType.Halt:
                return "pause"
            case DevsDbgSuspensionType.Restart:
                return "entry"
            case DevsDbgSuspensionType.Step:
                return "step"
            case DevsDbgSuspensionType.DebuggerStmt:
            case DevsDbgSuspensionType.Breakpoint:
                return "breakpoint"
            default:
                return (
                    DevsDbgSuspensionType[type]?.toLowerCase() || "stop_" + type
                )
        }
    }

    private handleSuspendedEvent() {
        if (this.resumeOnSuspend) return
        const type = this.client.suspensionReason
        switch (type) {
            case DevsDbgSuspensionType.Panic:
                this.sendEvent(new TerminatedEvent())
                break

            default:
                this.sendEvent<DebugProtocol.StoppedEvent>({
                    type: "event",
                    seq: 0,
                    event: "stopped",
                    body: {
                        reason: this.mapSuspensionReason(type),
                        preserveFocusHint: false,
                        threadId: this.client.suspendedFiber,
                        allThreadsStopped: true,
                    },
                })
                break
        }
    }

    private async startDebugger(
        response: DebugProtocol.Response,
        args: StartArgs,
        isLaunch: boolean
    ) {
        if (args.stopOnEntry === false) this.resumeOnSuspend = true
        else this.resumeOnSuspend = false

        await this.startClient(args)

        this.client.service.device.on(DISCONNECT, () => {
            this.stop()
        })

        if (isLaunch) await this.client.restartAndHalt()
        else await this.client.halt()
        await this.client.waitSuspended()
        await this.client.clearAllBreakpoints()
        this.sendEvent(new InitializedEvent())
    }

    protected override configurationDoneRequest(
        response: DebugProtocol.ConfigurationDoneResponse,
        args: DebugProtocol.ConfigurationDoneArguments,
        request?: DebugProtocol.Request
    ): void {
        this.asyncReq(response, async () => {
            if (this.resumeOnSuspend) {
                this.resumeOnSuspend = false
                await this.client.resume()
            }
        })
    }

    protected override threadsRequest(
        response: DebugProtocol.ThreadsResponse
    ): void {
        this.asyncReq(response, async () => {
            const fibs = await this.client.readFibers()
            response.body = {
                threads:
                    fibs.length == 0
                        ? [
                              {
                                  id: 1, // if no threads are returned, the "Pause" button will do nothing
                                  name: "fake-thread", // so we add a fake thread
                              },
                          ]
                        : fibs.map(f => ({
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
                        ...this.pcToLocation(v.stackFrame.userPc),
                    })
                ),
                totalFrames: frames.length,
            }
        })
    }

    protected override sourceRequest(
        response: DebugProtocol.SourceResponse,
        args: DebugProtocol.SourceArguments
    ): void {
        this.asyncReq(response, async () => {
            const s = this.findSource(
                args.source ?? { sourceReference: args.sourceReference }
            )
            const sf = this.img.dbg.sources[s]
            if (sf) {
                response.body = {
                    content: sf.text,
                }
            }
        })
    }

    private getFunctionByIdx(idx: DevsDbgFunIdx) {
        if (idx == DevsDbgFunIdx.Main) idx = 0
        return this.img.functions[idx]
    }

    protected override scopesRequest(
        response: DebugProtocol.ScopesResponse,
        args: DebugProtocol.ScopesArguments
    ): void {
        this.asyncReq(response, async () => {
            response.body = {
                scopes: [],
            }
            const fr = this.client.getValueByIndex(args.frameId)
            if (!fr?.stackFrame) {
                this.warn(`no stackframe on ${args.frameId}?`)
                return
            }

            const fn = this.getFunctionByIdx(fr.stackFrame.fnIdx)

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
                    const fn = this.getFunctionByIdx(v.arg.stackFrame.fnIdx)
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
            response.body = { breakpoints: [] }
            const srcIdx = this.findSource(args.source)
            const srcmap = this.img.srcmap
            const map = srcmap.srcMapForPos(srcmap.filePos(srcIdx))
            if (map.length == 0) return

            const breakpoints = args.breakpoints.map(b => ({
                ...b,
                pos: srcmap.locationToPos(srcIdx, b.line, b.column ?? 1),
            }))

            const brkEntry: SrcMapEntry[] = []

            // exact matching
            for (const e of map) {
                const r = srcmap.resolvePos(e.pos)
                for (let i = 0; i < breakpoints.length; ++i) {
                    const brk = breakpoints[i]
                    const col = brk.column ?? 1
                    if (brk.line == r.line) {
                        if (
                            !brkEntry[i] ||
                            (col > 1 &&
                                e.pos <= brk.pos &&
                                brk.pos < e.end &&
                                brkEntry[i].pos < e.pos)
                        )
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

    protected override continueRequest(
        response: DebugProtocol.ContinueResponse,
        args: DebugProtocol.ContinueArguments
    ): void {
        this.asyncReq(response, async () => {
            await this.client.resume()
        })
    }

    protected override pauseRequest(
        response: DebugProtocol.PauseResponse,
        args: DebugProtocol.PauseArguments
    ): void {
        this.asyncReq(response, async () => {
            await this.client.halt()
        })
    }

    protected override nextRequest(
        response: DebugProtocol.NextResponse,
        args: DebugProtocol.NextArguments
    ): void {
        this.stepRequest(response, args, 0)
    }

    protected override stepOutRequest(
        response: DebugProtocol.StepOutResponse,
        args: DebugProtocol.StepOutArguments
    ): void {
        this.stepRequest(response, args, DevsDbgStepFlags.StepOut)
    }

    protected override stepInRequest(
        response: DebugProtocol.StepInResponse,
        args: DebugProtocol.StepInArguments
    ): void {
        this.stepRequest(response, args, DevsDbgStepFlags.StepIn)
    }

    private stepRequest(
        response: DebugProtocol.Response,
        args: DebugProtocol.StepInArguments,
        flags: DevsDbgStepFlags
    ) {
        this.asyncReq(response, async () => {
            const stack = await this.client.readStacktrace(args.threadId)
            const frame = stack[0]?.stackFrame
            if (!frame) throw new Error("bad stack frame")
            let brks: number[] = []

            if (!(flags & DevsDbgStepFlags.StepOut)) {
                const fn = this.getFunctionByIdx(frame.fnIdx)
                const currStmt = fn.stmtByGlobalPc(frame.pc)
                const srcmap = this.img.srcmap
                const p0 = srcmap.resolvePos(currStmt.srcPos)

                // console.log("P0", srcmap.posToString(currStmt.srcPos))

                const exits = fn.findZoneExits(currStmt, other => {
                    // console.log(currStmt.pc, other.pc, args.granularity, currStmt.srcPos, other.srcPos)
                    // console.log(srcmap.posToString(other.srcPos))
                    switch (args.granularity) {
                        case "line":
                            const p1 = srcmap.resolvePos(other.srcPos)
                            return p0.src === p1.src && p0.line === p1.line
                        case "instruction":
                            return currStmt === other
                        case "statement":
                        default:
                            return (
                                currStmt.srcPos == other.srcPos &&
                                currStmt.srcLen == other.srcLen
                            )
                    }
                })
                brks = exits.map(e => e.pc + fn.imgOffset)
            }

            await this.client.step(
                stack[0],
                flags | DevsDbgStepFlags.StepOut,
                brks
            )
        })
    }

    protected override setExceptionBreakPointsRequest(
        response: DebugProtocol.SetExceptionBreakpointsResponse,
        args: DebugProtocol.SetExceptionBreakpointsArguments
    ): void {
        this.asyncReq(response, async () => {
            await this.client.setBoolReg(
                DevsDbgReg.BreakAtHandledExn,
                args.filters.includes("handled")
            )
            await this.client.setBoolReg(
                DevsDbgReg.BreakAtUnhandledExn,
                args.filters.includes("handled") ||
                    args.filters.includes("unhandled")
            )
        })
    }

    protected override exceptionInfoRequest(
        response: DebugProtocol.ExceptionInfoResponse,
        args: DebugProtocol.ExceptionInfoArguments
    ): void {
        this.asyncReq(response, async () => {
            const exn = this.client.exnValue()
            const msg = await exn.readField("message")
            const msgStr = await msg?.readString()
            response.body = {
                breakMode:
                    this.client.suspensionReason ==
                    DevsDbgSuspensionType.HandledException
                        ? "always"
                        : "unhandled",
                exceptionId: "Error", // TODO
                description: msgStr ?? "",
            }
        })
    }

    private async asyncReq(
        response: DebugProtocol.Response,
        fn: () => Promise<void>
    ) {
        try {
            await fn()
        } catch (err) {
            response.success = false
            response.message = exnToString(err)
            this.warn(response.message)
        }
        this.sendResponse(response)
    }

    private mapSrcFile(sf: SrcFile): DebugProtocol.Source {
        const path = this.resolvePath(sf)
        if (path)
            return {
                path,
                name: sf.path,
            }
        else
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

        if (v.isPrimitive) res.variablesReference = 0

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
        if (v.isString)
            return (
                JSON.stringify(await v.readString()) +
                (v.isPartial ? "..." : "")
            )

        if (v.isBuffer)
            return (
                "hex`" +
                toHex(await v.readBuffer()) +
                (v.isPartial ? " ..." : "") +
                "`"
            )

        switch (v.tag) {
            case DevsDbgValueTag.Number:
                return v.v0 + ""

            case DevsDbgValueTag.Special:
                switch (v.v0) {
                    case DevsDbgValueSpecial.Null:
                        return "null"
                    case DevsDbgValueSpecial.Undefined:
                        return "undefined"
                    case DevsDbgValueSpecial.False:
                        return "false"
                    case DevsDbgValueSpecial.True:
                        return "true"
                    case DevsDbgValueSpecial.Globals:
                        return "(globals)"
                    case DevsDbgValueSpecial.CurrentException:
                        return "(exception)"
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
                    ? `{…}`
                    : `{…${v.numNamed}…}`

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
        function normPath(p: string) {
            return p.replace(/\\/g, "/").toLowerCase()
        }
        if (src.sourceReference) return src.sourceReference - 1
        const srcIdx = this.img.dbg.sources.findIndex(
            s =>
                normPath(s.path) == normPath(src.path) ||
                normPath(this.resolvePath(s)) == normPath(src.path)
        )
        return srcIdx
    }

    //
    // Logging
    //

    public sendLog(msg: string, data?: any, cat = "console") {
        if (data !== undefined) msg += " " + JSON.stringify(data)
        msg += "\n"
        this.sendEvent(new DsLogOutputEvent(msg, data))
    }

    public warn(msg: string, data?: any) {
        this.sendLog(msg, data, "warn")
    }

    public sendEvent<T extends DebugProtocol.Event>(event: T): void {
        if (!(event instanceof DsLogOutputEvent)) {
            // Don't create an infinite loop...

            let objectToLog = event
            if (
                event instanceof OutputEvent &&
                event.body &&
                event.body.data &&
                event.body.data.doNotLogOutput
            ) {
                delete event.body.data.doNotLogOutput
                objectToLog = { ...event }
                objectToLog.body = {
                    ...event.body,
                    output: "<output not logged>",
                }
            }

            this.sendLog(`SRV: EV ${event.event}`, objectToLog.body)
        }

        super.sendEvent(event)
    }

    // this is not really used
    public sendRequest(
        command: string,
        args: any,
        timeout: number,
        cb: (response: DebugProtocol.Response) => void
    ): void {
        this.sendLog(`SRV: ${command}`, args)
        super.sendRequest(command, args, timeout, cb)
    }

    public sendResponse(response: DebugProtocol.Response): void {
        this.sendLog(
            `SRV: ${response.success ? "" : "ERR "}${response.command}`,
            response.body
        )
        super.sendResponse(response)
    }

    protected dispatchRequest(request: DebugProtocol.Request): void {
        this.sendLog(`VSCode: ${request.command}`, request.arguments)
        super.dispatchRequest(request)
    }
}

class DsLogOutputEvent extends OutputEvent {
    constructor(msg: string, data: any, cat = "console") {
        super(msg, cat, data)
    }
}
