import { gpio } from "@devicescript/core"
import { startButton } from "@devicescript/servers"

const gpbtn = startButton({
    pin: gpio(2),
})

gpbtn.down.subscribe(() => {
    console.log("down!")
})
