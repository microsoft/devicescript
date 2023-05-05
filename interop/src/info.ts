// location is offset into concatenation of all SrcFile's plus length

import { LocalBuildConfig } from "./archconfig"

// both are in 16-bit JS codepoints
export type SrcLocation = [number, number]
export interface SrcFile {
    path: string
    length: number // in 16-bit codepoints; useful if text is missing
    text?: string
    index?: number
}

export const srcMapEntrySize = 3

// format is (Dpos, len, Dpc) repeated
// [pos, len] is SrcLocation
// pc is byte offset in the image
// pc is Dpc + previous pc
// pos is Dpos + previous pos
export type SrcMap = number[]

export type ConstValue = number | boolean | string | null | { special: string }

export interface FunctionDebugInfo {
    name: string
    startpc: number
    size: number
    // where the function is defined; some functions are synthetic and miss location
    location?: SrcLocation
    // where the function is called from; may include `location` eg. for inline handlers
    users: SrcLocation[]
    slots: VarDebugInfo[]
    constVars: Record<string, ConstValue>
}

export type DebugVarType = "loc" | "glb" | "arg" | "tmp"

export interface VarDebugInfo {
    name: string
    type: string
}

export interface SpecDebugInfo {
    name: string
    classIdentifier: number
}

export interface DebugInfo {
    sizes: Record<string, number> & {
        header: number
        floats: number
        strings: number
        roles: number
        align: number
    }
    localConfig: LocalBuildConfig
    functions: FunctionDebugInfo[]
    specs: SpecDebugInfo[]
    globals: VarDebugInfo[]
    srcmap: SrcMap
    sources: SrcFile[]
    binarySHA256?: string // hex-encoded
    binary: { hex: string }

    _resolverCache?: any
}

export interface VersionInfo {
    devsVersion: string
    runtimeVersion: string
    nodeVersion: string
}

export function emptyDebugInfo(): DebugInfo {
    return {
        sizes: {
            header: 0,
            floats: 0,
            strings: 0,
            roles: 0,
            align: 0,
        },
        localConfig: {
            hwInfo: {},
        },
        functions: [],
        globals: [],
        specs: [],
        srcmap: [],
        sources: [],
        binary: { hex: "" },
    }
}

export interface ServerInfo {
    label: string
    startName: string
    detail: string
    classIdentifiers?: number[]
    imports: Record<string, string>
    snippet: string
}

export interface ServerInfoFile {
    servers: ServerInfo[]
}
