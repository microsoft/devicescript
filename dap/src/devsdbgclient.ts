import { assert } from "console"
import { Mutex } from "async-mutex"
import {
    bufferConcat,
    delay,
    EVENT,
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
} from "../../runtime/jacdac-c/jacdac/dist/specconstants"

export class DevsValue {
    index: number
    tag: DevsDbgValueTag
    v0: number
    arg: DevsValue

    numNamed: number
    hasNamed: boolean
    numIndexed: number

    constructor(public parent: DevsDbgClient) {
        this.index = this.parent.values.length
        this.parent.values.push(this)
    }
}

function TODO(msg = ""): never {
    throw new Error("TODO: " + msg)
}

export const EV_SUSPENDED = "dbgSuspended"

function tagIsObj(tag: DevsDbgValueTag) {
    return (tag & DevsDbgValueTag.ObjMask) == DevsDbgValueTag.ObjAny
}

export class DevsDbgClient extends JDServiceClient {
    static async fromBus(bus: JDBus) {
        for (let i = 0; i < 10; ++i) {
            const s = bus.services({
                serviceClass: SRV_DEVS_DBG,
            })[0]
            if (s) return new DevsDbgClient(s)
            await delay(100)
        }
        throw new Error("no debugger on the bus")
    }

    private regEn: JDRegister
    private lock = new Mutex()
    suspensionReason: DevsDbgSuspensionType
    suspendedFiber: number
    values: DevsValue[]
    private valueMap: Record<string, DevsValue>

    constructor(service: JDService) {
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

    private clearValues() {
        this.suspendedFiber = 0
        for (const v of this.values) {
            v.parent = null
        }
        this.values = []
        this.valueMap = {}
        this.getValue(DevsDbgValueTag.Special, DevsDbgValueSpecial.Null)
    }

    async resume() {
        await this.lock.runExclusive(async () => {
            this.clearValues()
            await this.service.sendCmdAsync(DevsDbgCmd.Resume)
        })
    }

    private async haltCmd(cmd: DevsDbgCmd) {
        await this.lock.runExclusive(async () => {
            await this.regEn.sendSetBoolAsync(true)
            await this.service.sendCmdAsync(cmd)
        })
    }

    async halt() {
        await this.haltCmd(DevsDbgCmd.Halt)
    }

    async restartAndHalt() {
        await this.haltCmd(DevsDbgCmd.RestartAndHalt)
    }

    private runSuspCmd(cmd: DevsDbgCmd, args?: Uint8Array) {
        assert(this.suspendedFiber)
        return this.lock.runExclusive(async () => {
            assert(this.suspendedFiber)
            await this.service.sendCmdAsync(cmd, args)
        })
    }

    async clearBreakpoints() {
        await this.runSuspCmd(DevsDbgCmd.ClearBreakpoints)
    }

    async setBreakpoint(pc: number) {
        await this.runSuspCmd(DevsDbgCmd.SetBreakpoint, jdpack("u32", [pc]))
    }

    private waitEvent(name: string) {
        return new Promise<void>(resolve => this.once(name, resolve))
    }

    async waitSuspended() {
        if (this.suspendedFiber) return
        await this.waitEvent(EV_SUSPENDED)
    }

    get nullValue() {
        return this.values[0]
    }

    private getValue(tag: DevsDbgValueTag, v0: number, arg?: DevsValue) {
        const isObj = tagIsObj(tag)
        if (isObj && v0 == 0) return this.nullValue
        let suff = `/${v0}`
        if (arg) suff += `@${arg.index}`
        let key = tag + suff
        let r = this.valueMap[key]
        if (r) return r
        r = new DevsValue(this)
        r.tag = tag
        r.v0 = v0
        r.arg = arg
        this.valueMap[key] = r
        if (isObj) this.valueMap[DevsDbgValueTag.ObjAny + suff] = r
        return r
    }

    async readStacktrace(fibid: number) {
        const pkts = await this.pipeGet(
            DevsDbgCmd.ReadStack,
            jdpack("u32", [fibid])
        )
        return pkts.output.map(pkt => {
            const [stackFrameId, pc, closureId, fnIdx] = pkt.jdunpack<number[]>(
                "u32 u32 u32 u16 x[2]"
            )
            return {
                stackFrameId: this.getValue(
                    DevsDbgValueTag.ObjStackFrame,
                    stackFrameId
                ),
                pc,
                closureId: this.getValue(
                    DevsDbgValueTag.ObjStackFrame,
                    closureId
                ),
                fnIdx,
            }
        })
    }

    async readFibers() {
        const pkts = await this.pipeGet(DevsDbgCmd.ReadFibers)
        return pkts.output.map(pkt => {
            const [fiberId] = pkt.jdunpack("u32")
            return {
                fiberId,
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

        if (fnIdx) return this.getValue(DevsDbgValueTag.ImgFunction, fnIdx, v)
        else return v
    }

    async readIndexed(v: DevsValue, start?: number, length?: number) {
        if (start == undefined) start = 0
        if (length == undefined) length = 0xffff
        const arg = jdpack("u32 u8 x[1] u16 u16", [v.v0, v.tag, start, length])
        const pkts = await this.pipeGet(DevsDbgCmd.ReadIndexedValues, arg)
        return pkts.output.map(pkt => this.unpackValue(pkt.data))
    }

    private decodeString(stridx: number) {
        if (
            (stridx & DevsDbgString.StaticIndicatorMask) ==
            DevsDbgString.StaticIndicatorMask
        ) {
            assert(DevsDbgString.StaticTagMask >> 23 == 0x7f << 1)
            assert(DevsDbgString.StaticIndexMask & 2)
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
        return pkts.output.map(pkt => {
            const key = this.decodeString(
                pkt.getNumber(NumberFormat.UInt32LE, 0)
            )
            const value = this.unpackValue(pkt.data.slice(4))
            return { key, value }
        })
    }

    private async pipeGet(cmd: number, suff?: Uint8Array) {
        return this.lock.runExclusive(async () => {
            const inp = new InPipeReader(this.device.bus)
            const openPkt = inp.openCommand(cmd)
            if (suff) openPkt.data = bufferConcat(openPkt.data, suff)
            await this.service.sendPacketAsync(openPkt, true)
            return await inp.readAll()
        })
    }

    private suspendedHandler(ev: JDEvent) {
        const [fiber, type] = jdunpack<
            [DevsDbgFiberHandle, DevsDbgSuspensionType]
        >(ev.data, "u32 u8")
        this.suspendedFiber = fiber
        this.suspensionReason = type
        this.emit(EV_SUSPENDED)
    }
}
