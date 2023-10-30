import { pins } from "@dsboard/esp32c3_rust_devkit"
import * as servers from "@devicescript/servers"

const pot = servers.startPotentiometer({
    pin: pins.P0,
})
