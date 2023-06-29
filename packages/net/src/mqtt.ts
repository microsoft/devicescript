/**
 *
 * MQTT communication layer.
 * A port of https://github.com/rovale/micro-mqtt for MakeCode, ported to DeviceScript.
 */

import { AsyncVoid, delay, emitter, wait } from "@devicescript/core"
import { Socket, SocketConnectOptions, connect } from "./sockets"

/**
 * Connect flags
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349229
 */
export const enum MQTTConnectFlags {
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
export const enum MQTTConnectReturnCode {
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
export interface MQTTMessage {
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
const enum MQTTControlPacketType {
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
const enum Constants {
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
 * The specifics of the MQTT
 */
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
    while (length > 0) {
        let encByte: number = length & 127
        length = length >> 7
        // if there are more data to encode, set the top bit of this byte
        if (length > 0) {
            encByte += 128
        }
        encBytes.push(encByte)
    }
    return encBytes
}

/**
 * Connect flags
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349229
 */
function createConnectFlags(options: MqttConnectOptions): number {
    let flags: number = 0
    flags |= options.username ? MQTTConnectFlags.UserName : 0
    flags |=
        options.username && options.password ? MQTTConnectFlags.Password : 0
    flags |= MQTTConnectFlags.CleanSession

    if (options.will) {
        flags |= MQTTConnectFlags.Will
        flags |= (options.will.qos || 0) << 3
        flags |= options.will.retain ? MQTTConnectFlags.WillRetain : 0
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
    const byte2: number[] = encodeRemainingLength(variable.length + payloadSize)
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
    if (!payload) payload = Buffer.alloc(0)
    return createPacketHeader(byte1, variable, payload.length).concat(payload)
}

/**
 * CONNECT - Client requests a connection to a Server
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718028
 */
function createConnect(options: MqttConnectOptions): Buffer {
    const byte1: number = MQTTControlPacketType.Connect << 4

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
function createPingReq() {
    return strChr([MQTTControlPacketType.PingReq << 4, 0])
}

/**
 * PUBLISH - Publish message header - doesn't include "payload"
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800410
 */
function createPublishHeader(
    topic: string,
    payloadSize: number,
    qos: number,
    retained: boolean
) {
    let byte1: number = (MQTTControlPacketType.Publish << 4) | (qos << 1)
    byte1 |= retained ? 1 : 0

    const pid = strChr(getBytes(Constants.FixedPackedId))
    const variable = qos === 0 ? pack(topic) : pack(topic).concat(pid)

    return createPacketHeader(byte1, variable, payloadSize)
}

function parsePublish(cmd: number, payload: Buffer): MQTTMessage {
    const qos: number = (cmd & 0b00000110) >> 1

    const topicLength = payload.readUInt16BE(0)
    let variableLength: number = 2 + topicLength
    if (qos > 0) {
        variableLength += 2
    }

    const message: MQTTMessage = {
        topic: payload.slice(2, 2 + topicLength).toString(),
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
function createPubAck(pid: number) {
    const byte1: number = MQTTControlPacketType.PubAck << 4

    return createPacket(byte1, strChr(getBytes(pid)))
}

/**
 * SUBSCRIBE - Subscribe to topics
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc384800436
 */
function createSubscribe(topic: string, qos: number): Buffer {
    const byte1: number = (MQTTControlPacketType.Subscribe << 4) | 2
    const pid = strChr(getBytes(Constants.FixedPackedId))

    return createPacket(byte1, pid, pack(topic).concat(strChr([qos])))
}

enum HandlerStatus {
    Normal = 0,
    Once = 1,
    ToRemove = 2,
}

class MQTTHandler {
    public status: HandlerStatus
    constructor(
        public readonly header: Buffer,
        public readonly topic: string,
        public readonly handler: (m: MQTTMessage) => AsyncVoid
    ) {
        this.status = HandlerStatus.Normal
    }
}

export enum MQTTState {
    /**
     * Opening socket
     */
    Connecting = 0,
    /**
     * Socket opened, waiting for MQTT broker
     */
    Open = 1,
    /**
     * MQTT broken acked connection packet
     */
    Connected = 2,
    Closing = 3,
    Closed = 4,
    /**
     * Sending packet
     */
    Sending = 5,
}

/**
 * A MQTT client
 */
export class MQTTClient {
    private log(msg: string) {
        console.log(`mqtt: ${msg}`)
    }

    private trace(msg: string) {
        console.debug(`mqtt: ${msg}`)
    }

    public opt: MqttConnectOptions

    private sct?: Socket

    private wdId: any
    private piId: any

    private buf: Buffer
    public readyState = MQTTState.Closed

    public readonly onerror = emitter<Error>()
    public readonly onopen = emitter<unknown>()
    public readonly onclose = emitter<unknown>()
    public readonly onmessage = emitter<MQTTMessage>()

    private mqttHandlers: MQTTHandler[] = []

    constructor(opt: MqttConnectOptions) {
        opt.port = opt.port || 8883
        opt.clientId = opt.clientId

        if (opt.will) {
            opt.will.qos = opt.will.qos || Constants.DefaultQos
            opt.will.retain = opt.will.retain || false
        }

        this.opt = opt
    }

    private static describe(code: MQTTConnectReturnCode): string {
        let error: string = "Connection refused, "
        switch (code) {
            case MQTTConnectReturnCode.UnacceptableProtocolVersion:
                error += "unacceptable protocol version."
                break
            case MQTTConnectReturnCode.IdentifierRejected:
                error += "identifier rejected."
                break
            case MQTTConnectReturnCode.ServerUnavailable:
                error += "server unavailable."
                break
            case MQTTConnectReturnCode.BadUserNameOrPassword:
                error += "bad user name or password."
                break
            case MQTTConnectReturnCode.NotAuthorized:
                error += "not authorized."
                break
            default:
                error += `unknown return code: ${code}.`
        }

        return error
    }

    /**
     * Close the current connection and socket
     */
    public async close(): Promise<void> {
        if (this.readyState === MQTTState.Closed) return

        this.readyState = MQTTState.Closing
        this.log("disconnect")
        clearInterval(this.wdId)
        this.wdId = undefined
        clearInterval(this.piId)
        this.piId = undefined
        const s = this.sct
        if (s) {
            this.sct = null
            await s.close()
        }
        this.readyState = MQTTState.Closed
    }

    public async connect(): Promise<void> {
        if (this.readyState !== MQTTState.Closed) return

        const self = this
        this.readyState = MQTTState.Connecting
        this.log(`socket connecting to ${this.opt.host}:${this.opt.port}`)
        clearInterval(this.wdId)
        this.wdId = setInterval(async () => {
            if (self.readyState !== MQTTState.Connected) {
                await self.close()
                self.onerror.emit(new Error("No connection. Retrying."))
                await self.connect()
            }
        }, Constants.WatchDogInterval * 1000)

        this.sct = await connect(this.opt)
        this.sct.onmessage.subscribe(async () => {
            const msg = await self.sct?.recv()
            self.trace(`recv ${msg.length}b ${msg.toString("hex")}`)
            await self.handleMessage(msg)
        })
        this.sct.onerror.subscribe(err => {
            self.log("error")
            self.onerror.emit(err)
        })
        this.sct.onclose.subscribe(() => {
            self.log("Close.")
            self.onclose.emit(undefined)
            self.readyState = MQTTState.Closed
            self.sct = null
        })
        self.log("socket opened, connecting to broker")
        this.readyState = MQTTState.Open
        await self.send(createConnect(self.opt))
        await wait(this.onopen, self.opt.timeout)
    }

    private async canSend() {
        let cnt = 0
        while (true) {
            if (this.readyState === MQTTState.Connected) {
                this.readyState = MQTTState.Sending
                return true
            }
            if (cnt++ < 100 && this.readyState === MQTTState.Sending)
                await delay(20)
            else {
                this.log("drop pkt")
                return false
            }
        }
    }

    private doneSending() {
        this.trace("done send")
        if (this.readyState === MQTTState.Sending)
            this.readyState = MQTTState.Connected
    }

    // Publish a message
    public async publish(
        topic: string,
        message?: string | Buffer,
        qos: number = Constants.DefaultQos,
        retained: boolean = false
    ): Promise<boolean> {
        const buf = typeof message === "string" ? Buffer.from(message) : message
        message = null
        if (!(await this.canSend())) return false
        const messageLen = buf ? buf.length : 0
        this.trace(`publish: ${topic} ${messageLen}b`)
        await this.send(createPublishHeader(topic, messageLen, qos, retained))
        if (buf) await this.send(buf)
        this.doneSending()
        return true
    }

    /**
     * Subscribe to a MQTT topic
     * @param topic
     * @param handler
     * @param qos
     */
    public async subscribe(
        topic: string,
        handler: (msg: MQTTMessage) => AsyncVoid,
        qos: number = Constants.DefaultQos
    ): Promise<boolean> {
        this.log(`subscribe: ${topic}`)
        if (!(await this.canSend())) return false
        const sub = createSubscribe(topic, qos)
        await this.send1(sub)
        if (topic[topic.length - 1] === "#")
            topic = topic.slice(0, topic.length - 1)
        const h = new MQTTHandler(sub, topic, handler)
        this.mqttHandlers.push(h)
        return true
    }

    private async send(data: Buffer): Promise<void> {
        if (this.sct) {
            this.trace(`send ${data.length}b ${data.toString("hex")}`)
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
                this.onerror.emit(new Error(`too large packet.`))
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
        const controlPacketType: MQTTControlPacketType = cmd >> 4
        // this.emit('debug', `Rcvd: ${controlPacketType}: '${data}'.`);

        const payload = data.slice(payloadOff, payloadEnd)
        switch (controlPacketType) {
            case MQTTControlPacketType.ConnAck:
                const returnCode: number = payload[1]
                if (returnCode === MQTTConnectReturnCode.Accepted) {
                    const self = this
                    this.log("MQTT connection accepted.")
                    this.readyState = MQTTState.Connected
                    this.onopen.emit(undefined)
                    this.piId = setInterval(
                        async () => await self.ping(),
                        Constants.PingInterval * 1000
                    )
                    for (const sub of this.mqttHandlers)
                        await this.send1(sub.header)
                } else {
                    const connectionError: string =
                        MQTTClient.describe(returnCode)
                    this.log("MQTT connection error: " + connectionError)
                    this.onerror.emit(new Error(connectionError))
                    await this.close()
                }
                break
            case MQTTControlPacketType.Publish:
                const message: MQTTMessage = parsePublish(cmd, payload)
                this.trace(`incoming: ${message.topic}`)
                let handled = false
                let cleanup = false
                if (this.mqttHandlers.length) {
                    for (let h of this.mqttHandlers)
                        if (
                            message.topic.slice(0, h.topic.length) === h.topic
                        ) {
                            await h.handler(message)
                            handled = true
                            if (h.status === HandlerStatus.Once) {
                                h.status = HandlerStatus.ToRemove
                                cleanup = true
                            }
                        }
                    if (cleanup)
                        this.mqttHandlers = this.mqttHandlers.filter(
                            h => h.status !== HandlerStatus.ToRemove
                        )
                }
                if (!handled) this.onmessage.emit(message)
                if (message.qos > 0) {
                    const self = this
                    setTimeout(async () => {
                        await self.send1(createPubAck(message.pid || 0))
                    }, 0)
                }
                break
            case MQTTControlPacketType.PingResp:
                this.trace("ping resp")
                break
            case MQTTControlPacketType.PubAck:
                this.trace("pub ack")
                break
            case MQTTControlPacketType.SubAck:
                this.trace("sub ack")
                break
            default:
                this.onerror.emit(
                    new Error(`unexpected packet type: ${controlPacketType}.`)
                )
                break
        }

        if (data.length > payloadEnd)
            await this.handleMessage(data.slice(payloadEnd))
    }

    private async send1(msg: Buffer) {
        if (await this.canSend()) {
            await this.send(msg)
            this.doneSending()
        }
    }

    private async ping() {
        await this.send1(createPingReq())
        //this.emit("debug", "Sent: Ping request.")
    }
}
