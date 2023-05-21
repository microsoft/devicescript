import * as ds from "@devicescript/core"

export interface SPIConfig {
    miso?: ds.InputPin
    mosi?: ds.OutputPin
    sck?: ds.OutputPin
    mode?: number
    hz?: number
}

type DsSpi = typeof ds & {
    spiConfigure(
        miso: number,
        mosi: number,
        sck: number,
        mode: number,
        hz: number
    ): void
    spiXfer(tx: Buffer, rx: Buffer): Promise<void>
}

function pinNum(p: ds.Pin) {
    return p ? p.gpio : -1
}

export function spiConfigure(cfg: SPIConfig) {
    ;(ds as DsSpi).spiConfigure(
        pinNum(cfg.miso),
        pinNum(cfg.mosi),
        pinNum(cfg.sck),
        cfg.mode || 0,
        cfg.hz || 1000000
    )
}

export async function spiWrite(buf: Buffer) {
    await (ds as DsSpi).spiXfer(buf, null)
}

export async function spiRead(numbytes: number) {
    const r = Buffer.alloc(numbytes)
    await (ds as DsSpi).spiXfer(null, r)
    return r
}

export async function spiXfer(buf: Buffer) {
    const r = Buffer.alloc(buf.length)
    await (ds as DsSpi).spiXfer(buf, r)
    return r
}
