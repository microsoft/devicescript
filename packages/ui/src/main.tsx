import { Potentiometer } from "@devicescript/core"
import { SSD1306Driver } from "@devicescript/drivers"
import { HorizontalGauge, Text, renderOnImage } from "./ui"

const ssd = new SSD1306Driver({ width: 64, height: 48 })
await ssd.init()

const image = ssd.image
const pot = new Potentiometer()

setInterval(async () => {
    const pos = await pot.reading.read()
    await renderOnImage(
        <>
            <Text>Battery</Text>
            <HorizontalGauge
                y={12}
                width={image.width}
                height={8}
                value={pos}
                showPercent={true}
            />
        </>,
        image
    )
    await ssd.show()
}, 1000)
