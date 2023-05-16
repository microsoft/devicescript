import * as ds from "@devicescript/core"

ds.Button.prototype.pressed = function pressed() {
    let reg: ds.ClientRegister<boolean> = (this as any).__pressed
    if (!reg) {
        reg = ds.clientRegister(false)
        ;(this as any).__pressed = reg
        this.down.subscribe(() => reg.emit(true))
        this.hold.subscribe(() => reg.emit(true))
        this.up.subscribe(() => reg.emit(false))
    }
    return reg
}
