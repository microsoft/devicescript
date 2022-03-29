import {
    AzureIotHubHealthConnectionStatus,
    AzureIoTHubHealthServer,
    CHANGE,
    CONNECT,
    DISCONNECT,
    fromBase64,
    fromUTF8,
    JDEventSource,
    sha256Hmac,
    stringToUint8Array,
    toBase64,
} from "jacdac-ts"
import MQTT from "paho-mqtt"

async function generateSasToken(
    resourceUri: string,
    signingKey: string,
    expiresEpoch: number
) {
    const key = fromBase64(signingKey)
    resourceUri = encodeURIComponent(resourceUri)
    const toSign = resourceUri + "\n" + expiresEpoch
    const sigBytes = await sha256Hmac(key, stringToUint8Array(fromUTF8(toSign)))
    const sig = encodeURIComponent(toBase64(sigBytes))
    const token = `sr=${resourceUri}&se=${expiresEpoch}&sig=${sig}`
    return token
}

const methodPrefix = "$iothub/methods/POST/"
const twinUpdatePrefix = "$iothub/twin/PATCH/properties/desired/"
const twinMethodPrefix = "$iothub/twin/res/"

function parseTopicArgs(topic: string) {
    const qidx = topic.indexOf("?")
    if (qidx >= 0) return parsePropertyBag(topic.slice(qidx + 1))
    return {}
}

function splitPair(kv: string): string[] {
    const i = kv.indexOf("=")
    if (i < 0) return [kv, ""]
    else return [kv.slice(0, i), kv.slice(i + 1)]
}

function parsePropertyBag(
    msg: string,
    separator?: string
): Record<string, string> {
    const r: Record<string, string> = {}
    if (msg && typeof msg === "string")
        msg.split(separator || "&")
            .map(kv => splitPair(kv))
            .filter(parts => !!parts[1].length)
            .forEach(
                parts =>
                    (r[decodeURIComponent(parts[0])] = decodeURIComponent(
                        parts[1]
                    ))
            )
    return r
}

export interface MethodInvocation {
    method: string
    seqNo: number
    payload: any
}

export type Json = any
export type TwinJson = {
    desired: Json
    reported: Json
}

export function applyTwinPatch(trg: Json, patch: Json) {
    for (const k of Object.keys(patch)) {
        const v = patch[k]
        if (v === null) {
            delete trg[k]
        } else if (typeof v == "object") {
            if (!trg[k]) trg[k] = {}
            applyTwinPatch(trg[k], v)
        } else {
            trg[k] = v
        }
    }
}
export class AzureIoTHubConnector extends JDEventSource {
    private client: MQTT.Client
    private clientId: string
    private disabled = false
    private toSend: MQTT.Message[] = []
    private currTwin: TwinJson
    private lastTwinVersion: number
    private twinRespHandlers: Record<
        string,
        (status: number, body: any) => void
    > = {}

    constructor(private healthServer: AzureIoTHubHealthServer) {
        super()
        this.healthServer.isReal = true
        this.healthServer.on(CONNECT, () => this.connect())
        this.healthServer.on(DISCONNECT, () => this.disconnect())
        this.healthServer.on(CHANGE, () => {
            this.disconnect()
            this.connect()
        })

        setInterval(() => {
            if (!this.disabled && !this.client) this.connect()
        }, 1000)
    }

    public upload(label: string, values: number[]) {
        this.publish(
            `devices/${this.clientId}/messages/events/`,
            JSON.stringify({
                device: this.healthServer.device.deviceId,
                label,
                values,
            })
        )
    }

    private emitDisconnect() {
        this.emit(DISCONNECT)
        this.healthServer.setConnectionStatus(
            AzureIotHubHealthConnectionStatus.Disconnected
        )
    }

    private disconnect() {
        this.disabled = true
        const c = this.client
        this.client = null
        if (c) {
            try {
                c.disconnect()
            } catch {}
            this.emitDisconnect()
        }
    }

    private log(msg: string) {
        console.log(`AzureIoT: ${msg}`)
    }

    private handleMqttMsg(msg: MQTT.Message) {
        this.log(
            "onMessageArrived: " +
                msg.destinationName +
                " -> " +
                msg.payloadString
        )

        if (msg.destinationName.startsWith(methodPrefix)) {
            const props = parseTopicArgs(msg.destinationName)
            const qidx = msg.destinationName.indexOf("/?")
            const methodName = msg.destinationName.slice(
                methodPrefix.length,
                qidx
            )
            this.log("method: '" + methodName + "'; " + JSON.stringify(props))
            const rid = parseInt(props["$rid"])
            let payload: any = {}
            try {
                payload = JSON.parse(msg.payloadString)
            } catch {}

            const info: MethodInvocation = {
                method: methodName,
                seqNo: rid,
                payload,
            }
            this.emit("method", info)
        } else if (msg.destinationName.startsWith(twinUpdatePrefix)) {
            if (!this.currTwin) return
            const sysProps = parseTopicArgs(msg.destinationName)
            const ver = parseInt(sysProps["$version"])
            if (ver <= this.lastTwinVersion) {
                this.log(`skipping twin update: ${ver}`)
                return
            }
            const update = JSON.parse(msg.payloadString)
            applyTwinPatch(this.currTwin["desired"], update)
            this.onTwinUpdate(this.currTwin, update)
        } else if (msg.destinationName.startsWith(twinMethodPrefix)) {
            // $iothub/twin/res/{status}/?$rid={request id}
            const status = parseInt(
                msg.destinationName.slice(twinMethodPrefix.length)
            )
            const args = parseTopicArgs(msg.destinationName)
            const rid = args["$rid"]
            const h = this.twinRespHandlers[rid]
            if (h) {
                delete this.twinRespHandlers[rid]
                h(status, JSON.parse(msg.payloadString || "{}"))
            }
        }
    }

