import { gpio } from "@devicescript/core"
import { startSwitch } from "@devicescript/servers"

const switch_ = startSwitch({
    pin: gpio(2),
})