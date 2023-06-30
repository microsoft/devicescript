/**
 *
 * MQTT communication layer.
 * A port of https://github.com/rovale/micro-mqtt for MakeCode, ported to DeviceScript.
 */

import {
    AsyncVoid,
    delay,
    deviceIdentifier,
    emitter,
    wait,
} from "@devicescript/core"
import { Socket, SocketConnectOptions, connect } from "./sockets"
import {
    Observable,
    ObservableValue,
    register,
} from "@devicescript/observables"

/**
 * Connect flags
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349229
 */
const enum MQTTConnectFlags {
    UserName = 1 << 7,
    Password = 1 << 6,
    WillRetain = 1 << 5,
    WillQoS2 = 1 << 4,
    WillQoS1 = 1 << 3,
    Will = 1 << 2,
    CleanSession = 1 << 1,
}

/**
 * Connect Return code
 * http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349256
 */
const enum MQTTConnectReturnCode {
    Unknown = -1,
    Accepted = 0,
    UnacceptableProtocolVersion = 1,
    IdentifierRejected = 2,
    ServerUnavailable = 3,
    BadUserNameOrPassword = 4,
    NotAuthorized = 5,
}

/**
 * A message received by the MQTT client.
 */
export interface MQTTMessage {
    /**
     * The packet identifier of the message.
     */
    pid?: number
    /**
     * The topic the message was published to.
     */
    topic: string
    /**
     * The message payload.
     */
    content: Buffer
    /**
     * The QoS of the message.
     */
    qos: number
    /**
     * Whether the message was retained.
     */
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
    PingInterval = 40000,
    WatchDogInterval = 50000,
    DefaultQos = 0,
    Uninitialized = -123,
    FixedPackedId = 1,
    KeepAlive = 60,
}

/**
 * The options used to connect to the MQTT broker.
 */
export interface MQTTConnectOptions extends SocketConnectOptions {
    username?: string
    password?: string
    clientId?: string
    /**
     * Connection watchdog interval (ms). Default to 50s.
     */
    watchdogInterval?: number
    /**
     * Ping packet interval (ms). Default to 40s.
     */
    pingInterval?: number
    /**
     * Connection keep alive (seconds). Default to 60.
     */
    keepAlive?: number
    will?: MQTTConnectOptionsWill
}

