import { assert, Image } from "@devicescript/compiler"
import { Mutex } from "async-mutex"
import {
    bufferConcat,
    bufferConcatMany,
    delay,
    EVENT,
    fromUTF8,
    getNumber,
    InPipeReader,
    JDBus,
    JDEvent,
    jdpack,
    JDRegister,
    JDService,
    JDServiceClient,
    jdunpack,
    NumberFormat,
    uint8ArrayToString,
} from "jacdac-ts"
import {
    DevsDbgEvent,
    DevsDbgReg,
    DevsDbgFiberHandle,
    DevsDbgSuspensionType,
    SRV_DEVS_DBG,
    DevsDbgCmd,
    DevsDbgValueTag,
    DevsDbgString,
    DevsDbgValueSpecial,
    DevsDbgStepFlags,
} from "@devicescript/compiler"

export interface DevsKeyValue {
    key: DevsValue | string
    value: DevsValue
}

const maxBytesFetch = 512

export class DevsValue {
    index: number
    tag: DevsDbgValueTag
    v0: number
    arg: DevsValue

    private cachedBytes: Uint8Array

    numNamed: number
    hasNamed: boolean
    numIndexed: number

    private _indexed: DevsValue[]
    private _named: DevsKeyValue[]

    stackFrame?: {
        pc: number
        userPc: number
        closure: DevsValue
        fnIdx: number
    }

    constructor(public parent: DevsDbgClient) {
        this.index = this.parent.values.length
        this.parent.values.push(this)
    }

    get genericText() {
        const t = DevsDbgValueTag[this.tag] || "t" + this.tag
        return `[${t}:0x${this.v0.toString(16)}]`
    }

    async readIndexed() {
        if (!this._indexed) {
            if (this.numIndexed === 0) {
                this._indexed = []
            } else {
                this._indexed = await this.parent.readIndexed(this)
            }
        }
        return this._indexed
    }

    async readNamed() {
        if (!this._named) {
            if (this.numNamed === 0 || this.hasNamed === false) {
                this._named = []
            } else {
                this._named = await this.parent.readNamed(this)
            }
        }
        return this._named
    }

    async readField(name: string) {
        const named = await this.readNamed()
        const direct = named.find(e => e.key == name)
        if (direct) return direct.value
        for (const e of named) {
            if (typeof e.key == "string") return
            const s = await e.key.readString()
            if (s == name) return e.value
        }
        return undefined
    }

    private async readBytes() {
        if (!this.cachedBytes)
            this.cachedBytes = await this.parent.readBytes(
                this,
                0,
                maxBytesFetch
            )
        return this.cachedBytes
    }

    get isPartial() {
        return this.cachedBytes?.length == maxBytesFetch
    }

    get isPrimitive() {
        if (this.isString) return true
        switch (this.tag) {
            case DevsDbgValueTag.Number:
                return true
            case DevsDbgValueTag.Special:
                switch (this.v0) {
                    case DevsDbgValueSpecial.False:
                    case DevsDbgValueSpecial.True:
                    case DevsDbgValueSpecial.Null:
                    case DevsDbgValueSpecial.Undefined:
                        return true
                    default:
                        return false
                }
            default:
                return false
        }
    }

    get isBuffer() {
        switch (this.tag) {
            case DevsDbgValueTag.ImgBuffer:
            case DevsDbgValueTag.ObjBuffer:
                return true

            default:
                return false
        }
    }

    async readBuffer() {
        switch (this.tag) {
            case DevsDbgValueTag.ImgBuffer:
                return this.parent.img.bufferTable[this.v0]

            case DevsDbgValueTag.ObjBuffer:
                return await this.readBytes()

            default:
                return undefined
        }
    }

    get isString() {
        switch (this.tag) {
            case DevsDbgValueTag.ImgStringUTF8:
            case DevsDbgValueTag.ImgStringBuiltin:
            case DevsDbgValueTag.ImgStringAscii:
            case DevsDbgValueTag.ObjString:
                return true

            default:
                return false
        }
    }

    async readString() {
        switch (this.tag) {
            case DevsDbgValueTag.ImgStringUTF8:
            case DevsDbgValueTag.ImgStringBuiltin:
            case DevsDbgValueTag.ImgStringAscii:
                return this.parent.img.getString(
                    this.tag - DevsDbgValueTag.ImgBuffer,
                    this.v0
                ) as string

            case DevsDbgValueTag.ObjString:
                return fromUTF8(uint8ArrayToString(await this.readBytes()))

            default:
                return undefined
        }
    }
}

export const EV_SUSPENDED = "dbgSuspended"

function tagIsObj(tag: DevsDbgValueTag) {
    return (tag & DevsDbgValueTag.ObjMask) == DevsDbgValueTag.ObjAny
}

export class DevsDbgClient extends JDServiceClient {
    private regEn: JDRegister
    private lock = new Mutex()
    suspensionReason: DevsDbgSuspensionType
    suspendedFiber: number
    values: DevsValue[] = []
    private valueMap: Record<string, DevsValue>

