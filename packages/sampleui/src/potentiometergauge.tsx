import "@devicescript/observables"
import { Potentiometer } from "@devicescript/core"
import { SSD1306Driver } from "@devicescript/drivers"
import { HorizontalGauge, Text, renderOnImage } from "./ui"
import { auditTime } from "@devicescript/observables"

const pot = new Potentiometer()

export async function startPotentiometerGauge() {
    const ssd = new SSD1306Driver({ width: 64, height: 48, devAddr: 0x3c })
    await ssd.init()

    const image = ssd.image
    image.print("loading...", 0, 0)
    await ssd.show()

    pot.reading.pipe(auditTime(100)).subscribe(async (pos: number) => {
        console.data({ pos })

        await renderOnImage(
            <>
                <Text>Slider</Text>
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
    })
}