export interface MQTTConnectOptionsWill {
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
function createConnectFlags(options: MQTTConnectOptions): number {
    const { username, password, will } = options
    let flags: number = 0
    flags |= username ? MQTTConnectFlags.UserName : 0
    flags |= username && password ? MQTTConnectFlags.Password : 0
    flags |= MQTTConnectFlags.CleanSession

    if (will) {
        flags |= MQTTConnectFlags.Will
        flags |= (will.qos || 0) << 3
        flags |= will.retain ? MQTTConnectFlags.WillRetain : 0
    }

    return flags
}

// Returns the MSB and LSB.
function getBytes(int16: number): number[] {
    if (int16 < 0 || int16 > 65535)
        throw new RangeError("bytes must be between 0 and 65535")
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
function createConnect(options: MQTTConnectOptions): Buffer {
    const byte1: number = MQTTControlPacketType.Connect << 4

    const protocolName = pack("MQTT")
    const nums = Buffer.alloc(4)
    nums[0] = 4 // protocol level
    nums[1] = createConnectFlags(options)
    nums[2] = 0
    nums[3] = options.keepAlive || Constants.KeepAlive

    let payload = pack(options.clientId || "")

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
        public readonly obs: ObservableValue<MQTTMessage>
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
    /**
     * The connection is in the process of closing
     */
    Closing = 3,
    /**
     * Connection closed
     */
    Closed = 4,
    /**
     * Sending packet
     */
    Sending = 5,
}

/**
 * A MQTT client
 * @devsWhenUsed
 * Ported from {@link https://github.com/rovale/micro-mqtt micro-mqtt}
 */
export class MQTTClient {
    private log(msg: string) {
        console.log(`mqtt: ${msg}`)
    }

    private trace(msg: string) {
        console.debug(`mqtt: ${msg}`)
    }

    public readonly opt: MQTTConnectOptions

    private socket?: Socket
    private watchdogId: any
    private pingId: any

    private buf: Buffer
    public readyState = MQTTState.Closed

    /**
     * Emitted when an error occurs.
     */
    public readonly onerror = emitter<Error>()
    /**
     * Emitted when the connection is established.
     */
    public readonly onconnect = emitter<unknown>()
    /**
     * Emitted when the connection is closed.
     */
    public readonly onclose = emitter<unknown>()
    /**
     * Emitted when a message is received and not handled by any subscription.
     */
    public readonly onunhandledmessage = emitter<MQTTMessage>()

    private mqttHandlers: MQTTHandler[] = []

    constructor(opt: MQTTConnectOptions) {
        opt.proto = opt.proto || "tls"
        if (!opt.port) opt.port = opt.proto === "tls" ? 8883 : 1883
        if (!opt.clientId) opt.clientId = `devs_${deviceIdentifier("self")}`
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
    private async close(): Promise<void> {
        if (this.readyState === MQTTState.Closed) return

        this.readyState = MQTTState.Closing
        this.log("disconnect")
        clearInterval(this.pingId)
        this.pingId = undefined
        const s = this.socket
        if (s) {
            this.socket = null
            await s.close()
        }
        this.readyState = MQTTState.Closed
    }

    /**
     * Starts the MQTT client and watchdog
     */
    public async start(): Promise<void> {
        if (this.running()) return
        const self = this
        // start watchdog
        clearInterval(this.watchdogId)
        this.watchdogId = setInterval(async () => {
            if (self.readyState !== MQTTState.Connected) {
                await self.close()
                self.onerror.emit(new Error("No connection. Retrying."))
                await self.connect()
            }
        }, this.opt.watchdogInterval || Constants.WatchDogInterval)
        await self.connect()
    }

    /**
     * Indicates if the MQTT client is started
     * and running.
     * @returns
     */
    public running() {
        return !!this.watchdogId
    }

    /**
     * Close connection and stop watchdog.
     */
    public async stop() {
        clearInterval(this.watchdogId)
        this.watchdogId = undefined
        await this.close()
    }

    /**
     * Attempts to connect to the MQTT broker
     * @returns
     */
    private async connect(): Promise<void> {
        if (this.readyState !== MQTTState.Closed) return

        const self = this
        this.readyState = MQTTState.Connecting
        this.log(`socket connecting to ${this.opt.host}:${this.opt.port}`)

        try {
            this.socket = await connect(this.opt)
            this.socket.onmessage.subscribe(async () => {
                const msg = await self.socket?.recv()
                self.trace(`recv ${msg.length}b ${msg.toString("hex")}`)
                await self.handleMessage(msg)
            })
            this.socket.onerror.subscribe(err => {
                self.log("error")
                self.onerror.emit(err)
            })
            this.socket.onclose.subscribe(() => {
                self.log("Close.")
                self.onclose.emit(undefined)
                self.readyState = MQTTState.Closed
                self.socket = null
            })
            self.log(`socket opened, connecting ${self.opt.clientId} to broker`)
            this.readyState = MQTTState.Open
            await self.send(createConnect(self.opt))
            await wait(this.onconnect, self.opt.timeout)
        } catch (e) {
            this.onerror.emit(e as Error)
            await this.close()
        }
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
     * Subscribe to a MQTT topic and returns an observable
     * @param topic
     * @param handler optional handler to attach
     * @param qos
     * @returns observable for topic messages
     */
    public async subscribe(
        topic: string,
        handler: (msg: MQTTMessage) => AsyncVoid = undefined,
        qos: number = Constants.DefaultQos
    ): Promise<Observable<MQTTMessage>> {
        this.log(`subscribe: ${topic}`)
        const sub = createSubscribe(topic, qos)
        if (topic[topic.length - 1] === "#")
            topic = topic.slice(0, topic.length - 1)
        const o = register<MQTTMessage>()
        if (handler) o.subscribe(handler)
        const h = new MQTTHandler(sub, topic, o)
        this.mqttHandlers.push(h)
        await this.send1(sub)
        return o
    }

    private async send(data: Buffer): Promise<void> {
        if (this.socket) {
            this.trace(`send ${data.length}b ${data.toString("hex")}`)
            await this.socket.send(data)
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
                    this.onconnect.emit(undefined)
                    clearInterval(this.pingId)
                    this.pingId = setInterval(
                        async () => await self.ping(),
                        self.opt.pingInterval || Constants.PingInterval
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
                            await h.obs.emit(message)
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
                if (!handled) this.onunhandledmessage.emit(message)
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
            return true
        }
        return false
    }

    private async ping() {
        await this.send1(createPingReq())
        //this.emit("debug", "Sent: Ping request.")
    }
}

/**
 * Opens a MQTT client connection
 * @param options connection options
 * @returns connected MQTT client
 */
export async function startMQTTClient(options: MQTTConnectOptions) {
    const mqtt = new MQTTClient(options)
    await mqtt.start()
    return mqtt
}
