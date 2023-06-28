/**
 *
 * MQTT communication layer.
 * A port of https://github.com/rovale/micro-mqtt for MakeCode, ported to DeviceScript.
 */

import { delay } from "@devicescript/core"
import { Socket, SocketConnectOptions, connect } from "./sockets"
import {
    ErrorEvent,
    Event,
    EventTarget,
    MessageEvent,
} from "@devicescript/runtime"

/**
 * Connect flags
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349229
 */
export const enum ConnectFlags {
    UserName = 128,
    Password = 64,
    WillRetain = 32,
    WillQoS2 = 16,
    WillQoS1 = 8,
    Will = 4,
    CleanSession = 2,
}

/**
 * Connect Return code
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349256
 */
export const enum ConnectReturnCode {
    Unknown = -1,
    Accepted = 0,
    UnacceptableProtocolVersion = 1,
    IdentifierRejected = 2,
    ServerUnavailable = 3,
    BadUserNameOrPassword = 4,
    NotAuthorized = 5,
}

/**
 * A message received in a Publish packet.
 */
export interface IMessage {
    pid?: number
    topic: string
    content: Buffer
    qos: number
    retain: number
}

/**
 * MQTT Control Packet type
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc353481061
 */
export const enum ControlPacketType {
    Connect = 1,
    ConnAck = 2,
    Publish = 3,
    PubAck = 4,
    // PubRec = 5,
    // PubRel = 6,
    // PubComp = 7,
    Subscribe = 8,
    SubAck = 9,
    Unsubscribe = 10,
    UnsubAck = 11,
    PingReq = 12,
    PingResp = 13,
    Disconnect = 14,
}

/**
 * Optimization, the TypeScript compiler replaces the constant enums.
 */
export const enum Constants {
    PingInterval = 40,
    WatchDogInterval = 50,
    DefaultQos = 0,
    Uninitialized = -123,
    FixedPackedId = 1,
    KeepAlive = 60,
}

/**
 * The options used to connect to the MQTT broker.
 */
export interface MqttConnectOptions extends SocketConnectOptions {
    username?: string
    password?: string
    clientId: string
    will?: MqttConnectOptionsWill
}

export interface MqttConnectOptionsWill {
    topic: string
    message: string
    qos?: number
    retain?: boolean
}

/**
 * The specifics of the MQTT protocol.
 */
export module Protocol {
    function strChr(codes: number[]): Buffer {
        return Buffer.from(codes)
    }

    /**
     * Encode remaining length
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718023
     */
    function encodeRemainingLength(remainingLength: number): number[] {
        let length: number = remainingLength
        const encBytes: number[] = []
        do {
            let encByte: number = length & 127
            length = length >> 7
            // if there are more data to encode, set the top bit of this byte
            if (length > 0) {
                encByte += 128
            }
            encBytes.push(encByte)
        } while (length > 0)

        return encBytes
    }

    /**
     * Connect flags
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349229
     */
    function createConnectFlags(options: MqttConnectOptions): number {
        let flags: number = 0
        flags |= options.username ? ConnectFlags.UserName : 0
        flags |=
            options.username && options.password ? ConnectFlags.Password : 0
        flags |= ConnectFlags.CleanSession

        if (options.will) {
            flags |= ConnectFlags.Will
            flags |= (options.will.qos || 0) << 3
            flags |= options.will.retain ? ConnectFlags.WillRetain : 0
        }

        return flags
    }

    // Returns the MSB and LSB.
    function getBytes(int16: number): number[] {
        return [int16 >> 8, int16 & 255]
    }

    /**
     * Structure of UTF-8 encoded strings
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Figure_1.1_Structure
     */
    function pack(s: string): Buffer {
        const buf = Buffer.from(s)
        return strChr(getBytes(buf.length)).concat(buf)
    }

    /**
     * Structure of an MQTT Control Packet
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800392
     */
    function createPacketHeader(
        byte1: number,
        variable: Buffer,
        payloadSize: number
    ): Buffer {
        const byte2: number[] = encodeRemainingLength(
            variable.length + payloadSize
        )
        return strChr([byte1]).concat(strChr(byte2)).concat(variable)
    }

