import {
    JDBus,
    JDDevice,
    printPacket,
    NumberFormat,
    setNumber,
    CMD_GET_REG,
    jdunpack,
    Packet,
    fromUTF8,
    range,
    read16,
    read32,
    stringToUint8Array,
    uint8ArrayToString,
    CMD_SET_REG,
    sizeOfNumberFormat,
    SRV_JACSCRIPT_CONDITION,
    SRV_JACSCRIPT_CLOUD,
    SystemEvent,
    assert,
    JDEventSource,
    ERROR,
    PANIC,
    CHANGE,
    GLOBALS_UPDATED,
} from "jacdac-ts"
import { JacsEnvOptions, JDBusJacsEnv } from "./busenv"
import { JacsEnv } from "./env"
import {
    BinFmt,
    bitSize,
    CellDebugInfo,
    CellKind,
    DebugInfo,
    emptyDebugInfo,
    FunctionDebugInfo,
    isPrefixInstr,
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
    stringifyInstr,
    ValueSpecial,
} from "./format"
import { strformat } from "./strformat"

const MAX_STEPS = 128 * 1024

export function oopsPos(pos: number, msg: string): never {
    throw new Error(`verification error at ${hex(pos)}: ${msg}`)
}

export function assertPos(pos: number, cond: boolean, msg: string) {
    if (!cond) oopsPos(pos, msg)
}

export function hex(n: number) {
    return "0x" + n.toString(16)
}

function log(msg: string) {
    console.log("VM: " + msg)
}

export class BinSection {
    constructor(public buf: Uint8Array, public offset: number) {
        assertPos(offset, (offset & 3) == 0, "binsect: offset aligned")
        assertPos(offset, this.end <= this.buf.length, "binsect: end <= len")
    }

    checkAligned() {
        assertPos(this.offset, (this.start & 3) == 0, "binsect: aligned")
        assertPos(this.offset, (this.length & 3) == 0, "binsect: aligned sz")
    }

    toString() {
        return `[${hex(this.start)}:${hex(this.end)}]`
    }

    get start() {
        return read32(this.buf, this.offset)
    }

    get end() {
        return this.start + this.length
    }

    get length() {
        return read32(this.buf, this.offset + 4)
    }

    asBuffer() {
        return this.buf.slice(this.start, this.end).buffer
    }

    mustContain(pos: number, off: number | BinSection) {
        if (typeof off == "number") {
            if (this.start <= off && off <= this.end) return
            oopsPos(pos, `${hex(off)} falls outside of ${this}`)
        } else {
            this.mustContain(pos, off.start)
            this.mustContain(pos, off.end)
        }
    }
}

export function loadImage(bin: Uint8Array) {
    const hd = bin.slice(0, BinFmt.FixHeaderSize)

    const [magic0, magic1, numGlobals] = jdunpack(
        hd.slice(0, 10),
        "u32 u32 u16"
    )

    assertPos(0, magic0 == BinFmt.Magic0, "magic 0")
    assertPos(4, magic1 == BinFmt.Magic1, "magic 1")

    const sects = range(6).map(
        idx =>
            new BinSection(
                bin,
                BinFmt.FixHeaderSize + BinFmt.SectionHeaderSize * idx
            )
    )

    const [funDesc, funData, floatData, roleData, strDesc, strData] = sects

    return {
        funDesc,
        funData,
        floatData,
        roleData,
        strDesc,
        strData,
        sects,
        numGlobals,
    }
}

class RoleInfo {
    constructor(
        public parent: ImageInfo,
        public offset: number,
        public dbg: CellDebugInfo
    ) {}
    get classId() {
        return read32(this.parent.bin, this.offset)
    }
    get roleName() {
        const idx = read16(this.parent.bin, this.offset + 4)
        const buf = this.parent.stringLiterals[idx]
        return fromUTF8(uint8ArrayToString(buf))
    }
    toString() {
        return this.dbg?.name || `R${this.offset}`
    }
}

export class FunctionInfo {
    startPC: number
    numLocals: number
    numRegs: number
    numParams: number
    section: any

    constructor(
        bin: Uint8Array,
        public offset: number,
        public dbg: FunctionDebugInfo
    ) {
        const [start, _len, numLocals, numRegs, _flags] = jdunpack(
            bin.slice(offset, offset + 12),
            "u32 u32 u16 u8 u8"
        )
        this.startPC = start >> 1
        this.numLocals = numLocals
        this.numRegs = numRegs & 0xf
        this.numParams = numRegs >> 4
    }

    toString() {
        return this.dbg?.name || `FN${this.offset}`
    }
}

class ImageInfo {
    floatLiterals: Float64Array
    stringLiterals: Uint8Array[]
    roles: RoleInfo[]
    functions: FunctionInfo[]
    code: Uint16Array
    numGlobals: number

