import { parseBytecode, stringifyInstr } from "./disassemble"
import {
    BinFmt,
    bitSize,
    exprIsStateful,
    InstrArgResolver,
    NumFmt,
    Op,
    opTakesNumber,
    opNumArgs,
    opIsStmt,
    StrIdx,
    BuiltInString,
    BuiltInObject,
    FunctionFlag,
} from "./format"
import { SrcLocation, srcMapEntrySize } from "./info"
import { assert, write32, write16, read32, read16 } from "./jdutil"
import { assertRange, oops } from "./util"

export interface TopOpWriter extends InstrArgResolver {
    addString(s: string): number
    addBuffer(s: Uint8Array): number
    addFloat(f: number): number
    writer: OpWriter
    hasErrors: boolean
    isLibrary: boolean
}

export class Label {
    uses: number[]
    offset = -1
    constructor(public name: string) {}
}

const VF_MAX_STACK_MASK = 0xff
const VF_USES_STATE = 0x100
const VF_HAS_PARENT = 0x200
const VF_IS_LITERAL = 0x400
const VF_IS_MEMREF = 0x800
const VF_IS_STRING = 0x1000
const VF_IS_WRITTEN = 0x2000

export class Value {
    op: number
    flags: number
    args: Value[]
    numValue: number
    strValue: string
    _userdata: {}
    _cachedValue: CachedValue

    constructor() {}

    get maxstack() {
        return (this.flags & VF_MAX_STACK_MASK) + 1
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

    _set(src: Value) {
        if (!this._userdata) this._userdata = src._userdata
        this.op = src.op
        this.flags = src.flags
        this.args = src.args
        this.numValue = src.numValue
        this._cachedValue = src._cachedValue
    }

    get staticIdx() {
        assert(this.args.length == 1)
        assert(this.args[0].isLiteral)
        return this.args[0].numValue
    }

    toString() {
        return `[op=${Op[this.op]} a=${this.args?.length}]`
    }

    clone() {
        const r = new Value()
        r._set(this)
        if (r.args) r.args = r.args.map(a => a.clone())
        return r
    }
}

export class CachedValue {
    numRefs = 1
    _longTerm = false
    constructor(public parent: OpWriter, public index: number) {}
    get packedIndex() {
        return packVarIndex(VariableKind.Cached, this.index)
    }
    get isCached() {
        return true
    }
    emit() {
        assert(this.numRefs > 0)
        const r = new Value()
        r.numValue = this.packedIndex
        r.op = Op.EXPRx_LOAD_LOCAL
        r.flags = VF_IS_MEMREF // not "using state" - it's temporary
        r._cachedValue = this
        this.numRefs++
        return r
    }
    store(v: Value) {
        assert(this.numRefs > 0)
        this.parent.emitStmt(
            Op.STMTx1_STORE_LOCAL,
            literal(this.packedIndex),
            v
        )
    }
    finalEmit() {
        const r = this.emit()
        this.free()
        return r
    }
    _decr() {
        if (this.numRefs <= 0) oops(`cached ref=0`)
        if (--this.numRefs == 0) {
            assert(this.parent.cachedValues[this.index] == this)
            this.parent.cachedValues[this.index] = null
            this.index = null
        }
    }
    free() {
        this._decr()
    }
}

class UnCachedValue extends CachedValue {
    constructor(parent: OpWriter) {
        super(parent, null)
    }

    theValue: Value
    get isCached() {
        return false
    }
    emit() {
        return this.theValue.clone()
    }

    store(v: Value) {
        assert(this.theValue === undefined)
        this.theValue = v
    }

