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
    uses: number[]
    offset = -1
    constructor(public name: string) {}
}

const VF_DEPTH_MASK = 0xff
const VF_USES_STATE = 0x100
const VF_HAS_PARENT = 0x200
const VF_IS_LITERAL = 0x400
const VF_IS_MEMREF = 0x800

export class Value {
    op: number
    flags: number
    args: Value[]
    numValue: number
    _userdata: {}

    constructor() {}
    get depth() {
        return this.flags & VF_DEPTH_MASK
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
    adopt() {
        assert(!(this.flags & VF_HAS_PARENT))
        this.flags |= VF_HAS_PARENT
    }
}

export class CachedValue {
    constructor(public parent: OpWriter, public index: number) {}
    emit() {
        assert(this.index != null)
        const r = new Value()
        r.numValue = this.index
        r.op = OpExpr.EXPRx_LOAD_LOCAL
        r.flags = VF_IS_MEMREF // not "using state" - it's temporary
        return r
    }
    store(v: Value) {
        assert(this.index != null)
        this.parent.emitStmt(OpStmt.STMTx1_STORE_LOCAL, floatVal(this.index), v)
    }
    free() {
        assert(this.parent.cachedValues[this.index] == this)
        this.parent.cachedValues[this.index] = null
        this.index = null
    }
}

function checkIndex(idx: number) {
    assert((idx | 0) === idx)
}

export function mkValue(kind: CellKind, index: number): Value {
    return {
        kind,
        index,
    }
}

export function floatVal(v: number) {
    const r = new Value()
    r.numValue = v
    r.op = OpExpr.EXPRx_LITERAL
    r.flags = VF_IS_LITERAL
    return r
}

export function nonEmittable(k: number) {
    const r = new Value()
    assert(k >= 0x100)
    r.op = k
    return r
}

class Comment {
    constructor(public offset: number, public comment: string) {}
}

export const LOCAL_OFFSET = 0x80

export class OpWriter {
    private binary: Uint8Array
    private binPtr: number
    private labels: Label[] = []
    private comments: Comment[] = []
    pendingStatefulValues: Value[] = []
    localOffsets: number[] = []
    cachedValues: CachedValue[] = []
    top: Label
    ret: Label
    private lineNo = -1
    private lineNoStart = -1
    desc = new Uint8Array(BinFmt.FunctionHeaderSize)
    offsetInFuncs = -1
    private maxRegs = 0
    srcmap: number[] = []

    constructor(private prog: TopOpWriter) {
        this.top = this.mkLabel("top")
        this.emitLabel(this.top)
        this.binary = new Uint8Array(128)
    }

    assertCurrent() {
        assert(this.prog.writer == this)
    }

    serialize() {
        return this.binary.slice(0, this.binPtr)
    }

    finalizeDesc(off: number, numlocals: number, numargs: number) {
        assert((this.location() & 1) == 0)
        const flags = 0
        const buf = new Uint8Array(3 * 4)
        write32(buf, 0, off)
        write32(buf, 4, this.location() * 2)
        write16(buf, 8, numlocals)
        buf[10] = this.maxRegs | (numargs << 4)
        buf[11] = flags
        this.desc.set(buf)
    }

    emitDbg(msg: string) {
        this.emitComment(msg)
    }

    _forceFinStmt() {
        if (this.lineNo < 0) return
        const len = this.location() - this.lineNoStart
        if (len) this.srcmap.push(this.lineNo, this.lineNoStart, len)
    }

    stmtStart(lineNo: number) {
        if (this.lineNo == lineNo) return
        this._forceFinStmt()
        this.lineNo = lineNo
        this.lineNoStart = this.location()
    }

    allocTmpLocals(num: number) {
        let run = 0
        let runStart = 0
        for (let i = 0; i < this.cachedValues.length; ++i) {
            if (this.cachedValues[i] == null) run++
            else {
                run = 0
                runStart = i + 1
            }
            if (run >= num) break
        }
        while (run < num) {
            this.cachedValues.push(null)
            run++
        }
        for (let i = 0; i < num; ++i) {
            assert(this.cachedValues[runStart + i] === null) // not undefined
            this.cachedValues[runStart + i] = new CachedValue(
                this,
                runStart + i
            )
        }
        return this.cachedValues.slice(runStart, runStart + num)
    }

    allocTmpLocal() {
        // TODO optimize?
        return this.allocTmpLocals(1)[0]
    }

    cacheValue(v: Value) {
        const t = this.allocTmpLocal()
        t.store(v)
        return t
    }

    stmtEnd() {}

    pop() {}
    push() {}
    popExcept(save?: Value) {}

