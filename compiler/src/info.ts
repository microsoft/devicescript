export interface SrcLocation {
    file: string
    line: number
    col: number
    len: number
    pos: number
}

export interface FunctionDebugInfo {
    name: string
    size: number
    // where the function is defined; some functions are synthetic and miss location
    location?: SrcLocation
    // where the function is called from; may include `location` eg. for inline handlers
    users: SrcLocation[]
    // format is (line-number, start, len)
    // start is offset in bytes from the start of the function
    // len is in bytes
    srcmap: number[]
    locals: CellDebugInfo[]
}

export interface CellDebugInfo {
    name: string
}

export interface RoleDebugInfo extends CellDebugInfo {
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
    globals: CellDebugInfo[]
    source: string
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
        functions: [],
        globals: [],
        roles: [],
        source: "",
    }
}
