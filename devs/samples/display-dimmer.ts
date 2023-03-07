import * as ds from "@devicescript/core"

const pot = new ds.Potentiometer()
const ledD = new ds.Led()
const btn = new ds.Button()
let p

pot.position.subscribe(async (p) => {
    console.log("tick", p)
    await ledD.brightness.write(p * 0.3)
})

declare module "@devicescript/core" {
    interface Led {
        setAllColors(r: number, g: number, b: number): Promise<void>
    }
}

ds.Led.prototype.setAllColors = async function (r, g, b) {
    await this.setAll(r, g, b)
}

ledD.onConnected(async () => {
    await ledD.setAllColors(0.9, 1, 0)
})

btn.down.subscribe(async () => {
    await ledD.setAll(1, 0, 1)
})

btn.up.subscribe(async () => {
    await ledD.setAll(0, 0, 1)
})