    allocBuf(): Value {
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

    allocArgs(num: number): Value[] {
        return range(num).map(x => this.doAlloc(x))
    }

    emitString(s: string) {
        const v = mkValue(CellKind.X_STRING, this.prog.addString(s))
        v.strValue = s
        return v
    }

    emitRaw(op: OpTop, arg: number) {
        assert(arg >> 12 == 0)
        assertRange(0, op, 0xf)
        this.emitInstr((op << 12) | arg)
    }

    _emitCall(procIdx: number, args: CachedValue[], op = OpCall.SYNC) {
        const proc = floatVal(procIdx)
        const localidx = floatVal(args[0] ? args[0].index : 0)
        const numargs = floatVal(args.length)

        if (op == OpCall.SYNC)
            this.emitStmt(OpStmt.STMT3_CALL, proc, localidx, numargs)
        else
            this.emitStmt(
                OpStmt.STMT4_CALL_BG,
                proc,
                localidx,
                numargs,
                floatVal(op)
            )
    }

    private bufferAllocated() {
        return !!(this.allocatedRegsMask & (1 << BUFFER_REG))
    }

    emitStoreByte(src: Value, off = 0) {
        assertRange(0, off, 0xff)
        this.emitStmt(
            OpStmt.STMT4_STORE_BUFFER,
            floatVal(OpFmt.U8),
            floatVal(off),
            floatVal(0),
            src
        )
    }

    emitBufLoad(fmt: OpFmt, off: number, bufidx = 0) {
        if (bufidx == 0) assertRange(0, off, 0xff)
        return this.emitExpr(
            OpExpr.EXPR3_LOAD_BUFFER,
            floatVal(fmt),
            floatVal(off),
            floatVal(bufidx)
        )
    }

    emitBufStore(src: Value, fmt: OpFmt, off: number, bufidx = 0) {
        this.emitStmt(
            OpStmt.STMT4_STORE_BUFFER,
            floatVal(fmt),
            floatVal(off),
            floatVal(bufidx),
            src
        )
    }

    emitBufOp(
        op: OpTop,
        dst: Value,
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

    getAssembly() {
        let res = ""
        let ptr = 0
        let commentPtr = 0
        const getbyte = () => {
            if (ptr < this.binPtr) return this.binary[ptr++]
            return 0
        }

        while (ptr < this.binPtr) {
            while (commentPtr < this.comments.length) {
                const c = this.comments[commentPtr]
                if (c.offset >= ptr) break
                commentPtr++
                res += "; " + c.comment.replace(/\n/g, "\n; ") + "\n"
            }
            res += stringifyInstr(getbyte, this.prog)
        }

        if (ptr > this.binPtr) res += "!!! binary mis-alignment\n"

        return res
    }

    emitComment(msg: string) {
        this.comments.push(new Comment(this.location(), msg))
    }

    mkLabel(name: string) {
        const l = new Label(name)
        this.labels.push(l)
        return l
    }

    emitLabel(l: Label) {
        assert(l.offset == -1)
        this.emitComment("lbl " + l.name)
        l.offset = this.location()
        if (l.uses) {
            for (const u of l.uses) {
                const v = l.offset - u
                assert(v >= 0)
                assert(v <= 0xffff)
                this.binary[u + 2] = v >> 8
                this.binary[u + 3] = v & 0xff
            }
            l.uses = undefined
        }
    }

    emitIfAndPop(reg: Value, thenBody: () => void, elseBody?: () => void) {
        this.pop()
        if (elseBody) {
            const endIf = this.mkLabel("endif")
            const elseIf = this.mkLabel("elseif")
            this.emitJump(elseIf, reg)
            thenBody()
            this.emitJump(endIf)
            this.emitLabel(elseIf)
            elseBody()
            this.emitLabel(endIf)
        } else {
            const skipIf = this.mkLabel("skipif")
            this.emitJump(skipIf, reg)
            thenBody()
            this.emitLabel(skipIf)
        }
    }

    emitJumpIfTrue(label: Label, cond: Value) {
        return this.emitJump(label, this.emitExpr(OpExpr.EXPR1_NOT, cond))
    }

    emitJump(label: Label, cond?: Value) {
        cond?.adopt()
        this.spillAllStateful()

        this.emitComment("jump " + label.name)

        const off0 = this.location()
        this.writeByte(cond ? OpStmt.STMTx1_JMP_Z : OpStmt.STMTx_JMP)

        if (label.offset != -1) {
            this.writeInt(label.offset - off0)
        } else {
            if (!label.uses) label.uses = []
            label.uses.push(off0)
            this.writeInt(0x1000)
        }

        if (cond) this.writeValue(cond)
    }

    patchLabels() {
        // we now patch at emit
        for (const l of this.labels) assert(!l.uses)

        // patch local indices
        for (const c of this.cachedValues) assert(c === null)
        for (const off of this.localOffsets) {
            assert(LOCAL_OFFSET <= this.binary[off] && this.binary[off] < 0xf8)
            this.binary[off] =
                this.binary[off] - LOCAL_OFFSET + this.cachedValues.length
        }
        this.localOffsets = []
    }

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
        r.op = op
        r.flags = VF_IS_MEMREF | VF_USES_STATE
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
        r.op = op
        r.flags = maxdepth + 1
        if (usesState) {
            r.flags |= VF_USES_STATE
            this.pendingStatefulValues.push(r)
        }
        return r
    }

    location() {
        return this.binPtr
    }

    private writeByte(v: number) {
        assert(0 <= v && v <= 0xff && (v | 0) == v)
        if (this.binPtr >= this.binary.length) {
            const copy = new Uint8Array(this.binary.length * 2)
            copy.set(this.binary)
            this.binary = copy
        }
        this.binary[this.binPtr++] = v
    }

    private writeInt(v: number) {
        assert((v | 0) == v)
        if (0 <= v && v < 0xf8) this.writeByte(v)
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
            if (v.op == OpExpr.EXPRx_LOAD_LOCAL && v.numValue >= LOCAL_OFFSET)
                this.localOffsets.push(this.location())
            this.writeInt(v.numValue)
        } else if (v.op >= 0x100) {
            oops("this value can't be emitted")
        } else {
            this.writeByte(v.op)
            this.writeArgs(exprTakesNumber(v.op), v.args)
        }
    }

    emitStmt(op: OpStmt, ...args: Value[]) {
        for (const a of args) a.adopt()
        this.spillAllStateful()
        this.writeByte(op)
        if (op == OpStmt.STMTx1_STORE_LOCAL && args[0].numValue >= LOCAL_OFFSET)
            this.localOffsets.push(this.location())
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

export function bufferFmt(mem: jdspec.PacketMember) {
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
    return fmt | (shift << 4)
}
