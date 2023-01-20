// location is offset into concatenation of all SrcFile's plus length
// both are in 16-bit JS codepoints
export type SrcLocation = [number, number]
export interface SrcFile {
    path: string
    length: number // in 16-bit codepoints; useful if text is missing
    text?: string
}

export const srcMapEntrySize = 3

// format is (Dpos, len, Dpc) repeated
// [pos, len] is SrcLocation
// pc is byte offset in the image
// pc is Dpc + previous pc
// pos is Dpos + previous pos
export type SrcMap = number[]

export interface FunctionDebugInfo {
    name: string
    size: number
    // where the function is defined; some functions are synthetic and miss location
    location?: SrcLocation
    // where the function is called from; may include `location` eg. for inline handlers
    users: SrcLocation[]
    slots: VarDebugInfo[]
}

export type DebugVarType = "loc" | "glb" | "arg" | "tmp"

export interface VarDebugInfo {
    name: string
    type: string
}

export interface RoleDebugInfo {
    name: string
    serviceClass: number
}

export interface DebugInfo {
    sizes: Record<string, number> & {
        header: number
        floats: number
        strings: number
        roles: number
        align: number
    }
    functions: FunctionDebugInfo[]
    roles: RoleDebugInfo[]
    globals: VarDebugInfo[]
    tables: {
        ascii: string[]
        utf8: string[]
        buffer: string[] // hex-encoded
    }
    srcmap: SrcMap
    sources: SrcFile[]

    _resolverCache?: any
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
        tables: {
            ascii: [],
            utf8: [],
            buffer: [],
        },
        functions: [],
        globals: [],
        roles: [],
        srcmap: [],
        sources: [],
    }
}
