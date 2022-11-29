const lightBulb1 = roles.lightBulb()
const button1 = roles.button()
button1.down.subscribe(() => {
    console.log("down")
    lightBulb1.brightness.write(1)
})
button1.up.subscribe(() => {
    console.log("up")
    lightBulb1.brightness.write(0)
})
every(5, () => {
    console.log("5 second", Date.now())
})
