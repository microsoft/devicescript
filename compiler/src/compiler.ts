// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../jacdac-c/jacdac/spectool/jdspec.d.ts" />

import * as esprima from "esprima"
import * as estree from "estree"

import {
    SystemReg,
    SRV_JACSCRIPT_CONDITION,
    JacscriptCloudEvent,
    JacscriptCloudCmd,
    JacscriptCloudCommandStatus,
} from "../../jacdac-c/jacdac/dist/specconstants"

import {
    range,
    read32,
    stringToUint8Array,
    toHex,
    toUTF8,
    write16,
    write32,
    strcmp,
    encodeU32LE,
} from "./jdutil"

import {
    BinFmt,
    bitSize,
    CellDebugInfo,
    CellKind,
    DebugInfo,
    FunctionDebugInfo,
    Host,
    InstrArgResolver,
    JacError,
    NUM_REGS,
    OpAsync,
    OpBinary,
    OpCall,
    OpFmt,
    OpMath1,
    OpMath2,
    OpRoleProperty,
    OpSync,
    OpTop,
    OpUnary,
    printJacError,
    SMap,
    stringifyCellKind,
    stringifyInstr,
    ValueSpecial,
} from "./format"

export const JD_SERIAL_HEADER_SIZE = 16
export const JD_SERIAL_MAX_PAYLOAD_SIZE = 236

export const CMD_GET_REG = 0x1000
export const CMD_SET_REG = 0x2000

export function oops(msg: string): never {
    throw new Error(msg)
}

export function assert(cond: boolean, msg = "") {
    if (!cond) oops("assertion failed" + (msg ? ": " + msg : ""))
}

export function assertRange(
    min: number,
    v: number,
    max: number,
    desc = "value"
) {
    if (min <= v && v <= max) return
    oops(`${desc}=${v} out of range [${min}, ${max}]`)
}

function strlen(s: string | ValueDesc) {
    if (typeof s != "string") {
        s = s.strValue
        assert(s != null)
    }
    return toUTF8(s).length
}

// inverse of camelize()
// setAll -> set_all
export function snakify(s: string) {
    const up = s.toUpperCase()
    const lo = s.toLowerCase()

    // if the name is all lowercase or all upper case don't do anything
    if (s == up || s == lo)
        return s

    // if the name already has underscores (not as first character), leave it alone
    if (s.lastIndexOf("_") > 0)
        return s

    const isUpper = (i: number) => s[i] != lo[i]
    const isLower = (i: number) => s[i] != up[i]
    //const isDigit = (i: number) => /\d/.test(s[i])

    let r = ""
    let i = 0
    while (i < s.length) {
        let upperMode = isUpper(i)
        let j = i
        while (j < s.length) {
            if (upperMode && isLower(j)) {
                // ABCd -> AB_Cd
                if (j - i > 2) {
                    j--
                    break
                } else {
                    // ABdefQ -> ABdef_Q
                    upperMode = false
                }
            }
            // abcdE -> abcd_E
            if (!upperMode && isUpper(j)) {
                break
            }
            j++
        }
        if (r) r += "_"
        r += s.slice(i, j)
        i = j
    }

    // If the name is is all caps (like a constant), preserve it
    if (r.toUpperCase() === r) {
        return r;
    }
    return r.toLowerCase();
}

export function camelize(name: string) {
    if (!name) return name
    return (
        name[0].toLowerCase() +
        name
            .slice(1)
            .replace(/\s+/g, "_")
            .replace(/_([a-z0-9])/gi, (_, l) => l.toUpperCase())
    )
}

class Cell {
    _index: number
    _name: string

    constructor(
        public definition:
            | estree.VariableDeclarator
            | estree.FunctionDeclaration
            | estree.Identifier,
        public scope: VariableScope
    ) {
        scope.add(this)
    }
    value(): ValueDesc {
        oops("on value() on generic Cell")
    }
    getName() {
        if (!this._name) {
            if (this.definition.type == "Identifier")
                this._name = idName(this.definition)
            else this._name = idName(this.definition.id)
        }
        return this._name
    }
    debugInfo(): CellDebugInfo {
        return {
            name: this.getName(),
        }
    }
}

class DelayedCodeSection {
    startLabel: Label
    returnLabel: Label
    body: ((wr: OpWriter) => void)[] = []

    constructor(public name: string, public parent: Procedure) { }

    empty() {
        return this.body.length == 0
    }

    emit(f: (wr: OpWriter) => void) {
        this.body.push(f)
    }

    callHere() {
        const wr = this.parent.writer
        this.startLabel = wr.mkLabel(this.name + "Start")
        this.returnLabel = wr.mkLabel(this.name + "Ret")
        wr.emitJump(this.startLabel)
        wr.emitLabel(this.returnLabel)
    }

    finalizeRaw() {
        assert(this.parent.parent.proc == this.parent)
        const wr = this.parent.writer
        for (const b of this.body) b(wr)
    }

    finalize() {
        if (this.empty()) {
            this.startLabel.offset = this.returnLabel.offset
            return
        }
        const wr = this.parent.writer
        wr.emitLabel(this.startLabel)
        this.finalizeRaw()
        wr.emitJump(this.returnLabel)
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
    isLocal = false // set when this is a local parameter role

    constructor(
        prog: Program,
        definition: estree.VariableDeclarator | estree.Identifier,
        scope: VariableScope,
        public spec: jdspec.ServiceSpec,
        _name?: string
    ) {
        super(definition, scope)
        if (_name) {
            this._name = _name
            scope._addToMap(this)
        }
        assert(!!spec)
        this.stringIndex = prog.addString(this.getName())
    }
    value(): ValueDesc {
        return { kind: CellKind.JD_ROLE, index: null, role: this }
    }
    rawValue(): ValueDesc {
        if (this.isLocal)
            return mkValue(CellKind.LOCAL, this._index)
        else
            return mkValue(CellKind.X_FLOAT, this._index)
    }
    extEncode(wr: OpWriter, reg = PrefixReg.A) {
        this.used = true
        if (this.isLocal) {
            wr.push()
            wr.setPrefixReg(reg, wr.forceReg(this.rawValue()))
            wr.pop()
            return 0
        } else {
            return this._index
        }
    }
    encode() {
        this.used = true
        if (this.isLocal)
            throwError(null, "only static roles supported here")
        return this._index
    }
    serialize() {
        const r = new Uint8Array(BinFmt.RoleHeaderSize)
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
        return this.spec.classIdentifier == SRV_JACSCRIPT_CONDITION
    }
}

class Variable extends Cell {
    isLocal = false

    constructor(
        definition: estree.VariableDeclarator | estree.Identifier,
        scope: VariableScope
    ) {
        super(definition, scope)
    }
    value(): ValueDesc {
        const kind = this.isLocal ? CellKind.LOCAL : CellKind.GLOBAL
        return { kind, index: this.encode(), variable: this }
    }
    encode() {
        return this._index
    }
    toString() {
        return `var ${this.getName()}`
    }
}

class Buffer extends Cell {
    constructor(
        definition: estree.VariableDeclarator | estree.Identifier,
        scope: VariableScope,
        public length: number,
        _name?: string
    ) {
        super(definition, scope)
        if (_name) {
            this._name = _name
            scope._addToMap(this)
        }
    }
    value(): ValueDesc {
        return { kind: CellKind.X_BUFFER, index: null, buffer: this }
    }
    encode() {
        return this._index
    }
    toString() {
        return `buffer ${this.getName()}`
    }
    serialize() {
        const r = new Uint8Array(BinFmt.BufferHeaderSize)
        write16(r, 4, this.length)
        return r
    }
}

class FunctionDecl extends Cell {
    proc: Procedure
    constructor(
        definition: estree.FunctionDeclaration,
        scope: VariableScope
    ) {
        super(definition, scope)
    }
    value(): ValueDesc {
        return { kind: CellKind.X_FUNCTION, index: null, fun: this }
    }
    toString() {
        return `function ${this.getName()}`
    }
}

interface ValueDesc {
    kind: CellKind
    index: number
    role?: Role
    variable?: Variable
    buffer?: Buffer
    clientCommand?: ClientCommand
    fun?: FunctionDecl
    spec?: jdspec.PacketInfo
    litValue?: number
    strValue?: string
}

function checkIndex(idx: number) {
    assert((idx | 0) === idx)
}

function mkValue(kind: CellKind, index: number): ValueDesc {
    return {
        kind,
        index,
    }
}

function floatVal(v: number) {
    const r = mkValue(CellKind.X_FLOAT, v)
    r.litValue = v
    return r
}

function idName(pat: estree.BaseExpression) {
    if (pat.type != "Identifier") return null
    return (pat as estree.Identifier).name
}

function addUnique<T>(arr: T[], v: T) {
    let idx = arr.indexOf(v)
    if (idx < 0) {
        idx = arr.length
        arr.push(v)
    }
    return idx
}

function numSetBits(n: number) {
    let r = 0
    for (let i = 0; i < 32; ++i) if (n & (1 << i)) r++
    return r
}

function specialVal(sp: ValueSpecial) {
    return mkValue(CellKind.SPECIAL, sp)
}

function matchesName(specName: string, jsName: string) {
    return camelize(specName) == jsName
}

const reservedFunctions: SMap<number> = {
    wait: 1,
    every: 1,
    upload: 1,
    print: 1,
    format: 1,
    panic: 1,
    reboot: 1,
    isNaN: 1,
    onStart: 1,
}

const values = {
    zero: floatVal(0),
    one: floatVal(1),
    nan: specialVal(ValueSpecial.NAN),
    error: mkValue(CellKind.ERROR, 0),
}

class Label {
    uses: number[] = []
    offset = -1
    constructor(public name: string) { }
}

const BUFFER_REG = NUM_REGS + 1

enum PrefixReg {
    A = 0,
    B = 1,
    C = 2,
    D = 3,
}

class OpWriter {
    private allocatedRegs: ValueDesc[] = []
    private allocatedRegsMask = 0
    private scopes: ValueDesc[][] = []
    private binary: number[] = []
    private labels: Label[] = []
    top: Label
    ret: Label
    private assembly: (string | number)[] = []
    private assemblyPtr = 0
    private lineNo = -1
    private lineNoStart = -1
    desc = new Uint8Array(BinFmt.FunctionHeaderSize)
    offsetInFuncs = -1
    private maxRegs = 0
    private srcmap: number[] = []

    constructor(public parent: Procedure) {
        this.top = this.mkLabel("top")
        this.ret = this.mkLabel("ret")
        this.emitLabel(this.top)
    }

    debugInfo(): FunctionDebugInfo {
        this.forceFinStmt()
        return {
            name: this.parent.name,
            srcmap: this.srcmap,
            locals: this.parent.locals.list.map(v => v.debugInfo()),
        }
    }

    serialize() {
        if (this.binary.length & 1) this.emitSync(OpSync.RETURN)
        return new Uint8Array(new Uint16Array(this.binary).buffer)
    }

    finalizeDesc(off: number) {
        assert((this.binary.length & 1) == 0)
        const flags = 0
        const buf = new Uint8Array(3 * 4)
        write32(buf, 0, off)
        write32(buf, 4, this.binary.length * 2)
        write16(buf, 8, this.parent.locals.list.length)
        buf[10] = this.maxRegs | (this.parent.numargs << 4)
        buf[11] = flags
        this.desc.set(buf)
    }

    numScopes() {
        return this.scopes.length
    }

    numRegsInTopScope() {
        return this.scopes[this.scopes.length - 1].length
    }

    emitDbg(msg: string) {
        this.emitComment(msg)
    }

    private forceFinStmt() {
        if (this.lineNo < 0) return
        const len = this.binary.length - this.lineNoStart
        if (len) this.srcmap.push(this.lineNo, this.lineNoStart, len)
    }

    stmtStart(lineNo: number) {
        if (this.lineNo == lineNo) return
        this.forceFinStmt()
        this.lineNo = lineNo
        this.lineNoStart = this.binary.length
    }