    constructor(
        public bin: Uint8Array,
        public dbg: DebugInfo = emptyDebugInfo()
    ) {
        const {
            funDesc,
            funData,
            floatData,
            roleData,
            strDesc,
            strData,
            sects,
            numGlobals,
        } = loadImage(bin)
        this.code = new Uint16Array(this.bin.buffer)
        this.floatLiterals = new Float64Array(floatData.asBuffer())

        this.numGlobals = numGlobals

        this.functions = []
        for (
            let ptr = funDesc.start;
            ptr < funDesc.end;
            ptr += BinFmt.FunctionHeaderSize
        ) {
            this.functions.push(
                new FunctionInfo(
                    this.bin,
                    ptr,
                    dbg.functions[this.functions.length]
                )
            )
        }

        this.stringLiterals = []
        for (
            let ptr = strDesc.start;
            ptr < strDesc.end;
            ptr += BinFmt.SectionHeaderSize
        ) {
            const strSect = new BinSection(bin, ptr)
            this.stringLiterals.push(new Uint8Array(strSect.asBuffer()))
        }

        this.roles = []
        for (
            let ptr = roleData.start;
            ptr < roleData.end;
            ptr += BinFmt.RoleHeaderSize
        ) {
            this.roles.push(
                new RoleInfo(this, ptr, dbg.roles[this.roles.length])
            )
        }
    }
}

function oops(): never {
    throw new Error()
}

function unop(op: OpUnary, v: number) {
    switch (op) {
        case OpUnary.ID:
            return v
        case OpUnary.NEG:
            return -v
        case OpUnary.NOT:
            return v ? 0 : 1
        case OpUnary.ABS:
            return Math.abs(v)
        case OpUnary.IS_NAN:
            return isNaN(v) ? 1 : 0
        default:
            oops()
    }
}

function binop(op: OpBinary, a: number, b: number) {
    switch (op) {
        case OpBinary.ADD:
            return a + b
        case OpBinary.SUB:
            return a - b
        case OpBinary.DIV:
            return a / b
        case OpBinary.MUL:
            return a * b
        case OpBinary.LT:
            return a < b ? 1 : 0
        case OpBinary.LE:
            return a <= b ? 1 : 0
        case OpBinary.EQ:
            return a == b ? 1 : 0
        case OpBinary.NE:
            return a != b ? 1 : 0
        case OpBinary.AND:
            return a ? b : a
        case OpBinary.OR:
            return a ? a : b
        default:
            oops()
    }
}

function opMath1(op: OpMath1, a: number) {
    switch (op) {
        case OpMath1.FLOOR:
            return Math.floor(a)
        case OpMath1.ROUND:
            return Math.round(a)
        case OpMath1.CEIL:
            return Math.ceil(a)
        case OpMath1.LOG_E:
            return Math.log(a)
        case OpMath1.RANDOM:
            return Math.random() * a
        default:
            oops()
    }
}

function opMath2(op: OpMath2, a: number, b: number) {
    switch (op) {
        case OpMath2.MIN:
            return Math.min(a, b)
        case OpMath2.MAX:
            return Math.max(a, b)
        case OpMath2.POW:
            return Math.pow(a, b)
        default:
            oops()
    }
}

const numfmts = [
    NumberFormat.UInt8LE,
    NumberFormat.UInt16LE,
    NumberFormat.UInt32LE,
    NumberFormat.UInt64LE,
    NumberFormat.Int8LE,
    NumberFormat.Int16LE,
    NumberFormat.Int32LE,
    NumberFormat.Int64LE,
]
function toNumberFormat(opfmt: OpFmt) {
    const r = numfmts[opfmt]
    if (r === undefined) {
        if (opfmt == OpFmt.F32) return NumberFormat.Float32LE
        if (opfmt == OpFmt.F64) return NumberFormat.Float64LE
        oops()
    }
    return r
}

function shiftVal(n: number) {
    if (n <= 31) return (1 << n) >>> 0
    let r = (1 << 31) >>> 0
    n -= 31
    while (n--) r *= 2
    return r
}

function nanify(v: number) {
    if (v == null) return NaN
    if (isNaN(v)) return NaN
    return v
}

