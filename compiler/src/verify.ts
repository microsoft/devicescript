import {
    fromUTF8,
    range,
    read16,
    read32,
    stringToUint8Array,
    toUTF8,
    uint8ArrayToString,
    write16,
    write32,
} from "jacdac-ts"
import {
    assertPos,
    BinSection,
    FunctionInfo,
    hex,
    loadImage,
    oopsPos,
} from "./executor"
import {
    BinFmt,
    bitSize,
    CellDebugInfo,
    CellKind,
    DebugInfo,
    emptyDebugInfo,
    FunctionDebugInfo,
    Host,
    InstrArgResolver,
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
    SMap,
    stringifyCellKind,
    stringifyInstr,
    ValueSpecial,
} from "./format"

class Resolver implements InstrArgResolver {
    resolverPC: number
    constructor(private floats: Float64Array, private dbg: DebugInfo) {}
    resolverParams: number[]
    describeCell(t: CellKind, idx: number): string {
        switch (t) {
            case CellKind.GLOBAL:
                return this.dbg.globals[idx]?.name
            case CellKind.FLOAT_CONST:
                return this.floats[idx] + ""
            default:
                return undefined
        }
    }
    funName(idx: number): string {
        return this.dbg.functions[idx]?.name
    }
    roleName(idx: number): string {
        return this.dbg.roles[idx]?.name
    }
}

export function numSetBits(n: number) {
    let r = 0
    for (let i = 0; i < 32; ++i) if (n & (1 << i)) r++
    return r
}

