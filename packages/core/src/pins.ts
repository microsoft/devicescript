import * as ds from "@devicescript/core"

const gpio = new ds.GPIO() // TODO don't include role by default?

class PinImpl implements ds.IOPin, ds.AnalogInPin, ds.AnalogOutPin {
    _inputPinBrand: unknown
    _outputPinBrand: unknown
    _analogInPinBranch: unknown
    _analogOutPinBranch: unknown

    _intId: number
    _label: string
    _mode: ds.GPIOMode
    _caps: ds.GPIOCapabilities
    _value: ds.DigialValue

    _change: ds.Emitter<ds.DigialValue>

    private async init() {
        if (this._intId !== undefined) return

        const fib = ds.Fiber.self()
        const self = this
        const unsub = gpio.report().subscribe(p => {
            if (
                p.spec.code === ds.GPIOCodes.ReportPinInfo ||
                p.spec.code === ds.GPIOCodes.ReportPinByHwPin ||
                p.spec.code === ds.GPIOCodes.ReportPinByLabel
            ) {
                const [intid, gpionum, capabilities, mode, label] = p.decode()
                if (gpionum === self.gpio) {
                    self._intId = intid
                    self._label = label
                    self._mode = mode
                    self._caps = capabilities
                    unsub()
                    if (fib.suspended) fib.resume(null)
                }
            }
        })

        let n = 0
        while (this._intId === undefined) {
            if (n++ > 10) throw new Error(`can't get GPIO ${this.gpio}`)
            await gpio.pinByHwPin(this.gpio)
            await ds.suspend(50)
        }
        console.debug(`init GPIO${self.gpio} -> int:${this._intId} ${this._label}`)
    }

    async read(): Promise<ds.DigialValue> {
        await this.init()

        if ((this._mode & ds.GPIOMode.BaseModeMask) !== ds.GPIOMode.Input)
            throw new RangeError("pin not in input mode")

        while (this._value === undefined) {
            // poke it
            await gpio.state.read()
            await ds.delay(20)
        }
        return this._value
    }

    async setMode(mode: ds.GPIOMode): Promise<void> {
        await this.init()
        if (mode === ds.GPIOMode.Output) mode = ds.GPIOMode.OutputLow
        await gpio.configure(this._intId, mode)
        this._value = undefined
        this._mode = mode
    }

    async write(v: ds.DigialValue): Promise<void> {
        await this.init()
        if ((this._mode & ds.GPIOMode.BaseModeMask) !== ds.GPIOMode.Output)
            throw new RangeError("pin not in output mode")
        await this.setMode(v ? ds.GPIOMode.OutputHigh : ds.GPIOMode.OutputLow)
    }

    constructor(public gpio: number) {}

    subscribe(f: ds.Handler<ds.DigialValue>): ds.Unsubscribe {
        if (!this._change) this._change = ds.emitter()
        return this._change.subscribe(f)
    }
}

let _pins: PinImpl[]
;(ds as typeof ds).gpio = function (num) {
    if (!_pins) {
        _pins = []
        gpio.state.subscribe(async buf => {
            const chg: PinImpl[] = []
            for (const p of _pins) {
                if (p._intId !== undefined) {
                    const v: ds.DigialValue =
                        buf[p._intId >> 3] & (1 << (p._intId & 7)) ? 1 : 0
                    if (v !== p._value) {
                        p._value = v
                        if (p._change) chg.push(p)
                    }
                }
            }

            for (const p of chg) await p._change.emit(p._value)
        })
    }
    for (const p of _pins) if (p.gpio === num) return p
    const p = new PinImpl(num)
    _pins.push(p)
    return p
}