    stmtEnd() {
        if (false)
            this.emitDbg(
                `reg=${this.allocatedRegsMask.toString(16)} ${this.scopes.length
                } ${this.scopes.map(s => s.length).join(",")}`
            )
    }

    push() {
        this.scopes.push([])
    }

    popExcept(save?: ValueDesc) {
        const scope = this.scopes.pop()
        let found = false
        for (const r of scope) {
            if (r == save) found = true
            else this.freeReg(r)
        }
        if (save) {
            assert(found)
            this.scopes[this.scopes.length - 1].push(save)
        }
    }

    pop() {
        this.popExcept(null)
    }

    allocBuf(): ValueDesc {
        assert(!this.bufferAllocated(), "allocBuf() not free")
        return this.doAlloc(BUFFER_REG, CellKind.JD_CURR_BUFFER)
    }

    private doAlloc(regno: number, kind = CellKind.X_FP_REG) {
        assert(regno != -1)
        if (this.allocatedRegsMask & (1 << regno))
            throwError(
                null,
                `expression too complex (R${regno} allocated)`
            )
        this.allocatedRegsMask |= 1 << regno
        const r = mkValue(kind, regno)
        this.allocatedRegs.push(r)
        this.scopes[this.scopes.length - 1].push(r)
        return r
    }

    allocArgs(num: number): ValueDesc[] {
        return range(num).map(x => this.doAlloc(x))
    }

    allocReg(): ValueDesc {
        let regno = -1
        for (let i = NUM_REGS - 1; i >= 0; i--) {
            if (!(this.allocatedRegsMask & (1 << i))) {
                regno = i
                break
            }
        }
        return this.doAlloc(regno)
    }

    freeReg(v: ValueDesc) {
        checkIndex(v.index)
        const idx = this.allocatedRegs.indexOf(v)
        assert(idx >= 0)
        this.allocatedRegs.splice(idx, 1)
        this.allocatedRegsMask &= ~(1 << v.index)
    }

    emitString(s: string) {
        const v = mkValue(CellKind.X_STRING, this.parent.parent.addString(s))
        v.strValue = s
        return v
    }

    isReg(v: ValueDesc) {
        if (v.kind == CellKind.X_FP_REG) {
            checkIndex(v.index)
            assert((this.allocatedRegsMask & (1 << v.index)) != 0)
            return true
        } else {
            return false
        }
    }

    emitRaw(op: OpTop, arg: number) {
        assert(arg >> 12 == 0)
        assertRange(0, op, 0xf)
        this.emitInstr((op << 12) | arg)
    }

    setPrefixReg(reg: PrefixReg, v: ValueDesc) {
        checkIndex(v.index)
        if (this.isReg(v)) {
            this.emitRaw(OpTop.SET_HIGH, (reg << 10) | (1 << 9) | v.index)
        } else {
            assert(v.kind == CellKind.X_FLOAT)
            const q = v.index & 0xffff
            const arr: [number, number, number, number] = [0, 0, 0, 0]
            arr[reg] = q
            this.emitPrefix(...arr)
        }
    }

    emitPrefix(a: number, b: number = 0, c: number = 0, d: number = 0) {
        const vals = [a, b, c, d]
        for (let i = 0; i < 4; ++i) {
            const v = vals[i]
            checkIndex(v)
            if (!v) continue
            const high = v >> 12
            this.emitRaw(OpTop.SET_A + i, v & 0xfff)
            if (high) {
                assert(high >> 4 == 0)
                this.emitRaw(OpTop.SET_HIGH, (i << 10) | high)
            }
        }
    }

    emitSync(
        op: OpSync,
        a: number = 0,
        b: number = 0,
        c: number = 0,
        d: number = 0
    ) {
        this.emitPrefix(a, b, c, d)
        assertRange(0, op, OpSync._LAST)
        this.emitRaw(OpTop.SYNC, op)
    }

    private saveRegs() {
        const d = this.allocatedRegsMask & 0xffff
        const regs = numSetBits(d)
        if (regs > this.maxRegs) this.maxRegs = regs
        return d
    }

    emitAsyncWithRole(op: OpAsync, role: Role, b: number = 0, c: number = 0) {
        this.emitAsync(op, role.extEncode(this), b, c)
    }

    emitAsync(op: OpAsync, a: number = 0, b: number = 0, c: number = 0) {
        assert(!this.bufferAllocated(), "buffer allocated in async")
        const d = this.saveRegs()
        this.emitPrefix(a, b, c, d >> 4)
        assertRange(0, op, OpAsync._LAST)
        this.emitRaw(OpTop.ASYNC, ((d & 0xf) << 8) | op)
    }

    emitMov(dst: number, src: number) {
        checkIndex(dst)
        checkIndex(src)
        this.emitRaw(OpTop.UNARY, (OpUnary.ID << 8) | (dst << 4) | src)
    }

    forceReg(v: ValueDesc) {
        if (this.isReg(v)) return v
        const r = this.allocReg()
        this.assign(r, v)
        return r
    }

    assign(dst: ValueDesc, src: ValueDesc) {
        if (src == dst) return
        if (this.isReg(dst)) {
            this.emitLoadCell(dst, src.kind, src.index)
        } else if (this.isReg(src)) {
            this.emitStoreCell(dst.kind, dst.index, src)
        } else {
            this.push()
            const r = this.allocReg()
            this.assign(r, src)
            this.assign(dst, r)
            this.pop()
        }
    }

    private emitFloatLiteral(dst: ValueDesc, v: number) {
        if (isNaN(v)) {
            this.emitLoadCell(dst, CellKind.SPECIAL, ValueSpecial.NAN)
        } else if ((v | 0) == v && 0 <= v && v <= 0xffff) {
            this.emitLoadCell(dst, CellKind.IDENTITY, v)
        } else {
            this.emitLoadCell(
                dst,
                CellKind.FLOAT_CONST,
                addUnique(this.parent.parent.floatLiterals, v)
            )
        }
    }

    emitLoadCell(dst: ValueDesc, celltype: CellKind, idx: number, argB = 0) {
        assert(this.isReg(dst))
        switch (celltype) {
            case CellKind.LOCAL:
            case CellKind.GLOBAL:
            case CellKind.FLOAT_CONST:
            case CellKind.IDENTITY:
            case CellKind.BUFFER:
            case CellKind.SPECIAL:
            case CellKind.ROLE_PROPERTY:
                this.emitLoadStoreCell(
                    OpTop.LOAD_CELL,
                    dst,
                    celltype,
                    idx,
                    argB
                )
                break
            case CellKind.X_FP_REG:
                this.emitMov(dst.index, idx)
                break
            case CellKind.X_FLOAT:
                this.emitFloatLiteral(dst, idx)
                break
            case CellKind.ERROR:
                // ignore
                break
            default:
                oops("can't load")
                break
        }
    }

    emitStoreCell(celltype: CellKind, idx: number, src: ValueDesc) {
        switch (celltype) {
            case CellKind.LOCAL:
            case CellKind.GLOBAL:
            case CellKind.BUFFER:
                this.emitLoadStoreCell(OpTop.STORE_CELL, src, celltype, idx, 0)
                break
            case CellKind.X_FP_REG:
                this.emitMov(idx, src.index)
                break
            case CellKind.ERROR:
                // ignore
                break
            default:
                oops("can't store")
                break
        }
    }

    private bufferAllocated() {
        return !!(this.allocatedRegsMask & (1 << BUFFER_REG))
    }

    private emitLoadStoreCell(
        op: OpTop,
        dst: ValueDesc,
        celltype: CellKind,
        idx: number,
        argB: number = 0,
        argC: number = 0,
        argD: number = 0
    ) {
        checkIndex(idx)
        assert(this.isReg(dst))
        assertRange(0, celltype, CellKind._HW_LAST)
        // DST[4] CELL_KIND[4] A:OFF[4]
        this.emitPrefix(idx >> 4, argB, argC, argD)
        this.emitRaw(op, (dst.index << 8) | (celltype << 4) | (idx & 0xf))
    }

    emitStoreByte(src: ValueDesc, off = 0) {
        assert(this.isReg(src))
        assertRange(0, off, 0xff)
        this.emitLoadStoreCell(
            OpTop.STORE_CELL,
            src,
            CellKind.BUFFER,
            0,
            OpFmt.U8,
            off
        )
    }

    emitBufLoad(dst: ValueDesc, fmt: OpFmt, off: number, bufidx = 0) {
        if (bufidx == 0) assertRange(0, off, 0xff)
        this.emitLoadStoreCell(
            OpTop.LOAD_CELL,
            dst,
            CellKind.BUFFER,
            0,
            fmt,
            off,
            bufidx
        )
    }

    emitBufStore(src: ValueDesc, fmt: OpFmt, off: number, bufidx = 0) {
        assertRange(0, off, 0xff)
        //assert(
        //    bufidx != 0 || this.bufferAllocated(),
        //    "buffer allocated in store"
        //)
        this.emitLoadStoreCell(
            OpTop.STORE_CELL,
            src,
            CellKind.BUFFER,
            0,
            fmt,
            off,
            bufidx
        )
    }

    emitBufOp(
        op: OpTop,
        dst: ValueDesc,
        off: number,
        mem: jdspec.PacketMember,
        bufferId = 0
    ) {
        assert(this.isReg(dst))
        let fmt = OpFmt.U8
        let sz = mem.storage
        if (sz < 0) {
            fmt = OpFmt.I8
            sz = -sz
        } else if (mem.isFloat) {
            fmt = 0b1000
        }
        switch (sz) {
            case 1:
                break
            case 2:
                fmt |= OpFmt.U16
                break
            case 4:
                fmt |= OpFmt.U32
                break
            case 8:
                fmt |= OpFmt.U64
                break
            default:
                oops("unhandled format: " + mem.storage + " for " + mem.name)
        }

        const shift = mem.shift || 0
        assertRange(0, shift, bitSize(fmt))
        assertRange(0, off, 0xff)
        if (op == OpTop.STORE_CELL)
            assert(this.bufferAllocated(), "buffer allocated in store")

        // B=shift:numfmt, C=Offset, D=buffer_id; A-unused ???
        this.emitLoadStoreCell(
            op,
            dst,
            CellKind.BUFFER,
            0,
            fmt | (shift << 4),
            off,
            bufferId
        )
    }

    private catchUpAssembly() {
        while (this.assemblyPtr < this.binary.length) {
            this.assembly.push(this.assemblyPtr++)
        }
    }

    private writeAsm(msg: string) {
        this.catchUpAssembly()
        this.assembly.push(msg)
    }

    getAssembly() {
        this.catchUpAssembly()
        let r = ""
        for (const ln of this.assembly) {
            if (typeof ln == "string") r += ln + "\n"
            else {
                this.parent.parent.resolverPC = ln
                r += stringifyInstr(this.binary[ln], this.parent.parent) + "\n"
            }
        }
        return r
    }

    emitComment(msg: string) {
        this.writeAsm("; " + msg.replace(/\n/g, "\n; "))
    }

    emitInstr(v: number) {
        v >>>= 0
        assertRange(0, v, 0xffff)
        this.binary.push(v)
    }

    mkLabel(name: string) {
        const l = new Label(name)
        this.labels.push(l)
        return l
    }

    emitLabel(l: Label) {
        assert(l.offset == -1)
        this.emitComment("lbl " + l.name)
        l.offset = this.binary.length
    }

    emitIfAndPop(reg: ValueDesc, thenBody: () => void, elseBody?: () => void) {
        assert(this.isReg(reg))
        this.pop()
        if (elseBody) {
            const endIf = this.mkLabel("endif")
            const elseIf = this.mkLabel("elseif")
            this.emitJump(elseIf, reg.index)
            thenBody()
            this.emitJump(endIf)
            this.emitLabel(elseIf)
            elseBody()
            this.emitLabel(endIf)
        } else {
            const skipIf = this.mkLabel("skipif")
            this.emitJump(skipIf, reg.index)
            thenBody()
            this.emitLabel(skipIf)
        }
    }