function loadCell(
    ctx: Ctx,
    act: Activation,
    tp: CellKind,
    idx: number,
    c: number
) {
    switch (tp) {
        case CellKind.LOCAL:
            return act.locals[idx]
        case CellKind.GLOBAL:
            return ctx.globals[idx]
        case CellKind.BUFFER: // arg=shift:numfmt, C=Offset
            const fmt = toNumberFormat(idx & 0xf)
            if (sizeOfNumberFormat(fmt) + c > ctx.pkt.size) return NaN
            const v = ctx.pkt.getNumber(fmt, c)
            if (v === undefined) return NaN
            return v / shiftVal(idx >> 4)
        case CellKind.FLOAT_CONST:
            return ctx.info.floatLiterals[idx]
        case CellKind.IDENTITY:
            return idx
        case CellKind.SPECIAL:
            switch (idx) {
                case ValueSpecial.NAN:
                    return NaN
                case ValueSpecial.SIZE:
                    return ctx.pkt.size
                case ValueSpecial.EV_CODE:
                    return nanify(ctx.pkt.eventCode)
                case ValueSpecial.REG_GET_CODE:
                    return ctx.pkt.isRegisterGet
                        ? ctx.pkt.registerIdentifier
                        : NaN
                default:
                    oops()
            }
        case CellKind.ROLE_PROPERTY:
            const role = ctx.roles[idx]
            switch (c) {
                case OpRoleProperty.IS_CONNECTED:
                    return role.isAttached() ? 1 : 0
                default:
                    oops()
            }
        default:
            oops()
    }
}

function clamp(nfmt: OpFmt, v: number) {
    const sz = bitSize(nfmt)

    if (nfmt <= OpFmt.U64) {
        v = Math.round(v)
        if (v < 0) return 0
        const max = shiftVal(sz) - 1
        if (v > max) return max
        return v
    } else if (nfmt <= OpFmt.I64) {
        v = Math.round(v)
        const min = -shiftVal(sz - 1)
        if (v < min) return min
        const max = -min - 1
        if (v > max) return max
        return v
    }

    // no clamping for floats
    return v
}

function storeCell(
    ctx: Ctx,
    act: Activation,
    tp: CellKind,
    idx: number,
    c: number,
    val: number
) {
    switch (tp) {
        case CellKind.LOCAL:
            act.locals[idx] = val
            break
        case CellKind.GLOBAL:
            if (ctx.globals[idx] !== val) {
                ctx.globals[idx] = val
                ctx.globalsUpdated = true
            }
            break
        case CellKind.BUFFER: // arg=shift:numfmt, C=Offset
            const v = clamp(idx & 0xf, val * shiftVal(idx >> 4))
            setNumber(ctx.pkt.data, toNumberFormat(idx & 0xf), c, v)
            break
        default:
            oops()
    }
}

function strFormat(fmt: Uint8Array, args: Float64Array) {
    return stringToUint8Array(strformat(uint8ArrayToString(fmt), args))
}

class Activation {
    locals: Float64Array
    savedRegs: number
    pc: number

    constructor(
        public fiber: Fiber,
        public info: FunctionInfo,
        public caller: Activation,
        numargs: number
    ) {
        this.locals = new Float64Array(info.numLocals + info.numRegs)
        for (let i = 0; i < numargs; ++i)
            this.locals[i] = this.fiber.ctx.registers[i]
        this.pc = info.startPC
    }

    restart() {
        this.pc = this.info.startPC
    }

    private saveRegs(d: number) {
        let p = 0
        const r = this.fiber.ctx.registers
        for (let i = 0; i < NUM_REGS; i++) {
            if ((1 << i) & d) {
                if (p >= this.info.numRegs) oops()
                this.locals[this.info.numLocals + p] = r[i]
                p++
            }
        }
        this.savedRegs = d
    }

    restoreRegs() {
        if (this.savedRegs == 0) return
        const r = this.fiber.ctx.registers
        let p = 0
        for (let i = 0; i < NUM_REGS; i++) {
            if ((1 << i) & this.savedRegs) {
                r[i] = this.locals[this.info.numLocals + p]
                p++
            }
        }
        this.savedRegs = 0
    }

    private callFunction(info: FunctionInfo, numargs: number) {
        const callee = new Activation(this.fiber, info, this, numargs)
        this.fiber.activate(callee)
    }

    private returnFromCall() {
        if (this.caller) this.fiber.activate(this.caller)
        else this.fiber.finish()
    }

    logInstr() {
        const ctx = this.fiber.ctx
        const [a, b, c, d] = ctx.params
        const instr = ctx.info.code[this.pc]
        log(
            `run: ${this.pc}: ${stringifyInstr(instr, {
                resolverParams: [a, b, c, d],
            })}`
        )
    }

