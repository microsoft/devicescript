/**
 * Print out message. Moooo.
 */
export function cowsay(message = "Mooooo") {
    while (message.length < 20) message += " "
    let len = message.length + 2
    let top = ""
    let bot = ""
    let spc = ""
    for (let i = 0; i < len; ++i) {
        top += "_"
        bot += "-"
        spc += " "
    }

    const r = ` ${top}
< ${message} >
 ${bot}
   \\   ^__^
    \\  (oo)\\_______
       (__)\\       )\\/\\
           ||----w |
           ||     ||`
    console.log(r)
}