    emitJump(label: Label, cond: number = -1) {
        // JMP = 9, // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
        checkIndex(cond)
        this.emitComment("jump " + label.name)
        label.uses.push(this.binary.length)
        this.emitRaw(OpTop.SET_B, 0)
        this.emitRaw(OpTop.JUMP, cond == -1 ? 0 : (cond << 8) | (1 << 6))
    }

    patchLabels() {
        for (const l of this.labels) {
            if (l.uses.length == 0) continue
            assert(l.offset != -1, `label ${l.name} emitted`)
            for (const u of l.uses) {
                let op0 = this.binary[u]
                let op1 = this.binary[u + 1]
                assert(op0 >> 12 == OpTop.SET_B)
                assert(op1 >> 12 == OpTop.JUMP)
                let off = l.offset - u - 2
                assert(off != -2) // avoid simple infinite loop
                if (off < 0) {
                    off = -off
                    op1 |= 1 << 7
                }
                assert((op0 & 0xfff) == 0)
                assert((op1 & 0x3f) == 0)
                assertRange(0, off, 0x3ffff)
                op0 |= off >> 6
                op1 |= off & 0x3f
                this.binary[u] = op0 >>> 0
                this.binary[u + 1] = op1 >>> 0
            }
        }
    }

    emitCall(proc: Procedure, op = OpCall.SYNC) {
        let d = 0
        if (op == OpCall.SYNC) d = this.saveRegs()
        else assert((this.allocatedRegsMask & 1) == 0)
        this.emitPrefix(proc.index >> 6, 0, 0, d)
        this.emitRaw(
            OpTop.CALL,
            (proc.numargs << 8) | (op << 6) | (proc.index & 0x3f)
        )
    }

    emitUnary(op: OpUnary, left: ValueDesc, right: ValueDesc) {
        assert(this.isReg(left))
        assert(this.isReg(right))
        assertRange(0, op, 0xf)
        this.emitRaw(OpTop.UNARY, (op << 8) | (left.index << 4) | right.index)
    }

    emitBin(op: OpBinary, left: ValueDesc, right: ValueDesc) {
        assert(this.isReg(left))
        assert(this.isReg(right))
        assertRange(0, op, 0xf)
        this.emitRaw(OpTop.BINARY, (op << 8) | (left.index << 4) | right.index)
    }
}

class SectionWriter {
    offset = -1
    currSize = 0
    data: Uint8Array[] = []
    desc = new Uint8Array(BinFmt.SectionHeaderSize)

    constructor(public size = -1) { }

    finalize(off: number) {
        assert(this.offset == -1 || this.offset == off)
        this.offset = off
        if (this.size == -1) this.size = this.currSize
        assert(this.size == this.currSize)
        assert((this.offset & 3) == 0)
        assert((this.size & 3) == 0)
        write32(this.desc, 0, this.offset)
        write32(this.desc, 4, this.size)
    }

    align() {
        while (this.currSize & 3) this.append(new Uint8Array([0]))
    }

    append(buf: Uint8Array) {
        this.data.push(buf)
        this.currSize += buf.length
        if (this.size >= 0) assertRange(0, this.currSize, this.size)
    }
}

class Procedure {
    writer = new OpWriter(this)
    index: number
    numargs = 0
    locals: VariableScope
    methodSeqNo: Variable
    constructor(public parent: Program, public name: string) {
        this.index = this.parent.procs.length
        this.parent.procs.push(this)
        this.locals = new VariableScope(this.parent.globals)
    }
    toString() {
        return `proc ${this.name}: (fun${this.index
            })\n${this.writer.getAssembly()}`
    }
    finalize() {
        this.writer.patchLabels()
    }
    args() {
        return this.locals.list.slice(0, this.numargs)
    }
    mkTempLocal(name: string) {
        const l = new Variable(null, this.locals)
        l._name = name
        l.isLocal = true
        return l
    }
}

class VariableScope {
    map: SMap<Cell> = {}
    list: Cell[] = []
    constructor(public parent: VariableScope) { }

    lookup(name: string): Cell {
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
        if (cell.definition) this._addToMap(cell)
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

type Expr = estree.Expression | estree.Super | estree.SpreadElement
type Stmt = estree.Statement | estree.Directive | estree.ModuleDeclaration
type FunctionLike = estree.FunctionDeclaration | estree.ArrowFunctionExpression | estree.FunctionExpression

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

function throwError(expr: estree.BaseNode, msg: string): never {
    const err = new Error(msg)
        ; (err as any).sourceNode = expr
    throw err
}

interface LoopLabels {
    continueLbl: Label
    breakLbl: Label
}

class ClientCommand {
    defintion: estree.FunctionExpression
    jsName: string
    pktSpec: jdspec.PacketInfo
    isFresh: boolean
    proc: Procedure
    constructor(public serviceSpec: jdspec.ServiceSpec) { }
}

class Program implements InstrArgResolver {
    buffers = new VariableScope(null)
    roles = new VariableScope(this.buffers)
    functions = new VariableScope(null)
    globals = new VariableScope(this.roles)
    tree: estree.Program
    procs: Procedure[] = []
    floatLiterals: number[] = []
    stringLiterals: string[] = []
    writer: OpWriter
    proc: Procedure
    sysSpec: jdspec.ServiceSpec
    serviceSpecs: Record<string, jdspec.ServiceSpec>
    clientCommands: Record<string, ClientCommand[]> = {}
    refreshMS: number[] = [0, 500]
    resolverParams: number[]
    resolverPC: number
    numErrors = 0
    main: Procedure
    cloudRole: Role
    cloudMethod429: Label
    cloudMethodDispatcher: DelayedCodeSection
    startDispatchers: DelayedCodeSection
    onStart: DelayedCodeSection
    packetBuffer: Buffer
    loopStack: LoopLabels[] = []
    compileAll = false

    constructor(public host: Host, public source: string) {
        this.serviceSpecs = {}
        for (const sp of host.getSpecs()) {
            this.serviceSpecs[sp.camelName] = sp as any
        }
        this.sysSpec = this.serviceSpecs["system"]
    }

    addString(str: string) {
        return addUnique(this.stringLiterals, str)
    }

    indexToLine(idx: number) {
        const s = this.source.slice(0, idx)
        return s.replace(/[^\n]/g, "").length + 1
    }

    indexToPos(idx: number) {
        const s = this.source.slice(0, idx)
        const line = s.replace(/[^\n]/g, "").length + 1
        const column = s.replace(/.*\n/, "").length + 1
        return { line, column }
    }

    reportError(range: number[], msg: string): ValueDesc {
        this.numErrors++
        const err: JacError = {
            ...this.indexToPos(range[0]),
            message: msg,
            codeFragment: this.sourceFrag(range),
        }
            ; (this.host.error || printJacError)(err)
        return values.error
    }

    describeCell(t: CellKind, idx: number): string {
        switch (t) {
            //case CellKind.LOCAL:
            //    return this.proc.locals.describeIndex(idx)
            case CellKind.GLOBAL:
                return this.globals.describeIndex(idx)
            case CellKind.FLOAT_CONST:
                return this.floatLiterals[idx] + ""
            default:
                return undefined
        }
    }

    funName(idx: number): string {
        const p = this.procs[idx]
        if (p) return p.name
    }

    roleName(idx: number): string {
        return this.roles.describeIndex(idx)
    }

    private roleDispatcher(role: Role) {
        if (!role.dispatcher) {
            if (role.isLocal)
                throwError(null, "local roles are not supported here")
            const proc = new Procedure(this, role.getName() + "_disp")
            role.dispatcher = {
                proc,
                top: proc.writer.mkLabel("disp_top"),
                init: new DelayedCodeSection("init", proc),
                disconnected: new DelayedCodeSection("disconnected", proc),
                connected: new DelayedCodeSection("connected", proc),
                checkConnected: new DelayedCodeSection("checkConnected", proc),
                wasConnected: proc.mkTempLocal("connected_" + role.getName()),
            }
            this.withProcedure(proc, wr => {
                wr.push()
                const conn = this.emitIsRoleConnected(role)
                wr.assign(role.dispatcher.wasConnected.value(), conn)
                wr.pop()
                role.dispatcher.init.callHere()
                wr.emitLabel(role.dispatcher.top)
                wr.emitAsync(OpAsync.WAIT_ROLE, role.encode())
                role.dispatcher.checkConnected.callHere()
            })

            this.startDispatchers.emit(wr => {
                // this is only executed once, but with BG_MAX1 is easier to naively analyze memory usage
                wr.emitCall(proc, OpCall.BG_MAX1)
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
                            wr.push()
                            const connNow = this.emitIsRoleConnected(
                                role as Role
                            )
                            wr.pop()
                            const nowDis = wr.mkLabel("nowDis")
                            wr.emitJump(nowDis, connNow.index)

                            {
                                // now==connected
                                if (!disp.connected.empty()) {
                                    wr.push()
                                    const connPrev = wr.forceReg(
                                        disp.wasConnected.value()
                                    )
                                    wr.emitUnary(
                                        OpUnary.NOT,
                                        connPrev,
                                        connPrev
                                    )
                                    wr.pop()
                                    wr.emitJump(
                                        disp.checkConnected.returnLabel,
                                        connPrev.index
                                    )
                                    // prev==disconnected

                                    disp.connected.finalizeRaw()
                                }
                                wr.push()
                                wr.assign(
                                    disp.wasConnected.value(),
                                    floatVal(1)
                                )
                                wr.pop()
                                wr.emitJump(disp.checkConnected.returnLabel)
                            }

                            {
                                wr.emitLabel(nowDis)
                                // now==disconnected
                                if (!disp.disconnected.empty()) {
                                    wr.push()
                                    const connPrev = wr.forceReg(
                                        disp.wasConnected.value()
                                    )
                                    wr.pop()
                                    wr.emitJump(
                                        disp.checkConnected.returnLabel,
                                        connPrev.index
                                    )
                                    // prev==connected
                                    disp.disconnected.finalizeRaw()
                                }
                                wr.push()
                                wr.assign(
                                    disp.wasConnected.value(),
                                    values.zero
                                )
                                wr.pop()
                                wr.emitJump(disp.checkConnected.returnLabel)
                            }
                        })
                    }

                    // either way, finalize checkConnected
                    disp.checkConnected.finalize()
                })
        }
    }

    private finalizeAutoRefresh() {
        const proc = new Procedure(this, "_autoRefresh_")
        const period = 521
        this.withProcedure(proc, wr => {
            for (const role_ of this.roles.list) {
                const role = role_ as Role
                if (role.autoRefreshRegs.length == 0) continue
                wr.push()
                const isConn = this.emitIsRoleConnected(role)
                wr.emitIfAndPop(isConn, () => {
                    for (const reg of role.autoRefreshRegs) {
                        if (
                            reg.identifier == SystemReg.Reading &&
                            role.isSensor()
                        ) {
                            wr.push()
                            wr.emitSync(OpSync.SETUP_BUFFER, 1)
                            const v = wr.forceReg(floatVal(199))
                            wr.emitStoreByte(v, 0)
                            wr.pop()
                            wr.emitAsync(
                                OpAsync.SEND_CMD,
                                role.encode(),
                                SystemReg.StreamingSamples | CMD_SET_REG
                            )
                        } else {
                            wr.emitSync(OpSync.SETUP_BUFFER, 0)
                            wr.emitAsync(
                                OpAsync.SEND_CMD,
                                role.encode(),
                                reg.identifier | CMD_GET_REG
                            )
                        }
                    }
                })
            }
            wr.emitAsync(OpAsync.SLEEP_MS, period)
            wr.emitJump(wr.top)
        })

        this.startDispatchers.emit(wr => wr.emitCall(proc, OpCall.BG_MAX1))
    }

