import {
    BinFmt,
    bitSize,
    CellKind,
    exprIsStateful,
    exprTakesNumber,
    InstrArgResolver,
    JACS_MAX_EXPR_DEPTH,
    OpCall,
    OpExpr,
    OpFmt,
    OpStmt,
    stmtTakesNumber,
    stringifyInstr,
} from "./format"
import { assert, write32, write16, range } from "./jdutil"
import { addUnique, assertRange, numSetBits, oops } from "./util"

export interface TopOpWriter extends InstrArgResolver {
    addString(s: string): number
    addFloat(f: number): number
    writer: OpWriter
}

export class Label {
    uses: number[] = []
    offset = -1
    constructor(public name: string) {}
}

const VF_DEPTH_MASK = 0xff
const VF_DEPTH_SHIFT = 8
const VF_OP_MASK = 0xff
const VF_USES_STATE = 0x10000
const VF_HAS_PARENT = 0x20000
const VF_IS_LITERAL = 0x40000
const VF_IS_MEMREF = 0x80000

export class Value {
    flags: number
    args: Value[]
    numValue: number

    constructor() {}
    get depth() {
        return (this.flags >> VF_DEPTH_SHIFT) & VF_DEPTH_MASK
    }
    get op() {
        return this.flags & VF_OP_MASK
    }
    get usesState() {
        return !!(this.flags & VF_USES_STATE)
    }
    get hasParent() {
        return !!(this.flags & VF_HAS_PARENT)
    }
    get isLiteral() {
        return !!(this.flags & VF_IS_LITERAL)
    }
    get isMemRef() {
        return !!(this.flags & VF_IS_MEMREF)
    }
}

interface ValueDesc {
    kind: CellKind
    index: number
    litValue?: number
    strValue?: string
}

function checkIndex(idx: number) {
    assert((idx | 0) === idx)
}

export function mkValue(kind: CellKind, index: number): ValueDesc {
    return {
        kind,
        index,
    }
}

export function floatVal(v: number) {
    const r = new Value()
    r.numValue = v
    r.flags = OpExpr.EXPRx_LITERAL | VF_IS_LITERAL
    return r
}

export class OpWriter {
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
    srcmap: number[] = []

    constructor(private prog: TopOpWriter) {
        this.top = this.mkLabel("top")
        this.ret = this.mkLabel("ret")
        this.emitLabel(this.top)
    }

    assertCurrent() {
        assert(this.prog.writer == this)
    }

    serialize() {
        if (this.binary.length & 1) this.emitSync(OpSync.RETURN)
        return new Uint8Array(new Uint16Array(this.binary).buffer)
    }

