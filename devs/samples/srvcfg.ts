import { startButton } from "@devicescript/srvcfg"

const btn = startButton({
    pin: 2,
})

btn.down.subscribe(() => {
    console.log("down!")
})