    step() {
        // this.logInstr()

        const ctx = this.fiber.ctx
        const instr = ctx.info.code[this.pc++]

        const op = instr >> 12
        const arg12 = instr & 0xfff
        const arg10 = instr & 0x3ff
        const arg8 = instr & 0xff
        const arg6 = instr & 0x3f
        const arg4 = instr & 0xf
        const subop = arg12 >> 8

        const reg0 = subop
        const reg1 = arg8 >> 4
        const reg2 = arg4

        let [a, b, c, d] = ctx.params

        switch (op) {
            case OpTop.LOAD_CELL:
            case OpTop.STORE_CELL:
            case OpTop.JUMP:
            case OpTop.CALL:
                b = (b << 6) | arg6
                break
        }

        switch (op) {
            case OpTop.LOAD_CELL:
            case OpTop.STORE_CELL:
                a = (a << 2) | (arg8 >> 6)
                break
        }

        switch (op) {
            case OpTop.SET_A:
            case OpTop.SET_B:
            case OpTop.SET_C:
            case OpTop.SET_D:
                ctx.params[op] = arg12
                break

            case OpTop.SET_HIGH:
                ctx.params[arg12 >> 10] |= arg10 << 12
                break

            case OpTop.UNARY: // OP[4] DST[4] SRC[4]
                ctx.registers[reg1] = unop(subop, ctx.registers[reg2])
                break

            case OpTop.BINARY: // OP[4] DST[4] SRC[4]
                ctx.registers[reg1] = binop(
                    subop,
                    ctx.registers[reg1],
                    ctx.registers[reg2]
                )
                break

            case OpTop.LOAD_CELL: // DST[4] A:OP[2] B:OFF[6]
                ctx.registers[reg0] = loadCell(ctx, this, a, b, c)
                break

            case OpTop.STORE_CELL: // SRC[4] A:OP[2] B:OFF[6]
                storeCell(ctx, this, a, b, c, ctx.registers[reg0])
                break

            case OpTop.JUMP: // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
                if (arg8 & (1 << 6) && ctx.registers[reg0]) break
                if (arg8 & (1 << 7)) {
                    this.pc -= b
                } else {
                    this.pc += b
                }
                break

            case OpTop.CALL: // NUMREGS[4] OPCALL[2] B:OFF[6] (D - saved regs)
                this.saveRegs(d)
                const finfo = ctx.info.functions[b]
                switch (arg8 >> 6) {
                    case OpCall.SYNC:
                        this.callFunction(finfo, subop)
                        break
                    case OpCall.BG:
                    case OpCall.BG_MAX1:
                    case OpCall.BG_MAX1_PEND1:
                        ctx.startFiber(finfo, subop, arg8 >> 6)
                        break
                    default:
                        oops()
                }
                break

            case OpTop.SYNC: // A:ARG[4] OP[8]
                a = (a << 4) | subop
                switch (arg8) {
                    case OpSync.RETURN:
                        this.returnFromCall()
                        break
                    case OpSync.SETUP_BUFFER: // A-size
                        ctx.pkt.data = new Uint8Array(a)
                        break
                    case OpSync.FORMAT: // A-string-index B-numargs C-offset
                        ctx.setBuffer(
                            strFormat(
                                ctx.info.stringLiterals[a],
                                ctx.registers.slice(0, b)
                            ),
                            c
                        )
                        break
                    case OpSync.MEMCPY: // A-string-index C-offset
                        const lit = ctx.info.stringLiterals[a]
                        if (lit.length + c > ctx.pkt.data.length) {
                            const left = ctx.pkt.data.length - c
                            if (left > 0)
                                ctx.pkt.data.set(lit.slice(0, left), c)
                        } else {
                            ctx.pkt.data.set(lit, c)
                        }
                        break
                    case OpSync.STR0EQ: {
                        const s = ctx.info.stringLiterals[a]
                        ctx.registers[0] =
                            ctx.pkt.data[c + s.length] === 0 &&
                            memcmp(
                                ctx.pkt.data.slice(c, c + s.length),
                                s,
                                s.length
                            ) == 0
                                ? 1
                                : 0
                        break
                    }
                    case OpSync.MATH1:
                        ctx.registers[0] = opMath1(a, ctx.registers[0])
                        break
                    case OpSync.MATH2:
                        ctx.registers[0] = opMath2(
                            a,
                            ctx.registers[0],
                            ctx.registers[1]
                        )
                        break
                    case OpSync.PANIC:
                        ctx.panic(a)
                        break
                    default:
                        oops()
                        break
                }
                break

            case OpTop.ASYNC: // D:SAVE_REGS[4] OP[8]
                d = (d << 4) | subop
                this.saveRegs(d)
                switch (arg8) {
                    case OpAsync.WAIT_ROLE:
                        const r = ctx.roles[a]
                        this.fiber.waitingOnRole = r
                        this.fiber.setWakeTime(0)
                        ctx.doYield()
                        break
                    case OpAsync.SLEEP_MS: // A-timeout in ms
                        this.fiber.setWakeTime(ctx.now() + a)
                        ctx.doYield()
                        break
                    case OpAsync.SLEEP_R0:
                        this.fiber.setWakeTime(
                            ctx.now() + Math.round(ctx.registers[0] * 1000)
                        )
                        ctx.doYield()
                        break
                    case OpAsync.SEND_CMD: // A-role, B-code
                        ctx.sendCmd(ctx.roles[a], b)
                        break
                    case OpAsync.QUERY_REG: // A-role, B-code, C-timeout
                        ctx.getReg(ctx.roles[a], b | CMD_GET_REG, c)
                        break
                    case OpAsync.QUERY_IDX_REG:
                        ctx.getReg(ctx.roles[a], b & 0xff, c, b >> 8)
                        break
                    case OpAsync.LOG_FORMAT: // A-string-index B-numargs
                        const msg = strFormat(
                            ctx.info.stringLiterals[a],
                            ctx.registers.slice(0, b)
                        )
                        console.log(
                            "JSCR: " + fromUTF8(uint8ArrayToString(msg))
                        )
                        this.fiber.sleep(0)
                        break
                    default:
                        oops()
                        break
                }
                break
        }

        if (!isPrefixInstr(instr)) ctx.params.fill(0)
    }
}