    _decr() {}
}

export function literal(v: number | boolean) {
    const r = new Value()
    if (v == null) {
        r.op = v === null ? Op.EXPR0_NULL : Op.EXPR0_UNDEFINED
        r.args = []
        r.flags = 0
    } else if (typeof v == "boolean") {
        r.op = v ? Op.EXPR0_TRUE : Op.EXPR0_FALSE
        r.args = []
        r.flags = 0
    } else if (typeof v == "number") {
        r.numValue = v
        r.op = Op.EXPRx_LITERAL
        r.flags = VF_IS_LITERAL
    } else {
        oops(`invalid literal: ${v}`)
    }
    return r
}

export function nonEmittable() {
    const r = new Value()
    r.op = BinFmt.FIRST_NON_OPCODE + 0x100
    r.flags = 0
    return r
}

class Comment {
    constructor(public offset: number, public comment: string) {}
}

export enum VariableKind {
    Global,
    ThisParam,
    Parameter,
    Cached,
    Local,
}
const VAR_CACHED_OFF = 30
const VAR_LOCAL_OFF = 100

export function packVarIndex(vk: VariableKind, idx: number) {
    switch (vk) {
        case VariableKind.Global:
            return idx
        case VariableKind.ThisParam:
            assert(idx == 0)
            return idx
        case VariableKind.Parameter:
            assert(idx < VAR_CACHED_OFF)
            return idx
        case VariableKind.Cached:
            idx += VAR_CACHED_OFF
            assert(idx < VAR_LOCAL_OFF)
            return idx
        case VariableKind.Local:
            idx += VAR_LOCAL_OFF
            assert(idx < BinFmt.FIRST_MULTIBYTE_INT)
            return idx
        default:
            oops("bad vk")
    }
}

export class OpWriter {
    private binary: Uint8Array
    private binPtr: number = 0
    private labels: Label[] = []
    private bufferAllocated = false
    pendingStatefulValues: Value[] = []
    localOffsets: number[] = []
    cachedValues: CachedValue[] = []
    funFlags: FunctionFlag = 0
    top: Label
    ret: Label
    desc = new Uint8Array(BinFmt.FUNCTION_HEADER_SIZE)
    offsetInFuncs = -1
    offsetInImg = -1
    private locStack: SrcLocation[] = []
    srcmap: number[] = []
    private nameIdx: number
    private lastReturnLocation = -1
    private closureRefs: Record<string, number[]> = {}

    constructor(public prog: TopOpWriter, public name: string) {
        this.top = this.mkLabel("top")
        this.emitLabel(this.top)
        this.binary = new Uint8Array(128)
        this.nameIdx = this.prog.addString(this.name.replace(/_F\d+$/, ""))
    }

    assertCurrent() {
        assert(this.prog.writer == this)
    }

    serialize() {
        assert(this.locStack.length == 0)
        return this.binary.slice(0, this.binPtr)
    }

    get size() {
        return this.binPtr + this.desc.length
    }

    finalizeDesc(off: number) {
        assert(this.offsetInImg == -1)
        this.offsetInImg = off
        for (let i = 0; i < this.srcmap.length; i += srcMapEntrySize) {
            this.srcmap[i + 2] += off
        }
        write32(this.desc, 0, off)
    }

    _forceFinStmt() {}

    private recordLocation() {
        const pos = this.locStack[this.locStack.length - 1]
        const pc = this.location()
        const l = this.srcmap.length
        if (l >= srcMapEntrySize && this.srcmap[l - 1] == pc) {
            // if previous entry was already at this pc - overwrite it with new position
            this.srcmap[l - 2] = pos[1]
            this.srcmap[l - 3] = pos[0]
        } else {
            this.srcmap.push(pos[0], pos[1], pc)
        }
    }

    locPush(pos: SrcLocation) {
        this.locStack.push(pos)
        this.recordLocation()
    }

    locPop() {
        assert(this.locStack.length > 0)
        this.locStack.pop()
        if (this.locStack.length) this.recordLocation()
    }

