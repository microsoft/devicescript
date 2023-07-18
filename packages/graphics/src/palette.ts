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

    packed(): [number, number, number, number][] {
        const res: [number, number, number, number][] = []
        for (let i = 0; i < this.numColors; ++i) {
            const c: [number, number, number, number] = [
                this.buffer[i * 3],
                this.buffer[i * 3 + 1],
                this.buffer[i * 3 + 2],
                0,
            ]
            res.push(c)
        }
        return res
    }
}