export function verifyBinary(
    host: Host,
    bin: Uint8Array,
    dbg = emptyDebugInfo()
) {
    const sourceLines = dbg.source.split(/\n/)

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

    for (let i = 0; i < sects.length; ++i) {
        host.log(`sect ${sects[i]}`)
        sects[i].checkAligned()
        if (i > 0)
            assertPos(
                sects[i].offset,
                sects[i - 1].end == sects[i].start,
                "section in order"
            )
    }

    assertPos(
        floatData.offset,
        (floatData.length & 7) == 0,
        "float data 8-aligned"
    )
    const floats = new Float64Array(floatData.asBuffer())

    const resolver = new Resolver(floats, dbg)
    const numFuncs = funDesc.length / BinFmt.FunctionHeaderSize
    const numRoles = roleData.length / BinFmt.RoleHeaderSize
    const numStrings = strDesc.length / BinFmt.SectionHeaderSize

    const funs: FunctionInfo[] = []

    let prevProc = funData.start
    let idx = 0
    for (
        let ptr = funDesc.start;
        ptr < funDesc.end;
        ptr += BinFmt.FunctionHeaderSize
    ) {
        const funSect = new BinSection(bin, ptr)
        funSect.checkAligned()
        assertPos(ptr, funSect.start == prevProc, "func in order")
        funData.mustContain(ptr, funSect)
        prevProc = funSect.end

        assertPos(ptr, funSect.length > 0, "func size > 0")
        const info = new FunctionInfo(bin, ptr, dbg.functions[idx])
        funs.push(info)
        info.section = funSect

        idx++
    }

    let allStrings: string[] = []

    idx = 0
    for (
        let ptr = strDesc.start;
        ptr < strDesc.end;
        ptr += BinFmt.SectionHeaderSize
    ) {
        const strSect = new BinSection(bin, ptr)
        strData.mustContain(ptr, strSect)
        const str = fromUTF8(
            uint8ArrayToString(new Uint8Array(strSect.asBuffer()))
        )
        allStrings.push(str)
        host.log(`str #${idx} = ${JSON.stringify(str)}`)
        idx++
    }

    idx = 0
    for (
        let ptr = roleData.start;
        ptr < roleData.end;
        ptr += BinFmt.RoleHeaderSize
    ) {
        const cl = read32(bin, ptr)
        const top = cl >>> 28
        assertPos(
            ptr,
            top == 0x1 || top == 0x2,
            "service class starts with 0x1 or 0x2 (mixin)"
        )
        const nameIdx = read16(bin, ptr + 4)
        assertPos(ptr, nameIdx < numStrings, "role name in range")
        host.log(`role #${idx} = ${hex(cl)} ${allStrings[nameIdx]}`)
        idx++
    }

    for (let i = 0; i < floats.length; ++i)
        host.log(`float #${i} = ${floats[i]}`)

    for (const info of funs) {
        verifyFunction(info, info.section)
    }

    function verifyFunction(info: FunctionInfo, f: BinSection) {
        const dbg = info.dbg
        const funcode = new Uint16Array(f.asBuffer())
        host.log(`fun ${f} ${dbg?.name}`)
        const srcmap = dbg?.srcmap || []
        let srcmapPtr = 0
        let prevLine = -1
        let params = [0, 0, 0, 0]
        let [a, b, c, d] = params
        let writtenRegs = 0
        let pc = 0
        let isJumpTarget: boolean[] = []

        check(info.numLocals >= info.numParams, "params fit in locals")

        for (let pass = 0; pass < 2; ++pass) {
            pc = 0
            writtenRegs = 0
            for (; pc < funcode.length; ++pc) {
                while (pc >= srcmap[srcmapPtr + 1] + srcmap[srcmapPtr + 2])
                    srcmapPtr += 3
                if (prevLine != srcmap[srcmapPtr]) {
                    prevLine = srcmap[srcmapPtr]
                    if (prevLine && pass == 0)
                        host.log(
                            `; (${prevLine}): ${
                                sourceLines[prevLine - 1] || ""
                            }`
                        )
                }
                const instr = funcode[pc]
                if (pass == 0) {
                    resolver.resolverPC = pc + (f.start >> 1)
                    resolver.resolverParams = params.slice()
                    host.log(stringifyInstr(instr, resolver))
                }

                if (isJumpTarget[pc]) writtenRegs = 0

                verifyInstr(instr)
            }
        }

        function verifyInstr(instr: number) {
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
            let lastOK = false

            ;[a, b, c, d] = params

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
                    params[op] = arg12
                    break

                case OpTop.SET_HIGH:
                    check(arg10 >> 4 == 0, "set_high only supported for 16 bit")
                    params[arg12 >> 10] |= arg10 << 12
                    break

                case OpTop.UNARY: // OP[4] DST[4] SRC[4]
                    rdReg(reg2)
                    wrReg(reg1)
                    check(subop < OpUnary._LAST, "valid uncode")
                    break

                case OpTop.BINARY: // OP[4] DST[4] SRC[4]
                    rdReg(reg1)
                    rdReg(reg2)
                    wrReg(reg1)
                    check(subop != 0, "valid bincode")
                    check(subop < OpBinary._LAST, "valid bincode")
                    break

                case OpTop.LOAD_CELL: // DST[4] A:OP[2] B:OFF[6]
                    wrReg(reg0)
                    verifyCell(a, b, false)
                    break

                case OpTop.STORE_CELL: // SRC[4] A:OP[2] B:OFF[6]
                    rdReg(reg0)
                    verifyCell(a, b, true)
                    break

                case OpTop.JUMP: // REG[4] BACK[1] IF_ZERO[1] B:OFF[6]
                    let pc2 = pc + 1
                    if (arg8 & (1 << 7)) {
                        pc2 -= b
                    } else {
                        pc2 += b
                    }
                    check(pc2 >= 0, "jump before")
                    check(pc2 < funcode.length, "jump after")
                    check(
                        pc2 == 0 || !isPrefixInstr(funcode[pc2 - 1]),
                        "jump into prefix"
                    )
                    isJumpTarget[pc2] = true
                    if (arg8 & (1 << 6)) rdReg(reg0)
                    else lastOK = true
                    break

                case OpTop.CALL: // NUMREGS[4] OPCALL[2] B:OFF[6] (D - saved regs)
                    rdRegs(subop)
                    checkSaveRegs()
                    switch (arg8 >> 6) {
                        case OpCall.BG:
                        case OpCall.BG_MAX1:
                        case OpCall.BG_MAX1_PEND1:
                            check(d == 0, "save regs on bg call")
                            wrReg(0)
                            break
                        case OpCall.SYNC:
                            wrReg(0)
                            break
                        default:
                            check(false, "invalid callop")
                    }
                    check(b < numFuncs, "call fn in range")
                    check(funs[b].numParams == subop, "correct num of args")
                    break

                case OpTop.SYNC: // A:ARG[4] OP[8]
                    a = (a << 4) | subop
                    switch (arg8) {
                        case OpSync.RETURN:
                            lastOK = true
                            break
                        case OpSync.SETUP_BUFFER: // A-size
                            check(a <= 236, "setup buffer size in range")
                            break
                        case OpSync.FORMAT: // A-string-index B-numargs
                            check(c <= 236, "offset in range")
                            rdRegs(b)
                            check(a < numStrings, "str in range")
                            break
                        case OpSync.STR0EQ:
                            check(c <= 236, "offset in range")
                            check(a < numStrings, "str in range")
                            wrReg(0)
                            break
                        case OpSync.MEMCPY:
                            check(c <= 236, "offset in range")
                            check(a < numStrings, "str in range")
                            break
                        case OpSync.MATH1:
                            rdReg(0)
                            wrReg(0)
                            check(a < OpMath1._LAST, "math1 in range")
                            break
                        case OpSync.MATH2:
                            rdReg(0)
                            rdReg(1)
                            wrReg(0)
                            check(a < OpMath2._LAST, "math2 in range")
                            break
                        case OpSync.PANIC:
                            lastOK = true
                            break
                        default:
                            check(false, "invalid sync code")
                            break
                    }
                    break

                case OpTop.ASYNC: // D:SAVE_REGS[4] OP[8]
                    d = (d << 4) | subop
                    checkSaveRegs()
                    switch (arg8) {
                        case OpAsync.SLEEP_MS:
                            break
                        case OpAsync.SLEEP_R0:
                            rdReg(0)
                            break
                        case OpAsync.WAIT_ROLE:
                            check(a < numRoles, "role in range")
                            break
                        case OpAsync.SEND_CMD: // A-role, B-code
                            check(a < numRoles, "role idx")
                            check(b <= 0xffff, "cmd code")
                            break
                        case OpAsync.QUERY_REG: // A-role, B-code, C-timeout
                            check(a < numRoles, "role idx")
                            check(b <= 0x1ff, "reg code")
                            break
                        case OpAsync.QUERY_IDX_REG: // A-role, B-STRIDX:CMD[8], C-timeout
                            check(a < numRoles, "role idx")
                            check(b >> 8 != 0, "arg!=0")
                            check(b >> 8 < numStrings, "num str")
                            break
                        case OpAsync.LOG_FORMAT: // A-string-index B-numargs
                            rdRegs(b)
                            const argmask = (1 << b) - 1
                            check(
                                (d & argmask) == argmask,
                                "log regs are saved"
                            )
                            check(a < numStrings, "str in range")
                            break
                        default:
                            check(false, "invalid async code")
                            break
                    }
                    writtenRegs &= d
                    break
            }

            if (!isPrefixInstr(instr)) params = [0, 0, 0, 0]

            if (lastOK) writtenRegs = 0

            check(lastOK || pc + 1 < funcode.length, "final fall-off")
        }

        function check(cond: boolean, msg: string) {
            if (!cond) {
                oopsPos(
                    f.start + pc * 2,
                    "instruction verification failure: " + msg
                )
            }
        }

        function rdReg(idx: number) {
            check((writtenRegs & (1 << idx)) != 0, "register was written")
        }

        function rdRegs(num: number) {
            for (let i = 0; i < num; i++) rdReg(i)
        }

        function wrReg(idx: number) {
            writtenRegs |= 1 << idx
        }

        function checkSaveRegs() {
            for (let i = 0; i < NUM_REGS; i++) if (d & (1 << i)) rdReg(i)
            check(
                numSetBits(d) <= info.numRegs,
                "allocated regs: " + info.numRegs
            )
        }

        function verifyCell(tp: CellKind, idx: number, write: boolean) {
            check(idx >= 0, "idx pos")
            switch (tp) {
                case CellKind.LOCAL:
                    check(idx < info.numLocals, "locals range")
                    break
                case CellKind.GLOBAL:
                    check(idx < numGlobals, "globals range")
                    break
                case CellKind.BUFFER: // arg=shift:numfmt, C=Offset
                    const fmt: OpFmt = idx & 0xf
                    check(
                        fmt <= OpFmt.I64 ||
                            fmt == OpFmt.F32 ||
                            fmt == OpFmt.F64,
                        "valid fmt"
                    )
                    const sz = bitSize(idx & 0xf)
                    const shift = idx >> 4
                    check(shift <= sz, "shift < sz")
                    check(c <= 236 - sz / 8, "offset in range")
                    break
                case CellKind.FLOAT_CONST:
                    check(idx < floats.length, "float const in range")
                    break
                case CellKind.IDENTITY:
                    break
                case CellKind.SPECIAL:
                    check(idx < ValueSpecial._LAST, "special in range")
                    break
                case CellKind.ROLE_PROPERTY:
                    check(idx < numRoles, "role prop R range")
                    check(c < OpRoleProperty._LAST, "role prop C range")
                    break
                default:
                    check(false, "invalid cell kind")
            }

            switch (tp) {
                case CellKind.LOCAL:
                case CellKind.GLOBAL:
                case CellKind.BUFFER:
                    break
                default:
                    check(!write, "cell kind not writable")
                    break
            }
        }
    }
}