function memcmp(a: Uint8Array, b: Uint8Array, sz: number) {
    for (let i = 0; i < sz; ++i) {
        const d = a[i] - b[i]
        if (d) return Math.sign(d)
    }
    return 0
}

class Fiber {
    wakeTime: number
    waitingOnRole: Role
    commandCode: number
    commandArg: number
    resendTimeout: number
    cmdPayload: Uint8Array

    activation: Activation
    firstFun: FunctionInfo
    pending: boolean

    constructor(public ctx: Ctx) {}

    resume() {
        if (this.prelude()) return
        this.setWakeTime(0)
        this.waitingOnRole = null
        this.ctx.currentFiber = this
        this.ctx.params.fill(0)
        this.activate(this.activation)
    }

    private prelude() {
        const resumeUserCode = false
        const keepWaiting = true

        if (!this.commandCode) return false
        const role = this.waitingOnRole
        if (!role.isAttached()) {
            this.setWakeTime(0)
            return keepWaiting // unbound, keep waiting, no timeout
        }

        if (this.cmdPayload) {
            const pkt = role.mkCmd(this.commandCode, this.cmdPayload)
            log(`send to ${role.info}: ${printPacket(pkt)}`)
            this.ctx.env.send(pkt)
            this.commandCode = 0
            this.cmdPayload = null
            return resumeUserCode
        }

        const pkt = this.ctx.pkt

        if (
            pkt.isReport &&
            pkt.serviceCommand == this.commandCode &&
            pkt.device == role.device &&
            pkt.serviceIndex == role.serviceIndex
        ) {
            const c = new CachedRegister()
            c.code = pkt.serviceCommand
            c.argument = this.commandArg
            c.role = role
            if (c.updateWith(role, pkt, this.ctx)) {
                this.ctx.regs.add(c)
                this.commandCode = 0
                pkt.data = c.value // this will strip any string label
                return resumeUserCode
            }
        }
        if (this.ctx.now() >= this.wakeTime) {
            const p = role.mkCmd(this.commandCode)
            if (this.commandArg)
                p.data = this.ctx.info.stringLiterals[this.commandArg].slice()
            this.ctx.env.send(p)
            if (this.resendTimeout < 1000) this.resendTimeout *= 2
            this.sleep(this.resendTimeout)
        }
        return keepWaiting
    }

    activate(a: Activation) {
        this.activation = a
        this.ctx.currentActivation = a
        a.restoreRegs()
    }

    setWakeTime(v: number) {
        this.wakeTime = v
        this.ctx.wakeTimesUpdated()
    }

    sleep(ms: number) {
        this.setWakeTime(this.ctx.now() + ms)
        this.ctx.doYield()
    }

    finish() {
        log(`finish ${this.firstFun} ${this.pending ? " +pending" : ""}`)
        if (this.pending) {
            this.pending = false
            this.activation.restart()
        } else {
            const idx = this.ctx.fibers.indexOf(this)
            if (idx < 0) oops()
            this.ctx.fibers.splice(idx, 1)
            this.ctx.doYield()
        }
    }
}

class Role {
    device: JDDevice
    serviceIndex: number

    constructor(public info: RoleInfo) {}

    assign(d: JDDevice, idx: number) {
        log(`role ${this.info} <-- ${d}:${idx}`)
        this.device = d
        this.serviceIndex = idx
    }

    mkCmd(serviceCommand: number, payload?: Uint8Array) {
        const p = Packet.from(serviceCommand, payload || new Uint8Array(0))
        p.deviceIdentifier = this.device.deviceId
        p.device = this.device
        p.serviceIndex = this.serviceIndex
        p.isCommand = true
        return p
    }

    isAttached() {
        return this.isCondition() || !!this.device
    }

    isCondition() {
        return this.info.classId == SRV_JACSCRIPT_CONDITION
    }
}

