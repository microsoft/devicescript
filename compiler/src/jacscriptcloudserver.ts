/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CHANGE,
    Packet,
    JDRegisterServer,
    JDServiceServer,
    JDServerOptions,
    SRV_JACSCRIPT_CLOUD,
    JacscriptCloudReg,
    JacscriptCloudCmd,
    CONNECT,
    DISCONNECT,
    JacscriptCloudEvent,
    jdpack,
} from "jacdac-ts"
import {
    AzureIoTHubConnector,
    Json,
    MethodInvocation,
    TwinJson,
} from "./azureiothubconnector"

function lookupJsonPath(j: Json, path: string) {
    for (const w of path.split(".")) {
        j = j[w]
        if (j == null) return j
    }
    return j
}

export class JacscriptCloudServer extends JDServiceServer {
    readonly connected: JDRegisterServer<[boolean]>

    private currTwin: TwinJson
    private twinGetsWaiting: string[] = []

    constructor(
        public connector: AzureIoTHubConnector,
        options?: JDServerOptions
    ) {
        super(SRV_JACSCRIPT_CLOUD, options)

        this.connected = this.addRegister(JacscriptCloudReg.Connected, [false])
        this.connected.on(CHANGE, () => {
            // this.sendEvent(AzureIotHubHealthEvent.ConnectionStatusChange)
        })

        this.connector.on(CONNECT, () => this.connected.setValues([true]))
        this.connector.on(DISCONNECT, () => this.connected.setValues([false]))
        this.connector.on("method", this.onMethod.bind(this))
        this.connector.on("twinUpdate", this.onTwinUpdate.bind(this))

        this.addCommand(JacscriptCloudCmd.Upload, this.handleUpload.bind(this))
        this.addCommand(
            JacscriptCloudCmd.AckCloudCommand,
            this.handleAckCloudCommand.bind(this)
        )
        this.addCommand(
            JacscriptCloudCmd.GetTwin,
            this.handleGetTwin.bind(this)
        )
    }

    private async onMethod(info: MethodInvocation) {
        console.log("invoke", info)
        const args: number[] = Array.isArray(info.payload)
            ? info.payload
            : info.payload?.args || []
        const payload = jdpack<[number, string, number[]]>("u32 z f64[]", [
            info.seqNo,
            info.method,
            args,
        ])
        await this.sendEvent(JacscriptCloudEvent.CloudCommand, payload)
    }

    private async handleUpload(pkt: Packet) {
        const [label, values] = pkt.jdunpack<[string, number[]]>("z f64[]")
        console.log("upload", label, values)
        this.connector.upload(label, values)
    }

    private async handleAckCloudCommand(pkt: Packet) {
        const [seqNo, status, args] =
            pkt.jdunpack<[number, number, number[]]>("u32 u32 f64[]")
        console.log("ack-invoke", seqNo, status, args)
        this.connector.finishMethod(seqNo, { args }, status)
    }

    private async sendGetResp(path: string) {
        let v = lookupJsonPath(this.currTwin.desired, path)
        if (typeof v != "number") v = NaN
        const pkt = Packet.jdpacked(JacscriptCloudCmd.GetTwin, "z f64", [
            path,
            v,
        ])
        await this.sendPacketAsync(pkt)
    }

    private async sendTwinEvent(updated: Json, path: string) {
        let v = lookupJsonPath(updated, path)
        if (v === null) v = NaN
        if (typeof v == "number")
            await this.sendEvent(
                JacscriptCloudEvent.TwinChange,
                jdpack("z f64", [path, v])
            )
    }

    private async onTwinUpdate(currTwin: TwinJson, updated: Json) {
        console.log("twin-update", updated, currTwin)
        this.currTwin = currTwin
        await this.sendEvent(JacscriptCloudEvent.TwinChange)
        if (this.twinGetsWaiting.length) {
            const waiting = this.twinGetsWaiting
            this.twinGetsWaiting = []
            const desired = currTwin.desired
            for (const path of this.twinGetsWaiting) {
                await this.sendGetResp(path)
            }
        }
    }

    private async handleGetTwin(pkt: Packet) {
        const path: string = pkt.jdunpack("s")[0]
        if (this.currTwin) {
            await this.sendGetResp(path)
        } else {
            this.twinGetsWaiting.push(path)
        }
    }
}
