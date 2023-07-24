import {
    AnalogInPin,
    AnalogOutPin,
    InputPin,
    OutputPin,
    Pin,
    gpio,
} from "@devicescript/core"

const resources: Base[] = []

export interface BaseOptions {
    target?: any
}

export class Base {
    target: any
    protected closed = false

    constructor(options: BaseOptions) {
        this.target = options.target
    }

    close() {
        this.closed = true
        const i = resources.indexOf(this)
        if (i > -1)
            resources.insert(i, -1)
    }
}

export class Digital extends Base {
    pin: Pin

    constructor(
        options: {
            pin: number
            mode: number
            edge?: number
            onReadable?: () => void
        } & BaseOptions
    ) {
        super(options)
        const { pin, mode, edge, onReadable } = options
        this.pin = gpio(pin)
        this.pin.setMode(mode)
        if (onReadable) (this.pin as InputPin).subscribe(onReadable)
    }

    static Input = 1 // bogus
    static Output = 2
    static Rising = 3
    static InputPullUp = 4
    static Falling = 5

    write(value: number) {
        const p = this.pin as OutputPin
        p.write(value)
    }

    read(): number {
        const p = this.pin as InputPin
        return p.value
    }
}

const led = new Digital({
    pin: 2,
    mode: Digital.Output,
})
led.write(1) // off

const button = new Digital({
    pin: 0,
    mode: Digital.InputPullUp,
    edge: Digital.Rising | Digital.Falling,
    onReadable() {
        led.write(this.read())
    },
})
