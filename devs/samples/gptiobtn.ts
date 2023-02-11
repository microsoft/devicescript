import { startButton } from "@devicescript/servers"

const gpbtn = startButton({
    pin: 2,
})

gpbtn.down.subscribe(() => {
    console.log("down!")
})
