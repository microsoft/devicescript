export class Palette {
    readonly buffer: Buffer
    numColors = 16

    static arcade() {
        return new Palette(hex`
            000000 ffffff ff2121 ff93c4 ff8135 fff609 249ca3 78dc52 
            003fad 87f2ff 8e2ec4 a4839f 5c406c e5cdc4 91463d 000000
        `)
    }

    constructor(init?: Buffer) {
        this.buffer = Buffer.alloc(this.numColors * 3)
        if (init) this.buffer.set(init)
    }

    color(idx: number) {
        if (idx < 0 || idx >= this.numColors) return 0
        return (
            (this.buffer[3 * idx + 0] << 16) |
            (this.buffer[3 * idx + 1] << 8) |
            (this.buffer[3 * idx + 2] << 0)
        )
    }

    setColor(idx: number, color: number) {
        this.buffer[3 * idx + 0] = color >> 16
        this.buffer[3 * idx + 1] = color >> 8
        this.buffer[3 * idx + 2] = color >> 0
    }
}
