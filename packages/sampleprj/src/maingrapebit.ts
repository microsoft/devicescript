import { KittenBotGrapeBit } from "@devicescript/drivers"

const board = new KittenBotGrapeBit()

const acc = await board.startAccelerometer()
const buzzer = await board.startBuzzer()
const m1 = await board.startMotor1()
const m2 = await board.startMotor2()
const bA = await board.startButtonA()
const bB = await board.startButtonB()
const led = await board.startLed()

await led.showAll(0x001f00)

acc.reading.subscribe(v => console.data(v))
bA.down.subscribe(() => console.data("A down"))
bB.down.subscribe(() => console.data("B down"))
