import * as ds from "@devicescript/core"

declare function hex(lits: any, ...args: any[]): ds.Buffer

declare interface Math {
    /**
     * Returns the result of signed 32-bit integer division of two numbers.
     */
    idiv(x: number, y: number): number
}