    private withProcedure<T>(proc: Procedure, f: (wr: OpWriter) => T) {
        assert(!!proc)
        const prevProc = this.proc
        try {
            this.proc = proc
            this.writer = proc.writer
            proc.writer.push()
            return f(proc.writer)
        } finally {
            proc.writer.pop()
            this.proc = prevProc
            if (prevProc) this.writer = prevProc.writer
        }
    }

    private forceName(
        pat: estree.Expression | estree.Pattern | estree.PrivateIdentifier | estree.Super
    ) {
        const r = idName(pat)
        if (!r) throwError(pat, "only simple identifiers supported")
        return (pat as estree.Identifier).name
    }

    private lookupRoleSpec(expr: Expr, serv: string) {
        const r = this.serviceSpecs.hasOwnProperty(serv)
            ? this.serviceSpecs[serv]
            : undefined
        if (!r) throwError(expr, "no such service: " + serv)
        return r
    }

    private parseRole(decl: estree.VariableDeclarator): Cell {
        const expr = decl.init
        if (expr?.type != "CallExpression") return null
        switch (idName(expr.callee)) {
            case "condition":
                this.requireArgs(expr, 0)
                return new Role(
                    this,
                    decl,
                    this.roles,
                    this.serviceSpecs["jacscriptCondition"]
                )
            case "buffer":
                this.requireArgs(expr, 1)
                const sz = this.forceNumberLiteral(expr.arguments[0])
                if ((sz | 0) != sz || sz <= 0 || sz > 1024)
                    throwError(
                        expr.arguments[0],
                        "buffer() length must be a positive integer (under 1k)"
                    )
                return new Buffer(decl, this.buffers, sz)
        }
        if (expr.callee.type != "MemberExpression") return null
        if (idName(expr.callee.object) != "roles") return null
        const spec = this.lookupRoleSpec(expr.callee, this.forceName(expr.callee.property))
        this.requireArgs(expr, 0)
        return new Role(this, decl, this.roles, spec)
    }

    private emitStore(trg: Variable, src: ValueDesc) {
        this.writer.assign(trg.value(), src)
    }

    private newDef(
        decl: { id: estree.Identifier | estree.Pattern } & estree.BaseNode
    ) {
        const id = this.forceName(decl.id)
        if (
            this.roles.lookup(id) ||
            (this.proc?.locals || this.globals).lookup(id) ||
            this.functions.lookup(id)
        )
            throwError(decl, `name '${id}' already defined`)
    }

    private emitVariableDeclaration(decls: estree.VariableDeclaration) {
        if (decls.kind != "var") throwError(decls, "only 'var' supported")
        for (const decl of decls.declarations) {
            let g: Variable
            if (this.isTopLevel(decl)) {
                const tmp = this.globals.lookup(this.forceName(decl.id))
                if (tmp instanceof Role) continue
                if (tmp instanceof Buffer) continue
                if (tmp instanceof Variable) g = tmp
                else {
                    if (this.numErrors == 0) oops("invalid var: " + tmp)
                    else continue
                }
            } else {
                this.newDef(decl)
                g = new Variable(decl, this.proc.locals)
                g.isLocal = true
            }

            if (decl.init) {
                this.writer.push()
                this.emitStore(g, this.emitSimpleValue(decl.init))
                this.writer.pop()
            }
        }
    }

    private emitIfStatement(stmt: estree.IfStatement) {
        const wr = this.writer
        wr.push()

        let cond = this.emitExpr(stmt.test)
        this.requireRuntimeValue(stmt.test, cond)
        if (cond.kind == CellKind.X_FLOAT) {
            wr.pop()
            if (cond.litValue) this.emitStmt(stmt.consequent)
            else {
                if (stmt.alternate) this.emitStmt(stmt.alternate)
            }
        } else {
            cond = wr.forceReg(cond)
            wr.emitIfAndPop(
                cond,
                () => this.emitStmt(stmt.consequent),
                stmt.alternate ? () => this.emitStmt(stmt.alternate) : null
            )
        }
    }

    private emitWhileStatement(stmt: estree.WhileStatement) {
        const wr = this.writer

        const continueLbl = wr.mkLabel("whileCont")
        const breakLbl = wr.mkLabel("whileBrk")

        wr.emitLabel(continueLbl)

        wr.push()
        let cond = this.emitExpr(stmt.test)
        this.requireRuntimeValue(stmt.test, cond)
        cond = wr.forceReg(cond)
        wr.emitJump(breakLbl, cond.index)
        wr.pop()

        try {
            this.loopStack.push({ continueLbl, breakLbl })
            this.emitStmt(stmt.body)
        } finally {
            this.loopStack.pop()
        }

        wr.emitJump(continueLbl)
        wr.emitLabel(breakLbl)
    }

    private emitAckCloud(
        code: JacscriptCloudCommandStatus,
        isOuter: boolean,
        args: Expr[] = []
    ) {
        const wr = this.writer
        wr.push()
        wr.allocBuf()
        {
            wr.push()
            const tmp = wr.allocReg()
            if (isOuter) wr.emitBufLoad(tmp, OpFmt.U32, 0)
            else wr.emitLoadCell(tmp, CellKind.LOCAL, 0)
            wr.emitSync(OpSync.SETUP_BUFFER, 8 + args.length * 8)
            wr.emitBufStore(tmp, OpFmt.U32, 0)
            wr.assign(tmp, floatVal(code))
            wr.emitBufStore(tmp, OpFmt.U32, 4)
            wr.pop()
        }
        let off = 8
        for (const arg of args) {
            wr.push()
            const v = this.emitSimpleValue(arg)
            wr.emitBufStore(v, OpFmt.F64, off)
            off += 8
            wr.pop()
        }
        wr.pop()
        this.writer.emitAsync(
            OpAsync.SEND_CMD,
            this.cloudRole.encode(),
            JacscriptCloudCmd.AckCloudCommand
        )
    }

    private emitReturnStatement(stmt: estree.ReturnStatement) {
        const wr = this.writer
        wr.push()
        if (this.proc.methodSeqNo) {
            let args: Expr[] = []
            if (stmt.argument?.type == "ArrayExpression") {
                args = stmt.argument.elements.slice()
            } else if (stmt.argument) {
                args = [stmt.argument]
            }
            this.emitAckCloud(JacscriptCloudCommandStatus.OK, false, args)
        } else if (stmt.argument) {
            const v = this.emitSimpleValue(stmt.argument)
            const r = wr.allocArgs(1)[0]
            wr.assign(r, v)
        } else {
            const r = wr.allocArgs(1)[0]
            wr.assign(r, values.nan)
        }
        wr.pop()
        this.writer.emitJump(this.writer.ret)
    }

    private specFromTypeName(expr: Expr, tp: string) {
        if (tp.endsWith("Role") && tp[0].toUpperCase() == tp[0]) {
            let r = tp.slice(0, -4)
            r = r[0].toLowerCase() + r.slice(1)
            return this.lookupRoleSpec(expr, r)
        } else {
            throwError(expr, "type name not understood: " + tp)
        }
    }

    private emitFunctionBody(
        stmt: estree.FunctionDeclaration | estree.FunctionExpression,
        proc: Procedure
    ) {
        const wr = this.writer
        this.emitStmt(stmt.body)
        wr.emitLabel(wr.ret)
        wr.emitSync(OpSync.RETURN)
    }

    private emitParameters(stmt: FunctionLike, proc: Procedure) {
        for (const paramdef of stmt.params) {
            if (paramdef.type != "Identifier")
                throwError(
                    paramdef,
                    "only simple identifiers supported as parameters"
                )

            let tp = ""

            const idx = paramdef.range?.[0]
            if (idx) {
                const pref = this.source.slice(0, idx).replace(/.*\n/, "")
                const m = /\/\*\*\s*@type\s+(.*?)\s*\*\/\s*$/.exec(pref)
                if (m) tp = m[1]
            }

            if (tp) {
                if (tp == "number") {
                    // OK!
                } else {
                    const spec = this.specFromTypeName(paramdef, tp)
                    const v = new Role(this, paramdef, proc.locals, spec)
                    v.isLocal = true
                    continue
                }
            }

            const v = new Variable(paramdef, proc.locals)
            v.isLocal = true
        }

        if (proc.locals.list.length >= 8)
            throwError(stmt.params[7], "too many arguments")
    }

    private getClientCommandProc(cc: ClientCommand) {
        if (cc.proc) return cc.proc

        const stmt = cc.defintion
        cc.proc = new Procedure(this, cc.serviceSpec.camelName + "." + cc.jsName)
        cc.proc.numargs = 1 + stmt.params.length

        this.withProcedure(cc.proc, wr => {
            const v = new Role(this, null, cc.proc.locals, cc.serviceSpec, "this")
            v.isLocal = true
            this.emitParameters(stmt, cc.proc)
            this.emitFunctionBody(stmt, cc.proc)
        })

        return cc.proc
    }

    private getFunctionProc(fundecl: FunctionDecl) {
        if (fundecl.proc) return fundecl.proc
        const stmt = fundecl.definition as estree.FunctionDeclaration

        fundecl.proc = new Procedure(this, fundecl.getName())
        fundecl.proc.numargs = stmt.params.length

        this.withProcedure(fundecl.proc, wr => {
            this.emitParameters(stmt, fundecl.proc)
            this.emitFunctionBody(stmt, fundecl.proc)
        })

        return fundecl.proc
    }

    private emitFunctionDeclaration(stmt: estree.FunctionDeclaration) {
        const fundecl = this.functions.list.find(
            f => f.definition === stmt
        ) as FunctionDecl
        if (!this.isTopLevel(stmt))
            throwError(stmt, "only top-level functions are supported")
        if (stmt.generator || stmt.async)
            throwError(stmt, "async not supported")
        assert(!!fundecl || !!this.numErrors)
        if (this.compileAll && fundecl)
            this.getFunctionProc(fundecl)
    }

    private isTopLevel(node: estree.Node) {
        return !!(node as any)._jacsIsTopLevel
    }

