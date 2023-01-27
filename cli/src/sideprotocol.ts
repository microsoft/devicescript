import type { CompilationResult } from "@devicescript/compiler"
import type { BuildOptions } from "./build"

export interface SideMessage<T extends string = string> {
    type: T
    seq?: number
    data?: any
}

export interface SideErrorResponse extends SideMessage<"error"> {
    data: {
        message: string
        stack?: string
    }
}

export interface SideBuildRequest extends SideMessage<"build"> {
    data: BuildReqArgs
}

export interface SideBuildResponse extends SideMessage<"build"> {
    data: BuildStatus
}

export interface SideWatchEvent extends SideMessage<"watch"> {
    data: BuildStatus
}

export type BuildStatus = CompilationResult & { deployStatus: string }
export interface BuildReqArgs {
    filename: string
    buildOptions?: BuildOptions
    watch?: boolean
    deployTo?: string // deviceId
}
