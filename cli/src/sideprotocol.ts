import type {
    CompilationResult,
    ResolvedBuildConfig,
} from "@devicescript/compiler"
import { ConnectionState } from "jacdac-ts"
import type { AddBoardOptions } from "./addboard"
import type { BuildOptions } from "./build"
import type { AddServiceOptions, AddSimOptions } from "./init"

export interface SideReq<T extends string = string> {
    req: T
    seq?: number
    data: any
}

export interface SideResp<T extends string = string> {
    resp: T
    seq?: number
    data: any
}

export interface SideEvent<T extends string = string> {
    ev: T
    data: any
}

export interface SideErrorResp extends SideResp<"error"> {
    data: {
        message: string
        stack?: string
    }
}

// enable/disable reception of {bcast:true} packets
export interface SideBcastReq extends SideReq<"bcast"> {
    data: { enabled: boolean }
}

export interface SideBuildReq extends SideReq<"build"> {
    data: BuildReqArgs
}
export interface SideBuildResp extends SideResp<"build"> {
    data: BuildStatus
}
export interface SideKillReq extends SideReq<"kill"> {}
export interface SideKillResp extends SideResp<"kill"> {
    data: void
}
export interface SideWatchReq extends SideReq<"watch"> {
    data: BuildReqArgs
}
export interface SideWatchResp extends SideResp<"watch"> {
    // no real response
    data: void
}
// but will get events every now and then
export interface SideWatchEvent extends SideEvent<"watch"> {
    data: BuildStatus
}

export interface SideConnectReq extends SideReq<"connect"> {
    data: ConnectReqArgs
}

export interface SideSpecsReq extends SideReq<"specs"> {
    data: {
        dir?: string // if dir===undefined, only global specs will be returned
    }
}
export interface VersionInfo {
    version: string
    runtimeVersion: string
    nodeVersion: string
}
export interface SideSpecsData {
    buildConfig: ResolvedBuildConfig
    versions: VersionInfo
}
export interface SideSpecsResp extends SideResp<"specs"> {
    data: SideSpecsData
}
export interface SideStartVmReq extends SideReq<"startVM"> {
    data: VmReqArgs
}
export interface SideStartVmResp extends SideResp<"startVM"> {
    data: {}
}

export interface SideStopVmReq extends SideReq<"stopVM"> {
    data: {}
}
export interface SideStopVmResp extends SideResp<"stopVM"> {
    data: void
}

export interface AddResponse {
    files: string[]
}

export interface SideAddServiceReq extends SideReq<"addService"> {
    data: AddServiceOptions
}
export interface SideAddServiceResp extends SideResp<"addService"> {
    data: AddResponse
}
export interface SideAddSimReq extends SideReq<"addSim"> {
    data: AddSimOptions
}
export interface SideAddSimResp extends SideResp<"addSim"> {
    data: AddResponse
}

export interface SideAddBoardReq extends SideReq<"addBoard"> {
    data: AddBoardOptions
}
export interface SideAddBoardResp extends SideResp<"addBoard"> {
    data: AddResponse
}


export interface SideTransportEvent extends SideEvent<"transport"> {
    data: TransportStatus
}

export interface TransportStatus {
    autoConnect?: boolean
    transports: {
        type: string
        connectionState: ConnectionState
        description?: string
    }[]
}

export interface SideTransportResp extends SideResp<"transport"> {
    data: TransportStatus
}

export type OutputFrom = "vm" | "vm-err" | "dev" | "verbose"
export interface SideOutputEvent extends SideEvent<"output"> {
    data: {
        from: OutputFrom
        lines: string[]
    }
}

export type BuildStatus = CompilationResult & { deployStatus: string }
export interface BuildReqArgs {
    filename: string
    buildOptions?: BuildOptions
    deployTo?: string // deviceId
}
export interface ConnectReqArgs {
    transport?: "serial" | "usb" | "spi" | "websocket" | string
    background?: boolean
    resourceGroupId?: string
}
export interface WebSocketConnectReqArgs extends ConnectReqArgs {
    transport: "websocket"
    url: string
    protocol: string
}

export interface VmReqArgs {
    nativePath?: string
    deviceId?: string
    gcStress?: boolean
}
