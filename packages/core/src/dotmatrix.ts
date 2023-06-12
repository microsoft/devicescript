import * as ds from "@devicescript/core"
declare module "@devicescript/core" {
    interface DotMatrix {
        /**
         * Sets a dot entry to a particular value
         */
        setDot(x: number, y: number, on: boolean | DigitalValue): Promise<void>
    }
}

ds.DotMatrix.prototype.setDot = async function (
    x: number,
    y: number,
    on: boolean | ds.DigitalValue
) {
    const data = await this.dots.read()
    const columns = await this.columns.read()
    const rows = await this.rows.read()
    const row = y | 0
    const col = x | 0

    if (
        !data ||
        isNaN(columns) ||
        isNaN(rows) ||
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= columns
    )
        return

    const columnspadded = columns + (8 - (columns % 8))
    const bitindex = row * columnspadded + col
    data.setBit(bitindex, !on)

    await this.dots.write(data)
}