    private allocTmpLocals(num: number) {
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

    needsCache(v: Value) {
        let maxSize = 5
        return needsCacheRec(v)
        function needsCacheRec(v: Value) {
            if (v.usesState || v._cachedValue) return true
            if (maxSize-- < 0) return true
            return v.args && v.args.some(needsCacheRec)
        }
    }

    cacheValue(v: Value, longTerm = false) {
        let t: CachedValue
        if (this.needsCache(v) || longTerm) {
            t = this.allocTmpLocal()
            t._longTerm = longTerm
        } else {
            t = new UnCachedValue(this)
        }

        t.store(v)
        return t
    }

    stmtEnd() {
        this.assertNoTemps()
    }

    freeBuf(): void {
        assert(this.bufferAllocated, "freeBuf() already free")
        this.bufferAllocated = false
    }

    emitString(s: string | Uint8Array) {
        const v = new Value()
        let idx = 0
        if (typeof s == "string") {
            idx = this.prog.addString(s)
            const tp = idx >> StrIdx._SHIFT
            idx &= (1 << StrIdx._SHIFT) - 1
            if (tp == StrIdx.UTF8) v.op = Op.EXPRx_STATIC_UTF8_STRING
            else if (tp == StrIdx.BUILTIN) v.op = Op.EXPRx_STATIC_BUILTIN_STRING
            else if (tp == StrIdx.ASCII) v.op = Op.EXPRx_STATIC_ASCII_STRING
            else assert(false)
            v.strValue = s
        } else {
            idx = this.prog.addBuffer(s)
            v.op = Op.EXPRx_STATIC_BUFFER
        }
        v.args = [literal(idx)]
        v.flags = VF_IS_STRING
        return v
    }

    getAssembly() {
        let res = `proc ${this.name}:\n`
        for (const stmt of parseBytecode(this.binary.slice(0, this.binPtr))) {
            res += stringifyInstr(stmt, this.prog) + "\n"
        }
        return res
    }

    mkLabel(name: string) {
        const l = new Label(name)
        this.labels.push(l)
        return l
    }

    _setLabelOffset(l: Label, off: number) {
        l.offset = off
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

    emitLabel(l: Label) {
        assert(l.offset == -1)
        this.lastReturnLocation = null
        this._setLabelOffset(l, this.location())
    }

    emitIfAndPop(reg: Value, thenBody: () => void, elseBody?: () => void) {
        if (elseBody) {
            const endIf = this.mkLabel("endIf")
            const elseIf = this.mkLabel("elseIf")
            this.emitJumpIfFalse(elseIf, reg)
            thenBody()
            this.emitJump(endIf)
            this.emitLabel(elseIf)
            elseBody()
            this.emitLabel(endIf)
        } else {
            const skipIf = this.mkLabel("skipIf")
            this.emitJumpIfFalse(skipIf, reg)
            thenBody()
            this.emitLabel(skipIf)
        }
    }

    emitJumpIfTrue(label: Label, cond: Value) {
        return this.emitJumpIfFalse(label, this.emitExpr(Op.EXPR1_NOT, cond))
    }

    emitJumpIfFalse(label: Label, cond: Value) {
        return this._emitJump(label, cond)
    }

    emitJump(label: Label) {
        return this._emitJump(label)
    }

    emitTry(label: Label) {
        return this._emitJump(label, undefined, Op.STMTx_TRY)
    }

    emitEndTry(label: Label) {
        return this._emitJump(label, undefined, Op.STMTx_END_TRY)
    }

    emitThrowJmp(label: Label, level: number) {
        if (level == 0) return this.emitJump(label)
        return this._emitJump(label, literal(level), Op.STMTx1_THROW_JMP)
    }

    private _emitJump(label: Label, cond?: Value, op?: Op) {
        cond?.adopt()
        this.spillAllStateful()

        if (cond) this.writeValue(cond)

        const off0 = this.location()
        if (!op) op = cond ? Op.STMTx1_JMP_Z : Op.STMTx_JMP
        this.writeByte(op)

        if (label.offset != -1) {
            this.writeInt(label.offset - off0)
        } else {
            if (!label.uses) label.uses = []
            label.uses.push(off0)
            this.writeInt(0x1000)
        }
    }

    private oops(msg: string) {
        try {
            console.log(this.getAssembly())
        } catch {}
        oops(msg)
    }

    assertNoTemps(really = false) {
        if (this.prog.hasErrors) return
        for (const c of this.cachedValues) {
            if (c !== null && (really || !c._longTerm)) {
                this.oops(`_L${c.packedIndex} still has ${c.numRefs} refs`)
            }
        }

        for (const e of this.pendingStatefulValues) {
            if (e.usesState && !e.hasParent)
                this.oops("pending stateful values")
        }
    }

    patchLabels(numLocals: number, numargs: number, tryDepth: number) {
        // we now patch at emit
        for (const l of this.labels) {
            if (l.uses) this.oops(`label ${l.name} not resolved`)
        }

        this.assertNoTemps(true)

        while (this.location() & 3) this.writeByte(0)

        const cachedLen = this.cachedValues.length
        const numSlots = numargs + numLocals + cachedLen

        const mapVarOffset = (v: number) => {
            assert(this.cachedValues.length == cachedLen)
            if (v < VAR_CACHED_OFF) {
                // regular param
                assert(v < numargs)
            } else if (v < VAR_LOCAL_OFF) {
                // cached local
                v -= VAR_CACHED_OFF
                assert(v < cachedLen)
                v += numargs
            } else {
                v -= VAR_LOCAL_OFF
                assert(v < numLocals)
                v += numargs + cachedLen
                assert(v < numSlots)
            }
            assert(v < BinFmt.FIRST_MULTIBYTE_INT)
            return v
        }

        // patch local indices
        for (const off of this.localOffsets) {
            this.binary[off] = mapVarOffset(this.binary[off])
        }
        this.localOffsets = []

        const buf = this.desc
        write32(buf, 4, this.location())
        write16(buf, 8, numSlots)
        buf[10] = numargs
        buf[11] = this.funFlags
        write16(buf, 12, this.nameIdx)
        assert(tryDepth <= 0xff)
        buf[14] = tryDepth

        return mapVarOffset
    }

    numSlots() {
        assert(read32(this.desc, 4) != 0)
        return read16(this.desc, 8)
    }

    private spillValue(v: Value) {
        const l = this.allocTmpLocal()
        l.store(v)
        v._set(l.emit())
        l.free()
    }

    private spillAllStateful() {
        for (const e of this.pendingStatefulValues) {
            if (e.usesState && !e.hasParent) this.spillValue(e)
        }
        this.pendingStatefulValues = []
    }

    emitMemRef(op: Op, idx: number) {
        const r = new Value()
        r.numValue = idx
        r.op = op
        r.flags = VF_IS_MEMREF | VF_USES_STATE
        this.pendingStatefulValues.push(r)
        return r
    }

    emitExpr(op: Op, ...args: Value[]) {
        assert(
            opNumArgs(op) == args.length,
            `op ${op} exp ${opNumArgs(op)} got ${args.length}`
        )
        assert(!opIsStmt(op), `op ${op} is stmt not expr`)
        let stack = 0
        let maxStack = 1
        let usesState = exprIsStateful(op)
        // TODO constant folding
        for (const a of args) {
            if (stack + a.maxstack >= BinFmt.MAX_STACK_DEPTH) this.spillValue(a)
            maxStack = Math.max(maxStack, stack + a.maxstack)
            stack++
            if (a.usesState) usesState = true
            assert(!(a.flags & VF_HAS_PARENT))
            a.flags |= VF_HAS_PARENT
        }
        const r = new Value()
        r.args = args
        r.op = op
        r.flags = maxStack - 1 // so that r.maxStack == maxStack
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
        if (0 <= v && v < BinFmt.FIRST_MULTIBYTE_INT) this.writeByte(v)
        else {
            let b = BinFmt.FIRST_MULTIBYTE_INT
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

    private saveLocalIdx(nval: number) {
        assert(nval < BinFmt.FIRST_MULTIBYTE_INT)
        this.localOffsets.push(this.location())
    }

    private writeArgs(op: Op, args: Value[]) {
        let i = 0
        if (opTakesNumber(op)) i = 1
        while (i < args.length) {
            this.writeValue(args[i])
            i++
        }
        this.writeByte(op)
        if (opTakesNumber(op)) {
            assert(args[0].isLiteral, `exp literal for op=${Op[op]} ${args[0]}`)
            const nval = args[0].numValue
            if (op == Op.STMTx1_STORE_LOCAL) this.saveLocalIdx(nval)
            this.writeInt(nval)
        }
    }

    private writeValue(v: Value) {
        assert(!(v.flags & VF_IS_WRITTEN))
        v.flags |= VF_IS_WRITTEN
        if (v.isLiteral) {
            const q = v.numValue
            if ((q | 0) == q) {
                const qq =
                    q + BinFmt.DIRECT_CONST_OFFSET + BinFmt.DIRECT_CONST_OP
                if (BinFmt.DIRECT_CONST_OP <= qq && qq <= 0xff)
                    this.writeByte(qq)
                else {
                    this.writeByte(Op.EXPRx_LITERAL)
                    this.writeInt(q)
                }
            } else if (isNaN(q)) {
                this.writeByte(Op.EXPR0_NAN)
            } else if (q == Infinity) {
                this.writeByte(Op.EXPR0_INF)
            } else if (q == -Infinity) {
                this.writeByte(Op.EXPR0_INF)
                this.writeByte(Op.EXPR1_NEG)
            } else {
                const idx = this.prog.addFloat(q)
                this.writeByte(Op.EXPRx_LITERAL_F64)
                this.writeInt(idx)
            }
        } else if (v.isMemRef) {
            assert(opTakesNumber(v.op))
            this.writeByte(v.op)
            if (v.op == Op.EXPRx_LOAD_LOCAL) this.saveLocalIdx(v.numValue)
            this.writeInt(v.numValue)
            if (v._cachedValue) v._cachedValue._decr()
        } else if (v.op >= 0x100) {
            oops("this value cannot be emitted: 0x" + v.op.toString(16))
        } else {
            if (v.op == Op.EXPRx_MAKE_CLOSURE) {
                const key = v.args[0].numValue + ""
                let l = this.closureRefs[key]
                if (!l) l = this.closureRefs[key] = []
                l.push(this.binPtr)
            }
            this.writeArgs(v.op, v.args)
        }
    }

    makeFunctionsStatic(isStatic: (fnidx: number) => boolean) {
        for (const key of Object.keys(this.closureRefs)) {
            if (!isStatic(+key)) continue
            for (const idx of this.closureRefs[key]) {
                assert(this.binary[idx] == Op.EXPRx_MAKE_CLOSURE)
                this.binary[idx] = Op.EXPRx_STATIC_FUNCTION
            }
        }
    }

    emitStmt(op: Op, ...args: Value[]) {
        assert(opNumArgs(op) == args.length)
        assert(opIsStmt(op))
        for (const a of args) a.adopt()
        this.spillAllStateful() // this doesn't spill adopt()'ed Value's (our arguments)
        this.writeArgs(op, args)
        if (op == Op.STMT1_RETURN) this.lastReturnLocation = this.location()
    }

    justHadReturn() {
        return this.location() == this.lastReturnLocation
    }

    emitCall(fn: Value, ...args: Value[]) {
        assert(args.length <= BinFmt.MAX_ARGS_SHORT_CALL)
        this.emitStmt(Op.STMT1_CALL0 + args.length, fn, ...args)
    }

    emitBuiltInObject(obj: BuiltInObject) {
        return this.emitExpr(Op.EXPRx_BUILTIN_OBJECT, literal(obj))
    }

    emitIndex(obj: Value, field: Value) {
        if (
            obj.op == Op.EXPRx_BUILTIN_OBJECT &&
            field.op == Op.EXPRx_STATIC_BUILTIN_STRING
        )
            return this.staticBuiltIn(obj.staticIdx, field.staticIdx)

        let op = Op.EXPR2_INDEX
        switch (field.op) {
            case Op.EXPRx_STATIC_BUILTIN_STRING:
                op = Op.EXPRx1_BUILTIN_FIELD
                break
            case Op.EXPRx_STATIC_ASCII_STRING:
                op = Op.EXPRx1_ASCII_FIELD
                break
            case Op.EXPRx_STATIC_UTF8_STRING:
                op = Op.EXPRx1_UTF8_FIELD
                break
            default:
                return this.emitExpr(Op.EXPR2_INDEX, obj, field)
        }

        return this.emitExpr(op, literal(field.staticIdx), obj)
    }

    builtInMember(obj: Value, name: BuiltInString) {
        return this.emitExpr(Op.EXPRx1_BUILTIN_FIELD, literal(name), obj)
    }

    staticBuiltIn(obj: BuiltInObject, name: BuiltInString) {
        if (obj == BuiltInObject.MATH) return this.mathMember(name)
        else if (obj == BuiltInObject.DEVICESCRIPT) return this.dsMember(name)
        else if (obj == BuiltInObject.OBJECT) return this.objectMember(name)
        return this.emitExpr(
            Op.EXPRx1_BUILTIN_FIELD,
            literal(name),
            this.emitBuiltInObject(obj)
        )
    }

    dsMember(name: BuiltInString) {
        return this.emitExpr(Op.EXPRx_DS_FIELD, literal(name))
    }

    mathMember(name: BuiltInString) {
        return this.emitExpr(Op.EXPRx_MATH_FIELD, literal(name))
    }

    objectMember(name: BuiltInString) {
        return this.emitExpr(Op.EXPRx_OBJECT_FIELD, literal(name))
    }
}

export class SectionWriter {
    offset = -1
    currSize = 0
    data: Uint8Array[] = []
    desc = new Uint8Array(BinFmt.SECTION_HEADER_SIZE)

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
            this.parent._setLabelOffset(
                this.startLabel,
                this.returnLabel.offset
            )
            return
        }
        const wr = this.parent
        wr.emitLabel(this.startLabel)
        this.finalizeRaw()
        wr.emitJump(this.returnLabel)
    }
}

export function bufferFmt(mem: jdspec.PacketMember) {
    let fmt = NumFmt.U8
    let sz = mem.storage
    if (sz < 0) {
        fmt = NumFmt.I8
        sz = -sz
    } else if (mem.isFloat) {
        fmt = 0b1000
    }
    switch (sz) {
        case 1:
            break
        case 2:
            fmt |= NumFmt.U16
            break
        case 4:
            fmt |= NumFmt.U32
            break
        case 8:
            fmt |= NumFmt.U64
            break
        default:
            oops("unhandled format: " + mem.storage + " for " + mem.name)
    }

    const shift = mem.shift || 0
    assertRange(0, shift, bitSize(fmt))
    return fmt | (shift << 4)
}
