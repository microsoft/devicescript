import { pins, board } from "@dsboard/adafruit_qt_py_c3"
import { startLightBulb } from "@devicescript/servers"

const lightBulb = startLightBulb({
    pin: pins.A0_D0,
})

setInterval(async () => {
  await lightBulb.toggle();
}, 500);
