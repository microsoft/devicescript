import * as ds from "@devicescript/core"

// extend interfaces
declare module "@devicescript/core" {
    export interface PinBase {
        /**
         * Configure pin mode.
         * @param mode desired mode
         */
        setMode(mode: GPIOMode): void

        mode: GPIOMode
    }

    export interface InputPin extends PinBase, Subscriber<DigitalValue> {
        /**
         * Value of the pin. `0 | 1` for digital pins, `0 ... 1` for analog.
         */
        value: DigitalValue | number
    }

    export interface OutputPin extends PinBase {
        write(v: DigitalValue | number | boolean): void
    }
}

/**
 * @devsNative GPIO.prototype
 */
declare var GPIOproto: ds.IOPin

GPIOproto.write = function (this: ds.OutputPin, v) {
    if ((this.mode & ds.GPIOMode.BaseModeMask) !== ds.GPIOMode.Output)
        throw new RangeError("pin not in output mode")
    this.setMode(v ? ds.GPIOMode.OutputHigh : ds.GPIOMode.OutputLow)
}

interface MyInputPin extends ds.InputPin {
    _change: ds.Emitter<ds.DigitalValue>
    _lastDigital: ds.DigitalValue
}

let changePins: MyInputPin[]
function changeHandler() {
    for (const p of changePins) {
        const v = p.value
        if ((v === 0 || v === 1) && v !== p._lastDigital) {
            p._lastDigital = v
            p._change.emit(v)
        }
    }
}

// TODO move this to C
GPIOproto.subscribe = function (this: MyInputPin, h) {
    if (!this._change) {
        this._change = ds.emitter()
        if (!changePins) {
            changePins = []
            setInterval(changeHandler, 100)
        }
        changePins.push(this)
    }
    return this._change.subscribe(h)
}