/*
// in C
uint8_t role
uint8_t arg
uint16_t code
uint32_t last_refresh
uint8_t data_size
uint8_t data[data_size]
*/

class CachedRegister {
    role: Role
    code: number
    argument: number
    last_access_idx: number
    last_refresh_time: number
    value: Uint8Array
    dead: boolean

    expired(now: number, validity: number) {
        if (!validity) validity = 15 * 60 * 1000
        return this.last_refresh_time + validity <= now
    }

    updateWith(role: Role, pkt: Packet, ctx: Ctx) {
        if (this.dead) return false
        if (this.role != role) return false
        if (this.code != pkt.serviceCommand) return false
        if (!pkt.isReport) return false
        let val = pkt.data
        if (this.argument) {
            const arg = ctx.info.stringLiterals[this.argument]
            if (
                pkt.data.length >= arg.length + 1 &&
                pkt.data[arg.length] == 0 &&
                memcmp(pkt.data, arg, arg.length) == 0
            ) {
                val = pkt.data.slice(arg.length + 1)
            } else {
                val = null
            }
        }
        if (val) {
            this.last_refresh_time = ctx.now()
            this.value = val.slice()
            return true
        } else {
            return false
        }
    }
}

const MAX_REG_CACHE = 50
const HALF_REG_CACHE = MAX_REG_CACHE >> 1

class RegisterCache {
    private regs: CachedRegister[] = []
    private access_idx = 0

    markUsed(c: CachedRegister) {
        c.last_access_idx = this.access_idx++
    }
    lookup(role: Role, code: number, arg = 0) {
        return this.regs.find(
            r =>
                !r.dead && r.role == role && r.code == code && r.argument == arg
        )
    }
    detachRole(role: Role) {
        for (const r of this.regs) if (r.role == role) r.dead = true
    }
    roleChanged(now: number, role: Role) {
        for (const r of this.regs) {
            if (r.role == role) {
                // if the role changed, push all it's registers' last update time at least 10s in the past
                r.last_refresh_time = Math.min(r.last_refresh_time, now - 10000)
            }
        }
    }
    updateWith(role: Role, pkt: Packet, ctx: Ctx) {
        for (const r of this.regs) r.updateWith(role, pkt, ctx)
    }
    add(c: CachedRegister) {
        if (this.regs.length >= MAX_REG_CACHE) {
            let old_access = 0
            let num_live = 0
            for (;;) {
                let min_access = this.access_idx
                num_live = 0
                for (const r of this.regs) {
                    if (r.last_access_idx <= old_access) r.dead = true
                    if (r.dead) continue
                    min_access = Math.min(r.last_access_idx, min_access)
                    num_live++
                }
                if (num_live <= HALF_REG_CACHE) break
                old_access = min_access - 2
            }
            this.regs = this.regs.filter(r => !r.dead)
        }
        this.regs.push(c)
        this.markUsed(c)
    }
}

const RESTART_PANIC_CODE = 0x100000
const INTERNAL_ERROR_PANIC_CODE = 0x100001

class Ctx {
    pkt: Packet
    registers = new Float64Array(NUM_REGS)
    params = new Uint16Array(4)
    globals: Float64Array
    currentFiber: Fiber
    fibers: Fiber[] = []
    currentActivation: Activation
    roles: Role[]
    wakeTimeout: any
    wakeUpdated = false
    globalsUpdated = true
    panicCode = 0
    onPanic: (code: number) => void
    onError: (err: Error) => void
    onGlobalsUpdated: () => void
    bus: JDBus
    regs = new RegisterCache()

    constructor(public info: ImageInfo, public env: JacsEnv) {
        this.globals = new Float64Array(this.info.numGlobals)
        this.roles = info.roles.map(r => new Role(r))

        this.env.onPacket = this.processPkt.bind(this)

        this.env.roleManager.setRoles(
            this.roles
                .filter(r => !r.isCondition())
                .map(r => ({
                    name: r.info.roleName,
                    classIdenitifer: r.info.classId,
                }))
        )

        this.env.roleManager.onAssignmentsChanged =
            this.syncRoleAssignments.bind(this)

        this.wakeFibers = this.wakeFibers.bind(this)
    }

    getGlobals() {
        const res: Record<string, number> = {}
        let idx = 0
        for (const info of this.info.dbg?.globals ?? [])
            res[info.name] = this.globals[idx++]
        return res
    }