    /**
     * Structure of an MQTT Control Packet
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800392
     */
    function createPacket(
        byte1: number,
        variable: Buffer,
        payload?: Buffer
    ): Buffer {
        if (payload == null) payload = Buffer.alloc(0)
        return createPacketHeader(byte1, variable, payload.length).concat(
            payload
        )
    }

    /**
     * CONNECT - Client requests a connection to a Server
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718028
     */
    export function createConnect(options: MqttConnectOptions): Buffer {
        const byte1: number = ControlPacketType.Connect << 4

        const protocolName = pack("MQTT")
        const nums = Buffer.alloc(4)
        nums[0] = 4 // protocol level
        nums[1] = createConnectFlags(options)
        nums[2] = 0
        nums[3] = Constants.KeepAlive

        let payload = pack(options.clientId)

        if (options.will) {
            payload = payload.concat(
                pack(options.will.topic).concat(pack(options.will.message))
            )
        }

        if (options.username) {
            payload = payload.concat(pack(options.username))
            if (options.password) {
                payload = payload.concat(pack(options.password))
            }
        }

        return createPacket(byte1, protocolName.concat(nums), payload)
    }

    /** PINGREQ - PING request
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800454
     */
    export function createPingReq() {
        return strChr([ControlPacketType.PingReq << 4, 0])
    }

    /**
     * PUBLISH - Publish message header - doesn't include "payload"
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800410
     */
    export function createPublishHeader(
        topic: string,
        payloadSize: number,
        qos: number,
        retained: boolean
    ) {
        let byte1: number = (ControlPacketType.Publish << 4) | (qos << 1)
        byte1 |= retained ? 1 : 0

        const pid = strChr(getBytes(Constants.FixedPackedId))
        const variable = qos === 0 ? pack(topic) : pack(topic).concat(pid)

        return createPacketHeader(byte1, variable, payloadSize)
    }

    export function parsePublish(cmd: number, payload: Buffer): IMessage {
        const qos: number = (cmd & 0b00000110) >> 1

        const topicLength = payload.readUInt16BE(0)
        let variableLength: number = 2 + topicLength
        if (qos > 0) {
            variableLength += 2
        }

        const message: IMessage = {
            topic: payload.slice(2, topicLength).toString(),
            content: payload.slice(variableLength),
            qos: qos,
            retain: cmd & 1,
        }

        if (qos > 0) message.pid = payload.readUInt16BE(variableLength - 2)

        return message
    }

    /**
     * PUBACK - Publish acknowledgement
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800416
     */
    export function createPubAck(pid: number) {
        const byte1: number = ControlPacketType.PubAck << 4

        return createPacket(byte1, strChr(getBytes(pid)))
    }

    /**
     * SUBSCRIBE - Subscribe to topics
     * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800436
     */
    export function createSubscribe(topic: string, qos: number): Buffer {
        const byte1: number = (ControlPacketType.Subscribe << 4) | 2
        const pid = strChr(getBytes(Constants.FixedPackedId))

        return createPacket(byte1, pid, pack(topic).concat(strChr([qos])))
    }
}

enum HandlerStatus {
    Normal = 0,
    Once = 1,
    ToRemove = 2,
}

class MQTTHandler {
    public status: HandlerStatus
    constructor(public topic: string, public handler: (m: IMessage) => void) {
        this.status = HandlerStatus.Normal
    }
}

export enum Status {
    Disconnected = 0,
    Connecting = 1,
    Connected = 2,
    Sending = 3,
}

export class Client extends EventTarget {
    private log(msg: string) {
        console.log(`mqtt: ${msg}`)
    }

    private trace(msg: string) {
        console.debug(`mqtt: ${msg}`)
    }

    public opt: MqttConnectOptions

    private sct?: Socket

    private wdId: number
    private piId: number

    private buf: Buffer
    // we re-send subscriptions on re-connect
    private subs: Buffer[] = []

    public status = Status.Disconnected

    get connected() {
        return this.status >= Status.Connected
    }

    private mqttHandlers: MQTTHandler[]

    constructor(opt: MqttConnectOptions) {
        super()

        this.wdId = Constants.Uninitialized
        this.piId = Constants.Uninitialized
        opt.port = opt.port || 8883
        opt.clientId = opt.clientId

        if (opt.will) {
            opt.will.qos = opt.will.qos || Constants.DefaultQos
            opt.will.retain = opt.will.retain || false
        }

        this.opt = opt
    }

