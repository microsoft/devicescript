// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../runtime/jacdac-c/jacdac/spectool/jdspec.d.ts" />

import * as ts from "typescript"
import { SyntaxKind as SK } from "typescript"

import {
    SystemReg,
    SRV_DEVICE_SCRIPT_CONDITION,
    CloudAdapterEvent,
    CloudAdapterCmd,
    CloudAdapterCommandStatus,
} from "../../runtime/jacdac-c/jacdac/dist/specconstants"

import {
    stringToUint8Array,
    toHex,
    toUTF8,
    write16,
    write32,
    strcmp,
    encodeU32LE,
    fromHex,
    bufferEq,
    range,
    uniqueMap,
    encodeU16LE,
} from "./jdutil"

import {
    BinFmt,
    ValueType,
    Host,
    OpCall,
    NumFmt,
    Op,
    SMap,
    ValueKind,
    DevsDiagnostic,
    BUILTIN_STRING__VAL,
    StrIdx,
    BUILTIN_OBJECT__VAL,
    BuiltInString,
    BuiltInObject,
    NumFmtSpecial,
    PacketSpecCode,
    PacketSpecFlag,
    FieldSpecFlag,
    ServiceSpecFlag,
} from "./format"
import {
    addUnique,
    assert,
    assertRange,
    camelize,
    oops,
    snakify,
    strlen,
    upperCamel,
} from "./util"
import {
    bufferFmt,
    DelayedCodeSection,
    literal,
    Label,
    nonEmittable,
    OpWriter,
    SectionWriter,
    TopOpWriter,
    Value,
    VariableKind,
    packVarIndex,
    CachedValue,
} from "./opwriter"
import { buildAST, formatDiagnostics, getProgramDiagnostics } from "./tsiface"
import { preludeFiles } from "./specgen"
import { jacdacDefaultSpecifications } from "./embedspecs"
import {
    CellDebugInfo,
    RoleDebugInfo,
    FunctionDebugInfo,
    DebugInfo,
    SrcLocation,
} from "./info"

export const JD_SERIAL_HEADER_SIZE = 16
export const JD_SERIAL_MAX_PAYLOAD_SIZE = 236

export const CMD_GET_REG = 0x1000
export const CMD_SET_REG = 0x2000

export const DEVS_FILE_PREFIX = "bytecode"
export const DEVS_ASSEMBLY_FILE = `${DEVS_FILE_PREFIX}.dasm`
export const DEVS_BYTECODE_FILE = `${DEVS_FILE_PREFIX}.devs`

export const DEVS_LIB_FILE = `${DEVS_FILE_PREFIX}-lib.json`
export const DEVS_BODY_FILE = `${DEVS_FILE_PREFIX}-body.json`
export const DEVS_DBG_FILE = `${DEVS_FILE_PREFIX}-dbg.json`
export const DEVS_SIZES_FILE = `${DEVS_FILE_PREFIX}-sizes.md`

const coreModule = "@devicescript/core"

const builtInObjByName: Record<string, BuiltInObject> = {
    "#ds.": BuiltInObject.DEVICESCRIPT,
    "#ArrayConstructor.prototype": BuiltInObject.ARRAY_PROTOTYPE,
}
BUILTIN_OBJECT__VAL.forEach((n, i) => {
    n = n.replace(/_prototype$/, ".prototype")
    if (n.indexOf("_") < 0 && i != BuiltInObject.DEVICESCRIPT)
        builtInObjByName["#" + n.replace(/^Ds/, "ds.")] = i
})

class Cell {
    _index: number

    constructor(
        public definition:
            | ts.VariableDeclaration
            | ts.FunctionDeclaration
            | ts.ParameterDeclaration
            | ts.BindingElement
            | ts.Identifier,
        public scope: VariableScope,
        public _name?: string
    ) {
        scope.add(this)
    }
    emit(wr: OpWriter): Value {
        oops("on value() on generic Cell")
    }
    canStore() {
        return false
    }
    getName() {
        if (!this._name) {
            if (ts.isIdentifier(this.definition))
                this._name = idName(this.definition)
            else this._name = idName(this.definition.name)
        }
        return this._name
    }
    debugInfo(): CellDebugInfo {
        return {
            name: this.getName(),
        }
    }
}

class Role extends Cell {
    dispatcher: {
        proc: Procedure
        top: Label
        init: DelayedCodeSection
        checkConnected: DelayedCodeSection
        connected: DelayedCodeSection
        disconnected: DelayedCodeSection
        wasConnected: Variable
    }
    autoRefreshRegs: jdspec.PacketInfo[] = []
    stringIndex: number
    used = false

    constructor(
        prog: Program,
        definition: ts.VariableDeclaration | ts.Identifier,
        scope: VariableScope,
        public spec: jdspec.ServiceSpec,
        _name?: string
    ) {
        super(definition, scope, _name)
        assert(!!spec, "no spec " + this._name)
        this.stringIndex = prog.addString(this.getName())
    }
    emit(wr: OpWriter): Value {
        const r = wr.emitExpr(Op.EXPRx_STATIC_ROLE, literal(this._index))
        r.valueType = ValueType.ROLE(this.spec)
        va(r).role = this
        this.used = true
        return r
    }
    serialize() {
        const r = new Uint8Array(BinFmt.ROLE_HEADER_SIZE)
        write32(r, 0, this.spec.classIdentifier)
        write16(r, 4, this.stringIndex)
        return r
    }
    toString() {
        return `role ${this.getName()}`
    }
    isSensor() {
        return this.spec.packets.some(
            p => p.identifier == SystemReg.StreamingSamples
        )
    }
    isCondition() {
        return this.spec.classIdentifier == SRV_DEVICE_SCRIPT_CONDITION
    }
    debugInfo(): RoleDebugInfo {
        return {
            ...super.debugInfo(),
            serviceClass: this.spec.classIdentifier,
        }
    }
}

class Variable extends Cell {
    public parentProc: Procedure

    constructor(
        definition:
            | ts.VariableDeclaration
            | ts.ParameterDeclaration
            | ts.FunctionDeclaration
            | ts.BindingElement,
        public vkind: VariableKind,
        scopeOrProc: VariableScope | Procedure,
        public valueType: ValueType,
        name?: string
    ) {
        super(
            definition,
            scopeOrProc instanceof VariableScope
                ? scopeOrProc
                : vkind == VariableKind.Local
                ? scopeOrProc.locals
                : scopeOrProc.params,
            name
        )
        if (scopeOrProc instanceof Procedure) this.parentProc = scopeOrProc
    }

    emitViaClosure(wr: OpWriter, lev: number) {
        if (lev == 0) return this.emit(wr)
        const r = wr.emitExpr(
            Op.EXPRx1_LOAD_CLOSURE,
            literal(this.getClosureIndex()),
            literal(lev)
        )
        r.valueType = this.valueType
        va(r).variable = this
        return r
    }

    private get packedIndex() {
        return packVarIndex(this.vkind, this._index)
    }

    private getClosureIndex() {
        assert(this.vkind != VariableKind.Global)
        return this.parentProc.mapVarOffset(this.packedIndex)
    }

    private assertDirect(wr: OpWriter) {
        if (this.parentProc) {
            assert((wr.prog as Program).proc == this.parentProc)
        }
    }

    emit(wr: OpWriter): Value {
        this.assertDirect(wr)
        let r: Value
        if (this.vkind == VariableKind.Global)
            r = wr.emitMemRef(
                Op.EXPRx_LOAD_GLOBAL,
                this.packedIndex,
                this.valueType
            )
        else
            r = wr.emitMemRef(
                Op.EXPRx_LOAD_LOCAL,
                this.packedIndex,
                this.valueType
            )
        va(r).variable = this
        return r
    }
    canStore() {
        return true
    }
    store(wr: OpWriter, src: Value, lev: number) {
        if (this.valueType == ValueType.ANY) this.valueType = src.valueType

        if (lev == 0) {
            this.assertDirect(wr)
            if (this.vkind == VariableKind.Global)
                wr.emitStmt(
                    Op.STMTx1_STORE_GLOBAL,
                    literal(this.packedIndex),
                    src
                )
            else
                wr.emitStmt(
                    Op.STMTx1_STORE_LOCAL,
                    literal(this.packedIndex),
                    src
                )
        } else {
            wr.emitStmt(
                Op.STMTx2_STORE_CLOSURE,
                literal(this.getClosureIndex()),
                literal(lev),
                src
            )
        }
    }
    toString() {
        return `var ${this.getName()} : ${this.valueType}`
    }
}

class BufferLit extends Cell {
    constructor(
        definition: ts.VariableDeclaration,
        scope: VariableScope,
        public litValue: Uint8Array
    ) {
        super(definition, scope)
    }
    emit(wr: OpWriter): Value {
        return wr.emitString(this.litValue)
    }
    toString() {
        return `bufferLit ${this.getName()}`
    }
}

class FunctionDecl extends Cell {
    proc: Procedure
    constructor(definition: ts.FunctionDeclaration, scope: VariableScope) {
        super(definition, scope)
    }
    emit(wr: OpWriter): Value {
        const prog = wr.prog as Program
        return prog.getFunctionProc(this).reference(wr)
    }
    toString() {
        return `function ${this.getName()}`
    }
}

class ValueAdd {
    index: number
    roleExpr?: Value
    role?: Role
    variable?: Variable
    clientCommand?: ClientCommand
    litValue?: number
}

function va(v: Value) {
    if (!v._userdata) v._userdata = new ValueAdd()
    return v._userdata as ValueAdd
}

function toSrcLocation(n: ts.Node): SrcLocation {
    const f = n.getSourceFile()
    const pp = f.getLineAndCharacterOfPosition(n.pos)
    return {
        file: f.fileName,
        line: pp.line + 1,
        col: pp.character + 1,
        len: n.end - n.pos,
        pos: n.pos,
    }
}

function idName(pat: Expr | ts.DeclarationName) {
    if (ts.isIdentifier(pat)) return pat.text
    else return null
}

function matchesName(specName: string, jsName: string) {
    return camelize(specName) == jsName
}

function unit() {
    return nonEmittable(ValueType.VOID)
}

interface DsSymbol extends ts.Symbol {
    __ds_cell: Cell
}

function symCell(sym: ts.Symbol) {
    return (sym as DsSymbol)?.__ds_cell
}

class Procedure {
    writer: OpWriter
    index: number
    params: VariableScope
    locals: VariableScope
    methodSeqNo: Variable
    users: ts.Node[] = []
    skipAccounting = false
    retType = ValueType.VOID
    parentProc: Procedure
    nestedProcs: Procedure[] = []
    usesClosure = false
    mapVarOffset: (n: number) => number

    constructor(
        public parent: Program,
        public name: string,
        public sourceNode?: ts.Node
    ) {
        if (!this.sourceNode) this.sourceNode = parent.lastNode
        this.index = this.parent.procs.length
        this.writer = new OpWriter(parent, `${this.name}_F${this.index}`)
        this.parent.procs.push(this)
        this.params = new VariableScope(this.parent.globals)
        this.locals = new VariableScope(this.params)
    }
    get numargs() {
        return this.params.list.length
    }
    toString() {
        return this.writer.getAssembly()
    }
    get usesThis() {
        const p = this.params.list[0] as Variable
        return p?.vkind == VariableKind.ThisParam
    }
    finalize() {
        if (this.mapVarOffset) return false
        this.mapVarOffset = this.writer.patchLabels(
            this.locals.list.length,
            this.numargs,
            this.usesThis
        )
        return true
    }
    args() {
        return this.params.list.slice() as Variable[]
    }
    useFrom(node: ts.Node) {
        if (this.users.indexOf(node) >= 0) return
        this.users.push(node)
    }
    mkTempLocal(name: string, tp: ValueType) {
        const l = new Variable(null, VariableKind.Local, this, tp)
        l._name = name
        return l
    }
    debugInfo(): FunctionDebugInfo {
        this.writer._forceFinStmt()
        return {
            name: this.name,
            srcmap: this.writer.srcmap,
            location: this.sourceNode
                ? toSrcLocation(this.sourceNode)
                : undefined,
            size: this.writer.size,
            users: this.users.map(toSrcLocation),
            locals: this.params.list
                .concat(this.locals.list)
                .map(v => v.debugInfo()),
        }
    }

    addNestedProc(proc: Procedure) {
        this.nestedProcs.push(proc)
        proc.parentProc = this
    }

    reference(wr: OpWriter) {
        return wr.emitExpr(Op.EXPRx_STATIC_FUNCTION, literal(this.index))
    }

    referenceAsClosure(wr: OpWriter) {
        return wr.emitExpr(Op.EXPRx_MAKE_CLOSURE, literal(this.index))
    }

    callMe(wr: OpWriter, args: Value[], op = OpCall.SYNC) {
        const fn = this.reference(wr)
        if (op == OpCall.SYNC) wr.emitCall(fn, ...args)
        else
            wr.emitCall(
                wr.builtInMember(fn, BuiltInString.START),
                literal(op),
                ...args
            )
    }
}

class VariableScope {
    map: SMap<Cell> = {}
    list: Cell[] = []
    constructor(public parent: VariableScope) {}

    lookup(name: string): Cell {
        if (name == null) return undefined
        if (this.map.hasOwnProperty(name)) return this.map[name]
        if (this.parent) return this.parent.lookup(name)
        return undefined
    }

    _addToMap(cell: Cell) {
        this.map[cell.getName()] = cell
    }

    add(cell: Cell) {
        cell._index = this.list.length
        this.list.push(cell)
        if (cell.definition || cell._name) this._addToMap(cell)
    }

    describeIndex(idx: number) {
        const v = this.list[idx]
        if (v) return v.getName()
        return undefined
    }

    sort() {
        this.list.sort((a, b) => strcmp(a.getName(), b.getName()))
        for (let i = 0; i < this.list.length; ++i) this.list[i]._index = i
    }
}

enum RefreshMS {
    Never = 0,
    Normal = 500,
    Slow = 5000,
}

type Expr = ts.Expression | ts.TemplateLiteralLikeNode
type Stmt = ts.Statement
type FunctionLike =
    | ts.FunctionDeclaration
    | ts.ArrowFunction
    | ts.FunctionExpression

const mathConst: SMap<number> = {
    E: Math.E,
    PI: Math.PI,
    LN10: Math.LN10,
    LN2: Math.LN2,
    LOG2E: Math.LOG2E,
    LOG10E: Math.LOG10E,
    SQRT1_2: Math.SQRT1_2,
    SQRT2: Math.SQRT2,
}

function throwError(expr: ts.Node, msg: string): never {
    const err = new Error(msg)
    // console.log(err.stack)
    ;(err as any).sourceNode = expr
    throw err
}

interface LoopLabels {
    continueLbl: Label
    breakLbl: Label
}

class ClientCommand {
    defintion: ts.FunctionExpression
    jsName: string
    pktSpec: jdspec.PacketInfo
    isFresh: boolean
    proc: Procedure
    constructor(public serviceSpec: jdspec.ServiceSpec) {}
}

class MonkeyPatch {
    proc: Procedure
    constructor(public defintion: ts.FunctionExpression, public name: string) {}
}

class Program implements TopOpWriter {
    bufferLits = new VariableScope(null)
    roles = new VariableScope(this.bufferLits)
    functions = new VariableScope(null)
    globals = new VariableScope(this.roles)
    tree: ts.Program
    checker: ts.TypeChecker
    mainFile: ts.SourceFile
    procs: Procedure[] = []
    lastNode: ts.Node
    floatLiterals: number[] = []
    asciiLiterals: string[] = []
    utf8Literals: string[] = []
    bufferLiterals: Uint8Array[] = []
    writer: OpWriter
    proc: Procedure
    accountingProc: Procedure
    sysSpec: jdspec.ServiceSpec
    serviceSpecs: Record<string, jdspec.ServiceSpec>
    enums: Record<string, jdspec.EnumInfo> = {}
    clientCommands: Record<string, ClientCommand[]> = {}
    monkeyPatch: Record<string, MonkeyPatch | FunctionDecl> = {}
    refreshMS: number[] = [0, 500]
    resolverParams: number[]
    resolverPC: number
    prelude: Record<string, string>
    numErrors = 0
    main: Procedure
    cloudRole: Role
    cloudMethod429: Label
    cloudMethodDispatcher: DelayedCodeSection
    startDispatchers: DelayedCodeSection
    onStart: DelayedCodeSection
    loopStack: LoopLabels[] = []
    isLibrary = false
    compileAll = false