    private emitProgram(prog: estree.Program) {
        this.packetBuffer = new Buffer(
            null,
            this.buffers,
            JD_SERIAL_MAX_PAYLOAD_SIZE,
            "packet"
        )
        assert(this.packetBuffer._index == 0) // current packet is buffer #0

        this.main = new Procedure(this, "main")

        this.startDispatchers = new DelayedCodeSection(
            "startDispatchers",
            this.main
        )
        this.onStart = new DelayedCodeSection("onStart", this.main)
        prog.body.forEach(markTopLevel)
        // pre-declare all functions and globals
        for (const s of prog.body) {
            try {
                switch (s.type) {
                    case "FunctionDeclaration":
                        this.newDef(s)
                        const n = this.forceName(s.id)
                        if (reservedFunctions[n] == 1)
                            throwError(
                                s,
                                `function name '${n}' is reserved`
                            )
                        new FunctionDecl(s, this.functions)
                        break
                    case "VariableDeclaration":
                        for (const decl of s.declarations) {
                            this.newDef(decl)
                            if (!this.parseRole(decl)) {
                                new Variable(decl, this.globals)
                            }
                        }
                        break
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
            this.serviceSpecs["jacscriptCloud"],
            "cloud"
        )

        this.withProcedure(this.main, () => {
            this.startDispatchers.callHere()
            for (const s of prog.body) this.emitStmt(s)
            this.onStart.finalizeRaw()
            this.writer.emitSync(OpSync.RETURN)
            this.finalizeAutoRefresh()
            this.startDispatchers.finalize()
        })

        if (!this.cloudRole.used) {
            const cl = this.roles.list.pop()
            assert(cl == this.cloudRole)
        }

        function markTopLevel(node: estree.Node) {
            ; (node as any)._jacsIsTopLevel = true
            switch (node.type) {
                case "ExpressionStatement":
                    markTopLevel(node.expression)
                    break
                case "VariableDeclaration":
                    node.declarations.forEach(markTopLevel)
                    break
            }
        }
    }

    private ignore(val: ValueDesc) { }

    private emitExpressionStatement(stmt: estree.ExpressionStatement) {
        this.ignore(this.emitExpr(stmt.expression))
    }

    private emitHandler(
        name: string,
        func: Expr,
        options: {
            every?: number
            methodHandler?: boolean
        } = {}
    ): Procedure {
        if (func.type != "ArrowFunctionExpression")
            throwError(func, "arrow function expected here")
        const proc = new Procedure(this, name)
        if (func.params.length && !options.methodHandler)
            throwError(func, "parameters not supported here")
        this.withProcedure(proc, wr => {
            if (options.methodHandler)
                proc.methodSeqNo = proc.mkTempLocal("methSeqNo")
            this.emitParameters(func, proc)
            proc.numargs = proc.locals.list.length
            if (options.every) {
                if (options.every <= 0xffff)
                    wr.emitAsync(OpAsync.SLEEP_MS, options.every)
                else {
                    wr.push()
                    const tm = wr.allocArgs(1)[0]
                    wr.assign(tm, floatVal(options.every / 1000))
                    wr.pop()
                    wr.emitAsync(OpAsync.SLEEP_R0)
                }
            }
            if (func.body.type == "BlockStatement") {
                for (const stmt of func.body.body) this.emitStmt(stmt)
            } else {
                this.ignore(this.emitExpr(func.body))
            }
            wr.emitLabel(wr.ret)
            if (options.every) wr.emitJump(wr.top)
            else {
                if (options.methodHandler)
                    this.emitAckCloud(JacscriptCloudCommandStatus.OK, false, [])
                wr.emitSync(OpSync.RETURN)
            }
        })
        return proc
    }

    private codeName(node: estree.BaseNode) {
        let [a, b] = node.range || []
        if (!b) return ""
        if (b - a > 30) b = a + 30
        return this.source.slice(a, b).replace(/[^a-zA-Z0-9_]+/g, "_")
    }

    private requireArgs(expr: estree.CallExpression, num: number) {
        if (expr.arguments.length != num)
            throwError(
                expr,
                `${num} arguments required; got ${expr.arguments.length}`
            )
    }

    private emitInRoleDispatcher(role: Role, f: (wr: OpWriter) => void) {
        const disp = this.roleDispatcher(role)
        this.withProcedure(disp.proc, f)
    }

    private inlineBin(subop: OpBinary, left: ValueDesc, right: ValueDesc) {
        const wr = this.writer
        const l = wr.forceReg(left)
        const r = wr.forceReg(right)
        wr.emitBin(subop, l, r)
        return l
    }

    private requireTopLevel(expr: estree.CallExpression) {
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
            wr.push()
            const cond = this.inlineBin(
                OpBinary.EQ,
                specialVal(ValueSpecial.EV_CODE),
                floatVal(code)
            )
            wr.emitIfAndPop(cond, () =>
                wr.emitCall(handler, OpCall.BG_MAX1_PEND1)
            )
        })
    }

    private emitEventCall(
        expr: estree.CallExpression,
        obj: ValueDesc,
        prop: string
    ): ValueDesc {
        const role = obj.role
        switch (prop) {
            case "subscribe":
                this.requireTopLevel(expr)
                this.requireArgs(expr, 1)
                this.emitEventHandler(
                    this.codeName(expr.callee),
                    expr.arguments[0],
                    role,
                    obj.spec.identifier
                )
                return values.zero
            case "wait":
                this.requireArgs(expr, 0)
                const wr = this.writer
                const lbl = wr.mkLabel("wait")
                wr.emitLabel(lbl)
                wr.emitAsyncWithRole(OpAsync.WAIT_ROLE, role)
                wr.push()
                const cond = this.inlineBin(
                    OpBinary.EQ,
                    specialVal(ValueSpecial.EV_CODE),
                    floatVal(obj.spec.identifier)
                )
                wr.pop()
                wr.emitJump(lbl, cond.index)
                return values.zero
        }
        throwError(expr, `events don't have property ${prop}`)
    }

    private extractRegField(obj: ValueDesc, field: jdspec.PacketMember) {
        const wr = this.writer
        const r = wr.allocReg()
        let off = 0
        for (const f of obj.spec.fields) {
            if (f == field) {
                wr.emitBufOp(OpTop.LOAD_CELL, r, off, field)
                return r
            } else {
                off += Math.abs(f.storage)
            }
        }
        oops("field missing")
    }

    private emitRegGet(
        obj: ValueDesc,
        refresh?: RefreshMS,
        field?: jdspec.PacketMember
    ) {
        if (refresh === undefined)
            refresh =
                obj.spec.kind == "const" ? RefreshMS.Never : RefreshMS.Normal
        if (!field && obj.spec.fields.length == 1) field = obj.spec.fields[0]

        const role = obj.role
        const wr = this.writer
        wr.emitAsyncWithRole(
            OpAsync.QUERY_REG,
            role,
            obj.spec.identifier,
            refresh
        )
        if (field) {
            return this.extractRegField(obj, field)
        } else {
            const r: ValueDesc = {
                kind: CellKind.JD_VALUE_SEQ,
                index: null,
                role,
                spec: obj.spec,
            }
            return r
        }
    }

    private emitIsRoleConnected(role: Role) {
        const wr = this.writer
        const reg = wr.allocReg()
        wr.emitLoadCell(
            reg,
            CellKind.ROLE_PROPERTY,
            OpRoleProperty.IS_CONNECTED,
            role.extEncode(wr, PrefixReg.B)
        )
        return reg
    }

    private emitRoleCall(
        expr: estree.CallExpression,
        role: Role,
        prop: string
    ): ValueDesc {
        const wr = this.writer
        if (expr.callee.type != "MemberExpression") oops("")
        switch (prop) {
            case "isConnected":
                this.requireArgs(expr, 0)
                return this.emitIsRoleConnected(role)
            case "onConnected":
            case "onDisconnected":
                this.requireTopLevel(expr)
                this.requireArgs(expr, 1)
                const name = role.getName() + "_" + prop
                const handler = this.emitHandler(name, expr.arguments[0])
                const disp = this.roleDispatcher(role)
                const section =
                    prop == "onConnected" ? disp.connected : disp.disconnected
                section.emit(wr => {
                    wr.emitCall(handler, OpCall.BG_MAX1_PEND1)
                })
                if (prop == "onConnected")
                    disp.init.emit(wr => {
                        wr.push()
                        const r = wr.forceReg(disp.wasConnected.value())
                        wr.emitIfAndPop(r, () => {
                            wr.emitCall(handler, OpCall.BG_MAX1)
                        })
                    })
                return values.zero
            case "wait":
                if (!role.isCondition())
                    throwError(expr, "only condition()s have wait()")
                this.requireArgs(expr, 0)
                wr.emitAsyncWithRole(OpAsync.WAIT_ROLE, role)
                return values.zero
            default:
                const v = this.emitRoleMember(expr.callee, role)
                if (v.kind == CellKind.JD_CLIENT_COMMAND) {
                    return this.emitProcCall(expr, this.getClientCommandProc(v.clientCommand), true)
                } else if (v.kind == CellKind.JD_COMMAND) {
                    this.emitPackArgs(expr, v.spec)
                    this.writer.emitAsyncWithRole(
                        OpAsync.SEND_CMD,
                        role,
                        v.spec.identifier
                    )
                } else if (v.kind != CellKind.ERROR) {
                    throwError(
                        expr,
                        `${stringifyCellKind(v.kind)} can't be called`
                    )
                }
                return values.zero
        }
    }

    private parseFormat(expr: Expr): OpFmt {
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

        let r: OpFmt

        switch (sz) {
            case 8:
                r = OpFmt.U8
                break
            case 16:
                r = OpFmt.U16
                break
            case 32:
                r = OpFmt.U32
                break
            case 64:
                r = OpFmt.U64
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
                r += OpFmt.I8
                break
            case "f":
                if (shift)
                    throwError(expr, `shifts not supported for floats`)
                r += OpFmt.F8
                break
            default:
                assert(false)
        }

        if (r == OpFmt.F8 || r == OpFmt.F16)
            throwError(expr, `f8 and f16 are not supported`)

        return r | (shift << 4)
    }

    private emitBufferCall(
        expr: estree.CallExpression,
        buf: Buffer,
        prop: string
    ): ValueDesc {
        const wr = this.writer
        if (expr.callee.type != "MemberExpression") oops("")
        switch (prop) {
            case "getAt": {
                this.requireArgs(expr, 2)
                const fmt = this.parseFormat(expr.arguments[1])
                wr.push()
                const off = this.emitSimpleValue(expr.arguments[0], CellKind.X_FLOAT)
                wr.setPrefixReg(PrefixReg.C, off)
                wr.pop()
                const reg = wr.allocReg()
                wr.emitBufLoad(reg, fmt, 0, buf.encode())
                return reg
            }

            case "setAt": {
                this.requireArgs(expr, 3)
                const fmt = this.parseFormat(expr.arguments[1])
                wr.push()
                const off = this.emitSimpleValue(expr.arguments[0], CellKind.X_FLOAT)
                const val = this.emitSimpleValue(expr.arguments[2])
                wr.setPrefixReg(PrefixReg.C, off)
                wr.emitBufStore(val, fmt, 0, buf.encode())
                wr.pop()
                return values.zero
            }

            case "setLength": {
                this.requireArgs(expr, 1)
                wr.push()
                const len = this.emitSimpleValue(expr.arguments[0], CellKind.X_FLOAT)
                wr.setPrefixReg(PrefixReg.A, len)
                wr.pop()
                wr.emitSync(OpSync.SETUP_BUFFER, 0, 0, 0, buf.encode())
                return values.zero
            }

            default:
                throwError(expr, `can't find ${prop} on buffer`)
        }
    }

    private stringLiteral(expr: Expr) {
        if (expr?.type == "Literal" && typeof expr.value == "string") {
            return expr.value
        }
        return undefined
    }

    private forceStringLiteral(expr: Expr) {
        const v = this.stringLiteral(expr)
        if (v === undefined) throwError(expr, "string literal expected")
        return this.writer.emitString(v)
    }

    private emitPackArgs(
        expr: estree.CallExpression,
        pspec: jdspec.PacketInfo
    ) {
        let offset = 0
        let repeatsStart = -1
        let specIdx = 0
        const fields = pspec.fields

        if (expr.arguments.length == 1 && idName(expr.arguments[0]) == "packet")
            return

        const args = expr.arguments.map(arg => {
            if (specIdx >= fields.length) {
                if (repeatsStart != -1) specIdx = repeatsStart
                else throwError(arg, `too many arguments`)
            }
            const spec = pspec.fields[specIdx++]
            if (spec.startRepeats) repeatsStart = specIdx - 1
            let size = Math.abs(spec.storage)
            let stringLiteral: string = undefined
            if (size == 0) {
                stringLiteral = this.stringLiteral(arg)
                if (stringLiteral == undefined)
                    throwError(arg, "expecting a string literal here")
                size = strlen(stringLiteral)
                if (spec.type == "string0") size += 1
            }
            const val =
                stringLiteral === undefined ? this.emitSimpleValue(arg) : null
            const r = {
                stringLiteral,
                size,
                offset,
                spec,
                val,
            }
            offset += size
            return r
        })

        // this could be skipped - they will just be zero
        if (specIdx < fields.length)
            throwError(expr, "not enough arguments")

        if (offset > JD_SERIAL_MAX_PAYLOAD_SIZE)
            throwError(expr, "arguments do not fit in a packet")

        const wr = this.writer

        wr.push()
        wr.allocBuf()
        wr.emitSync(OpSync.SETUP_BUFFER, offset)
        for (const desc of args) {
            if (desc.stringLiteral !== undefined) {
                const vd = wr.emitString(desc.stringLiteral)
                wr.emitSync(OpSync.MEMCPY, vd.index, 0, desc.offset)
            } else {
                wr.push()
                wr.emitBufOp(OpTop.STORE_CELL, desc.val, desc.offset, desc.spec)
                wr.pop()
            }
        }
        wr.pop()
    }