    private syncRoleAssignments() {
        const assignedRoles: Role[] = []
        for (const r of this.roles) {
            if (r.isCondition()) continue
            const curr = this.env.roleManager.getRole(r.info.roleName)
            if (
                curr.device != r.device ||
                curr.serviceIndex != r.serviceIndex
            ) {
                assignedRoles.push(r)
                r.assign(curr.device, curr.serviceIndex)
                if (!curr.device) this.regs.detachRole(r)
            }
        }
        if (assignedRoles.length) {
            for (const r of assignedRoles) {
                this.pkt = Packet.from(0xffff, new Uint8Array(0))
                if (r.device) this.pkt.deviceIdentifier = r.device.deviceId
                this.wakeRole(r)
            }
            this.pokeFibers()
        }
    }

    now() {
        return this.env.now()
    }

    startProgram() {
        this.startFiber(this.info.functions[0], 0, OpCall.BG)
        this.pokeFibers()
    }

    wakeTimesUpdated() {
        this.wakeUpdated = true
    }

    panic(code: number, exn?: Error) {
        if (!code) code = RESTART_PANIC_CODE
        if (!this.panicCode) {
            if (code == RESTART_PANIC_CODE)
                console.debug(`jdvm: RESTART requested`)
            else if (code == INTERNAL_ERROR_PANIC_CODE)
                console.error(`jdvm: INTERNAL ERROR`)
            else console.error(`jdvm: PANIC ${code}`)
            this.panicCode = code
        }
        this.clearWakeTimer()
        if (!exn) exn = new Error("Panic")
        ;(exn as any).panicCode = this.panicCode
        throw exn
    }

    private clearWakeTimer() {
        if (this.wakeTimeout !== undefined) {
            this.env.clearTimeout(this.wakeTimeout)
            this.wakeTimeout = undefined
        }
    }

    private run(f: Fiber) {
        if (this.panicCode) return
        try {
            f.resume()
            let maxSteps = MAX_STEPS
            while (this.currentActivation) {
                this.currentActivation.step()
                if (!--maxSteps) throw new Error("execution timeout")
            }
        } catch (e) {
            if (this.panicCode) {
                this.onPanic(this.panicCode)
            } else {
                try {
                    // this will set this.panicCode, so we don't run any code anymore
                    this.panic(INTERNAL_ERROR_PANIC_CODE)
                } catch {}
                this.onError(e)
            }
        }
    }

    private pokeFibers() {
        if (this.wakeUpdated) this.wakeFibers()
        if (this.globalsUpdated) {
            this.globalsUpdated = false
            this.onGlobalsUpdated()
        }
    }

    private wakeFibers() {
        if (this.panicCode) return

        let minTime = 0

        this.clearWakeTimer()

        this.pkt = Packet.onlyHeader(0xffff)

        for (;;) {
            let numRun = 0
            const now = this.now()
            minTime = Infinity
            for (const f of this.fibers) {
                if (!f.wakeTime) continue
                const wakeTime = f.wakeTime
                if (now >= wakeTime) {
                    this.run(f)
                    if (this.panicCode) return
                    numRun++
                } else {
                    minTime = Math.min(wakeTime, minTime)
                }
            }

            if (numRun == 0 && minTime > this.now()) break
        }

        this.wakeUpdated = false
        if (minTime < Infinity) {
            const delta = Math.max(0, minTime - this.now())
            this.wakeTimeout = this.env.setTimeout(this.wakeFibers, delta)
        }
    }

    private wakeRole(role: Role) {
        for (const f of this.fibers)
            if (f.waitingOnRole == role) {
                if (false)
                    log(
                        `wake ${f.firstFun} r=${
                            role.info
                        } pkt=${this.pkt.toString()}`
                    )
                this.run(f)
            }
    }

    private processPkt(pkt: Packet) {
        if (this.panicCode) return
        if (pkt.isRepeatedEvent) return

        this.pkt = pkt
        if (false && pkt.serviceIndex != 0)
            console.log(new Date(), "process: " + printPacket(pkt))
        for (let idx = 0; idx < this.roles.length; ++idx) {
            const r = this.roles[idx]
            if (
                r.device == pkt.device &&
                (r.serviceIndex == pkt.serviceIndex ||
                    (pkt.serviceIndex == 0 && pkt.serviceCommand == 0))
            ) {
                if (pkt.eventCode === SystemEvent.Change)
                    this.regs.roleChanged(this.now(), r)
                this.regs.updateWith(r, pkt, this)
                this.wakeRole(r)
            }
        }
        this.pokeFibers()
    }

    doYield() {
        const f = this.currentFiber
        this.currentFiber = null
        this.currentActivation = null
        return f
    }

    startFiber(info: FunctionInfo, numargs: number, op: OpCall) {
        if (op != OpCall.BG)
            for (const f of this.fibers) {
                if (f.firstFun == info) {
                    if (op == OpCall.BG_MAX1_PEND1) {
                        if (f.pending) {
                            this.registers[0] = 3
                        } else {
                            f.pending = true
                            this.registers[0] = 2
                        }
                    } else {
                        this.registers[0] = 0
                    }
                    return
                }
            }
        log(`start fiber: ${info} ${this.pkt ? printPacket(this.pkt) : ""}`)
        const fiber = new Fiber(this)
        fiber.activation = new Activation(fiber, info, null, numargs)
        fiber.firstFun = info
        fiber.setWakeTime(this.now())
        this.fibers.push(fiber)
        this.registers[0] = 1
    }

