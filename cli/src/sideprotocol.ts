import type { CompilationResult } from "@devicescript/compiler"
import type { BuildOptions } from "./build"

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
    data: {}
}
export interface SideSpecsResp extends SideResp<"specs"> {
    data: {
        specs: jdspec.ServiceSpec[]
        version: string
    }
}

export type BuildStatus = CompilationResult & { deployStatus: string }
export interface BuildReqArgs {
    filename: string
    buildOptions?: BuildOptions
    deployTo?: string // deviceId
}
export interface ConnectReqArgs {
    transport?: "serial" | string
    background?: boolean
}