    constructor(public host: Host, public _source: string) {
        this.serviceSpecs = {}
        const specs = host.getSpecs()
        for (const sp of specs) {
            this.serviceSpecs[sp.camelName] = sp
            for (const en of Object.keys(sp.enums)) {
                const n = upperCamel(sp.camelName) + upperCamel(en)
                this.enums["#" + n] = sp.enums[en]
            }
        }
        this.sysSpec = this.serviceSpecs["system"]
        this.prelude = preludeFiles(specs)
    }

    get hasErrors() {
        return this.numErrors > 0
    }

    getSource(fn: string) {
        if (!fn || fn == this.host.mainFileName?.()) return this._source
        return this.prelude[fn] || ""
    }

    addString(str: string) {
        let isAscii = true
        for (let i = 0; i < str.length; ++i)
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 0) {
                isAscii = false
                break
            }
        let idx = BUILTIN_STRING__VAL.indexOf(str)
        if (idx >= 0) return idx | (StrIdx.BUILTIN << StrIdx._SHIFT)
        if (isAscii && str.length < 50) {
            idx = addUnique(this.asciiLiterals, str)
            return idx | (StrIdx.ASCII << StrIdx._SHIFT)
        } else
            return (
                addUnique(this.utf8Literals, str) |
                (StrIdx.UTF8 << StrIdx._SHIFT)
            )
    }

    addBuffer(buf: Uint8Array) {
        for (let i = 0; i < this.bufferLiterals.length; ++i) {
            const ss = this.bufferLiterals[i]
            if (bufferEq(buf, ss)) return i
        }
        this.bufferLiterals.push(buf)
        return this.bufferLiterals.length - 1
    }

    addFloat(f: number): number {
        return addUnique(this.floatLiterals, f)
    }

    indexToLine(node: ts.Node) {
        const { line } = ts.getLineAndCharacterOfPosition(
            node.getSourceFile(),
            node.getStart()
        )
        return line + 1
    }

    printDiag(diag: ts.Diagnostic) {
        if (diag.category == ts.DiagnosticCategory.Error) this.numErrors++

        const jdiag: DevsDiagnostic = {
            ...diag,
            filename: this.host?.mainFileName() || "main.ts",
            line: 1,
            column: 1,
            formatted: formatDiagnostics([diag]),
        }

        if (diag.file) {
            const { character, line } = diag.file.getLineAndCharacterOfPosition(
                diag.start
            )
            jdiag.line = line + 1
            jdiag.column = character + 1
            jdiag.filename = diag.file.fileName
        }
        if (this.host.error) this.host.error(jdiag)
        else console.error(jdiag.formatted)
    }

    reportError(node: ts.Node, msg: string): Value {
        const diag: ts.Diagnostic = {
            category: ts.DiagnosticCategory.Error,
            messageText: msg,
            code: 9999,
            file: node.getSourceFile(),
            start: node.getStart(),
            length: node.getWidth(),
        }
        this.printDiag(diag)
        return nonEmittable(ValueType.ERROR)
    }

    describeCell(ff: string, idx: number): string {
        switch (ff) {
            case "R":
                return this.roles.describeIndex(idx)
            case "B":
                return toHex(this.bufferLiterals[idx])
            case "U":
                return JSON.stringify(this.utf8Literals[idx])
            case "A":
                return JSON.stringify(this.asciiLiterals[idx])
            case "I":
                return JSON.stringify(BUILTIN_STRING__VAL[idx])
            case "O":
                return BUILTIN_OBJECT__VAL[idx] || "???"
            case "L":
                return "" // local
            case "G":
                return this.globals.describeIndex(idx)
            case "D":
                return this.floatLiterals[idx] + ""
            case "F":
                return this.procs[idx]?.name
        }
    }

    private roleDispatcher(role: Role) {
        if (!role.dispatcher) {
            const proc = new Procedure(
                this,
                role.getName() + "_disp",
                role.definition
            )
            proc.skipAccounting = true
            role.dispatcher = {
                proc,
                top: proc.writer.mkLabel("disp_top"),
                init: new DelayedCodeSection("init", proc.writer),
                disconnected: new DelayedCodeSection(
                    "disconnected",
                    proc.writer
                ),
                connected: new DelayedCodeSection("connected", proc.writer),
                checkConnected: new DelayedCodeSection(
                    "checkConnected",
                    proc.writer
                ),
                wasConnected: proc.mkTempLocal(
                    "connected_" + role.getName(),
                    ValueType.BOOL
                ),
            }
            this.withProcedure(proc, wr => {
                this.emitStore(
                    role.dispatcher.wasConnected,
                    this.emitIsRoleConnected(role)
                )
                role.dispatcher.init.callHere()
                wr.emitLabel(role.dispatcher.top)
                wr.emitStmt(Op.STMT1_WAIT_ROLE, role.emit(wr))
                role.dispatcher.checkConnected.callHere()
            })

            this.startDispatchers.emit(wr => {
                // this is only executed once, but with BG_MAX1 is easier to naively analyze memory usage
                proc.callMe(wr, [], OpCall.BG_MAX1)
            })
        }
        return role.dispatcher
    }

    private finalizeDispatchers() {
        for (const role of this.roles.list) {
            const disp = (role as Role).dispatcher
            if (disp)
                this.withProcedure(disp.proc, wr => {
                    // forever!
                    wr.emitJump(disp.top)

                    // run init
                    disp.init.finalize()

                    // if any dis/connect handlers, do the checking
                    if (!disp.connected.empty() || !disp.disconnected.empty()) {
                        disp.checkConnected.body.push(wr => {
                            const connNow = this.emitIsRoleConnected(
                                role as Role
                            )
                            const nowDis = wr.mkLabel("nowDis")
                            wr.emitJump(nowDis, connNow)

                            {
                                // now==connected
                                if (!disp.connected.empty()) {
                                    wr.emitJump(
                                        disp.checkConnected.returnLabel,
                                        wr.emitExpr(
                                            Op.EXPR1_NOT,
                                            disp.wasConnected.emit(wr)
                                        )
                                    )
                                    // prev==disconnected

                                    disp.connected.finalizeRaw()
                                }
                                this.emitStore(disp.wasConnected, literal(1))
                                wr.emitJump(disp.checkConnected.returnLabel)
                            }

                            {
                                wr.emitLabel(nowDis)
                                // now==disconnected
                                if (!disp.disconnected.empty()) {
                                    wr.emitJump(
                                        disp.checkConnected.returnLabel,
                                        disp.wasConnected.emit(wr)
                                    )
                                    // prev==connected
                                    disp.disconnected.finalizeRaw()
                                }
                                this.emitStore(disp.wasConnected, literal(0))
                                wr.emitJump(disp.checkConnected.returnLabel)
                            }
                        })
                    }

                    // either way, finalize checkConnected
                    disp.checkConnected.finalize()
                })
        }
    }

    private emitSleep(ms: number) {
        const wr = this.writer
        wr.emitCall(wr.dsMember(BuiltInString.SLEEPMS), literal(ms))
    }

    private finalizeAutoRefresh() {
        if (this.roles.list.every(r => (r as Role).autoRefreshRegs.length == 0))
            return
        const proc = new Procedure(this, "_autoRefresh_")
        const period = 521
        this.withProcedure(proc, wr => {
            for (const role_ of this.roles.list) {
                const role = role_ as Role
                if (role.autoRefreshRegs.length == 0) continue
                const isConn = this.emitIsRoleConnected(role)
                wr.emitIfAndPop(isConn, () => {
                    for (const reg of role.autoRefreshRegs) {
                        if (
                            reg.identifier == SystemReg.Reading &&
                            role.isSensor()
                        ) {
                            wr.emitSetBuffer(new Uint8Array([199]))
                            this.emitSendCommand(
                                role,
                                SystemReg.StreamingSamples | CMD_SET_REG
                            )
                        } else {
                            wr.emitStmt(Op.STMT1_SETUP_PKT_BUFFER, literal(0))
                            this.emitSendCommand(
                                role,
                                reg.identifier | CMD_GET_REG
                            )
                        }
                    }
                })
            }
            this.emitSleep(period)
            wr.emitJump(wr.top)
        })

        this.startDispatchers.emit(wr => proc.callMe(wr, [], OpCall.BG_MAX1))
    }

    private withProcedure<T>(proc: Procedure, f: (wr: OpWriter) => T) {
        assert(!!proc)
        const prevProc = this.proc
        const prevAcc = this.accountingProc
        try {
            this.proc = proc
            if (!proc.skipAccounting) this.accountingProc = proc
            this.writer = proc.writer
            return f(proc.writer)
        } finally {
            this.proc = prevProc
            if (prevProc) this.writer = prevProc.writer
            this.accountingProc = prevAcc
        }
    }

    private forceName(pat: ts.Expression | ts.DeclarationName) {
        const r = idName(pat)
        if (!r) throwError(pat, "only simple identifiers supported")
        return r
    }

    private lookupRoleSpec(expr: ts.Node, serv: string) {
        const r = this.serviceSpecs.hasOwnProperty(serv)
            ? this.serviceSpecs[serv]
            : undefined
        if (!r) throwError(expr, "no such service: " + serv)
        return r
    }

    private parseRole(decl: ts.VariableDeclaration): Cell {
        const expr = decl.initializer

        const buflit = this.bufferLiteral(expr)
        if (buflit)
            return this.assignCell(
                decl,
                new BufferLit(decl, this.bufferLits, buflit)
            )

        if (!expr) return null

        if (ts.isNewExpression(expr)) {
            const spec = this.specFromTypeName(
                expr.expression,
                this.nodeName(expr.expression),
                true
            )
            if (spec) {
                this.requireArgs(expr, 0)
                return this.assignCell(
                    decl,
                    new Role(this, decl, this.roles, spec)
                )
            }
        }

        return null
    }

    private emitStore(trg: Variable, src: Value) {
        trg.store(this.writer, src, this.getClosureLevel(trg))
    }

    private newDef(decl: ts.NamedDeclaration) {
        this.forceName(decl.name)
    }

    private lookupBuiltinFunc(name: string) {
        const d = this.functions.lookup(name)
        if (d && d.definition) {
            if (
                this.prelude.hasOwnProperty(
                    d.definition.getSourceFile().fileName
                )
            )
                return d as FunctionDecl
        }
        return undefined
    }

    private skipInit(decl: ts.VariableDeclaration) {
        if (this.isTopLevel(decl) && idName(decl.name)) {
            const cell = this.getCellAtLocation(decl)
            return !(cell instanceof Variable)
        }
        return false
    }

    private getPropName(pn: ts.PropertyName | ts.BindingName) {
        const wr = this.writer
        if (ts.isIdentifier(pn) || ts.isStringLiteral(pn)) return pn.text
        throwError(pn, "unsupported property name")
    }

    private assignToId(id: ts.Identifier, init: Value) {
        const variable = this.getCellAtLocation(id)
        if (!(variable instanceof Variable)) throwError(id, "invalid cell type")
        variable.valueType = init.valueType
        this.emitStore(variable, init)
    }

    private cloneObj(obj: Value) {
        const wr = this.writer
        wr.emitStmt(Op.STMT0_ALLOC_MAP)
        wr.emitCall(
            wr.objectMember(BuiltInString.ASSIGN),
            this.retVal(ValueType.MAP),
            obj
        )
        return this.retVal(ValueType.MAP)
    }

    private assignToBindingElement(
        bindingElt: ts.BindingElement,
        obj: CachedValue,
        usedFields: string[]
    ) {
        const wr = this.writer
        const bindingName = bindingElt.name

        if (bindingElt.dotDotDotToken) {
            const spr = wr.cacheValue(this.cloneObj(obj.emit()))

            for (const pn of usedFields)
                wr.emitStmt(
                    Op.STMT2_INDEX_DELETE,
                    spr.emit(),
                    wr.emitString(pn)
                )

            if (!ts.isIdentifier(bindingName))
                throwError(bindingName, "unsupported spread")
            this.assignToId(bindingName, spr.finalEmit())
            return
        }

        const pname = this.getPropName(
            bindingElt.propertyName ?? bindingElt.name
        )
        usedFields.push(pname)

        let val = wr.emitIndex(obj.emit(), wr.emitString(pname))

        if (bindingElt.initializer)
            throwError(
                bindingElt,
                "default values in bindings not supported yet"
            )

        if (ts.isIdentifier(bindingName)) {
            this.assignToId(bindingName, val)
        } else if (ts.isObjectBindingPattern(bindingName)) {
            const obj2 = wr.cacheValue(val)
            const used: string[] = []
            for (const elt of bindingName.elements) {
                this.assignToBindingElement(elt, obj2, used)
            }
            obj2.free()
        } else {
            throwError(bindingName, "invalid binding elt")
        }
    }

    private emitVariableDeclarationList(decls: ts.VariableDeclarationList) {
        for (const decl of decls.declarations) {
            if (this.skipInit(decl)) continue

            if (this.isTopLevel(decl)) {
                // OK
            } else {
                this.assignVariableCells(decl, this.proc)
            }

            if (!decl.initializer) continue

            const init = this.emitSimpleValue(decl.initializer, ValueType.ANY)

            if (ts.isIdentifier(decl.name)) {
                this.assignToId(decl.name, init)
            } else {
                const wr = this.writer
                const obj = wr.cacheValue(init)
                if (ts.isObjectBindingPattern(decl.name)) {
                    const used: string[] = []
                    for (const elt of decl.name.elements)
                        this.assignToBindingElement(elt, obj, used)
                } else {
                    throwError(decl, "array destruct not supported")
                }
                obj.free()
            }
        }
    }

    private emitVariableDeclaration(decls: ts.VariableStatement) {
        this.emitVariableDeclarationList(decls.declarationList)
    }

    private valueIsAlwaysFalse(v: Value) {
        if (v.isLiteral) return v.numValue == 0
        return v.op == Op.EXPR0_FALSE || v.op == Op.EXPR0_NULL
    }

    private valueIsAlwaysTrue(v: Value) {
        if (v.isLiteral) return v.numValue != 0 && !isNaN(v.numValue)
        return v.op == Op.EXPR0_TRUE
    }

    private emitIfStatement(stmt: ts.IfStatement) {
        const cond = this.emitSimpleValue(stmt.expression, ValueType.BOOL)
        if (this.valueIsAlwaysFalse(cond)) {
            if (stmt.elseStatement) this.emitStmt(stmt.elseStatement)
        } else if (this.valueIsAlwaysTrue(cond)) {
            this.emitStmt(stmt.thenStatement)
        } else {
            this.writer.emitIfAndPop(
                cond,
                () => this.emitStmt(stmt.thenStatement),
                stmt.elseStatement
                    ? () => this.emitStmt(stmt.elseStatement)
                    : null
            )
        }
    }

    private emitForStatement(stmt: ts.ForStatement) {
        const wr = this.writer

        const topLbl = wr.mkLabel("forTop")
        const continueLbl = wr.mkLabel("forCont")
        const breakLbl = wr.mkLabel("forBrk")

        if (stmt.initializer) {
            if (ts.isVariableDeclarationList(stmt.initializer))
                this.emitVariableDeclarationList(stmt.initializer)
            else {
                this.emitIgnoredExpression(stmt.initializer)
            }
        }

        wr.emitLabel(topLbl)

        const cond = this.emitSimpleValue(stmt.condition, ValueType.BOOL)
        wr.emitJump(breakLbl, cond)

        try {
            this.loopStack.push({ continueLbl, breakLbl })
            this.emitStmt(stmt.statement)
            wr.emitLabel(continueLbl)
            if (stmt.incrementor) this.emitIgnoredExpression(stmt.incrementor)
        } finally {
            this.loopStack.pop()
        }

        wr.emitJump(topLbl)
        wr.emitLabel(breakLbl)
    }

    private emitWhileStatement(stmt: ts.WhileStatement) {
        const wr = this.writer

        const continueLbl = wr.mkLabel("whileCont")
        const breakLbl = wr.mkLabel("whileBrk")

        wr.emitLabel(continueLbl)
        const cond = this.emitSimpleValue(stmt.expression, ValueType.BOOL)
        wr.emitJump(breakLbl, cond)

        try {
            this.loopStack.push({ continueLbl, breakLbl })
            this.emitStmt(stmt.statement)
        } finally {
            this.loopStack.pop()
        }

        wr.emitJump(continueLbl)
        wr.emitLabel(breakLbl)
    }

    private emitAckCloud(
        code: CloudAdapterCommandStatus,
        isOuter: boolean,
        args: Expr[] = []
    ) {
        const wr = this.writer
        wr.allocBuf()
        {
            const tmp = isOuter
                ? wr.emitBufLoad(NumFmt.U32, 0)
                : wr.emitMemRef(Op.EXPRx_LOAD_LOCAL, 0, ValueType.NUMBER)
            wr.emitStmt(Op.STMT1_SETUP_PKT_BUFFER, literal(8 + args.length * 8))
            wr.emitBufStore(tmp, NumFmt.U32, 0)
            wr.emitBufStore(literal(code), NumFmt.U32, 4)
        }
        let off = 8
        for (const arg of args) {
            const v = this.emitSimpleValue(arg)
            wr.emitBufStore(v, NumFmt.F64, off)
            off += 8
        }
        wr.freeBuf()
        this.emitSendCommand(this.cloudRole, CloudAdapterCmd.AckCloudCommand)
    }

    private emitReturnStatement(stmt: ts.ReturnStatement) {
        const wr = this.writer
        if (this.proc.methodSeqNo) {
            let args: Expr[] = []
            if (
                stmt.expression &&
                ts.isArrayLiteralExpression(stmt.expression)
            ) {
                args = stmt.expression.elements.slice()
            } else if (stmt.expression) {
                args = [stmt.expression]
            }
            this.emitAckCloud(CloudAdapterCommandStatus.OK, false, args)
            wr.emitStmt(Op.STMT1_RETURN, literal(null))
        } else if (stmt.expression) {
            if (wr.ret) oops("return with value not supported here")
            wr.emitStmt(
                Op.STMT1_RETURN,
                this.emitSimpleValue(stmt.expression, ValueType.ANY)
            )
        } else {
            if (wr.ret) this.writer.emitJump(this.writer.ret)
            else wr.emitStmt(Op.STMT1_RETURN, literal(null))
        }
    }

    private moduleOf(sym: ts.Symbol) {
        let n = sym?.valueDeclaration?.parent
        if (n?.kind == SK.ModuleBlock) n = n.parent
        if (n && ts.isModuleDeclaration(n)) {
            if (ts.isStringLiteral(n.name)) return n.name.text
        }
        return null
    }

    private inCoreModule(sym: ts.Symbol) {
        return this.moduleOf(sym) == coreModule
    }

    private specFromTypeName(
        expr: ts.Node,
        nm?: string,
        optional = false
    ): jdspec.ServiceSpec {
        if (!nm) nm = this.nodeName(expr)
        if (nm && nm.startsWith("#ds.")) {
            let r = nm.slice(4)
            r = r[0].toLowerCase() + r.slice(1)
            if (r == "condition") r = "deviceScriptCondition"
            return this.lookupRoleSpec(expr, r)
        } else {
            if (optional) return null
            throwError(expr, `type name not understood: ${nm}`)
        }
    }

    private emitFunction(
        stmt: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction,
        proc: Procedure
    ) {
        this.withProcedure(proc, wr => {
            this.emitParameters(stmt, proc)
            this.emitFunctionBody(stmt, proc)
        })
        return proc
    }

    private finalizeProc(proc: Procedure) {
        try {
            if (!proc.finalize()) return
        } catch (e) {
            this.handleException(proc.sourceNode, e)
            return
        }
        for (const p of proc.nestedProcs) {
            if (
                p.sourceNode &&
                (ts.isFunctionDeclaration(p.sourceNode) ||
                    ts.isFunctionExpression(p.sourceNode) ||
                    ts.isArrowFunction(p.sourceNode))
            )
                this.emitFunction(p.sourceNode, p)
            else oops("bad sourceNode")
        }
    }

    private emitFunctionBody(
        stmt: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction,
        proc: Procedure
    ) {
        if (ts.isBlock(stmt.body)) {
            this.emitStmt(stmt.body)
            if (!this.writer.justHadReturn())
                this.writer.emitStmt(Op.STMT1_RETURN, literal(null))
        } else {
            this.writer.emitStmt(Op.STMT1_RETURN, this.emitExpr(stmt.body))
        }

        this.finalizeProc(proc)
    }

    private addParameter(
        proc: Procedure,
        id: ts.ParameterDeclaration | string
    ) {
        const v = new Variable(
            typeof id == "string" ? null : id,
            VariableKind.Parameter,
            proc,
            ValueType.NUMBER
        )
        if (typeof id == "string") v._name = id
        else this.assignCell(id, v)
        if (v.getName() == "this") v.vkind = VariableKind.ThisParam
        return v
    }

    private mapType(node: ts.Node, tp: ts.Type) {
        if (tp.getFlags() & ts.TypeFlags.BooleanLike) return ValueType.BOOL
        if (tp.getFlags() & ts.TypeFlags.NumberLike) return ValueType.NUMBER
        if (tp.getFlags() & ts.TypeFlags.StringLike) return ValueType.STRING
        if (tp.getFlags() & ts.TypeFlags.VoidLike) return ValueType.VOID
        if (
            tp.getFlags() &
            (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never)
        )
            return ValueType.ANY

        if (tp.getFlags() & ts.TypeFlags.StructuredType) {
            const sigs = this.checker.getSignaturesOfType(
                tp,
                ts.SignatureKind.Call
            )
            if (sigs?.length > 0) return ValueType.FUNCTION
        }

        const n = this.symName(tp.getSymbol())
        if (n && n[0] == "#") {
            if (n == "#Buffer") return ValueType.BUFFER
            if (n == "#Array") return ValueType.ARRAY
            if (
                tp
                    .getBaseTypes()
                    ?.some(b => this.symName(b.getSymbol()) == "#Role")
            )
                return ValueType.ROLE(this.specFromTypeName(node, n))
        }

        if (tp.getFlags() & ts.TypeFlags.Object) return ValueType.MAP

        const tname = this.checker.typeToString(tp)
        throwError(
            node,
            `type not understood: ${tname} (${n} ${tp.getFlags()})`
        )
    }

    private emitParameters(stmt: FunctionLike, proc: Procedure) {
        for (const paramdef of stmt.parameters) {
            if (paramdef.kind != SK.Parameter)
                throwError(
                    paramdef,
                    "only simple identifiers supported as parameters"
                )
            const v = this.addParameter(proc, paramdef)
            v.valueType = ValueType.ANY
        }
        proc.retType = ValueType.ANY
    }

    private getClientCommandProc(cc: ClientCommand) {
        if (cc.proc) return cc.proc

        const stmt = cc.defintion
        cc.proc = new Procedure(
            this,
            cc.serviceSpec.camelName + "." + cc.jsName,
            stmt
        )

        this.withProcedure(cc.proc, wr => {
            const v = new Variable(
                null,
                VariableKind.Parameter,
                cc.proc,
                ValueType.ROLE(cc.serviceSpec),
                "this"
            )
            this.emitParameters(stmt, cc.proc)
            this.emitFunctionBody(stmt, cc.proc)
        })

        return cc.proc
    }

    getFunctionProc(fundecl: FunctionDecl) {
        if (fundecl.proc) return fundecl.proc
        const stmt = fundecl.definition as ts.FunctionDeclaration
        fundecl.proc = new Procedure(this, fundecl.getName(), stmt)
        return this.emitFunction(stmt, fundecl.proc)
    }

    private emitFunctionDeclaration(stmt: ts.FunctionDeclaration) {
        const fundecl = this.functions.list.find(
            f => f.definition === stmt
        ) as FunctionDecl

        if (!this.isTopLevel(stmt)) {
            const fnVar = this.assignCell(
                stmt,
                new Variable(
                    stmt,
                    VariableKind.Local,
                    this.proc,
                    ValueType.FUNCTION
                )
            )
            this.emitStore(fnVar, this.emitFunctionExpr(stmt))
            return
        }

        if (
            stmt.asteriskToken ||
            (stmt.modifiers && !stmt.modifiers.every(modifierOK))
        )
            throwError(stmt, "modifier not supported")
        assert(!!fundecl || !!this.numErrors)

        if (fundecl) {
            if (fundecl.getName().startsWith("__ds_")) {
                // TODO rename function to strip __ds_ (smaller binary)
                // TODO compare signatures!
                const id = fundecl.getName().slice(5)
                this.monkeyPatch["#ds." + id] = fundecl
            }

            if (this.compileAll || (this.isLibrary && this.inMainFile(stmt)))
                this.getFunctionProc(fundecl)
        }

        function modifierOK(mod: ts.Modifier) {
            switch (mod.kind) {
                case SK.ExportKeyword:
                    return true
                default:
                    return false
            }
        }
    }

    private isTopLevel(node: ts.Node) {
        return !!(node as any)._devsIsTopLevel
    }

    private symSetCell(sym: ts.Symbol, cell: Cell) {
        const s = sym as DsSymbol
        assert(!s.__ds_cell || s.__ds_cell == cell || this.numErrors > 0)
        s.__ds_cell = cell
    }

    private assignCell<T extends Cell>(node: ts.NamedDeclaration, cell: T): T {
        const sym = this.checker.getSymbolAtLocation(node.name)
        assert(!!sym)
        this.symSetCell(sym, cell)
        return cell
    }

    private emitProgram(prog: ts.Program) {
        this.lastNode = this.mainFile
        this.main = new Procedure(this, "main", this.mainFile)

        this.startDispatchers = new DelayedCodeSection(
            "startDispatchers",
            this.main.writer
        )
        this.onStart = new DelayedCodeSection("onStart", this.main.writer)

        const stmts = ([] as ts.Statement[]).concat(
            ...prog
                .getSourceFiles()
                .map(file => (file.isDeclarationFile ? [] : file.statements))
        )

        stmts.forEach(markTopLevel)

        // pre-declare all functions and globals
        for (const s of stmts) {
            try {
                if (ts.isFunctionDeclaration(s)) {
                    this.newDef(s)
                    this.forceName(s.name)
                    this.assignCell(s, new FunctionDecl(s, this.functions))
                } else if (ts.isVariableStatement(s)) {
                    for (const decl of s.declarationList.declarations) {
                        this.assignVariableCells(decl, null)
                    }
                }
            } catch (e) {
                this.handleException(s, e)
            }
        }

        this.roles.sort()

        // make sure the cloud role is last
        this.cloudRole = new Role(
            this,
            null,
            this.roles,
            this.serviceSpecs["cloudAdapter"],
            "cloud"
        )

        this.withProcedure(this.main, () => {
            this.startDispatchers.callHere()
            for (const s of stmts) this.emitStmt(s)
            this.onStart.finalizeRaw()
            this.writer.emitStmt(Op.STMT1_RETURN, literal(0))
            this.finalizeAutoRefresh()
            this.startDispatchers.finalize()
        })

        if (!this.cloudRole.used) {
            const cl = this.roles.list.pop()
            assert(cl == this.cloudRole)
        }

        function markTopLevel(node: ts.Node) {
            ;(node as any)._devsIsTopLevel = true
            if (ts.isExpressionStatement(node)) markTopLevel(node.expression)
            else if (ts.isVariableStatement(node))
                node.declarationList.declarations.forEach(markTopLevel)
            else if (
                ts.isVariableDeclaration(node) &&
                !ts.isIdentifier(node.name)
            )
                node.name.elements.forEach(markTopLevel)
        }
    }

    private assignVariableCells(decl: ts.VariableDeclaration, proc: Procedure) {
        if (idName(decl.name) && !proc) {
            if (this.parseRole(decl)) return
        }

        const doAssign = (decl: ts.VariableDeclaration | ts.BindingElement) => {
            if (ts.isIdentifier(decl.name))
                this.assignCell(
                    decl,
                    new Variable(
                        decl,
                        proc ? VariableKind.Local : VariableKind.Global,
                        proc ? proc : this.globals,
                        ValueType.ANY
                    )
                )
            else if (ts.isObjectBindingPattern(decl.name)) {
                for (const elt of decl.name.elements) {
                    doAssign(elt)
                }
            } else if (ts.isArrayBindingPattern(decl.name)) {
                for (const elt of decl.name.elements) {
                    if (!ts.isOmittedExpression(elt)) doAssign(elt)
                }
            } else {
                throwError(decl, "unsupported binding")
            }
        }

        doAssign(decl)
    }

    private ignore(val: Value) {
        val.adopt()
    }

    private isForIgnored(expr: Expr) {
        if (expr.parent) {
            if (ts.isForStatement(expr.parent))
                return (
                    expr == expr.parent.initializer ||
                    expr == expr.parent.incrementor
                )
        }
        return false
    }

    private isIgnored(expr: Expr) {
        return (
            expr.parent &&
            (ts.isExpressionStatement(expr.parent) || this.isForIgnored(expr))
        )
    }

    private emitIgnoredExpression(expr: Expr) {
        this.ignore(this.emitExpr(expr))
        this.writer.assertNoTemps()
    }

    private emitExpressionStatement(stmt: ts.ExpressionStatement) {
        this.emitIgnoredExpression(stmt.expression)
    }

    private uniqueProcName(base: string) {
        let suff = 0
        while (this.procs.some(p => p.name == base + "_" + suff)) suff++
        return base + "_" + suff
    }

    private emitHandler(
        name: string,
        func: Expr,
        options: {
            every?: number
            methodHandler?: boolean
        } = {}
    ): Procedure {
        if (!ts.isArrowFunction(func))
            throwError(func, "arrow function expected here")
        const proc = new Procedure(this, this.uniqueProcName(name), func)
        proc.useFrom(func)
        proc.writer.ret = proc.writer.mkLabel("ret")
        if (func.parameters.length && !options.methodHandler)
            throwError(func, "parameters not supported here")
        this.withProcedure(proc, wr => {
            if (options.methodHandler)
                proc.methodSeqNo = this.addParameter(proc, "methSeqNo")
            this.emitParameters(func, proc)
            if (options.every) {
                this.emitSleep(options.every)
            }
            if (ts.isBlock(func.body)) {
                this.emitStmt(func.body)
            } else {
                this.ignore(this.emitExpr(func.body))
            }
            wr.emitLabel(wr.ret)
            if (options.every) wr.emitJump(wr.top)
            else {
                if (options.methodHandler)
                    this.emitAckCloud(CloudAdapterCommandStatus.OK, false, [])
                wr.emitStmt(Op.STMT1_RETURN, literal(null))
            }
        })
        return proc
    }

    private codeName(node: ts.Node) {
        return node
            .getText()
            .slice(0, 30)
            .replace(/[^a-zA-Z0-9_]+/g, "_")
    }

    private requireArgsExt(node: ts.Node, args: Expr[], num: number) {
        if (args.length != num)
            throwError(node, `${num} arguments required; got ${args.length}`)
    }

    private requireArgs(
        expr: ts.CallExpression | ts.NewExpression,
        num: number
    ) {
        this.requireArgsExt(expr, expr.arguments.slice(), num)
    }

    private emitInRoleDispatcher(role: Role, f: (wr: OpWriter) => void) {
        const disp = this.roleDispatcher(role)
        this.withProcedure(disp.proc, f)
    }

    private requireTopLevel(expr: ts.CallExpression) {
        if (!this.isTopLevel(expr))
            throwError(
                expr,
                "this can only be done at the top-level of the program"
            )
    }

    private emitEventHandler(
        name: string,
        handlerExpr: Expr,
        role: Role,
        code: number
    ) {
        const handler = this.emitHandler(name, handlerExpr)
        this.emitInRoleDispatcher(role, wr => {
            const cond = wr.emitExpr(
                Op.EXPR2_EQ,
                wr.emitExpr(Op.EXPR0_PKT_EV_CODE),
                literal(code)
            )
            wr.emitIfAndPop(cond, () =>
                handler.callMe(wr, [], OpCall.BG_MAX1_PEND1)
            )
        })
    }

    private emitEventCall(
        expr: ts.CallExpression,
        val: Value,
        prop: string
    ): Value {
        assert(val.valueType.kind == ValueKind.JD_EVENT)
        const wr = this.writer
        switch (prop) {
            case "subscribe":
                this.requireTopLevel(expr)
                this.requireArgs(expr, 1)
                this.ignore(val)
                this.emitEventHandler(
                    this.codeName(expr.expression),
                    expr.arguments[0],
                    this.roleOf(expr.expression, val),
                    val.valueType.packetSpec.identifier
                )
                return unit()
            case "wait":
                this.requireArgs(expr, 0)
                const lbl = wr.mkLabel("wait")
                wr.emitLabel(lbl)
                wr.emitStmt(Op.STMT1_WAIT_ROLE, this.roleExprOf(expr, val))
                const cond = wr.emitExpr(
                    Op.EXPR2_EQ,
                    wr.emitExpr(Op.EXPR0_PKT_EV_CODE),
                    literal(val.valueType.packetSpec.identifier)
                )
                wr.emitJump(lbl, cond)
                return unit()
            default:
                return null
        }
    }

    private directCallFun(expr: ts.Node, fn: FunctionDecl, args: Value[]) {
        const wr = this.writer
        const proc = this.getFunctionProc(fn)
        proc.useFrom(expr)
        const formals = proc.args()
        for (let i = 0; i < args.length; i++) {
            const v = args[i]
            this.requireValueType(expr, v, formals[i].valueType)
        }
        proc.callMe(wr, args)
        return this.retVal(proc.retType)
    }

    private loadFieldAt(
        expr: ts.Node,
        field: jdspec.PacketMember,
        off: number
    ) {
        const wr = this.writer
        if (this.isBufferField(field)) {
            const fn = this.lookupBuiltinFunc("decode_" + field.type)
            if (!fn) throwError(null, `${field.type} format not supported yet`)
            return this.directCallFun(expr, fn, [literal(off)])
        }
        return wr.emitBufLoad(bufferFmt(field), off)
    }

    private extractRegField(
        node: ts.Node,
        spec: jdspec.PacketInfo,
        field: jdspec.PacketMember
    ) {
        let off = 0
        for (const f of spec.fields) {
            if (f == field) {
                return this.loadFieldAt(node, field, off)
            } else {
                off += Math.abs(f.storage)
            }
        }
        oops("field missing")
    }

    private emitRegGet(
        node: ts.Node,
        val: Value,
        refresh?: RefreshMS,
        field?: jdspec.PacketMember
    ) {
        assert(val.valueType.kind == ValueKind.JD_REG)
        const spec = val.valueType.packetSpec
        if (refresh === undefined)
            refresh = spec.kind == "const" ? RefreshMS.Never : RefreshMS.Normal
        if (!field && spec.fields.length == 1) field = spec.fields[0]

        const wr = this.writer
        wr.emitStmt(
            Op.STMT3_QUERY_REG,
            va(val).roleExpr,
            literal(spec.identifier),
            literal(refresh)
        )
        if (field) {
            return this.extractRegField(node, spec, field)
        } else {
            const r = nonEmittable(
                new ValueType(
                    ValueKind.JD_VALUE_SEQ,
                    val.valueType.roleSpec,
                    spec
                )
            )
            va(r).role = va(val).role
            return r
        }
    }

    private emitIsRoleConnected(val: Value | Role) {
        if (val instanceof Role) val = val.emit(this.writer)
        return this.writer.builtInMember(val, BuiltInString.ISCONNECTED)
    }

    private roleExprOf(expr: Expr, val: Value) {
        const vobj = va(val)
        if (vobj.roleExpr) val = vobj.roleExpr
        if (!val.valueType.isRole)
            throwError(expr, `a role expression is required here`)
        return val
    }

    private roleOf(expr: Expr, val: Value) {
        let vobj = va(this.roleExprOf(expr, val))
        if (!vobj.role) throwError(expr, `a static role is required here`)
        return vobj.role
    }

    private emitRoleCall(
        expr: ts.CallExpression,
        val: Value,
        prop: string
    ): Value {
        const wr = this.writer
        if (!ts.isPropertyAccessExpression(expr.expression)) oops("")
        switch (prop) {
            case "onConnected":
            case "onDisconnected": {
                this.requireTopLevel(expr)
                this.requireArgs(expr, 1)
                const role = this.roleOf(expr, val)
                const name = role.getName() + "_" + prop
                const handler = this.emitHandler(name, expr.arguments[0])
                const disp = this.roleDispatcher(role)
                const section =
                    prop == "onConnected" ? disp.connected : disp.disconnected
                section.emit(wr => {
                    handler.callMe(wr, [], OpCall.BG_MAX1_PEND1)
                })
                if (prop == "onConnected")
                    disp.init.emit(wr => {
                        wr.emitIfAndPop(disp.wasConnected.emit(wr), () => {
                            handler.callMe(wr, [], OpCall.BG_MAX1)
                        })
                    })
                return unit()
            }
            case "wait": {
                const role = this.roleOf(expr, val)
                if (!role.isCondition())
                    throwError(expr, "only condition()s have wait()")
                this.requireArgs(expr, 0)
                wr.emitStmt(Op.STMT1_WAIT_ROLE, role.emit(wr))
                return unit()
            }
            default:
                const v = this.emitRoleMember(expr.expression, val)
                const k = v.valueType.kind
                if (k == ValueKind.JD_CLIENT_COMMAND) {
                    this.ignore(val)
                    return this.emitProcCall(
                        expr,
                        this.getClientCommandProc(va(v).clientCommand),
                        true
                    )
                } else if (k == ValueKind.JD_COMMAND) {
                    const spec = v.valueType.packetSpec
                    this.emitPackArgs(expr, spec)
                    this.emitSendCommand(val, spec.identifier)
                } else if (k != ValueKind.ERROR) {
                    throwError(expr, `${v.valueType} cannot be called`)
                }
                return unit()
        }
    }

    private parseFormat(expr: Expr): NumFmt {
        const str = this.stringLiteral(expr) || ""
        const m = /^([uif])(\d+)(\.\d+)?$/.exec(str.trim())
        if (!m)
            throwError(
                expr,
                `format descriptor ("u32", "i22.10", etc) expected`
            )
        let sz = parseInt(m[2])
        let shift = 0
        if (m[3]) {
            shift = parseInt(m[3].slice(1))
            sz += shift
        }

        let r: NumFmt

        switch (sz) {
            case 8:
                r = NumFmt.U8
                break
            case 16:
                r = NumFmt.U16
                break
            case 32:
                r = NumFmt.U32
                break
            case 64:
                r = NumFmt.U64
                break
            default:
                throwError(
                    expr,
                    `total format size is not one of 8, 16, 32, 64 bits`
                )
        }

        switch (m[1]) {
            case "u":
                break
            case "i":
                r += NumFmt.I8
                break
            case "f":
                if (shift) throwError(expr, `shifts not supported for floats`)
                r += NumFmt.F8
                break
            default:
                assert(false)
        }

        if (r == NumFmt.F8 || r == NumFmt.F16)
            throwError(expr, `f8 and f16 are not supported`)

        return r | (shift << 4)
    }

    private nodeType(node: ts.Node) {
        return this.mapType(node, this.checker.getTypeAtLocation(node))
    }

    private emitGenericCall(expr: ts.CallExpression, fn: Value) {
        const wr = this.writer
        wr.emitCall(fn, ...this.emitArgs(expr.arguments.slice()))
        return this.retVal(this.nodeType(expr))
    }

    private emitMathCall(id: BuiltInString, ...args: Value[]) {
        const wr = this.writer
        wr.emitCall(wr.mathMember(id), ...args)
        return this.retVal(ValueType.NUMBER)
    }

    private emitGenericMethodCall(
        expr: ts.CallExpression,
        obj: Value,
        prop: string
    ) {
        const wr = this.writer
        const fn = wr.emitIndex(obj, wr.emitString(prop))
        return this.emitGenericCall(expr, fn)
    }

    private emitBufferCall(
        expr: ts.CallExpression,
        buf: Value,
        prop: string
    ): Value {
        const wr = this.writer
        if (!ts.isPropertyAccessExpression(expr.expression)) oops("")
        switch (prop) {
            case "getAt": {
                this.requireArgs(expr, 2)
                const fmt = this.parseFormat(expr.arguments[1])
                return wr.emitExpr(
                    Op.EXPR3_LOAD_BUFFER,
                    buf,
                    literal(fmt),
                    this.emitSimpleValue(expr.arguments[0])
                )
            }

            case "setAt": {
                this.requireArgs(expr, 3)
                const fmt = this.parseFormat(expr.arguments[1])
                const off = this.emitSimpleValue(expr.arguments[0])
                const val = this.emitSimpleValue(expr.arguments[2])
                wr.emitStmt(Op.STMT4_STORE_BUFFER, buf, literal(fmt), off, val)
                return unit()
            }

            case "setLength": {
                if (buf.op != Op.EXPR0_PKT_BUFFER)
                    throwError(
                        expr,
                        ".setLength() only supported on 'packet' buffer"
                    )
                this.requireArgs(expr, 1)
                const len = this.emitSimpleValue(expr.arguments[0])
                wr.emitStmt(Op.STMT1_SETUP_PKT_BUFFER, len)
                return unit()
            }

            default:
                return null
        }
    }

    private stringLiteral(expr: Expr) {
        if (this.isStringLiteral(expr)) return expr.text
        return undefined
    }

    private bufferLiteral(expr: Expr): Uint8Array {
        if (!expr) return undefined

        if (ts.isTaggedTemplateExpression(expr) && idName(expr.tag) == "hex") {
            if (!ts.isNoSubstitutionTemplateLiteral(expr.template))
                throwError(
                    expr,
                    "${}-expressions not supported in hex literals"
                )
            const hexbuf = expr.template.text.replace(/\s+/g, "").toLowerCase()
            if (hexbuf.length & 1) throwError(expr, "non-even hex length")
            if (!/^[0-9a-f]*$/.test(hexbuf))
                throwError(expr, "invalid characters in hex")
            return fromHex(hexbuf)
        }

        const cell = this.getCellAtLocation(expr)
        if (cell instanceof BufferLit) return cell.litValue

        return undefined
    }

    private forceStringLiteral(expr: Expr) {
        const v = this.stringLiteral(expr)
        if (v === undefined) throwError(expr, "string literal expected")
        return this.writer.emitString(v)
    }

    private fieldTypeToValueType(mem: jdspec.PacketMember) {
        switch (mem.type) {
            case "bytes":
            case "string":
            case "string0":
                return ValueType.BUFFER
            case "bool":
                return ValueType.BOOL
            default:
                return ValueType.NUMBER
        }
    }

    private bufferSize(v: Value) {
        const idx = v.args?.[0]?.numValue
        if (idx !== undefined)
            switch (v.op) {
                case Op.EXPRx_STATIC_BUFFER:
                    return this.bufferLiterals[idx].length
                case Op.EXPRx_STATIC_ASCII_STRING:
                    return this.asciiLiterals[idx].length
                case Op.EXPRx_STATIC_UTF8_STRING:
                    return strlen(this.utf8Literals[idx])
                case Op.EXPRx_STATIC_BUILTIN_STRING:
                    return BUILTIN_STRING__VAL[idx].length
            }
        return undefined
    }

    private emitStringOrBuffer(expr: Expr) {
        const stringLiteral = this.stringLiteral(expr)
        const wr = this.writer
        if (stringLiteral != undefined) {
            return wr.emitString(stringLiteral)
        } else {
            const buf = this.bufferLiteral(expr)
            if (buf) {
                return wr.emitString(buf)
            } else {
                throwError(expr, "expecting a string literal here")
            }
        }
    }

    private emitPackArgs(expr: ts.CallExpression, pspec: jdspec.PacketInfo) {
        let offset = 0
        let repeatsStart = -1
        let specIdx = 0
        const fields = pspec.fields

        if (
            expr.arguments.length == 1 &&
            this.nodeName(expr.arguments[0]) == "#ds.packet"
        )
            return

        const wr = this.writer
        const args = expr.arguments.map(arg => {
            if (specIdx >= fields.length) {
                if (repeatsStart != -1) specIdx = repeatsStart
                else throwError(arg, `too many arguments`)
            }
            const spec = pspec.fields[specIdx++]
            if (spec.startRepeats) repeatsStart = specIdx - 1
            let size = Math.abs(spec.storage)
            let stringLiteralVal: Value = undefined
            if (size == 0) {
                stringLiteralVal = this.emitStringOrBuffer(arg)
                size = this.bufferSize(stringLiteralVal)
                if (spec.type == "string0") size += 1
            }
            const val = stringLiteralVal
                ? null
                : this.emitSimpleValue(arg, this.fieldTypeToValueType(spec))
            const r = {
                stringLiteralVal,
                size,
                offset,
                spec,
                val,
            }
            offset += size
            return r
        })

        // this could be skipped - they will just be zero
        if (specIdx < fields.length) throwError(expr, "not enough arguments")

        if (offset > JD_SERIAL_MAX_PAYLOAD_SIZE)
            throwError(expr, "arguments do not fit in a packet")

        wr.allocBuf()
        wr.emitStmt(Op.STMT1_SETUP_PKT_BUFFER, literal(offset))
        for (const desc of args) {
            if (desc.stringLiteralVal !== undefined) {
                const vd = desc.stringLiteralVal
                wr.emitStmt(Op.STMT2_SET_PKT, vd, literal(desc.offset))
            } else {
                wr.emitBufStore(desc.val, bufferFmt(desc.spec), desc.offset)
            }
        }
        wr.freeBuf()
    }

    private isBufferField(field: jdspec.PacketMember) {
        return (
            field.type == "bytes" ||
            field.type == "string" ||
            field.type == "string0" ||
            field.storage == 0
        )
    }

    private emitRegisterCall(
        expr: ts.CallExpression,
        val: Value,
        prop: string
    ): Value {
        assert(val.valueType.kind == ValueKind.JD_REG)
        const spec = val.valueType.packetSpec
        const vobj = va(val)
        assertRange(0, spec.identifier, 0x1ff)

        switch (prop) {
            case "read":
                this.requireArgs(expr, 0)
                return this.emitRegGet(expr, val)
            case "write":
                this.emitPackArgs(expr, spec)
                this.emitSendCommand(
                    vobj.roleExpr,
                    spec.identifier | CMD_SET_REG
                )
                return unit()
            case "onChange": {
                if (spec.fields.length != 1)
                    throwError(
                        expr,
                        "structured registers not supported in onChange()"
                    )
                const fld = spec.fields[0]
                const noThreshold =
                    this.isBufferField(fld) || fld.type == "bool"
                const role = this.roleOf(expr.expression, val)
                this.requireArgs(expr, noThreshold ? 1 : 2)
                this.requireTopLevel(expr)
                const threshold = noThreshold
                    ? null
                    : this.forceNumberLiteral(expr.arguments[0])
                const name = role + "_chg_" + spec.name
                const handler = this.emitHandler(
                    name,
                    expr.arguments[noThreshold ? 0 : 1]
                )
                if (role.autoRefreshRegs.indexOf(spec) < 0)
                    role.autoRefreshRegs.push(spec)
                this.emitInRoleDispatcher(role, wr => {
                    const cache = this.proc.mkTempLocal(name, ValueType.NUMBER)
                    role.dispatcher.init.emit(wr => {
                        this.emitStore(cache, literal(NaN))
                    })
                    const cond = wr.emitExpr(
                        Op.EXPR2_EQ,
                        wr.emitExpr(Op.EXPR0_PKT_REG_GET_CODE),
                        literal(spec.identifier)
                    )
                    wr.emitIfAndPop(cond, () => {
                        // get the reg value from current packet
                        const curr = wr.cacheValue(
                            this.extractRegField(expr, spec, fld)
                        )
                        const skipHandler = wr.mkLabel("skipHandler")
                        // if (curr == undefined) goto skip (shouldn't really happen unless service is misbehaving)
                        wr.emitJumpIfTrue(
                            skipHandler,
                            wr.emitExpr(Op.EXPR1_IS_NULL, curr.emit())
                        )
                        // if (Math.abs(tmp-curr) < threshold) goto skip
                        // note that this also calls handler() if cache was NaN
                        if (threshold) {
                            const absval = wr.emitExpr(
                                Op.EXPR1_ABS,
                                wr.emitExpr(
                                    Op.EXPR2_SUB,
                                    cache.emit(wr),
                                    curr.emit()
                                )
                            )
                            wr.emitJumpIfTrue(
                                skipHandler,
                                wr.emitExpr(
                                    Op.EXPR2_LT,
                                    absval,
                                    literal(threshold)
                                )
                            )
                        } else {
                            wr.emitJumpIfTrue(
                                skipHandler,
                                wr.emitExpr(
                                    Op.EXPR2_EQ,
                                    cache.emit(wr),
                                    curr.emit()
                                )
                            )
                        }
                        // cache := curr
                        this.emitStore(cache, curr.emit())
                        curr.free()
                        // handler()
                        handler.callMe(wr, [], OpCall.BG_MAX1_PEND1)
                        // skip:
                        wr.emitLabel(skipHandler)
                    })
                })
                return unit()
            }
        }
        return null
    }

    private emitArgs(args: Expr[], formals?: Variable[]) {
        const wr = this.writer
        return args.map((arg, i) => {
            let tp = ValueType.ANY
            const f = formals?.[i]
            if (f) tp = f.valueType
            return this.emitSimpleValue(arg, tp)
        })
    }

    private forceNumberLiteral(expr: Expr) {
        const tmp = this.emitExpr(expr)
        if (!tmp.isLiteral) throwError(expr, "number literal expected")
        return tmp.numValue
    }

    private finalizeCloudMethods() {
        if (!this.cloudMethodDispatcher) return
        this.emitInRoleDispatcher(this.cloudRole, wr => {
            const skipMethods = wr.mkLabel("skipMethods")
            const cond = wr.emitExpr(
                Op.EXPR2_EQ,
                wr.emitExpr(Op.EXPR0_PKT_EV_CODE),
                literal(CloudAdapterEvent.CloudCommand)
            )
            wr.emitJump(skipMethods, cond)

            this.cloudMethodDispatcher.finalizeRaw()
            this.emitAckCloud(CloudAdapterCommandStatus.NotFound, true)
            wr.emitJump(this.cloudRole.dispatcher.top)

            wr.emitLabel(this.cloudMethod429)
            this.emitAckCloud(CloudAdapterCommandStatus.Busy, true)
            wr.emitJump(this.cloudRole.dispatcher.top)

            wr.emitLabel(skipMethods)
        })
    }

    private emitCloudMethod(expr: ts.CallExpression) {
        this.requireTopLevel(expr)
        this.requireArgs(expr, 2)
        const str = this.forceStringLiteral(expr.arguments[0])
        const handler = this.emitHandler(
            this.codeName(expr.expression),
            expr.arguments[1],
            { methodHandler: true }
        )
        if (!this.cloudMethodDispatcher) {
            this.emitInRoleDispatcher(this.cloudRole, wr => {
                this.cloudMethod429 = wr.mkLabel("cloud429")
            })
            this.cloudMethodDispatcher = new DelayedCodeSection(
                "cloud_method",
                this.cloudRole.dispatcher.proc.writer
            )
        }

        this.cloudMethodDispatcher.emit(wr => {
            const skip = wr.mkLabel("skipMethod")
            wr.emitJump(skip, wr.emitExpr(Op.EXPR2_STR0EQ, str, literal(4)))
            wr.emitJumpIfTrue(
                this.cloudMethod429,
                wr.emitExpr(Op.EXPR1_GET_FIBER_HANDLE, handler.reference(wr))
            )
            const pref = 4 + strlen(this.stringLiteral(expr.arguments[0])) + 1
            const args = range(handler.numargs).map(i =>
                i == 0
                    ? wr.emitBufLoad(NumFmt.U32, 0)
                    : wr.emitBufLoad(NumFmt.F64, pref + (i - 1) * 8)
            )
            handler.callMe(wr, args, OpCall.BG_MAX1)
            wr.emitJump(this.cloudRole.dispatcher.top)
            wr.emitLabel(skip)
        })
    }

    private emitSendCommand(role: Value | Role, cmd: number) {
        if (role instanceof Role) role = role.emit(this.writer)
        this.writer.emitStmt(Op.STMT2_SEND_CMD, role, literal(cmd))
    }

    private isStringLike(expr: ts.Expression) {
        return !!(
            this.checker.getTypeAtLocation(expr).getFlags() &
            ts.TypeFlags.StringLike
        )
    }

    private flattenPlus(arg: ts.Expression): Expr[] {
        if (!this.isStringLike(arg)) return [arg]

        if (
            ts.isBinaryExpression(arg) &&
            arg.operatorToken.kind == SK.PlusToken
        ) {
            return this.flattenPlus(arg.left).concat(
                this.flattenPlus(arg.right)
            )
        } else if (ts.isTemplateExpression(arg)) {
            const r: Expr[] = []
            if (arg.head.text) r.push(arg.head)
            for (const span of arg.templateSpans) {
                r.push(span.expression)
                if (span.literal.text) r.push(span.literal)
            }
            return r
        } else {
            return [arg]
        }
    }

    private emitCloud(expr: ts.CallExpression, fnName: string): Value {
        const wr = this.writer
        switch (fnName) {
            case "ds.CloudConnector.upload":
                const spec = this.cloudRole.spec.packets.find(
                    p => p.name == "upload"
                )
                this.emitPackArgs(expr, spec)
                this.emitSendCommand(this.cloudRole, spec.identifier)
                return unit()
            case "ds.CloudConnector.onMethod":
                this.emitCloudMethod(expr)
                return unit()
            case "console.log":
                wr.emitCall(
                    wr.dsMember(BuiltInString.LOG),
                    this.compileFormat(expr.arguments.slice())
                )
                return unit()
            case "Date.now":
                return wr.emitExpr(Op.EXPR0_NOW_MS)
            default:
                return null
        }
    }

    private compileFormat(args: ts.Expression[]) {
        let fmt = ""
        const fmtargs: Expr[] = []
        const strval = (n: number) => {
            if (n <= 9) return "" + n
            return String.fromCharCode(0x61 + n - 9)
        }
        const pushArg = (arg: Expr) => {
            const str = this.stringLiteral(arg)
            if (str) {
                fmt += str.replace(/\{/g, "{{")
            } else {
                fmt += `{${strval(fmtargs.length)}}`
                fmtargs.push(arg)
            }
        }

        for (const arg of args) {
            if (fmt && !/[=:]$/.test(fmt)) fmt += " "
            const flat = this.flattenPlus(arg)
            if (flat.some(f => this.stringLiteral(f) != null)) {
                flat.forEach(pushArg)
            } else {
                pushArg(arg)
            }
        }

        const wr = this.writer
        wr.emitCall(
            wr.dsMember(BuiltInString.FORMAT),
            wr.emitString(fmt),
            ...this.emitArgs(fmtargs)
        )
        return this.retVal(ValueType.STRING)
    }

    private retVal(tp: ValueType) {
        if (tp.kind == ValueKind.VOID) return unit()
        return this.writer.emitExpr(Op.EXPR0_RET_VAL).withType(tp)
    }

    private emitProcCall(
        expr: ts.CallExpression,
        proc: Procedure,
        isMember = false
    ) {
        const wr = this.writer
        const args = expr.arguments.slice()
        proc.useFrom(expr)
        if (isMember) {
            // this.requireArgs(expr, proc.numargs - 1)
            if (ts.isPropertyAccessExpression(expr.expression))
                args.unshift(expr.expression.expression)
            else assert(false)
        } else {
            // this.requireArgs(expr, proc.numargs)
        }
        const cargs = this.emitArgs(args, proc.args())
        proc.callMe(wr, cargs)
        if (proc.retType.kind == ValueKind.VOID) return unit()
        return this.retVal(proc.retType)
    }

    private symName(sym: ts.Symbol) {
        if (!sym) return null
        if (sym.flags & ts.SymbolFlags.Alias)
            sym = this.checker.getAliasedSymbol(sym)
        let r = this.checker.getFullyQualifiedName(sym)
        if (r && r.startsWith(`"${coreModule}"`))
            return "#ds." + r.slice(coreModule.length + 3)
        else {
            const d = sym.getDeclarations()?.[0]
            if (d && this.prelude.hasOwnProperty(d.getSourceFile().fileName)) {
                r = r.replace(/^global\./, "")
                if (
                    ts.isSourceFile(d.parent) ||
                    ts.isModuleBlock(d.parent) ||
                    (ts.isInterfaceDeclaration(d.parent) &&
                        ts.isSourceFile(d.parent.parent)) ||
                    (ts.isVariableDeclarationList(d.parent) &&
                        ts.isSourceFile(d.parent.parent.parent))
                )
                    return "#" + r
                // console.log(SK[d.parent.kind], d.parent.kind, r)
                return r
            }
        }
        return r
    }

    private nodeName(node: ts.Node) {
        switch (node.kind) {
            case SK.NumberKeyword:
                return "#number"
            case SK.BooleanKeyword:
                return "#boolean"
        }
        const sym = this.checker.getSymbolAtLocation(node)
        const r = this.symName(sym)
        if (["#parseInt", "#parseFloat"].indexOf(r) >= 0)
            return "#ds." + r.slice(1)
        // if (!r) console.log(node.kind, r)
        return r
    }

    private emitBuiltInCall(expr: ts.CallExpression, funName: string): Value {
        const wr = this.writer
        switch (funName) {
            case "isNaN": {
                this.requireArgs(expr, 1)
                return wr.emitExpr(
                    Op.EXPR1_IS_NAN,
                    this.emitSimpleValue(expr.arguments[0])
                )
            }
            case "ds.every": {
                this.requireTopLevel(expr)
                this.requireArgs(expr, 2)
                const time = Math.round(
                    this.forceNumberLiteral(expr.arguments[0]) * 1000
                )
                if (time < 20)
                    throwError(expr, "minimum every() period is 0.02s (20ms)")
                const proc = this.emitHandler("every", expr.arguments[1], {
                    every: time,
                })
                proc.callMe(wr, [], OpCall.BG)
                return unit()
            }
            case "ds.onStart": {
                this.requireTopLevel(expr)
                this.requireArgs(expr, 1)
                const proc = this.emitHandler("onStart", expr.arguments[0])
                this.onStart.emit(wr => proc.callMe(wr, []))
                return unit()
            }
            default:
                return null
        }
    }

    private getMonkeyPatchProc(mp: MonkeyPatch | FunctionDecl) {
        if (mp instanceof FunctionDecl) {
            return this.getFunctionProc(mp)
        }

        if (mp.proc) return mp.proc

        const stmt = mp.defintion
        mp.proc = new Procedure(this, mp.name, stmt)

        return this.emitFunction(stmt, mp.proc)
    }

    private emitCallExpression(expr: ts.CallExpression): Value {
        const callName = this.nodeName(expr.expression)
        const builtInName =
            callName && callName.startsWith("#") ? callName.slice(1) : null

        if (builtInName) {
            const r = this.emitCloud(expr, builtInName)
            if (r) return r

            const d = this.monkeyPatch[callName]
            if (d) return this.emitProcCall(expr, this.getMonkeyPatchProc(d))

            const builtIn = this.emitBuiltInCall(expr, builtInName)
            if (builtIn) return builtIn
        }

        if (ts.isPropertyAccessExpression(expr.expression)) {
            const prop = idName(expr.expression.name)
            const val = this.emitExpr(expr.expression.expression)
            const callRes = (() => {
                switch (val.valueType.kind) {
                    case ValueKind.JD_EVENT:
                        return this.emitEventCall(expr, val, prop)
                    case ValueKind.JD_REG:
                        return this.emitRegisterCall(expr, val, prop)
                    case ValueKind.BUFFER:
                        return this.emitBufferCall(expr, val, prop)
                    case ValueKind.ROLE:
                        return this.emitRoleCall(expr, val, prop)
                    default:
                        return null
                }
            })()
            if (callRes) return callRes
            else return this.emitGenericMethodCall(expr, val, prop)
        }

        const fn = this.emitExpr(expr.expression)
        return this.emitGenericCall(expr, fn)
    }

    private getSymAtLocation(node: ts.Node) {
        let sym = this.checker.getSymbolAtLocation(node)
        if (!sym) {
            const decl = node as ts.NamedDeclaration
            if (decl.name) sym = this.checker.getSymbolAtLocation(decl.name)
        }
        return sym
    }

    private getCellAtLocation(node: ts.Node) {
        let sym: ts.Symbol
        if (node?.parent?.kind == SK.ShorthandPropertyAssignment)
            sym = this.checker.getShorthandAssignmentValueSymbol(node.parent)
        else sym = this.getSymAtLocation(node)
        return symCell(sym)
    }

    private getClosureLevel(variable: Variable) {
        if (variable.vkind == VariableKind.Global) return 0
        assert(!!variable.parentProc)
        let lev = 0
        let ptr = this.proc
        while (ptr && ptr != variable.parentProc) {
            lev++
            ptr = ptr.parentProc
        }
        assert(ptr != null)
        if (lev > 0) this.proc.usesClosure = true
        return lev
    }

    private emitIdentifier(expr: ts.Identifier): Value {
        const r = this.emitBuiltInConst(expr)
        if (r) return r
        const cell = this.getCellAtLocation(expr)
        if (!cell) throwError(expr, "unknown name: " + idName(expr))
        if (cell instanceof Variable)
            return cell.emitViaClosure(this.writer, this.getClosureLevel(cell))
        return cell.emit(this.writer)
    }

    private emitThisExpression(expr: ts.ThisExpression): Value {
        const cell = this.proc.params.lookup("this")
        if (!cell)
            throwError(expr, "'this' cannot be used here: " + this.proc.name)
        return cell.emit(this.writer)
    }

    private matchesSpecName(pi: jdspec.PacketInfo, id: string) {
        return matchesName(pi.name, id)
    }

    private emitRoleMember(expr: ts.PropertyAccessExpression, roleObj: Value) {
        const propName = this.forceName(expr.name)
        let r: Value
        let v: ValueAdd

        assert(roleObj.valueType.isRole)

        if (propName == "isConnected")
            return this.writer.builtInMember(roleObj, BuiltInString.ISCONNECTED)

        const roleSpec = roleObj.valueType.roleSpec

        const setKind = (p: jdspec.PacketInfo, kind: ValueKind) => {
            assert(!r)
            r = nonEmittable(new ValueType(kind, roleSpec, p))
            v = va(r)
            v.index = p.identifier
            v.roleExpr = roleObj
        }

        for (const cmd of this.clientCommands[roleSpec.camelName] ?? []) {
            if (this.matchesSpecName(cmd.pktSpec, propName)) {
                setKind(cmd.pktSpec, ValueKind.JD_CLIENT_COMMAND)
                v.clientCommand = cmd
                return r
            }
        }

        for (const p of roleSpec.packets) {
            if (this.matchesSpecName(p, propName)) {
                if (isRegister(p)) {
                    setKind(p, ValueKind.JD_REG)
                }
                if (isEvent(p)) {
                    setKind(p, ValueKind.JD_EVENT)
                }
                if (isCommand(p)) {
                    setKind(p, ValueKind.JD_COMMAND)
                }
            }
        }

        const packetSpec = r?.valueType?.packetSpec

        if (packetSpec?.client)
            throwError(
                expr,
                `client packet '${packetSpec.name}' not implemented on ${roleSpec.camelName}`
            )

        if (!r)
            throwError(
                expr,
                `service ${roleSpec.camelName} has no member ${propName}`
            )
        return r

        function isRegister(pi: jdspec.PacketInfo) {
            return pi.kind == "ro" || pi.kind == "rw" || pi.kind == "const"
        }

        function isEvent(pi: jdspec.PacketInfo) {
            return pi.kind == "event"
        }

        function isCommand(pi: jdspec.PacketInfo) {
            return pi.kind == "command"
        }
    }

    private emitElementAccessExpression(
        expr: ts.ElementAccessExpression
    ): Value {
        const val = this.emitExpr(expr.expression)
        const idx = this.emitSimpleValue(expr.argumentExpression)
        return this.writer.emitExpr(Op.EXPR2_INDEX, val, idx)
    }

    private emitBuiltInConst(expr: ts.Expression, nodeName?: string) {
        if (!nodeName) nodeName = this.nodeName(expr)
        if (!nodeName) return null
        switch (nodeName) {
            case "#ds.packet":
                return this.writer.emitExpr(Op.EXPR0_PKT_BUFFER)
            case "#NaN":
                return this.emitLiteral(NaN)
            case "#Infinity":
                return this.emitLiteral(Infinity)
            case "undefined":
                return this.emitLiteral(undefined)
            default:
                if (builtInObjByName.hasOwnProperty(nodeName))
                    return this.writer.emitBuiltInObject(
                        builtInObjByName[nodeName]
                    )
                // console.log("N", nodeName)
                if (nodeName.startsWith("#ds.")) {
                    const idx = BUILTIN_STRING__VAL.indexOf(nodeName.slice(4))
                    if (idx >= 0) return this.writer.dsMember(idx)
                }
                return null
        }
    }

    private emitPropertyAccessExpression(
        expr: ts.PropertyAccessExpression
    ): Value {
        const r = this.emitBuiltInConst(expr)
        if (r) return r

        const nsName = this.nodeName(expr.expression)
        if (nsName == "#Math") {
            const id = idName(expr.name)
            if (mathConst.hasOwnProperty(id)) return literal(mathConst[id])
        } else if (this.enums.hasOwnProperty(nsName)) {
            const e = this.enums[nsName]
            const prop = idName(expr.name)
            if (e.members.hasOwnProperty(prop)) return literal(e.members[prop])
            else throwError(expr, `enum ${nsName} has no member ${prop}`)
        }

        const val = this.emitExpr(expr.expression)

        if (val.valueType.isRole) {
            return this.emitRoleMember(expr, val)
        } else if (val.valueType.kind == ValueKind.JD_REG) {
            const spec = val.valueType.packetSpec
            const propName = this.forceName(expr.name)
            if (spec.fields.length > 1) {
                const fld = spec.fields.find(f => matchesName(f.name, propName))
                if (!fld)
                    throwError(expr, `no field ${propName} in ${spec.name}`)
                return this.emitRegGet(expr, val, undefined, fld)
            } else {
                throwError(expr, `unhandled member ${propName}; use .read()`)
            }
        } else {
            return this.writer.emitIndex(
                val,
                this.writer.emitString(this.forceName(expr.name))
            )
        }
    }

    private isStringLiteral(node: ts.Node): node is ts.LiteralExpression {
        switch (node.kind) {
            case SK.TemplateHead:
            case SK.TemplateMiddle:
            case SK.TemplateTail:
            case SK.StringLiteral:
            case SK.NoSubstitutionTemplateLiteral:
                return true
            default:
                return false
        }
    }

    private emitLiteral(v: any, node?: ts.Node) {
        if (
            v === null ||
            v === undefined ||
            typeof v == "number" ||
            typeof v == "boolean"
        )
            return literal(v)

        if (typeof v == "string") return this.writer.emitString(v)

        throwError(node, "unhandled literal: " + v)
    }

    private emitLiteralExpression(node: ts.LiteralExpression): Value {
        const wr = this.writer

        if (node.kind == SK.NumericLiteral) {
            const parsed = parseFloat(node.text)
            return this.emitLiteral(parsed)
        } else if (this.isStringLiteral(node)) {
            return wr.emitString(node.text)
        } else {
            throwError(node, "whoops")
        }
    }

    private emitTemplateExpression(node: ts.TemplateExpression): Value {
        return this.compileFormat([node])
    }

    private lookupVar(expr: ts.Expression) {
        const r = this.getCellAtLocation(expr)
        if (!(r instanceof Variable)) throwError(expr, "expecting variable")
        return r
    }

    private emitSimpleValue(expr: Expr, tp = ValueType.NUMBER): Value {
        const val = this.emitExpr(expr)
        this.requireValueType(expr, val, tp)
        return val
    }

    private isBoolLike(tp: ValueType) {
        switch (tp.kind) {
            case ValueKind.ANY:
            case ValueKind.NUMBER:
            case ValueKind.NULL:
            case ValueKind.BOOL:
            case ValueKind.BUFFER:
            case ValueKind.STRING:
            case ValueKind.MAP:
            case ValueKind.ARRAY:
            case ValueKind.FIBER:
            case ValueKind.ROLE:
            case ValueKind.FUNCTION:
                return true
            default:
                return false
        }
    }

    private isSimpleValue(tp: ValueType) {
        return this.isBoolLike(tp)
    }

    private requireValueType(node: ts.Node, v: Value, reqTp: ValueType) {
        if (reqTp == ValueType.BOOL && this.isBoolLike(v.valueType)) return
        if (reqTp == ValueType.ANY && this.isSimpleValue(v.valueType)) return
        if (v.valueType == ValueType.ANY || v.valueType == ValueType.NULL)
            return
        // if (!v.valueType.equals(reqTp))
        //    throwError(node, `cannot convert ${v.valueType} to ${reqTp}`)
    }

    private emitPrototypeUpdate(expr: ts.BinaryExpression): Value {
        const left = expr.left

        if (!ts.isPropertyAccessExpression(left)) return null

        let classExpr = left.expression
        if (
            ts.isPropertyAccessExpression(classExpr) &&
            idName(classExpr.name) == "prototype"
        )
            classExpr = classExpr.expression

        const className = this.nodeName(classExpr)

        // allow more stuff in future
        const isMonkeyPatch = className == "#Math"
        const spec = isMonkeyPatch
            ? null
            : this.specFromTypeName(classExpr, this.nodeName(classExpr), true)

        if (!isMonkeyPatch && !spec) return

        const fnName = this.forceName(left.name)
        if (!ts.isFunctionExpression(expr.right))
            throwError(expr.right, "expecting 'function (...) { }' here")

        if (isMonkeyPatch) {
            const id = className + "." + fnName
            const mp = new MonkeyPatch(expr.right, fnName)
            this.monkeyPatch[id] = mp
            if (this.compileAll || (this.isLibrary && this.inMainFile(expr)))
                this.getMonkeyPatchProc(mp)
            return unit()
        }

        const cmd = new ClientCommand(spec)
        cmd.defintion = expr.right
        cmd.jsName = fnName

        const fn = expr.right
        cmd.pktSpec = spec.packets.filter(
            p => p.kind == "command" && matchesName(p.name, fnName)
        )[0]
        const paramNames = fn.parameters.map(p => this.forceName(p.name))
        if (cmd.pktSpec) {
            if (!cmd.pktSpec.client)
                throwError(left, "only 'client' commands can be implemented")
            const flds = cmd.pktSpec.fields
            if (paramNames.length != flds.length)
                throwError(
                    fn,
                    `expecting ${flds.length} parameter(s); got ${paramNames.length}`
                )
            for (let i = 0; i < flds.length; ++i) {
                const f = flds[i]
                if (f.storage == 0)
                    throwError(
                        fn,
                        `client command has non-numeric parameter ${f.name}`
                    )
                if (
                    paramNames.findIndex(
                        p => p == f.name || matchesName(f.name, p)
                    ) != i
                )
                    throwError(fn, `parameter ${f.name} found at wrong index`)
            }
        } else {
            cmd.pktSpec = {
                kind: "command",
                description: "",
                client: true,
                identifier: 0x10000 + Object.keys(this.clientCommands).length,
                name: snakify(fnName),
                fields: fn.parameters.map(p => ({
                    name: this.forceName(p.name),
                    type: "f64",
                    storage: 8,
                })),
            }
            cmd.isFresh = true
            if (spec.packets.some(p => p.name == cmd.pktSpec.name))
                throwError(
                    expr.left,
                    `'${cmd.pktSpec.name}' already exists on ${spec.camelName}`
                )
        }

        let lst = this.clientCommands[spec.camelName]
        if (!lst) lst = this.clientCommands[spec.camelName] = []
        if (lst.some(e => e.pktSpec.name == cmd.pktSpec.name))
            throwError(
                expr.left,
                `${cmd.pktSpec.name} already implemented on ${spec.camelName}`
            )
        lst.push(cmd)

        if (this.compileAll || (this.isLibrary && this.inMainFile(expr)))
            this.getClientCommandProc(cmd)

        return unit()
    }

    private emitAssignmentTarget(trg: Expr) {
        const wr = this.writer
        const r = this.tryEmitIndex(trg)
        if (r) {
            const obj = wr.cacheValue(r.obj)
            const idx = wr.cacheValue(r.idx)

            return {
                read: () => wr.emitIndex(obj.emit(), idx.emit()),
                write: (src: Value) =>
                    wr.emitStmt(
                        Op.STMT3_INDEX_SET,
                        obj.emit(),
                        idx.emit(),
                        src
                    ),
                free: () => {
                    obj.free()
                    idx.free()
                },
            }
        }

        if (ts.isIdentifier(trg)) {
            const variable = this.lookupVar(trg)
            return {
                read: () => variable.emit(wr),
                write: (src: Value) => this.emitStore(variable, src),
                free: () => {},
            }
        }

        throwError(trg, "unsupported assignment target")
    }

    private emitAssignmentExpression(expr: ts.BinaryExpression): Value {
        this.forceAssignmentIgnored(expr)

        const res = this.emitPrototypeUpdate(expr)
        if (res) return res

        const wr = this.writer
        let left = expr.left

        const r = this.tryEmitIndex(left)
        if (r) {
            const src = this.emitExpr(expr.right) // compute src after left.property
            wr.emitStmt(Op.STMT3_INDEX_SET, r.obj, r.idx, src)
            return unit()
        }

        const src = this.emitExpr(expr.right)
        if (ts.isArrayLiteralExpression(left)) {
            if (src.valueType.kind == ValueKind.JD_VALUE_SEQ) {
                let off = 0
                const spec = src.valueType.packetSpec
                for (let i = 0; i < left.elements.length; ++i) {
                    const pat = left.elements[i]
                    const f = spec.fields[i]
                    if (!f) throwError(pat, `not enough fields in ${spec.name}`)
                    const e = this.loadFieldAt(expr.right, f, off)
                    off += Math.abs(f.storage)
                    this.emitStore(this.lookupVar(pat), e)
                }
            } else {
                throwError(expr, "expecting a multi-field register read")
            }
            return unit()
        } else if (ts.isIdentifier(left)) {
            const v = this.lookupVar(left)
            this.requireValueType(expr.right, src, v.valueType)
            this.emitStore(v, src)
            return unit()
        }

        throwError(expr, "unhandled assignment")
    }

    private forceAssignmentIgnored(expr: Expr) {
        if (!this.isIgnored(expr))
            throwError(
                expr,
                "the value of assignment expression has to be ignored"
            )
    }

    private emitBinaryExpression(expr: ts.BinaryExpression): Value {
        const simpleOps: SMap<Op> = {
            [SK.PlusToken]: Op.EXPR2_ADD,
            [SK.MinusToken]: Op.EXPR2_SUB,
            [SK.SlashToken]: Op.EXPR2_DIV,
            [SK.AsteriskToken]: Op.EXPR2_MUL,
            [SK.LessThanToken]: Op.EXPR2_LT,
            [SK.BarToken]: Op.EXPR2_BIT_OR,
            [SK.AmpersandToken]: Op.EXPR2_BIT_AND,
            [SK.CaretToken]: Op.EXPR2_BIT_XOR,
            [SK.LessThanLessThanToken]: Op.EXPR2_SHIFT_LEFT,
            [SK.GreaterThanGreaterThanToken]: Op.EXPR2_SHIFT_RIGHT,
            [SK.GreaterThanGreaterThanGreaterThanToken]:
                Op.EXPR2_SHIFT_RIGHT_UNSIGNED,
            [SK.LessThanEqualsToken]: Op.EXPR2_LE,
            [SK.EqualsEqualsToken]: Op.EXPR2_EQ,
            [SK.EqualsEqualsEqualsToken]: Op.EXPR2_EQ,
            [SK.ExclamationEqualsToken]: Op.EXPR2_NE,
            [SK.ExclamationEqualsEqualsToken]: Op.EXPR2_NE,
        }

        function stripEquals(k: SK) {
            switch (k) {
                case SK.PlusEqualsToken:
                    return SK.PlusToken
                case SK.MinusEqualsToken:
                    return SK.MinusToken
                case SK.AsteriskEqualsToken:
                    return SK.AsteriskToken
                case SK.AsteriskAsteriskEqualsToken:
                    return SK.AsteriskAsteriskToken
                case SK.SlashEqualsToken:
                    return SK.SlashToken
                case SK.PercentEqualsToken:
                    return SK.PercentToken
                case SK.LessThanLessThanEqualsToken:
                    return SK.LessThanLessThanToken
                case SK.GreaterThanGreaterThanEqualsToken:
                    return SK.GreaterThanGreaterThanToken
                case SK.GreaterThanGreaterThanGreaterThanEqualsToken:
                    return SK.GreaterThanGreaterThanGreaterThanToken
                case SK.AmpersandEqualsToken:
                    return SK.AmpersandToken
                case SK.BarEqualsToken:
                    return SK.BarToken
                case SK.CaretEqualsToken:
                    return SK.CaretToken
                default:
                    return null
            }
        }

        let op = expr.operatorToken.kind

        if (op == SK.EqualsToken) return this.emitAssignmentExpression(expr)

        if (op == SK.CommaToken) {
            this.ignore(this.emitExpr(expr.left))
            return this.emitSimpleValue(expr.right, ValueType.ANY)
        }

        let swap = false
        if (op == SK.GreaterThanToken) {
            op = SK.LessThanToken
            swap = true
        }
        if (op == SK.GreaterThanEqualsToken) {
            op = SK.LessThanEqualsToken
            swap = true
        }

        const wr = this.writer

        if (op == SK.AmpersandAmpersandToken || op == SK.BarBarToken) {
            const a = this.emitSimpleValue(expr.left, ValueType.BOOL)
            const tmp = wr.cacheValue(a, true)
            const tst = wr.emitExpr(
                op == SK.AmpersandAmpersandToken
                    ? Op.EXPR1_TO_BOOL
                    : Op.EXPR1_NOT,
                tmp.emit()
            )
            const skipB = wr.mkLabel("lazyB")
            wr.emitJump(skipB, tst)
            tmp.store(this.emitSimpleValue(expr.right, ValueType.BOOL))
            wr.emitLabel(skipB)

            return tmp.finalEmit()
        }

        const emitBin = (op: SK, a: Value, b: Value) => {
            if (op == SK.AsteriskAsteriskToken)
                return this.emitMathCall(BuiltInString.POW, a, b)
            if (op == SK.PercentToken)
                return this.emitMathCall(BuiltInString.IMOD, a, b)

            const op2 = simpleOps[op]
            if (op2 === undefined) throwError(expr, "unhandled operator")

            const res = wr.emitExpr(op2, a, b)
            if (op2 == Op.EXPR2_ADD && this.isStringLike(expr))
                res.valueType = ValueType.STRING
            return res
        }

        if (stripEquals(op) != null) {
            op = stripEquals(op)
            const t = this.emitAssignmentTarget(expr.left)
            const other = this.emitSimpleValue(expr.right, ValueType.ANY)
            this.forceAssignmentIgnored(expr)
            const r = emitBin(op, t.read(), other)
            t.write(r)
            t.free()
            return unit()
        }

        const op2 = simpleOps[op]

        let dstTp = ValueType.NUMBER
        if (op2 == Op.EXPR2_EQ || op2 == Op.EXPR2_NE || op2 == Op.EXPR2_ADD)
            dstTp = ValueType.ANY

        let a = this.emitSimpleValue(expr.left, dstTp)
        let b = this.emitSimpleValue(expr.right, dstTp)
        if (swap) [a, b] = [b, a]

        return emitBin(op, a, b)
    }

    private mapPostfixOp(k: SK) {
        if (k == SK.PlusPlusToken) return Op.EXPR2_ADD
        if (k == SK.MinusMinusToken) return Op.EXPR2_SUB
        return null
    }

    private emitUnaryExpression(expr: ts.PrefixUnaryExpression): Value {
        const wr = this.writer
        const simpleOps: SMap<Op> = {
            [SK.ExclamationToken]: Op.EXPR1_NOT,
            [SK.MinusToken]: Op.EXPR1_NEG,
            [SK.PlusToken]: Op.EXPR1_UPLUS,
            [SK.TildeToken]: Op.EXPR1_BIT_NOT,
        }

        let arg = expr.operand

        const updateOp = this.mapPostfixOp(expr.operator)
        if (updateOp) {
            const t = this.emitAssignmentTarget(expr.operand)
            t.write(wr.emitExpr(updateOp, t.read(), literal(1)))
            const r = t.read()
            t.free()
            return r
        }

        let op = simpleOps[expr.operator]
        if (op === undefined) throwError(expr, "unhandled operator")

        if (
            expr.operator == SK.ExclamationToken &&
            ts.isPrefixUnaryExpression(arg) &&
            arg.operator == SK.ExclamationToken
        ) {
            op = Op.EXPR1_TO_BOOL
            arg = arg.operand
        }

        const a = this.emitSimpleValue(
            arg,
            op == Op.EXPR1_NOT ? ValueType.BOOL : ValueType.NUMBER
        )
        return wr.emitExpr(op, a)
    }

    private emitArrayExpression(expr: ts.ArrayLiteralExpression): Value {
        const wr = this.writer
        const sz = expr.elements.length
        wr.emitStmt(Op.STMT1_ALLOC_ARRAY, literal(sz))
        const arr = wr.emitExpr(Op.EXPR0_RET_VAL)
        if (sz == 0) {
            arr.valueType = ValueType.ARRAY
            return arr
        }
        const ref = wr.cacheValue(arr)
        for (let i = 0; i < sz; ++i) {
            wr.emitStmt(
                Op.STMT3_INDEX_SET,
                ref.emit(),
                literal(i),
                this.emitSimpleValue(expr.elements[i], ValueType.ANY)
            )
        }
        return ref.finalEmit(ValueType.ARRAY)
    }

    private tryEmitIndex(expr: Expr) {
        const wr = this.writer
        if (
            ts.isElementAccessExpression(expr) ||
            ts.isPropertyAccessExpression(expr)
        ) {
            const obj = this.emitExpr(expr.expression)
            const idx = ts.isPropertyAccessExpression(expr)
                ? wr.emitString(this.forceName(expr.name))
                : this.emitSimpleValue(expr.argumentExpression, ValueType.ANY)
            return { obj, idx }
        }
        return null
    }

    private emitDeleteExpression(expr: ts.DeleteExpression): Value {
        const wr = this.writer
        const r = this.tryEmitIndex(expr.expression)
        if (!r) throwError(expr, "unsupported delete")
        wr.emitStmt(Op.STMT2_INDEX_DELETE, r.obj, r.idx)
        return this.retVal(ValueType.BOOL)
    }

    private emitPostfixUnaryExpression(expr: ts.PostfixUnaryExpression): Value {
        const wr = this.writer
        const t = this.emitAssignmentTarget(expr.operand)
        const op = this.mapPostfixOp(expr.operator)
        assert(op != null)
        if (this.isIgnored(expr)) {
            t.write(wr.emitExpr(op, t.read(), literal(1)))
            t.free()
            return unit()
        } else {
            const cached = wr.cacheValue(t.read())
            assert(cached.isCached)
            t.write(wr.emitExpr(op, cached.emit(), literal(1)))
            t.free()
            return cached.finalEmit()
        }
    }

    private emitConditionalExpression(expr: ts.ConditionalExpression): Value {
        const wr = this.writer
        const cond = this.emitSimpleValue(expr.condition, ValueType.BOOL)
        if (this.valueIsAlwaysFalse(cond)) {
            return this.emitExpr(expr.whenFalse)
        } else if (this.valueIsAlwaysTrue(cond)) {
            return this.emitExpr(expr.whenTrue)
        } else {
            const lblElse = wr.mkLabel("condElse")
            const lblEnd = wr.mkLabel("condEnd")
            wr.emitJump(lblElse, cond)
            const tmp = wr.cacheValue(this.emitExpr(expr.whenTrue), true)
            wr.emitJump(lblEnd)
            wr.emitLabel(lblElse)
            tmp.store(this.emitExpr(expr.whenFalse))
            wr.emitLabel(lblEnd)
            return tmp.finalEmit()
        }
    }

    private emitFunctionExpr(
        expr: ts.ArrowFunction | ts.FunctionExpression | ts.FunctionDeclaration
    ): Value {
        const wr = this.writer
        const n = (expr.name ? idName(expr.name) : null) || "inline"

        const proc = new Procedure(this, n, expr)
        this.proc.addNestedProc(proc)

        return proc.referenceAsClosure(wr)
    }

    private emitObjectExpression(expr: ts.ObjectLiteralExpression): Value {
        const wr = this.writer
        wr.emitStmt(Op.STMT0_ALLOC_MAP)
        const ret = this.retVal(ValueType.MAP)
        if (expr.properties.length == 0) return ret

        const arr = wr.cacheValue(ret)
        for (const p of expr.properties) {
            let expr: Expr
            if (ts.isPropertyAssignment(p)) {
                expr = p.initializer
            } else if (
                ts.isShorthandPropertyAssignment(p) &&
                !p.objectAssignmentInitializer
            ) {
                expr = p.name
            } else if (ts.isSpreadAssignment(p) && !p.name) {
                wr.emitCall(
                    wr.objectMember(BuiltInString.ASSIGN),
                    arr.emit(),
                    this.emitExpr(p.expression)
                )
                continue
            } else {
                throwError(p, `unsupported initializer ${SK[p.kind]}`)
            }
            const fld = wr.emitString(this.forceName(p.name))
            const init = this.emitExpr(expr)
            wr.emitStmt(Op.STMT3_INDEX_SET, arr.emit(), fld, init)
        }

        return arr.finalEmit()
    }

    private emitExpr(expr: Expr): Value {
        switch (expr.kind) {
            case SK.AsExpression:
                return this.emitExpr((expr as ts.AsExpression).expression)
            case SK.CallExpression:
                return this.emitCallExpression(expr as ts.CallExpression)
            case SK.FalseKeyword:
                return this.emitLiteral(false)
            case SK.TrueKeyword:
                return this.emitLiteral(true)
            case SK.NullKeyword:
                return this.emitLiteral(null)
            case SK.UndefinedKeyword:
                return this.emitLiteral(undefined)
            case SK.Identifier:
                return this.emitIdentifier(expr as ts.Identifier)
            case SK.ThisKeyword:
                return this.emitThisExpression(expr as ts.ThisExpression)
            case SK.ElementAccessExpression:
                return this.emitElementAccessExpression(
                    expr as ts.ElementAccessExpression
                )
            case SK.PropertyAccessExpression:
                return this.emitPropertyAccessExpression(
                    expr as ts.PropertyAccessExpression
                )

            case SK.TemplateHead:
            case SK.TemplateMiddle:
            case SK.TemplateTail:
            case SK.NumericLiteral:
            case SK.StringLiteral:
            case SK.NoSubstitutionTemplateLiteral:
                //case SyntaxKind.RegularExpressionLiteral:
                return this.emitLiteralExpression(expr as ts.LiteralExpression)

            case SK.TemplateExpression:
                return this.emitTemplateExpression(
                    expr as ts.TemplateExpression
                )

            case SK.BinaryExpression:
                return this.emitBinaryExpression(expr as ts.BinaryExpression)
            case SK.PrefixUnaryExpression:
                return this.emitUnaryExpression(
                    expr as ts.PrefixUnaryExpression
                )
            case SK.TaggedTemplateExpression:
                return this.emitStringOrBuffer(
                    expr as ts.TaggedTemplateExpression
                )
            case SK.ArrayLiteralExpression:
                return this.emitArrayExpression(
                    expr as ts.ArrayLiteralExpression
                )
            case SK.ObjectLiteralExpression:
                return this.emitObjectExpression(
                    expr as ts.ObjectLiteralExpression
                )
            case SK.ParenthesizedExpression:
                return this.emitExpr(
                    (expr as ts.ParenthesizedExpression).expression
                )
            case SK.ArrowFunction:
                return this.emitFunctionExpr(expr as ts.ArrowFunction)
            case SK.FunctionExpression:
                return this.emitFunctionExpr(expr as ts.FunctionExpression)
            case SK.DeleteExpression:
                return this.emitDeleteExpression(expr as ts.DeleteExpression)
            case SK.TypeOfExpression:
                return this.writer.emitExpr(
                    Op.EXPR1_TYPEOF_STR,
                    this.emitExpr((expr as ts.TypeOfExpression).expression)
                )
            case SK.PostfixUnaryExpression:
                return this.emitPostfixUnaryExpression(
                    expr as ts.PostfixUnaryExpression
                )
            case SK.ConditionalExpression:
                return this.emitConditionalExpression(
                    expr as ts.ConditionalExpression
                )
            default:
                // console.log(expr)
                return throwError(expr, "unhandled expr: " + SK[expr.kind])
        }
    }

    private sourceFrag(node: ts.Node) {
        const text = node.getFullText().trim()
        return text.slice(0, 60).replace(/\n[^]*/, "...")
    }

    private handleException(stmt: ts.Node, e: any) {
        if (e.terminateEmit) throw e

        if (!stmt) stmt = this.lastNode

        if (e.sourceNode !== undefined) {
            const node = e.sourceNode || stmt
            this.reportError(node, e.message)
            // console.log(e.stack)
        } else {
            debugger
            this.reportError(stmt, "Internal error: " + e.message)
            console.log(e.stack)
            e.terminateEmit = true
            throw e
        }
    }

    private emitStmt(stmt: ts.Statement) {
        const src = this.sourceFrag(stmt)
        const wr = this.writer
        if (src) wr.emitComment(src)

        this.lastNode = stmt

        wr.stmtStart(this.indexToLine(stmt))

        try {
            switch (stmt.kind) {
                case SK.ExpressionStatement:
                    return this.emitExpressionStatement(
                        stmt as ts.ExpressionStatement
                    )
                case SK.VariableStatement:
                    return this.emitVariableDeclaration(
                        stmt as ts.VariableStatement
                    )
                case SK.IfStatement:
                    return this.emitIfStatement(stmt as ts.IfStatement)
                case SK.WhileStatement:
                    return this.emitWhileStatement(stmt as ts.WhileStatement)
                case SK.ForStatement:
                    return this.emitForStatement(stmt as ts.ForStatement)
                case SK.Block:
                    stmt.forEachChild(s => this.emitStmt(s as ts.Statement))
                    return
                case SK.ReturnStatement:
                    return this.emitReturnStatement(stmt as ts.ReturnStatement)
                case SK.FunctionDeclaration:
                    return this.emitFunctionDeclaration(
                        stmt as ts.FunctionDeclaration
                    )
                case SK.ExportDeclaration:
                case SK.InterfaceDeclaration:
                case SK.ModuleDeclaration:
                case SK.EmptyStatement:
                    return // ignore
                case SK.ImportDeclaration:
                    return // ignore
                default:
                    // console.log(stmt)
                    throwError(stmt, `unhandled stmt type: ${SK[stmt.kind]}`)
            }
        } catch (e) {
            this.handleException(stmt, e)
        } finally {
            wr.stmtEnd()
        }
    }

    private assertLittleEndian() {
        const test = new Uint16Array([0xd042])
        assert(toHex(new Uint8Array(test.buffer)) == "42d0")
    }

    private specialFieldFmt(f: jdspec.PacketMember) {
        switch (f.type) {
            case "string":
                return NumFmtSpecial.STRING
            case "bool":
                return NumFmtSpecial.BOOL
            case "string0":
                return NumFmtSpecial.STRING0
            case "bytes":
                return NumFmtSpecial.BYTES
            case "pipe":
                return NumFmtSpecial.PIPE
            case "pipe_port":
                return NumFmtSpecial.PIPE_PORT
            default:
                return undefined
        }
    }

    private fieldFmt(f: jdspec.PacketMember) {
        const special = f ? this.specialFieldFmt(f) : NumFmtSpecial.EMPTY
        if (special != undefined) {
            return (
                NumFmt.SPECIAL | ((special & 0xf) << 4) | ((special >> 4) & 0x3)
            )
        } else {
            return bufferFmt(f)
        }
    }

    private serializeSpecs() {
        let usedSpecs = uniqueMap(
            this.roles.list as Role[],
            r => r.spec.classIdentifier + "",
            r => r.spec
        )
        if (false)
            usedSpecs = Object.values(this.serviceSpecs).filter(
                s => s.shortId[0] != "_"
            )
        if (usedSpecs.length) {
            usedSpecs.unshift(this.serviceSpecs["sensor"])
            usedSpecs.unshift(this.serviceSpecs["base"])
        }
        const numSpecs = usedSpecs.length
        const specWriter = new SectionWriter()

        const later = usedSpecs.map(spec => {
            const specDesc = new Uint8Array(BinFmt.SERVICE_SPEC_HEADER_SIZE)
            specWriter.append(specDesc)
            let flags = 0

            if (spec.extends.indexOf("_sensor") >= 0)
                flags |= ServiceSpecFlag.DERIVE_SENSOR

            const name =
                spec.camelName[0].toUpperCase() + spec.camelName.slice(1)
            write16(specDesc, 0, this.addString(name))
            write32(specDesc, 4, spec.classIdentifier)
            write16(specDesc, 2, flags)
            const pkts = spec.packets

            return () => {
                const multifields = pkts.map(pkt => {
                    if (
                        pkt.fields.length == 0 ||
                        (pkt.fields.length == 1 && !pkt.fields[0].startRepeats)
                    )
                        return -1 // inline field
                    else {
                        const r = specWriter.currSize >> 2
                        for (const f of pkt.fields) {
                            let flags = 0x00
                            let numfmt = 0
                            if (f.storage && /u8\[/.test(f.type)) {
                                flags |= FieldSpecFlag.IS_BYTES
                                numfmt = f.storage
                            } else {
                                numfmt = this.fieldFmt(f)
                            }
                            if (f.startRepeats)
                                flags |= FieldSpecFlag.STARTS_REPEATS
                            specWriter.append(
                                encodeU16LE([
                                    this.addString(camelize(f.name)),
                                    numfmt | (flags << 8),
                                ])
                            )
                        }
                        specWriter.append(encodeU16LE([0, 0]))
                        assert(4 == BinFmt.SERVICE_SPEC_FIELD_SIZE)
                        return r
                    }
                })
                const startoff = specWriter.currSize
                let idx = -1
                for (const pkt of pkts) {
                    idx++
                    let code = pkt.identifier
                    let flags = 0
                    if (pkt.derived) continue
                    if (isRegister(pkt)) code |= PacketSpecCode.REGISTER
                    else if (pkt.kind == "event") code |= PacketSpecCode.EVENT
                    else if (pkt.kind == "command")
                        code |= PacketSpecCode.COMMAND
                    else if (pkt.kind == "report") code |= PacketSpecCode.REPORT
                    else if (pkt.kind.includes("pipe")) continue
                    else oops(`unknown pkt kind ${pkt.kind}`)
                    let numfmt = multifields[idx]
                    if (numfmt == -1) numfmt = this.fieldFmt(pkt.fields[0])
                    else flags |= PacketSpecFlag.MULTI_FIELD
                    const pktDesc = encodeU16LE([
                        this.addString(camelize(pkt.name)),
                        code,
                        flags,
                        numfmt,
                    ])
                    assert(
                        pktDesc.length == BinFmt.SERVICE_SPEC_PACKET_SIZE,
                        "sz"
                    )
                    specWriter.append(pktDesc)
                }

                write16(specDesc, 10, startoff >> 2)
                const nument =
                    (specWriter.currSize - startoff) /
                    BinFmt.SERVICE_SPEC_PACKET_SIZE
                write16(specDesc, 8, nument)
            }
        })

        later.forEach(f => f())

        specWriter.align()

        return {
            numSpecs,
            specWriter,
        }

        function isRegister(pi: jdspec.PacketInfo) {
            return pi.kind == "ro" || pi.kind == "rw" || pi.kind == "const"
        }
    }

    private serialize() {
        // serialization only works on little endian machines
        this.assertLittleEndian()

        const fixHeader = new SectionWriter(BinFmt.FIX_HEADER_SIZE)
        const sectDescs = new SectionWriter()
        const sections: SectionWriter[] = [fixHeader, sectDescs]

        const hd = new Uint8Array(BinFmt.FIX_HEADER_SIZE)
        hd.set(
            encodeU32LE([
                BinFmt.MAGIC0,
                BinFmt.MAGIC1,
                BinFmt.IMG_VERSION,
                this.globals.list.length,
            ])
        )
        fixHeader.append(hd)

        const funDesc = new SectionWriter()
        const funData = new SectionWriter()
        const floatData = new SectionWriter()
        const roleData = new SectionWriter()
        const asciiDesc = new SectionWriter()
        const utf8Desc = new SectionWriter()
        const bufferDesc = new SectionWriter()
        const strData = new SectionWriter()
        const { specWriter, numSpecs } = this.serializeSpecs()
        write16(hd, 14, numSpecs)

        const writers = [
            funDesc,
            funData,
            floatData,
            roleData,
            asciiDesc,
            utf8Desc,
            bufferDesc,
            strData,
            specWriter,
        ]

        assert(BinFmt.NUM_IMG_SECTIONS == writers.length)

        for (const s of writers) {
            sectDescs.append(s.desc)
            sections.push(s)
        }

        funDesc.size = BinFmt.FUNCTION_HEADER_SIZE * this.procs.length

        for (const proc of this.procs) {
            funDesc.append(proc.writer.desc)
            proc.writer.offsetInFuncs = funData.currSize
            funData.append(proc.writer.serialize())
        }

        const floatBuf = new Float64Array(this.floatLiterals).buffer
        const nanboxedU32 = new Uint32Array(floatBuf)
        for (let i = 0; i < this.floatLiterals.length; ++i) {
            const f = this.floatLiterals[i]
            if ((f | 0) == f) {
                nanboxedU32[i * 2] = f
                nanboxedU32[i * 2 + 1] = -1
            }
        }
        floatData.append(new Uint8Array(floatBuf))

        for (const r of this.roles.list) {
            roleData.append((r as Role).serialize())
        }

        function addLits(lst: (Uint8Array | string)[], dst: SectionWriter) {
            lst.forEach(str => {
                const buf: Uint8Array =
                    typeof str == "string"
                        ? stringToUint8Array(toUTF8(str) + "\u0000")
                        : str

                let desc = new Uint8Array(BinFmt.SECTION_HEADER_SIZE)
                write32(desc, 0, strData.currSize)
                write32(
                    desc,
                    4,
                    typeof str == "string" ? buf.length - 1 : buf.length
                )
                strData.append(buf)
                if (dst == asciiDesc) {
                    assert(desc[2] == 0)
                    assert(desc[3] == 0)
                    desc = desc.slice(0, BinFmt.ASCII_HEADER_SIZE)
                }
                dst.append(desc)
                return desc
            })
        }

        addLits(this.asciiLiterals, asciiDesc)
        addLits(this.utf8Literals, utf8Desc)
        addLits(this.bufferLiterals, bufferDesc)

        asciiDesc.align()

        strData.append(new Uint8Array(1)) // final NUL-terminator
        strData.align()

        let off = 0
        for (const s of sections) {
            s.finalize(off)
            off += s.size
        }

        const mask = BinFmt.BINARY_SIZE_ALIGN - 1
        off = (off + mask) & ~mask
        const outp = new Uint8Array(off)

        for (const proc of this.procs) {
            proc.writer.finalizeDesc(funData.offset + proc.writer.offsetInFuncs)
        }

        off = 0
        for (const s of sections) {
            for (const d of s.data) {
                outp.set(d, off)
                off += d.length
            }
        }

        const left = outp.length - off
        assert(0 <= left && left < BinFmt.BINARY_SIZE_ALIGN)

        const dbg: DebugInfo = {
            sizes: {
                header: fixHeader.size + sectDescs.size,
                floats: floatData.size,
                strings:
                    strData.size +
                    asciiDesc.size +
                    utf8Desc.size +
                    bufferDesc.size,
                roles: roleData.size,
                align: left,
            },
            roles: this.roles.list.map(r => (r as Role).debugInfo()),
            functions: this.procs.map(p => p.debugInfo()),
            globals: this.globals.list.map(r => r.debugInfo()),
            source: this._source,
        }

        return { binary: outp, dbg }
    }

    getAssembly() {
        return this.procs.map(p => p.toString()).join("\n")
    }

    inMainFile(node: ts.Node) {
        return node.getSourceFile() == this.mainFile
    }

    private emitLibrary() {
        if (!this.isLibrary) return

        const q = (b: string | Uint8Array) => {
            if (typeof b == "string") return "s:" + b
            else return "h:" + toHex(b)
        }
        const cleanDesc = (desc: Uint8Array) => {
            // clear offset since it's meaningless in library
            desc = new Uint8Array(desc)
            write32(desc, 0, 0)
            return desc
        }
        const lib = {
            procs: this.procs.map(p => ({
                name: p.name,
                desc: q(cleanDesc(p.writer.desc)),
                body: q(p.writer.serialize()),
            })),
            buffer: this.bufferLiterals.map(q),
            ascii: this.asciiLiterals.map(q),
            utf8: this.utf8Literals.map(q),
            floats: this.floatLiterals.slice(),
        }
        this.host.write(DEVS_LIB_FILE, JSON.stringify(lib, null, 1))
    }

    emit() {
        assert(!this.tree)

        this.tree = buildAST(this.host, this._source, this.prelude)
        this.checker = this.tree.getTypeChecker()

        getProgramDiagnostics(this.tree).forEach(d => this.printDiag(d))

        const files = this.tree.getSourceFiles()
        this.mainFile = files[files.length - 1]

        this.emitProgram(this.tree)

        this.finalizeCloudMethods()
        this.finalizeDispatchers()
        for (const p of this.procs) this.finalizeProc(p)

        const staticProcs: Record<string, boolean> = {}
        for (const p of this.procs) {
            if (!p.usesClosure) staticProcs[p.index + ""] = true
        }
        const funIsStatic = (idx: number) => staticProcs[idx + ""] == true
        for (const p of this.procs) {
            p.writer.makeFunctionsStatic(funIsStatic)
        }

        // early assembly dump, in case serialization fails
        if (this.numErrors == 0)
            this.host.write(DEVS_ASSEMBLY_FILE, this.getAssembly())

        const { binary, dbg } = this.serialize()
        const progJson = {
            text: this._source,
            blocks: "",
            compiled: toHex(binary),
        }
        this.host.write(DEVS_BODY_FILE, JSON.stringify(progJson, null, 4))
        this.host.write(DEVS_DBG_FILE, JSON.stringify(dbg, null, 4))
        this.host.write(DEVS_SIZES_FILE, computeSizes(dbg))
        if (this.numErrors == 0)
            this.host.write(DEVS_ASSEMBLY_FILE, this.getAssembly())
        // this file is tracked by --watch and should be written last
        this.host.write(DEVS_BYTECODE_FILE, binary)

        if (this.numErrors == 0) {
            try {
                this.host?.verifyBytecode(binary, dbg)
            } catch (e) {
                this.reportError(this.mainFile, e.message)
            }
        }

        if (this.numErrors == 0) this.emitLibrary()

        const clientSpecs: jdspec.ServiceSpec[] = []
        for (const kn of Object.keys(this.clientCommands)) {
            const lst = this.clientCommands[kn]
                .filter(c => c.isFresh)
                .map(c => c.pktSpec)
            if (lst.length > 0) {
                const s = this.clientCommands[kn][0].serviceSpec
                clientSpecs.push({
                    name: s.name,
                    camelName: s.camelName,
                    shortId: s.shortId,
                    shortName: s.shortName,
                    classIdentifier: s.classIdentifier,
                    status: undefined,
                    extends: undefined,
                    notes: undefined,
                    enums: undefined,
                    tags: undefined,
                    constants: undefined,
                    packets: lst,
                })
            }
        }

        return {
            success: this.numErrors == 0,
            binary: binary,
            dbg: dbg,
            clientSpecs,
        }
    }
}

export interface CompilationResult {
    success: boolean
    binary: Uint8Array
    dbg: DebugInfo
    clientSpecs: jdspec.ServiceSpec[]
}

/**
 * Compiles the DeviceScript program.
 * @param code
 * @param opts
 * @returns
 */
export function compile(
    code: string,
    opts: {
        host?: Host
        mainFileName?: string
        log?: (msg: string) => void
        files?: Record<string, string | Uint8Array>
        errors?: DevsDiagnostic[]
        specs?: jdspec.ServiceSpec[]
        verifyBytecode?: (buf: Uint8Array) => void
        isLibrary?: boolean
    } = {}
): CompilationResult {
    const {
        files = {},
        mainFileName = "",
        specs = jacdacDefaultSpecifications,
        log = (msg: string) => console.debug(msg),
        verifyBytecode = buf => {},
        errors = [],
    } = opts
    const {
        host = <Host>{
            mainFileName: () => mainFileName,
            write: (filename: string, contents: string | Uint8Array) => {
                files[filename] = contents
            },
            log,
            error: err => errors.push(err),
            getSpecs: () => specs,
            verifyBytecode,
        },
    } = opts
    const p = new Program(host, code)
    if (opts.isLibrary) p.isLibrary = true
    return p.emit()
}

export function testCompiler(host: Host, code: string) {
    const lines = code.split(/\r?\n/).map(s => {
        const m = /\/\/\s*!\s*(.*)/.exec(s)
        if (m) return m[1]
        else return null
    })
    const numerr = lines.filter(s => !!s).length
    let numExtra = 0
    const p = new Program(
        {
            write: () => {},
            log: msg => {},
            getSpecs: host.getSpecs,
            verifyBytecode: host.verifyBytecode,
            mainFileName: host.mainFileName,
            error: err => {
                let isOK = false
                if (err.file) {
                    const { line } = ts.getLineAndCharacterOfPosition(
                        err.file,
                        err.start
                    )
                    const exp = lines[line]
                    const text = ts.flattenDiagnosticMessageText(
                        err.messageText,
                        "\n"
                    )
                    if (exp != null && text.indexOf(exp) >= 0) {
                        lines[line] = "" // allow more errors on the same line
                        isOK = true
                    }
                }

                if (!isOK) {
                    numExtra++
                    console.error(formatDiagnostics([err]))
                }
            },
        },
        code
    )
    const r = p.emit()
    let missingErrs = 0
    for (let i = 0; i < lines.length; ++i) {
        if (lines[i]) {
            const msg = "missing error: " + lines[i]
            const fn = host.mainFileName?.() || ""
            console.error(`${fn}(${i + 1},${1}): ${msg}`)
            missingErrs++
        }
    }
    if (missingErrs) throw new Error("some errors were not reported")
    if (numExtra) throw new Error("extra errors reported")
    if (numerr && r.success) throw new Error("unexpected success")

    if (r.success) {
        const cont = p.getAssembly()
        if (cont.indexOf("???oops") >= 0) {
            console.log(cont)
            throw new Error("bad disassembly")
        }
    }
}

export function toTable(header: string[], rows: (string | number)[][]) {
    rows = rows.slice()
    rows.unshift(header)
    const maxlen: number[] = []
    const isnum: boolean[] = []
    for (const row of rows) {
        for (let i = 0; i < row.length; ++i) {
            maxlen[i] = Math.min(
                Math.max(maxlen[i] ?? 2, toStr(row[i]).length),
                30
            )
            isnum[i] ||= typeof row[i] == "number"
        }
    }
    let hd = true
    let res = ""
    for (const row of rows) {
        for (let i = 0; i < maxlen.length; ++i) {
            let w = toStr(row[i])
            const missing = maxlen[i] - w.length
            if (missing > 0) {
                const pref = " ".repeat(missing)
                if (isnum[i]) w = pref + w
                else w = w + pref
            }
            res += w
            if (i != maxlen.length - 1) res += " | "
        }
        res += "\n"
        if (hd) {
            hd = false
            for (let i = 0; i < maxlen.length; ++i) {
                let w = isnum[i]
                    ? "-".repeat(maxlen[i] - 1) + ":"
                    : "-".repeat(maxlen[i])
                res += w
                if (i != maxlen.length - 1) res += " | "
            }
            res += "\n"
        }
    }

    return res.replace(/\s+\n/gm, "\n")

    function toStr(n: string | number | null) {
        return (n ?? "") + ""
    }
}

export function computeSizes(dbg: DebugInfo) {
    const funs = dbg.functions.slice()
    funs.sort((a, b) => a.size - b.size || strcmp(a.name, b.name))
    let ftotal = 0
    for (const f of funs) {
        ftotal += f.size
    }
    let dtotal = 0
    for (const v of Object.values(dbg.sizes)) dtotal += v
    return (
        "## Data\n\n" +
        toTable(
            ["Size", "Name"],
            Object.keys(dbg.sizes)
                .map(k => [dbg.sizes[k], k])
                .concat([[dtotal, "Data TOTAL"]])
        ) +
        "\n## Functions\n\n" +
        toTable(
            ["Size", "Name", "Users"],
            funs
                .map(f => [f.size, "`" + f.name + "`", locs2str(f.users)])
                .concat([
                    [ftotal, "Function TOTAL"],
                    [dtotal + ftotal, "TOTAL"],
                ])
        )
    )

    function loc2str(l: SrcLocation) {
        return `${l.file}(${l.line},${l.col})`
    }

    function locs2str(ls: SrcLocation[]) {
        const maxlen = 10
        let r = ls.slice(0, maxlen).map(loc2str).join(", ")
        if (ls.length > maxlen) r += "..."
        return r
    }
}
