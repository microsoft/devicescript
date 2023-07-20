export class Palette {
    readonly buffer: Buffer
    readonly numColors: number

    static arcade() {
        return new Palette(hex`
            000000 ffffff ff2121 ff93c4 ff8135 fff609 249ca3 78dc52 
            003fad 87f2ff 8e2ec4 a4839f 5c406c e5cdc4 91463d 000000
        `)
    }

    static monochrome() {
        return new Palette(hex`000000 ffffff`)
    }

    constructor(init: Buffer) {
        this.buffer = init.slice(0)
        this.buffer.set(init)
        this.numColors = (this.buffer.length / 3) >> 0
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

    // r,g,b,padding
    packed(): Buffer {
        const res: Buffer = Buffer.alloc(this.numColors << 2)
        for (let i = 0; i < this.numColors; ++i) {
            res[i * 4] = this.buffer[i * 3]
            res[i * 4 + 1] = this.buffer[i * 3 + 1]
            res[i * 4 + 2] = this.buffer[i * 3 + 2]
        }
        return res
    }

    // r,g,b,padding
    unpack(buffer: Buffer) {
        if (buffer.length >> 2 !== this.numColors)
            throw new RangeError("incorrect number of colors")
        for (let i = 0; i < this.numColors; ++i) {
            this.buffer[i * 3] = buffer[i * 4]
            this.buffer[i * 3 + 1] = buffer[i * 4 + 1]
            this.buffer[i * 3 + 2] = buffer[i * 4 + 2]
        }
    }
}
