import * as ds from "@devicescript/core"

/**
 * SPI configuration options
 */
export interface SPIConfig {
    /**
     * MISO pin
     */
    miso?: ds.InputPin
    /**
     * MOSI pin
     */
    mosi?: ds.OutputPin
    /**
     * SCK pin
     */
    sck?: ds.OutputPin
    mode?: number
    /**
     * Clock speed in Hz
     */
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

export class SPI {
    /**
     * Configure the SPI bus
     * @param cfg a set of configuration options
     */
    configure(cfg: SPIConfig) {
        ;(ds as DsSpi).spiConfigure(
            pinNum(cfg.miso),
            pinNum(cfg.mosi),
            pinNum(cfg.sck),
            cfg.mode || 0,
            cfg.hz || 1000000
        )
    }

    /**
     * Write a buffer to the SPI bus
     */
    async write(buf: Buffer) {
        await (ds as DsSpi).spiXfer(buf, null)
    }

    /**
     * Reads a buffer from the SPI bus
     */
    async read(numbytes: number) {
        const r = Buffer.alloc(numbytes)
        await (ds as DsSpi).spiXfer(null, r)
        return r
    }

    /**
     * Transfers a buffer to and from the SPI bus
     * @param buf buffer to send
     * @returns buffer received of the same size
     */
    async transfer(buf: Buffer) {
        const r = Buffer.alloc(buf.length)
        await (ds as DsSpi).spiXfer(buf, r)
        return r
    }
}

/**
 * The default SPI instance.
 */
export const spi = new SPI()
