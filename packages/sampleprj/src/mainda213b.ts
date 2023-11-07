import { DA213BDriver, startAccelerometer } from "@devicescript/drivers"

const acc = await startAccelerometer(new DA213BDriver(), {})
acc.reading.subscribe((v) => console.data(v))