    constructor(service: JDService, public img: Image) {
        super(service)
        assert(service.serviceClass == SRV_DEVS_DBG)

        this.clearValues()

        this.regEn = service.register(DevsDbgReg.Enabled)

        this.mount(
            service
                .event(DevsDbgEvent.Suspended)
                .subscribe(EVENT, this.suspendedHandler.bind(this))
        )
    }

    get suspended() {
        return !!this.suspensionReason
    }

    private clearValues() {
        this.xlog("clear values")
        this.suspendedFiber = 0
        this.suspensionReason = 0
        for (const v of this.values) {
            v.parent = null
        }
        this.values = []
        this.valueMap = {}
        this.getValue(DevsDbgValueTag.Special, DevsDbgValueSpecial.Undefined)
    }

    async disable() {
        try {
            if (this.suspended) await this.resume()
        } catch {}
        await this.regEn.sendSetAsync(new Uint8Array([0]))
    }

    async resume() {
        await this.lock.runExclusive(async () => {
            this.clearValues()
            await this.service.sendCmdAsync(DevsDbgCmd.Resume)
        })
    }

    async setBoolReg(reg: DevsDbgReg, v: boolean) {
        await this.lock.runExclusive(async () => {
            this.service.register(reg).sendSetAsync(new Uint8Array([v ? 1 : 0]))
        })
    }

    private async haltCmd(cmd: DevsDbgCmd) {
        await this.lock.runExclusive(async () => {
            await this.regEn.sendSetAsync(new Uint8Array([1]))
            await this.service.sendCmdAsync(cmd)
        })
    }

    async halt() {
        await this.haltCmd(DevsDbgCmd.Halt)
    }

    async restartAndHalt() {
        await this.haltCmd(DevsDbgCmd.RestartAndHalt)
    }

    async step(frame: DevsValue, flags: DevsDbgStepFlags, brkPCs: number[]) {
        await this.lock.runExclusive(async () => {
            assert(!!frame.stackFrame)
            this.clearValues()
            await this.service.sendCmdAsync(
                DevsDbgCmd.Step,
                jdpack("u32 u16 x[2] u32[]", [frame.v0, flags, brkPCs])
            )
        })
    }

    private runSuspCmd(cmd: DevsDbgCmd, args?: Uint8Array) {
        assert(this.suspended)
        return this.lock.runExclusive(async () => {
            assert(this.suspended)
            await this.service.sendCmdAsync(cmd, args, true)
        })
    }

    async clearAllBreakpoints() {
        await this.runSuspCmd(DevsDbgCmd.ClearAllBreakpoints)
    }

    async setBreakpoints(pc: number[]) {
        if (pc.length)
            await this.runSuspCmd(
                DevsDbgCmd.SetBreakpoints,
                jdpack("u32[]", [pc])
            )
    }

    async clearBreakpoints(pc: number[]) {
        if (pc.length)
            await this.runSuspCmd(
                DevsDbgCmd.ClearBreakpoints,
                jdpack("u32[]", [pc])
            )
    }

    private waitEvent(name: string) {
        return new Promise<void>(resolve => this.once(name, resolve))
    }

    async waitSuspended() {
        if (this.suspended) return
        await this.waitEvent(EV_SUSPENDED)
    }

    get nullValue() {
        return this.values[0]
    }

    getValueByIndex(idx: number) {
        const v = this.values[idx]
        if (!v) throw new Error(`no such value: ${idx}`)
        return v
    }

    getCachedValue(tag: DevsDbgValueTag, v0: number, arg?: DevsValue) {
        return this.getValue(tag, v0, arg, true)
    }

    mkSynthValue(tag: DevsDbgValueTag, v0: number, arg?: DevsValue) {
        assert(tag == DevsDbgValueTag.User1)
        return this.getValue(tag, v0, arg)
    }

    exnValue() {
        return this.getValue(
            DevsDbgValueTag.Special,
            DevsDbgValueSpecial.CurrentException
        )
    }

    private getValue(
        tag: DevsDbgValueTag,
        v0: number,
        arg?: DevsValue,
        noCreate = false
    ) {
        const isObj = tagIsObj(tag)
        if (isObj && v0 == 0) return this.nullValue
        let suff = `/${v0}`
        if (arg) suff += `@${arg.index}`
        let key = tag + suff
        let r = this.valueMap[key]
        if (r || noCreate) return r
        r = new DevsValue(this)
        r.tag = tag
        r.v0 = v0
        r.arg = arg
        this.valueMap[key] = r
        this.xlog(`create ${r.genericText}`)
        if (isObj) this.valueMap[DevsDbgValueTag.ObjAny + suff] = r
        return r
    }

