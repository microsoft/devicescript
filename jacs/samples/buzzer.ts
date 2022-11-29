const btn = roles.button()
const buzzer = roles.buzzer()


btn.down.subscribe(() => {
    buzzer.playNote(440, 0.1, 200)
})
