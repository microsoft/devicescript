import * as ds from "@devicescript/core"

ds.MagneticFieldLevel.prototype.detected = function () {
    let reg: ds.ClientRegister<boolean> = (this as any).__detected
    if (!reg) {
        reg = ds.clientRegister(false)
        ;(this as any).__detected = reg
        this.active.subscribe(() => reg.emit(true))
        this.inactive.subscribe(() => reg.emit(false))
    }
    return reg
}