    async readStacktrace(fibid: number) {
        const pkts = await this.pipeGet(
            DevsDbgCmd.ReadStack,
            jdpack("u32", [fibid])
        )
        return pkts.output.map((pkt, idx) => {
            const [stackFrameId, pc, closureId, fnIdx] = pkt.jdunpack<number[]>(
                "u32 u32 u32 u16 x[2]"
            )
            const st = this.getValue(
                DevsDbgValueTag.ObjStackFrame,
                stackFrameId
            )
            let userPc = pc
            let isBrk =
                fibid == this.suspendedFiber &&
                idx == 0 &&
                (this.suspensionReason == DevsDbgSuspensionType.Breakpoint ||
                    this.suspensionReason == DevsDbgSuspensionType.Step)
            if (pc > 0 && !isBrk) userPc--
            st.stackFrame = {
                pc,
                userPc,
                closure: closureId
                    ? this.getValue(DevsDbgValueTag.ObjStackFrame, closureId)
                    : null,
                fnIdx,
            }
            return st
        })
    }

    async readFibers() {
        const pkts = await this.pipeGet(DevsDbgCmd.ReadFibers)
        return pkts.output.map(pkt => {
            const [fiberId, initialFn, currFn] = pkt.jdunpack("u32 u16 u16")
            return {
                fiberId,
                initialFn,
                currFn,
            }
        })
    }

    private unpackValue(buf: Uint8Array) {
        let [v0, v1, fnIdx, tag] = jdunpack(buf, "u32 u32 u16 u8")

        if (tag == DevsDbgValueTag.Number)
            v0 = getNumber(buf, NumberFormat.Float64LE, 0)

        let v = this.getValue(tag, v0)

        if (tag == DevsDbgValueTag.ImgRole || tag == DevsDbgValueTag.ObjMap) {
            v.numNamed = v1
        } else if (tagIsObj(tag)) {
            v.hasNamed = !!(v1 & 0x8000_0000)
            v.numIndexed = v1 & 0x7fff_ffff
        }

        if (fnIdx) {
            if (v == this.nullValue) v = undefined
            return this.getValue(DevsDbgValueTag.ImgFunction, fnIdx, v)
        } else return v
    }

    private indexedArg(v: DevsValue, start?: number, length?: number) {
        if (start == undefined) start = 0
        if (length == undefined) length = 0xffff
        assert(v.tag < DevsDbgValueTag.User1)
        const arg = jdpack("u32 u8 x[1] u16 u16", [v.v0, v.tag, start, length])
        return arg
    }

    async readBytes(v: DevsValue, start?: number, length?: number) {
        const pkts = await this.pipeGet(
            DevsDbgCmd.ReadBytes,
            this.indexedArg(v, start, length)
        )
        return bufferConcatMany(pkts.output.map(pkt => pkt.data))
    }

    async readIndexed(v: DevsValue, start?: number, length?: number) {
        const pkts = await this.pipeGet(
            DevsDbgCmd.ReadIndexedValues,
            this.indexedArg(v, start, length)
        )
        return pkts.output.map(pkt => this.unpackValue(pkt.data))
    }

    private decodeString(stridx: number) {
        if (
            (stridx & DevsDbgString.StaticIndicatorMask) ==
            (DevsDbgString.StaticIndicatorMask | 0)
        ) {
            assert(DevsDbgString.StaticTagMask >> 23 == 0x7f << 1)
            assert(0 != (DevsDbgString.StaticIndexMask & 2))
            assert(!(DevsDbgString.StaticIndexMask & 1))
            const tag = (stridx & DevsDbgString.StaticTagMask) >> 24
            const idx = (stridx & DevsDbgString.StaticIndexMask) >> 1
            return this.getValue(tag, idx)
        } else {
            return this.getValue(DevsDbgValueTag.ObjString, stridx)
        }
    }

    async readNamed(v: DevsValue) {
        const arg = jdpack("u32 u8", [v.v0, v.tag])
        const pkts = await this.pipeGet(DevsDbgCmd.ReadNamedValues, arg)
        return pkts.output.map((pkt): DevsKeyValue => {
            const key = this.decodeString(
                pkt.getNumber(NumberFormat.UInt32LE, 0)
            )
            const value = this.unpackValue(pkt.data.slice(4))
            // console.log(`${v.genericText}: ${key.genericText} => ${value.genericText}`)
            return { key, value }
        })
    }

    private async pipeGet(cmd: number, suff?: Uint8Array) {
        assert(cmd == DevsDbgCmd.ReadFibers || this.suspended)
        return this.lock.runExclusive(async () => {
            assert(cmd == DevsDbgCmd.ReadFibers || this.suspended)
            const inp = new InPipeReader(this.device.bus)
            const openPkt = inp.openCommand(cmd)
            if (suff) openPkt.data = bufferConcat(openPkt.data, suff)
            await this.service.sendPacketAsync(openPkt, true)
            return await inp.readAll()
        })
    }

    private suspendedHandler(ev: JDEvent) {
        const [fiber, reason] = jdunpack<
            [DevsDbgFiberHandle, DevsDbgSuspensionType]
        >(ev.data, "u32 u8")
        if (this.suspensionReason == reason && this.suspendedFiber == fiber)
            return
        this.suspendedFiber = fiber
        this.suspensionReason = reason
        this.xlog(`suspended fib=${fiber} ${DevsDbgSuspensionType[reason]}`)
        this.emit(EV_SUSPENDED)
    }

    private xlog(...args: any[]) {
        console.debug("DDBG:", ...args)
    }
}