    private static describe(code: ConnectReturnCode): string {
        let error: string = "Connection refused, "
        switch (code) {
            case ConnectReturnCode.UnacceptableProtocolVersion:
                error += "unacceptable protocol version."
                break
            case ConnectReturnCode.IdentifierRejected:
                error += "identifier rejected."
                break
            case ConnectReturnCode.ServerUnavailable:
                error += "server unavailable."
                break
            case ConnectReturnCode.BadUserNameOrPassword:
                error += "bad user name or password."
                break
            case ConnectReturnCode.NotAuthorized:
                error += "not authorized."
                break
            default:
                error += `unknown return code: ${code}.`
        }

        return error
    }

    public async disconnect(): Promise<void> {
        this.log("disconnect")
        if (this.wdId !== Constants.Uninitialized) {
            clearInterval(this.wdId)
            this.wdId = Constants.Uninitialized
        }

        if (this.piId !== Constants.Uninitialized) {
            clearInterval(this.piId)
            this.piId = Constants.Uninitialized
        }

        const s = this.sct
        if (s) {
            this.sct = null
            await s.close()
        }

        this.status = Status.Disconnected
    }

    public async connect(): Promise<void> {
        if (this.status != Status.Disconnected) return
        this.status = Status.Connecting
        this.log(`Connecting to ${this.opt.host}:${this.opt.port}`)
        if (this.wdId === Constants.Uninitialized) {
            this.wdId = setInterval(async () => {
                if (!this.connected) {
                    await this.disconnect()
                    this.dispatchEvent(new Event("error")) //, "No connection. Retrying.")
                    await this.connect()
                }
            }, Constants.WatchDogInterval * 1000)
        }

        this.sct = await connect(this.opt)
        this.sct.addEventListener("open", () => {
            this.log("Network connection established.")
            this.dispatchEvent(new Event("connect"))
            this.send(Protocol.createConnect(this.opt))
        })
        this.sct.addEventListener("message", ev => {
            const mev = ev as MessageEvent<Buffer>
            const msg = mev.data
            this.trace("incoming " + msg.length + " bytes")
            this.handleMessage(msg)
        })
        this.sct.addEventListener("error", ev => {
            this.log("error")
            this.dispatchEvent(new Event("error"))
        })
        this.sct.addEventListener("close", () => {
            this.log("Close.")
            this.dispatchEvent(new Event("disconnected"))
            this.status = Status.Disconnected
            this.sct = null
        })
        // await this.sct.connect()
    }

    private async canSend() {
        let cnt = 0
        while (true) {
            if (this.status == Status.Connected) {
                this.status = Status.Sending
                return true
            }
            if (cnt++ < 100 && this.status == Status.Sending) await delay(20)
            else {
                this.log("drop pkt")
                return false
            }
        }
    }

    private doneSending() {
        this.trace("done send")
        if (this.status == Status.Sending) this.status = Status.Connected
    }

    // Publish a message
    public publish(
        topic: string,
        message?: string | Buffer,
        qos: number = Constants.DefaultQos,
        retained: boolean = false
    ): void {
        const buf = typeof message == "string" ? Buffer.from(message) : message
        message = null
        if (this.startPublish(topic, buf ? buf.length : 0, qos, retained)) {
            if (buf) this.send(buf)
            this.finishPublish()
        }
    }

    public startPublish(
        topic: string,
        messageLen: number,
        qos: number = Constants.DefaultQos,
        retained: boolean = false
    ) {
        if (!this.canSend()) return false
        this.trace(`publish: ${topic} ${messageLen}b`)
        this.send(
            Protocol.createPublishHeader(topic, messageLen, qos, retained)
        )
        return true
    }

    public continuePublish(data: Buffer) {
        this.send(data)
    }

    public finishPublish() {
        this.doneSending()
        this.dispatchEvent(new Event("published"))
    }