    finalizeDesc(off: number, numlocals: number, numargs: number) {
        assert((this.binary.length & 1) == 0)
        const flags = 0
        const buf = new Uint8Array(3 * 4)
        write32(buf, 0, off)
        write32(buf, 4, this.binary.length * 2)
        write16(buf, 8, numlocals)
        buf[10] = this.maxRegs | (numargs << 4)
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

    _forceFinStmt() {
        if (this.lineNo < 0) return
        const len = this.binary.length - this.lineNoStart
        if (len) this.srcmap.push(this.lineNo, this.lineNoStart, len)
    }

    stmtStart(lineNo: number) {
        if (this.lineNo == lineNo) return
        this._forceFinStmt()
        this.lineNo = lineNo
        this.lineNoStart = this.binary.length
    }

    stmtEnd() {
        if (false)
            this.emitDbg(
                `reg=${this.allocatedRegsMask.toString(16)} ${
                    this.scopes.length
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
            throw new Error(`expression too complex (R${regno} allocated)`)
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
        const v = mkValue(CellKind.X_STRING, this.prog.addString(s))
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

    _emitCall(procIdx: number, numargs: number, op = OpCall.SYNC) {
        let d = 0
        if (op == OpCall.SYNC) d = this.saveRegs()
        else assert((this.allocatedRegsMask & 1) == 0)
        this.emitPrefix(procIdx >> 6, 0, 0, d)
        this.emitRaw(OpTop.CALL, (numargs << 8) | (op << 6) | (procIdx & 0x3f))
    }

    emitAsyncWithRole(
        op: OpAsync,
        role: { extEncode(wr: OpWriter): number },
        b: number = 0,
        c: number = 0
    ) {
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
            this.emitLoadCell(dst, CellKind.FLOAT_CONST, this.prog.addFloat(v))
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
                this.prog.resolverPC = ln
                r += stringifyInstr(this.binary[ln], this.prog) + "\n"
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

    pendingStatefulValues: Value[] = []

    private spillValue(v: Value) {
        //update depth
    }

    private spillAllStateful() {
        for (const e of this.pendingStatefulValues) {
            if (e.usesState && !e.hasParent) this.spillValue(e)
        }
        this.pendingStatefulValues = []
    }

    emitMemRef(op: OpExpr, idx: number) {
        const r = new Value()
        r.numValue = idx
        r.flags = op | VF_IS_MEMREF | VF_USES_STATE
        this.pendingStatefulValues.push(r)
        return r
    }

    emitExpr(op: OpExpr, ...args: Value[]) {
        let maxdepth = -1
        let usesState = exprIsStateful(op)
        // TODO constant folding
        for (const a of args) {
            if (a.depth >= JACS_MAX_EXPR_DEPTH - 1) this.spillValue(a)
            maxdepth = Math.max(a.depth, maxdepth)
            if (a.usesState) usesState = true
            assert(!(a.flags & VF_HAS_PARENT))
            a.flags |= VF_HAS_PARENT
        }
        const r = new Value()
        r.args = args
        r.flags = op | ((maxdepth + 1) << VF_DEPTH_SHIFT)
        if (usesState) {
            r.flags |= VF_USES_STATE
            this.pendingStatefulValues.push(r)
        }
        return r
    }

    private writeByte(v: number) {
        assert(0 <= v && v <= 0xff && (v | 0) == v)
        // TODO
    }

    private writeInt(v: number) {
        assert((v | 0) == v)
        if (0 <= v && v <= 0xf8) this.writeByte(v)
        else {
            let b = 0xf8
            if (v < 0) {
                b |= 4
                v = -v
            }
            let hddone = false
            for (let shift = 3; shift >= 0; shift--) {
                const q = (v >> (8 * shift)) & 0xff
                if (q && !hddone) {
                    this.writeByte(b | shift)
                    hddone = true
                }
                if (hddone) this.writeByte(q)
            }
        }
    }

    private writeArgs(firstInt: boolean, args: Value[]) {
        let i = 0
        if (firstInt) {
            assert(args[0].isLiteral)
            this.writeInt(args[0].numValue)
            i = 1
        }
        while (i < args.length) {
            this.writeValue(args[i])
            i++
        }
    }

    private writeValue(v: Value) {
        if (v.isLiteral) {
            const q = v.numValue
            if ((q | 0) == q) {
                const qq = q + 16 + 0x80
                if (0x80 <= qq && qq <= 0xff) this.writeByte(qq)
                else {
                    this.writeByte(OpExpr.EXPRx_LITERAL)
                    this.writeInt(q)
                }
            } else if (isNaN(q)) {
                this.writeByte(OpExpr.EXPR0_NAN)
            } else {
                const idx = this.prog.addFloat(q)
                this.writeByte(OpExpr.EXPRx_LITERAL_F64)
                this.writeInt(idx)
            }
        } else if (v.isMemRef) {
            assert(exprTakesNumber(v.op))
            this.writeByte(v.op)
            this.writeInt(v.numValue)
        } else {
            this.writeByte(v.op)
            this.writeArgs(exprTakesNumber(v.op), v.args)
        }
    }

    emitStmt(op: OpStmt, ...args: Value[]) {
        for (const a of args) {
            assert(!(a.flags & VF_HAS_PARENT))
            a.flags |= VF_HAS_PARENT
        }
        this.spillAllStateful()
        this.writeByte(op)
        this.writeArgs(stmtTakesNumber(op), args)
    }
}

export class SectionWriter {
    offset = -1
    currSize = 0
    data: Uint8Array[] = []
    desc = new Uint8Array(BinFmt.SectionHeaderSize)

    constructor(public size = -1) {}

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

export class DelayedCodeSection {
    startLabel: Label
    returnLabel: Label
    body: ((wr: OpWriter) => void)[] = []

    constructor(public name: string, public parent: OpWriter) {}

    empty() {
        return this.body.length == 0
    }

    emit(f: (wr: OpWriter) => void) {
        this.body.push(f)
    }

    callHere() {
        const wr = this.parent
        this.startLabel = wr.mkLabel(this.name + "Start")
        this.returnLabel = wr.mkLabel(this.name + "Ret")
        wr.emitJump(this.startLabel)
        wr.emitLabel(this.returnLabel)
    }

    finalizeRaw() {
        this.parent.assertCurrent()
        const wr = this.parent
        for (const b of this.body) b(wr)
    }

    finalize() {
        if (this.empty()) {
            this.startLabel.offset = this.returnLabel.offset
            return
        }
        const wr = this.parent
        wr.emitLabel(this.startLabel)
        this.finalizeRaw()
        wr.emitJump(this.returnLabel)
    }
}