    private pktLabel() {
        return fromUTF8(uint8ArrayToString(this.pkt.data))
    }

    setBuffer(b: Uint8Array, off: number) {
        if (off > 236) return
        if (b.length + off > 236) b = b.slice(0, 236 - off)
        const pkt = this.pkt
        if (b.length + off > pkt.size) {
            const tmp = new Uint8Array(b.length + off)
            tmp.set(pkt.data)
            tmp.set(b, off)
            pkt.data = tmp
        } else {
            pkt.data.set(b, off)
        }
    }

    sendCmd(role: Role, code: number) {
        if ((code & 0xf000) == CMD_SET_REG) {
            const cached = this.regs.lookup(
                role,
                (code & ~CMD_SET_REG) | CMD_GET_REG
            )
            if (cached) cached.dead = true
        }

        const fib = this.currentFiber
        if (role.isCondition()) {
            fib.sleep(0)
            log(`wake condition ${role.info}`)
            this.wakeRole(role)
            return
        }

        fib.waitingOnRole = role
        fib.commandCode = code
        fib.resendTimeout = 20
        fib.cmdPayload = this.pkt.data.slice() // hmmm...
        fib.sleep(0)
    }

    getReg(role: Role, code: number, timeout: number, arg = 0) {
        const now = this.now()

        if (role.device) {
            const cached = this.regs.lookup(role, code, arg)
            if (cached) {
                if (cached.expired(now, timeout)) {
                    cached.dead = true
                } else {
                    this.regs.markUsed(cached)
                    this.pkt = Packet.from(cached.code, cached.value)
                    this.pkt.deviceIdentifier = role.device.deviceId
                    this.pkt.serviceIndex = role.serviceIndex
                    return
                }
            }
        }

        const fib = this.currentFiber
        fib.waitingOnRole = role
        fib.commandCode = code
        fib.commandArg = arg
        fib.resendTimeout = 20
        fib.sleep(0)
    }
}

export enum RunnerState {
    Stopped,
    Initializing,
    Running,
    Error,
}

export class Runner extends JDEventSource {
    private ctx: Ctx
    private env: JDBusJacsEnv
    img: ImageInfo
    allowRestart = false
    options: JacsEnvOptions = {}
    private _state = RunnerState.Stopped
    startDelay = 1100

    constructor(
        public bus: JDBus,
        public bin: Uint8Array,
        public dbg: DebugInfo = emptyDebugInfo()
    ) {
        super()
        this.img = new ImageInfo(bin, dbg)
        if (!this.img.roles.some(r => r.classId == SRV_JACSCRIPT_CLOUD))
            this.options.disableCloud = true
    }

    get state() {
        return this._state
    }
    private set state(value: RunnerState) {
        if (value !== this._state) {
            this._state = value
            console.log(`jsc: runner ${this._state}`)
            this.emit(CHANGE)
        }
    }

    globals() {
        return this.ctx?.getGlobals()
    }

    run() {
        if (
            this.state === RunnerState.Running ||
            this.state == RunnerState.Initializing
        )
            return
        this.stop()
        this.state = RunnerState.Initializing
        this.env = new JDBusJacsEnv(this.bus, this.options)
        this.ctx = new Ctx(this.img, this.env)
        this.ctx.onError = e => {
            console.error("Internal error", e.stack)
            this.state = RunnerState.Error
            this.emit(ERROR, e)
        }
        this.ctx.onGlobalsUpdated = () => {
            this.emit(GLOBALS_UPDATED)
        }
        this.ctx.onPanic = code => {
            if (code == RESTART_PANIC_CODE) code = 0
            if (code) console.error(`PANIC ${code}`)
            this.state = RunnerState.Stopped
            this.emit(PANIC, code)
            if (this.allowRestart) this.run()
        }
        this.bus.scheduler.setTimeout(() => {
            if (this.ctx) {
                this.state = RunnerState.Running
                this.ctx.startProgram()
            }
        }, this.startDelay)
    }

    stop() {
        const ctx = this.ctx
        if (ctx) {
            this.allowRestart = false
            this.ctx = undefined
            // the ctx.panic(0) will not call onPanic() handler, so we stop ourselves here
            this.state = RunnerState.Stopped
            try {
                ctx.panic(0)
            } catch (e) {
                //console.debug(e)
            }
        }
        const env = this.env
        if (env) {
            this.env = undefined
            env.unmount()
        }
    }
}
