import type { CompilationResult } from "@devicescript/compiler"
import type { BuildOptions } from "./build"

export interface SideMessage {
    type: string
    seq?: number
    data?: any
}

export interface SideErrorResponse extends SideMessage {
    type: "error"
    seq: number
    data: {
        message: string
        stack?: string
    }
}

export interface SideBuildRequest extends SideMessage {
    type: "build"
    seq: number
    data: BuildReqArgs
}

export interface SideBuildResponse extends SideMessage {
    type: "build"
    seq: number
    data: BuildStatus
}

export interface SideWatchEvent extends SideMessage {
    type: "watch"
    data: BuildStatus
}

export type BuildStatus = CompilationResult & { deployStatus: string }
export interface BuildReqArgs {
    filename: string
    buildOptions?: BuildOptions
    watch?: boolean
    deployTo?: string // deviceId
}