    private emitRegisterCall(
        expr: estree.CallExpression,
        obj: ValueDesc,
        prop: string
    ): ValueDesc {
        const role = obj.role
        assertRange(0, obj.spec.identifier, 0x1ff)

        const wr = this.writer
        switch (prop) {
            case "read":
                this.requireArgs(expr, 0)
                return this.emitRegGet(obj)
            case "write":
                this.emitPackArgs(expr, obj.spec)
                wr.emitAsyncWithRole(
                    OpAsync.SEND_CMD,
                    role,
                    obj.spec.identifier | CMD_SET_REG
                )
                return values.zero
            case "onChange":
                this.requireArgs(expr, 2)
                this.requireTopLevel(expr)
                if (obj.spec.fields.length != 1)
                    throwError(expr, "wrong register type")
                const threshold = this.forceNumberLiteral(expr.arguments[0])
                const name = role.getName() + "_chg_" + obj.spec.name
                const handler = this.emitHandler(name, expr.arguments[1])
                if (role.autoRefreshRegs.indexOf(obj.spec) < 0)
                    role.autoRefreshRegs.push(obj.spec)
                this.emitInRoleDispatcher(role, wr => {
                    const cache = this.proc.mkTempLocal(name)
                    role.dispatcher.init.emit(wr => {
                        wr.assign(cache.value(), values.nan)
                    })
                    wr.push()
                    const cond = this.inlineBin(
                        OpBinary.EQ,
                        specialVal(ValueSpecial.REG_GET_CODE),
                        floatVal(obj.spec.identifier)
                    )
                    wr.emitIfAndPop(cond, () => {
                        // get the reg value from current packet
                        wr.push()
                        const curr = this.extractRegField(
                            obj,
                            obj.spec.fields[0]
                        )
                        const skipHandler = wr.mkLabel("skipHandler")
                        // if (isNaN(curr)) goto skip (shouldn't really happen unless service is misbehaving)
                        const tmp = wr.allocReg()
                        wr.emitUnary(OpUnary.IS_NAN, tmp, curr)
                        wr.emitUnary(OpUnary.NOT, tmp, tmp)
                        wr.emitJump(skipHandler, tmp.index)
                        // tmp := cache
                        wr.assign(tmp, cache.value())
                        // if (Math.abs(tmp-curr) <= threshold) goto skip
                        // note that this also calls handler() if cache was NaN
                        wr.emitBin(OpBinary.SUB, tmp, curr)
                        wr.emitUnary(OpUnary.ABS, tmp, tmp)
                        const thresholdReg = wr.forceReg(floatVal(threshold))
                        wr.emitBin(OpBinary.LE, tmp, thresholdReg)
                        wr.emitUnary(OpUnary.NOT, tmp, tmp)
                        wr.emitJump(skipHandler, tmp.index)
                        // cache := curr
                        wr.assign(cache.value(), curr)
                        wr.pop()
                        // handler()
                        wr.emitCall(handler, OpCall.BG_MAX1_PEND1)
                        // skip:
                        wr.emitLabel(skipHandler)
                    })
                })
                return values.zero
        }
        throwError(expr, `events don't have property ${prop}`)
    }

    private multExpr(v: ValueDesc, scale: number) {
        if (v.kind == CellKind.X_FLOAT) return floatVal(v.index * scale)
        this.writer.emitBin(OpBinary.MUL, v, floatVal(scale))
        return v
    }

    private emitArgs(args: Expr[], formals?: Cell[]) {
        const wr = this.writer
        const tmpargs: number[] = []
        wr.push()
        for (let i = 0; i < args.length; i++) {
            wr.push()
            const f = formals?.[i]
            let r: ValueDesc
            if (f instanceof Role) {
                r = this.emitRoleRef(args[i])
            } else {
                r = this.emitSimpleValue(args[i])
            }
            wr.popExcept(r)
            tmpargs.push(r.index)
        }
        wr.pop()

        if (tmpargs.some(idx => idx < args.length))
            throwError(args[0], "args register clash")

        const regs = wr.allocArgs(args.length)
        for (let i = 0; i < regs.length; ++i) {
            assert(regs[i].index == i)
            wr.emitMov(i, tmpargs[i])
        }

        return regs
    }

    private forceNumberLiteral(expr: Expr) {
        const tmp = this.emitExpr(expr)
        if (tmp.kind != CellKind.X_FLOAT)
            throwError(expr, "number literal expected")
        return tmp.index
    }

    private finalizeCloudMethods() {
        if (!this.cloudMethodDispatcher) return
        this.emitInRoleDispatcher(this.cloudRole, wr => {
            const skipMethods = wr.mkLabel("skipMethods")

            wr.push()
            const cond = this.inlineBin(
                OpBinary.EQ,
                specialVal(ValueSpecial.EV_CODE),
                floatVal(JacscriptCloudEvent.CloudCommand)
            )
            wr.emitJump(skipMethods, cond.index)
            wr.pop()

            this.cloudMethodDispatcher.finalizeRaw()
            this.emitAckCloud(JacscriptCloudCommandStatus.NotFound, true)
            wr.emitJump(this.cloudRole.dispatcher.top)

            wr.emitLabel(this.cloudMethod429)
            this.emitAckCloud(JacscriptCloudCommandStatus.Busy, true)
            wr.emitJump(this.cloudRole.dispatcher.top)

            wr.emitLabel(skipMethods)
        })
    }

    private emitGetTwin(path: ValueDesc) {
        const wr = this.writer
        wr.emitAsync(
            OpAsync.QUERY_IDX_REG,
            this.cloudRole.encode(),
            JacscriptCloudCmd.GetTwin | (path.index << 8),
            RefreshMS.Slow
        )
        const res = wr.allocReg()
        wr.emitBufLoad(res, OpFmt.F64, 0)
        return res
    }

    private emitCloudMethod(expr: estree.CallExpression) {
        this.requireTopLevel(expr)
        this.requireArgs(expr, 2)
        const str = this.forceStringLiteral(expr.arguments[0])
        const handler = this.emitHandler(
            this.codeName(expr.callee),
            expr.arguments[1],
            { methodHandler: true }
        )
        if (!this.cloudMethodDispatcher) {
            this.emitInRoleDispatcher(this.cloudRole, wr => {
                this.cloudMethod429 = wr.mkLabel("cloud429")
            })
            this.cloudMethodDispatcher = new DelayedCodeSection(
                "cloud_method",
                this.cloudRole.dispatcher.proc
            )
        }

        this.cloudMethodDispatcher.emit(wr => {
            const skip = wr.mkLabel("skipMethod")

            {
                wr.push()
                const r0 = wr.allocArgs(1)[0]
                wr.emitSync(OpSync.STR0EQ, str.index, 0, 4)
                wr.emitJump(skip, r0.index)
                wr.pop()
            }

            {
                wr.push()
                const args = wr.allocArgs(handler.numargs)
                wr.emitBufLoad(args[0], OpFmt.U32, 0)
                const pref =
                    4 + strlen(this.stringLiteral(expr.arguments[0])) + 1
                for (let i = 1; i < handler.numargs; ++i)
                    wr.emitBufLoad(args[i], OpFmt.F64, pref + (i - 1) * 8)
                wr.pop()
            }

            wr.emitCall(handler, OpCall.BG_MAX1)
            wr.emitJump(this.cloudMethod429, 0)
            wr.emitJump(this.cloudRole.dispatcher.top)

            wr.emitLabel(skip)
        })
    }

    private emitCloud(expr: estree.CallExpression, fnName: string): ValueDesc {
        switch (fnName) {
            case "cloud.upload":
                const spec = this.cloudRole.spec.packets.find(
                    p => p.name == "upload"
                )
                this.emitPackArgs(expr, spec)
                this.writer.emitAsync(
                    OpAsync.SEND_CMD,
                    this.cloudRole.encode(),
                    spec.identifier
                )
                return values.zero
            case "cloud.twin":
                this.requireArgs(expr, 1)
                const path = this.forceStringLiteral(expr.arguments[0])
                return this.emitGetTwin(path)
            case "cloud.onTwinChange":
                this.requireTopLevel(expr)
                this.requireArgs(expr, 1)
                this.emitEventHandler(
                    "twin_changed",
                    expr.arguments[0],
                    this.cloudRole,
                    JacscriptCloudEvent.TwinChange
                )
                return values.zero
            case "cloud.onMethod":
                this.emitCloudMethod(expr)
                return values.zero
            case "console.log":
                this.writer.push()
                this.writer.emitAsync(
                    OpAsync.LOG_FORMAT,
                    this.emitFmtArgs(expr),
                    expr.arguments.length - 1
                )
                this.writer.pop()
                return values.zero
            default:
                return null
        }
    }

    private emitMath(expr: estree.CallExpression, fnName: string): ValueDesc {
        interface Desc {
            m1?: OpMath1
            m2?: OpMath2
            lastArg?: number
            firstArg?: number
            div?: number
        }

        const funs: SMap<Desc> = {
            "Math.floor": { m1: OpMath1.FLOOR },
            "Math.round": { m1: OpMath1.ROUND },
            "Math.ceil": { m1: OpMath1.CEIL },
            "Math.log": { m1: OpMath1.LOG_E },
            "Math.random": { m1: OpMath1.RANDOM, lastArg: 1.0 },
            "Math.randomInt": { m1: OpMath1.RANDOM_INT },
            "Math.max": { m2: OpMath2.MAX },
            "Math.min": { m2: OpMath2.MIN },
            "Math.pow": { m2: OpMath2.POW },
            "Math.idiv": { m2: OpMath2.IDIV },
            "Math.imul": { m2: OpMath2.IMUL },
            "Math.sqrt": { m2: OpMath2.POW, lastArg: 1 / 2 },
            "Math.cbrt": { m2: OpMath2.POW, lastArg: 1 / 3 },
            "Math.exp": { m2: OpMath2.POW, firstArg: Math.E },
            "Math.log10": { m1: OpMath1.LOG_E, div: Math.log(10) },
            "Math.log2": { m1: OpMath1.LOG_E, div: Math.log(2) },
            "Math.abs": { m1: OpMath1._LAST + 1 },
        }

        const wr = this.writer
        const f = funs[fnName]
        if (!f) return null

        let numArgs = f.m1 !== undefined ? 1 : f.m2 !== undefined ? 2 : NaN
        const origArgs = numArgs
        if (f.firstArg !== undefined) numArgs--
        if (f.lastArg !== undefined) numArgs--
        assert(!isNaN(numArgs))
        this.requireArgs(expr, numArgs)

        if (fnName == "Math.abs") {
            const r = this.emitSimpleValue(expr.arguments[0])
            wr.emitUnary(OpUnary.ABS, r, r)
            return r
        }

        wr.push()
        const args = expr.arguments.slice()
        if (f.firstArg !== undefined) args.unshift(this.mkLiteral(f.firstArg))
        if (f.lastArg !== undefined) args.push(this.mkLiteral(f.lastArg))
        assert(args.length == origArgs)
        const allArgs = this.emitArgs(args)
        if (f.m1 !== undefined) wr.emitSync(OpSync.MATH1, f.m1)
        else wr.emitSync(OpSync.MATH2, f.m2)
        // don't return r0, as this will interfere with nested calls
        const res = wr.allocReg()
        wr.assign(res, allArgs[0])
        wr.popExcept(res)

        if (f.div !== undefined) {
            wr.push()
            const d = this.emitSimpleValue(this.mkLiteral(1 / f.div))
            wr.emitBin(OpBinary.MUL, res, d)
            wr.pop()
        }

        return res
    }

    private emitProcCall(expr: estree.CallExpression, proc: Procedure, isMember = false) {
        const wr = this.writer
        const args = expr.arguments.slice()
        if (isMember) {
            this.requireArgs(expr, proc.numargs - 1)
            if (expr.callee.type == "MemberExpression")
                args.unshift(expr.callee.object as estree.Expression)
            else
                assert(false)
        } else {
            this.requireArgs(expr, proc.numargs)
        }
        wr.push()
        this.emitArgs(args, proc.args())
        wr.pop()
        wr.emitCall(proc)
        const r = wr.allocReg()
        wr.emitMov(r.index, 0)
        return r
    }

