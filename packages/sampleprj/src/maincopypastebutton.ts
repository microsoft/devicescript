import { pins, board } from "@dsboard/pico"
import {
    startButton,
    startHidKeyboard,
    startLightBulb,
} from "@devicescript/servers"
import {
    HidKeyboardAction,
    HidKeyboardModifiers,
    HidKeyboardSelector,
} from "@devicescript/core"

// the keyboard button mounted on GP14
const button = startButton({
    pin: pins.GP14,
})
// a status indicator led mounted on GP1
const led = startLightBulb({
    pin: pins.GP1,
})
// the HID keyboard driver that will send keystrokes
const keyboard = startHidKeyboard({})

// true: ctrl+c, false: ctrl+v
let copy = true
// use leftgui on mac or leftcontrol on windows
let modifier = HidKeyboardModifiers.LeftGUI

// copy and paste on button click
button.down.subscribe(async () => {
    // when copy is true, send ctrl+c
    const selector = copy ? HidKeyboardSelector.C : HidKeyboardSelector.V
    // when copy is true, turn on the led to represent a "full clipboard"
    const brightness = copy ? 1 : 0

    // a bit of logging
    console.log(copy ? "ctrl+c" : "ctrl+v")
    await keyboard.key(selector, modifier, HidKeyboardAction.Press)
    await led.intensity.write(brightness)
    // toggle for next round
    copy = !copy
})