    private onTwinUpdate(currTwin: TwinJson, updated: Json) {
        this.emit("twinUpdate", currTwin, updated)
    }

    private publish(topic: string, payload: string | ArrayBuffer) {
        console.log("pub", topic)
        const msg = new MQTT.Message(payload || "")
        msg.destinationName = topic
        msg.qos = 0
        msg.retained = false
        if (this.client) this.client.send(msg)
        else this.toSend.push(msg)
    }

    finishMethod(seqNo: number, payload: any, status = 200) {
        this.publish(
            `$iothub/methods/res/${status}/?$rid=${seqNo}`,
            JSON.stringify(payload)
        )
    }

    private twinReq(path: string, msg?: string): Promise<Json> {
        const rid = Math.round(Math.random() * 800000000) + 100000000
        return new Promise((resolve, reject) => {
            this.twinRespHandlers[rid] = (status, body) => {
                if (status == 204 || status == 200) {
                    resolve(body)
                } else {
                    const msg = `twin error -> ${status} ${JSON.stringify(
                        body
                    )}`
                    this.log(msg)
                    reject(new Error(msg))
                }
            }
            this.publish(`$iothub/twin/${path}/?$rid=${rid}`, msg)
        })
    }

    patchTwin(patch: Json) {
        const p = JSON.stringify(patch)
        if (p == "{}") {
            this.log("skipping empty twin patch")
            return Promise.resolve()
        } else {
            this.log(`twin patch: ${JSON.stringify(patch)}`)
            return this.twinReq("PATCH/properties/reported", p)
        }
    }

    private connected() {
        this.log(`connected`)
        this.emit(CONNECT)
        this.healthServer.setConnectionStatus(
            AzureIotHubHealthConnectionStatus.Connected
        )

        this.client.subscribe(methodPrefix + "#")
        this.client.subscribe(twinMethodPrefix + "#")
        this.client.subscribe(twinUpdatePrefix + "#")

        this.twinReq("GET").then(
            (currTwin: TwinJson) => {
                this.currTwin = currTwin
                this.lastTwinVersion = currTwin.desired["$version"]
                this.onTwinUpdate(currTwin, currTwin.desired)
            },
            e => {
                // TODO ???
            }
        )

        const mm = this.toSend
        if (mm.length) {
            this.toSend = []
            for (const m of mm) this.client.send(m)
        }
    }

    private async connect() {
        if (this.client) return
        this.disabled = false

        const connStr = this.healthServer.parsedConnectionString()

        const iotHubHostName = connStr["HostName"]
        const deviceId = connStr["DeviceId"]

        if (!deviceId || !iotHubHostName) return

        this.clientId = deviceId
        this.healthServer.setConnectionStatus(
            AzureIotHubHealthConnectionStatus.Connecting
        )

        const url = `wss://${iotHubHostName}/$iothub/websocket?iothub-no-client-cert=true`
        this.log(`connecting to ${url}`)

        const client = new MQTT.Client(url, deviceId)
        this.client = client

        let sasToken = connStr["SharedAccessSignature"]

        if (!sasToken)
            // token valid until year 2255; in future we may try something more short-lived
            sasToken = await generateSasToken(
                `${iotHubHostName}/devices/${deviceId}`,
                connStr["SharedAccessKey"],
                9000000000
            )

        const disconnected = () => {
            if (this.client == client) {
                this.emitDisconnect()
                this.client = null
            }
        }

        client.onConnectionLost = info => {
            if (info.errorCode != 0) this.log("MQTT lost: " + info.errorMessage)
            disconnected()
        }
        client.onMessageArrived = this.handleMqttMsg.bind(this)

        client.connect({
            // reconnect: true, - TODO need some policy here
            userName: `${iotHubHostName}/${deviceId}/?api-version=2018-06-30`,
            password: "SharedAccessSignature " + sasToken,
            mqttVersion: 4,
            onSuccess: () => {
                if (client == this.client) this.connected()
            },
            onFailure: info => {
                this.log(`MQTT error: ${info.errorMessage}`)
                disconnected()
            },
        })
    }
}