    private emitCallExpression(expr: estree.CallExpression): ValueDesc {
        const wr = this.writer
        if (expr.callee.type == "MemberExpression") {
            const prop = idName(expr.callee.property)
            const objName = idName(expr.callee.object)
            if (objName) {
                const fullName = objName + "." + prop
                const r =
                    this.emitMath(expr, fullName) ||
                    this.emitCloud(expr, fullName)
                if (r) return r
            }
            const obj = this.emitExpr(expr.callee.object)
            switch (obj.kind) {
                case CellKind.JD_EVENT:
                    return this.emitEventCall(expr, obj, prop)
                case CellKind.JD_REG:
                    return this.emitRegisterCall(expr, obj, prop)
                case CellKind.JD_ROLE:
                    return this.emitRoleCall(expr, obj.role, prop)
                case CellKind.X_BUFFER:
                    return this.emitBufferCall(expr, obj.buffer, prop)
            }
        }

        const funName = idName(expr.callee)

        if (!funName) throwError(expr, `unsupported call`)

        if (!reservedFunctions[funName]) {
            const d = this.functions.lookup(funName) as FunctionDecl
            if (d) {
                return this.emitProcCall(expr, this.getFunctionProc(d))
            } else {
                throwError(expr, `can't find function '${funName}'`)
            }
        }

        switch (funName) {
            case "wait": {
                this.requireArgs(expr, 1)
                const v = this.emitExpr(expr.arguments[0])
                const tm =
                    v.litValue !== undefined
                        ? Math.round(v.litValue * 1000)
                        : 0x1000000
                if (0 < tm && tm <= 0xffff) wr.emitAsync(OpAsync.SLEEP_MS, tm)
                else {
                    wr.push()
                    const r0 = wr.allocArgs(1)[0]
                    wr.assign(r0, v)
                    wr.pop()
                    wr.emitAsync(OpAsync.SLEEP_R0)
                }
                return values.zero
            }
            case "isNaN": {
                this.requireArgs(expr, 1)
                const r = this.emitSimpleValue(expr.arguments[0])
                wr.emitUnary(OpUnary.IS_NAN, r, r)
                return r
            }
            case "reboot": {
                this.requireArgs(expr, 0)
                wr.emitSync(OpSync.PANIC, 0)
                return values.zero
            }
            case "panic": {
                this.requireArgs(expr, 1)
                const code = this.forceNumberLiteral(expr.arguments[0])
                if ((code | 0) != code || code <= 0 || code > 9999)
                    throwError(
                        expr,
                        "panic() code must be integer between 1 and 9999"
                    )
                wr.emitSync(OpSync.PANIC, code)
                return values.zero
            }
            case "every": {
                this.requireTopLevel(expr)
                this.requireArgs(expr, 2)
                const time = Math.round(
                    this.forceNumberLiteral(expr.arguments[0]) * 1000
                )
                if (time < 20)
                    throwError(
                        expr,
                        "minimum every() period is 0.02s (20ms)"
                    )
                const proc = this.emitHandler("every", expr.arguments[1], {
                    every: time,
                })
                wr.emitCall(proc, OpCall.BG)
                return values.zero
            }
            case "onStart": {
                this.requireTopLevel(expr)
                this.requireArgs(expr, 1)
                const proc = this.emitHandler("onStart", expr.arguments[0])
                this.onStart.emit(wr => wr.emitCall(proc))
                return values.zero
            }
            case "format":
                wr.push()
                const r = wr.allocBuf()
                wr.emitSync(
                    OpSync.FORMAT,
                    this.emitFmtArgs(expr),
                    expr.arguments.length - 1
                )
                wr.popExcept(r)
                return r
        }
        throwError(expr, "unhandled call")
    }

    private emitFmtArgs(expr: estree.CallExpression) {
        const fmtString = this.forceStringLiteral(expr.arguments[0])
        this.emitArgs(expr.arguments.slice(1))
        return fmtString.index
    }

    private emitIdentifier(expr: estree.Identifier): ValueDesc {
        const id = this.forceName(expr)
        if (id == "NaN") return values.nan
        const cell = this.proc.locals.lookup(id)
        if (!cell) throwError(expr, "unknown name: " + id)
        return cell.value()
    }

    private emitThisExpression(expr: estree.ThisExpression): ValueDesc {
        const cell = this.proc.locals.lookup("this")
        if (!cell) throwError(expr, "'this' cannot be used here")
        return cell.value()
    }

    private matchesSpecName(pi: jdspec.PacketInfo, id: string) {
        return matchesName(pi.name, id)
    }

