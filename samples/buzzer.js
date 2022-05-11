var btn = roles.button()
var buzzer = roles.buzzer()


btn.down.subscribe(() => {
    buzzer.playNote(440, 0.1, 200)
})