    private subscribeCore(
        topic: string,
        handler: (msg: IMessage) => void,
        qos: number = Constants.DefaultQos
    ): MQTTHandler {
        this.log(`subscribe: ${topic}`)
        const sub = Protocol.createSubscribe(topic, qos)
        this.subs.push(sub)
        this.send1(sub)
        if (handler) {
            if (topic[topic.length - 1] == "#")
                topic = topic.slice(0, topic.length - 1)
            if (!this.mqttHandlers) this.mqttHandlers = []
            const h = new MQTTHandler(topic, handler)
            this.mqttHandlers.push(h)
            return h
        } else {
            return null
        }
    }

    // Subscribe to topic
    public subscribe(
        topic: string,
        handler?: (msg: IMessage) => void,
        qos: number = Constants.DefaultQos
    ): void {
        this.subscribeCore(topic, handler, qos)
    }

    private async send(data: Buffer): Promise<void> {
        if (this.sct) {
            this.trace("send: " + data[0] + " / " + data.length + " bytes")
            // this.log("send: " + data[0] + " / " + data.length + " bytes: " + data.toHex())
            await this.sct.send(data)
        }
    }

    private async handleMessage(data: Buffer) {
        if (this.buf) data = this.buf.concat(data)
        this.buf = data
        if (data.length < 2) return
        let len = data[1]
        let payloadOff = 2
        if (len & 0x80) {
            if (data.length < 3) return
            if (data[2] & 0x80) {
                this.dispatchEvent(new ErrorEvent("error", `too large packet.`))
                this.buf = null
                return
            }
            len = (data[2] << 7) | (len & 0x7f)
            payloadOff++
        }

        const payloadEnd = payloadOff + len
        if (data.length < payloadEnd) return // wait for the rest of data

        this.buf = null

        const cmd = data[0]
        const controlPacketType: ControlPacketType = cmd >> 4
        // this.emit('debug', `Rcvd: ${controlPacketType}: '${data}'.`);

        const payload = data.slice(payloadOff, payloadEnd - payloadOff)

        switch (controlPacketType) {
            case ControlPacketType.ConnAck:
                const returnCode: number = payload[1]
                if (returnCode === ConnectReturnCode.Accepted) {
                    this.log("MQTT connection accepted.")
                    this.dispatchEvent(new Event("connected"))
                    this.status = Status.Connected
                    this.piId = setInterval(
                        async () => await this.ping(),
                        Constants.PingInterval * 1000
                    )
                    for (const sub of this.subs) await this.send1(sub)
                } else {
                    const connectionError: string = Client.describe(returnCode)
                    this.log("MQTT connection error: " + connectionError)
                    this.dispatchEvent(new ErrorEvent("error", connectionError))
                    await this.disconnect()
                }
                break
            case ControlPacketType.Publish:
                const message: IMessage = Protocol.parsePublish(cmd, payload)
                this.trace(`incoming: ${message.topic}`)
                let handled = false
                let cleanup = false
                if (this.mqttHandlers) {
                    for (let h of this.mqttHandlers)
                        if (message.topic.slice(0, h.topic.length) == h.topic) {
                            h.handler(message)
                            handled = true
                            if (h.status == HandlerStatus.Once) {
                                h.status = HandlerStatus.ToRemove
                                cleanup = true
                            }
                        }
                    if (cleanup)
                        this.mqttHandlers = this.mqttHandlers.filter(
                            h => h.status != HandlerStatus.ToRemove
                        )
                }
                if (!handled)
                    this.dispatchEvent(
                        new MessageEvent<IMessage>("receive", message)
                    )
                if (message.qos > 0) {
                    setTimeout(() => {
                        this.send1(Protocol.createPubAck(message.pid || 0))
                    }, 0)
                }
                break
            case ControlPacketType.PingResp:
            case ControlPacketType.PubAck:
            case ControlPacketType.SubAck:
                break
            default:
                this.dispatchEvent(
                    new ErrorEvent(
                        "error",
                        `MQTT unexpected packet type: ${controlPacketType}.`
                    )
                )
                break
        }

        if (data.length > payloadEnd) this.handleMessage(data.slice(payloadEnd))
    }

    private async send1(msg: Buffer) {
        if (await this.canSend()) {
            await this.send(msg)
            this.doneSending()
        }
    }

    private async ping() {
        await this.send1(Protocol.createPingReq())
        //this.emit("debug", "Sent: Ping request.")
    }
}