    private emitRoleMember(expr: estree.MemberExpression, role: Role) {
        const propName = this.forceName(expr.property)
        let r: ValueDesc

        const setKind = (p: jdspec.PacketInfo, id: CellKind) => {
            assert(!r)
            r = {
                kind: id,
                index: p.identifier,
                role,
                spec: p
            }
        }

        for (const cmd of this.clientCommands[role.spec.camelName] ?? []) {
            if (this.matchesSpecName(cmd.pktSpec, propName)) {
                setKind(cmd.pktSpec, CellKind.JD_CLIENT_COMMAND)
                r.clientCommand = cmd
                return r
            }
        }

        let generic: jdspec.PacketInfo
        for (const p of this.sysSpec.packets) {
            if (this.matchesSpecName(p, propName)) generic = p
        }

        for (const p of role.spec.packets) {
            if (
                this.matchesSpecName(p, propName) ||
                (generic?.identifier == p.identifier && generic?.kind == p.kind)
            ) {
                if (isRegister(p)) {
                    setKind(p, CellKind.JD_REG)
                }
                if (isEvent(p)) {
                    setKind(p, CellKind.JD_EVENT)
                }
                if (isCommand(p)) {
                    setKind(p, CellKind.JD_COMMAND)
                }
            }
        }

        if (r?.spec?.client)
            throwError(expr, `client packet '${r.spec.name}' not implemented on ${role.spec.camelName}`)

        if (!r)
            throwError(
                expr,
                `role ${role.getName()} has no member ${propName}`
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

    private emitMemberExpression(expr: estree.MemberExpression): ValueDesc {
        if (idName(expr.object) == "Math") {
            const id = idName(expr.property)
            if (mathConst.hasOwnProperty(id)) return floatVal(mathConst[id])
        }
        const obj = this.emitExpr(expr.object)
        if (obj.kind == CellKind.JD_ROLE) {
            return this.emitRoleMember(expr, obj.role)
        } else if (obj.kind == CellKind.JD_REG) {
            const propName = this.forceName(expr.property)
            if (obj.spec.fields.length > 1) {
                const fld = obj.spec.fields.find(f =>
                    matchesName(f.name, propName)
                )
                if (!fld)
                    throwError(
                        expr,
                        `no field ${propName} in ${obj.spec.name}`
                    )
                return this.emitRegGet(obj, undefined, fld)
            } else {
                throwError(
                    expr,
                    `unhandled member ${propName}; use .read()`
                )
            }
        }

        throwError(expr, `unhandled member ${idName(expr.property)}`)
    }

    private mkLiteral(v: number): estree.Literal {
        return {
            type: "Literal",
            value: v,
        }
    }

    private emitLiteral(expr: estree.Literal): ValueDesc {
        let v = expr.value
        if (v === true) v = 1
        else if (v === false) v = 0
        else if (v === null || v === undefined) v = 0

        const wr = this.writer

        if (typeof v == "string") {
            const r = wr.allocBuf()
            const vd = wr.emitString(v)
            wr.emitSync(OpSync.SETUP_BUFFER, strlen(v))
            wr.emitSync(OpSync.MEMCPY, vd.index)
            return r
        }

        if (typeof v == "number") return floatVal(v)
        throwError(expr, "unhandled literal: " + v)
    }

    private lookupCell(expr: estree.Expression | estree.Pattern) {
        const name = this.forceName(expr)
        const r = this.proc.locals.lookup(name)
        if (!r) throwError(expr, `can't find '${name}'`)
        return r
    }

    private lookupVar(expr: estree.Expression | estree.Pattern) {
        const r = this.lookupCell(expr)
        if (!(r instanceof Variable))
            throwError(expr, "expecting variable")
        return r
    }

    private emitSimpleValue(expr: Expr, except?: CellKind) {
        this.writer.push()
        const val = this.emitExpr(expr)
        if (except != undefined && val.kind === except) {
            this.writer.pop()
            return val
        }
        this.requireRuntimeValue(expr, val)
        const r = this.writer.forceReg(val)
        this.writer.popExcept(r)
        return r
    }

    private emitRoleRef(expr: Expr) {
        this.writer.push()
        const val = this.emitExpr(expr)
        if (val.kind != CellKind.JD_ROLE)
            throwError(expr, "role expected here")
        const r = this.writer.forceReg(val.role.rawValue())
        this.writer.popExcept(r)
        return r
    }

    private emitValueInto(trg: ValueDesc, expr: Expr) {
        assert(this.writer.isReg(trg))
        this.writer.push()
        const val = this.emitExpr(expr)
        this.requireRuntimeValue(expr, val)
        this.writer.assign(trg, val)
        this.writer.pop()
    }

    private requireRuntimeValue(node: estree.BaseNode, v: ValueDesc) {
        switch (v.kind) {
            case CellKind.X_FP_REG:
            case CellKind.LOCAL:
            case CellKind.GLOBAL:
            case CellKind.FLOAT_CONST:
            case CellKind.IDENTITY:
            case CellKind.X_FLOAT:
            case CellKind.SPECIAL:
                break
            default:
                throwError(node, "a number required here")
        }
    }

    private emitPrototypeUpdate(
        expr: estree.AssignmentExpression
    ): ValueDesc {
        if (expr.left.type != "MemberExpression" ||
            expr.left.object.type != "MemberExpression" ||
            idName(expr.left.object.property) != "prototype")
            return null

        const clName = this.forceName(expr.left.object.object)
        const spec = this.specFromTypeName(expr.left.object.object, clName)
        const fnName = this.forceName(expr.left.property)
        if (expr.right.type != "FunctionExpression")
            throwError(expr.right, "expecting 'function (...) { }' here")

        const cmd = new ClientCommand(spec)
        cmd.defintion = expr.right
        cmd.jsName = fnName

        const fn = expr.right
        cmd.pktSpec = spec.packets.filter(p => p.kind == "command" && matchesName(p.name, fnName))[0]
        const paramNames = fn.params.map(p => this.forceName(p))
        if (cmd.pktSpec) {
            if (!cmd.pktSpec.client)
                throwError(expr.left, "only 'client' commands can be implemented")
            const flds = cmd.pktSpec.fields
            if (paramNames.length != flds.length)
                throwError(fn, `expecting ${flds.length} parameter(s); got ${paramNames.length}`)
            for (let i = 0; i < flds.length; ++i) {
                const f = flds[i]
                if (f.storage == 0)
                    throwError(fn, `client command has non-numeric parameter ${f.name}`)
                if (paramNames.findIndex(p => p == f.name || matchesName(f.name, p)) != i)
                    throwError(fn, `parameter ${f.name} found at wrong index`)
            }
        } else {
            cmd.pktSpec = {
                kind: "command",
                description: '',
                client: true,
                identifier: 0x10000 + Object.keys(this.clientCommands).length,
                name: snakify(fnName),
                fields: fn.params.map(p => ({
                    name: this.forceName(p),
                    type: "f64",
                    storage: 8,
                }))
            }
            cmd.isFresh = true
            if (spec.packets.some(p => p.name == cmd.pktSpec.name))
                throwError(expr.left, `'${cmd.pktSpec.name}' already exists on ${spec.camelName}`)
        }

        let lst = this.clientCommands[spec.camelName]
        if (!lst)
            lst = this.clientCommands[spec.camelName] = []
        if (lst.some(e => e.pktSpec.name == cmd.pktSpec.name))
            throwError(expr.left, `${cmd.pktSpec.name} already implemented on ${spec.camelName}`)
        lst.push(cmd)

        if (this.compileAll)
            this.getClientCommandProc(cmd)

        return values.zero
    }

    private emitAssignmentExpression(
        expr: estree.AssignmentExpression
    ): ValueDesc {
        if (expr.operator != "=")
            throwError(expr, "only simple assignment supported")

        const res = this.emitPrototypeUpdate(expr)
        if (res) return res

        const src = this.emitExpr(expr.right)
        const wr = this.writer
        let left = expr.left
        if (left.type == "ArrayPattern") {
            if (src.kind == CellKind.JD_VALUE_SEQ) {
                let off = 0
                wr.push()
                const tmpreg = wr.allocReg()
                for (let i = 0; i < left.elements.length; ++i) {
                    const pat = left.elements[i]
                    const f = src.spec.fields[i]
                    if (!f)
                        throwError(
                            pat,
                            `not enough fields in ${src.spec.name}`
                        )
                    wr.emitBufOp(OpTop.LOAD_CELL, tmpreg, off, f)
                    off += Math.abs(f.storage)
                    this.emitStore(this.lookupVar(pat), tmpreg)
                }
                wr.pop()
            } else {
                throwError(expr, "expecting a multi-field register read")
            }
            return src
        } else if (left.type == "Identifier") {
            this.requireRuntimeValue(expr.right, src)
            this.emitStore(this.lookupVar(left), src)
            return src
        }
        throwError(expr, "unhandled assignment")
    }

    private emitBinaryExpression(
        expr: estree.BinaryExpression | estree.LogicalExpression
    ): ValueDesc {
        const simpleOps: SMap<OpBinary> = {
            "+": OpBinary.ADD,
            "-": OpBinary.SUB,
            "/": OpBinary.DIV,
            "*": OpBinary.MUL,
            "<": OpBinary.LT,
            "|": OpBinary.BIT_OR,
            "&": OpBinary.BIT_AND,
            "^": OpBinary.BIT_XOR,
            "<<": OpBinary.SHIFT_LEFT,
            ">>": OpBinary.SHIFT_RIGHT,
            ">>>": OpBinary.SHIFT_RIGHT_UNSIGNED,
            "<=": OpBinary.LE,
            "==": OpBinary.EQ,
            "===": OpBinary.EQ,
            "!=": OpBinary.NE,
            "!==": OpBinary.NE,
        }

        let op = expr.operator

        if (op == "**")
            return this.emitMath(
                {
                    type: "CallExpression",
                    range: expr.range,
                    callee: null,
                    optional: false,
                    arguments: [expr.left, expr.right],
                },
                "Math.pow"
            )

        let swap = false
        if (op == ">") {
            op = "<"
            swap = true
        }
        if (op == ">=") {
            op = "<="
            swap = true
        }

        const wr = this.writer

        if (op == "&&" || op == "||") {
            wr.push()
            const a = this.emitSimpleValue(expr.left)
            wr.push()
            const tst = wr.allocReg()
            wr.emitUnary(op == "&&" ? OpUnary.TO_BOOL : OpUnary.NOT, tst, a)
            const skipB = wr.mkLabel("lazyB")
            wr.pop()
            wr.emitJump(skipB, tst.index)
            this.emitValueInto(a, expr.right)
            wr.emitLabel(skipB)
            wr.popExcept(a)
            return a
        }

        const op2 = simpleOps[op]
        if (op2 === undefined) throwError(expr, "unhandled operator")

        wr.push()
        let a = this.emitSimpleValue(expr.left)
        let b = this.emitSimpleValue(expr.right)
        if (swap) [a, b] = [b, a]
        wr.emitBin(op2, a, b)
        wr.popExcept(a)

        return a
    }

    private emitUnaryExpression(expr: estree.UnaryExpression): ValueDesc {
        const simpleOps: SMap<OpUnary> = {
            "!": OpUnary.NOT,
            "-": OpUnary.NEG,
            "~": OpUnary.BIT_NOT,
            "+": OpUnary.ID,
        }

        let op = simpleOps[expr.operator]
        if (op === undefined) throwError(expr, "unhandled operator")

        let arg = expr.argument

        if (
            expr.operator == "!" &&
            arg.type == "UnaryExpression" &&
            arg.operator == "!"
        ) {
            op = OpUnary.TO_BOOL
            arg = arg.argument
        }

        const wr = this.writer

        wr.push()
        const a = this.emitSimpleValue(arg)
        wr.emitUnary(op, a, a)
        wr.popExcept(a)

        return a
    }

    private emitExpr(expr: Expr): ValueDesc {
        switch (expr.type) {
            case "CallExpression":
                return this.emitCallExpression(expr)
            case "Identifier":
                return this.emitIdentifier(expr)
            case "ThisExpression":
                return this.emitThisExpression(expr)
            case "MemberExpression":
                return this.emitMemberExpression(expr)
            case "Literal":
                return this.emitLiteral(expr)
            case "AssignmentExpression":
                return this.emitAssignmentExpression(expr)
            case "LogicalExpression":
            case "BinaryExpression":
                return this.emitBinaryExpression(expr)
            case "UnaryExpression":
                return this.emitUnaryExpression(expr)
            default:
                // console.log(expr)
                return throwError(expr, "unhandled expr: " + expr.type)
        }
    }

    private sourceFrag(range: number[]) {
        if (range) {
            let [startp, endp] = range
            if (endp === undefined) endp = startp + 60
            endp = Math.min(endp, startp + 60)
            return this.source.slice(startp, endp).replace(/\n[^]*/, "...")
        }

        return null
    }

    private handleException(stmt: estree.BaseNode, e: any) {
        if (e.sourceNode !== undefined) {
            const node = e.sourceNode || stmt
            this.reportError(node.range, e.message)
            // console.log(e.stack)
        } else {
            this.reportError(stmt.range, "Internal error: " + e.message)
            console.log(e.stack)
        }
    }

    private emitStmt(stmt: Stmt) {
        const src = this.sourceFrag(stmt.range)
        const wr = this.writer
        if (src) wr.emitComment(src)

        wr.stmtStart(this.indexToLine(stmt.range[0]))

        const scopes = wr.numScopes()
        wr.push()
        try {
            switch (stmt.type) {
                case "ExpressionStatement":
                    return this.emitExpressionStatement(stmt)
                case "VariableDeclaration":
                    return this.emitVariableDeclaration(stmt)
                case "IfStatement":
                    return this.emitIfStatement(stmt)
                case "WhileStatement":
                    return this.emitWhileStatement(stmt)
                case "BlockStatement":
                    stmt.body.forEach(s => this.emitStmt(s))
                    return
                case "ReturnStatement":
                    return this.emitReturnStatement(stmt)
                case "FunctionDeclaration":
                    return this.emitFunctionDeclaration(stmt)
                default:
                    console.log(stmt)
                    throwError(stmt, `unhandled type: ${stmt.type}`)
            }
        } catch (e) {
            this.handleException(stmt, e)
        } finally {
            wr.pop()
            wr.stmtEnd()
            if (wr.numScopes() != scopes) {
                if (!this.numErrors)
                    throwError(stmt, "push/pop mismatch; " + stmt.type)
                while (wr.numScopes() > scopes) wr.pop()
            }
        }
    }

    private assertLittleEndian() {
        const test = new Uint16Array([0xd042])
        assert(toHex(new Uint8Array(test.buffer)) == "42d0")
    }

    private serialize() {
        // serialization only works on little endian machines
        this.assertLittleEndian()

        const fixHeader = new SectionWriter(BinFmt.FixHeaderSize)
        const sectDescs = new SectionWriter()
        const sections: SectionWriter[] = [fixHeader, sectDescs]

        const hd = new Uint8Array(BinFmt.FixHeaderSize)
        hd.set(
            encodeU32LE([
                BinFmt.Magic0,
                BinFmt.Magic1,
                BinFmt.ImgVersion,
                this.globals.list.length,
            ])
        )
        fixHeader.append(hd)

        const funDesc = new SectionWriter()
        const funData = new SectionWriter()
        const floatData = new SectionWriter()
        const roleData = new SectionWriter()
        const strDesc = new SectionWriter()
        const strData = new SectionWriter()
        const bufferDesc = new SectionWriter()

        for (const s of [
            funDesc,
            funData,
            floatData,
            roleData,
            strDesc,
            strData,
            bufferDesc,
        ]) {
            sectDescs.append(s.desc)
            sections.push(s)
        }

        funDesc.size = BinFmt.FunctionHeaderSize * this.procs.length

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

        for (const b of this.buffers.list) {
            bufferDesc.append((b as Buffer).serialize())
        }

        const descs = this.stringLiterals.map(str => {
            const buf = stringToUint8Array(toUTF8(str) + "\u0000")
            const desc = new Uint8Array(8)
            write32(desc, 0, strData.currSize) // initially use offsets in strData section
            write32(desc, 4, buf.length - 1)
            strData.append(buf)
            strDesc.append(desc)
            return desc
        })
        strData.align()

        let off = 0
        for (const s of sections) {
            s.finalize(off)
            off += s.size
        }
        const mask = BinFmt.BinarySizeAlign - 1
        off = (off + mask) & ~mask
        const outp = new Uint8Array(off)

        // shift offsets from strData-local to global
        for (const d of descs) {
            write32(d, 0, read32(d, 0) + strData.offset)
        }

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
        assert(0 <= left && left < BinFmt.BinarySizeAlign)

        return outp
    }

    emit() {
        try {
            this.tree = esprima.parseScript(this.source, {
                // tolerant: true,
                range: true,
            })
        } catch (e) {
            if (e.description) this.reportError([e.index], e.description)
            else throw e
            return
        }

        this.emitProgram(this.tree)

        this.finalizeCloudMethods()
        this.finalizeDispatchers()
        for (const p of this.procs) p.finalize()

        if (this.numErrors == 0)
            this.host.write(
                "prog.jasm",
                this.procs.map(p => p.toString()).join("\n")
            )

        const b = this.serialize()
        const dbg: DebugInfo = {
            roles: this.roles.list.map(r => r.debugInfo()),
            functions: this.procs.map(p => p.writer.debugInfo()),
            globals: this.globals.list.map(r => r.debugInfo()),
            source: this.source,
        }
        this.host.write("prog.jacs", b)
        this.host.write("prog-dbg.json", JSON.stringify(dbg))

        if (this.numErrors == 0) {
            try {
                this.host?.verifyBytecode(b, dbg)
            } catch (e) {
                this.reportError([0, this.source.length], e.message)
            }
        }

        const clientSpecs: jdspec.ServiceSpec[] = []
        for (const kn of Object.keys(this.clientCommands)) {
            const lst = this.clientCommands[kn].filter(c => c.isFresh).map(c => c.pktSpec)
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
                    packets: lst
                })
            }
        }

        return {
            success: this.numErrors == 0,
            binary: b,
            dbg: dbg,
            clientSpecs
        }
    }
}

export function compile(host: Host, code: string) {
    const p = new Program(host, code)
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
            write: () => { },
            log: msg => { },
            getSpecs: host.getSpecs,
            verifyBytecode: host.verifyBytecode,
            error: err => {
                const exp = lines[err.line - 1]
                if (exp && err.message.indexOf(exp) >= 0)
                    lines[err.line - 1] = null
                else {
                    numExtra++
                    printJacError(err)
                }
            },
        },
        code
    )
    const r = p.emit()
    let missingErrs = 0
    for (let i = 0; i < lines.length; ++i) {
        if (lines[i]) {
            printJacError({
                line: i + 1,
                column: 1,
                message: "missing error: " + lines[i],
                codeFragment: "",
            })
            missingErrs++
        }
    }
    if (missingErrs) throw new Error("some errors were not reported")
    if (numExtra) throw new Error("extra errors reported")
    if (numerr && r.success) throw new Error("unexpected success")
}
