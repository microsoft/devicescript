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
    functions: FunctionDebugInfo[]
    roles: RoleDebugInfo[]
    globals: CellDebugInfo[]
    source: string
}

export function emptyDebugInfo(): DebugInfo {
    return {
        functions: [],
        globals: [],
        roles: [],
        source: "",
    }
}
