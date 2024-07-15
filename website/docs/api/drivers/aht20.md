# AHT20

Driver for AHT20 temperature/humidity sensor at I2C address `0x38`.

-   Services: [temperature](/api/clients/temperature/), [humidity](/api/clients/humidity/)
-   [Datasheet](https://asairsensors.com/wp-content/uploads/2021/09/Data-Sheet-AHT20-Humidity-and-Temperature-Sensor-ASAIR-V1.0.03.pdf)
-   [Source](https://github.com/microsoft/devicescript/blob/main/packages/drivers/src/aht20.ts)

## Usage

```ts
import { startAHT20 } from "@devicescript/drivers"
const { temperature, humidity } = await startAHT20()
```

## Configuration

-   Configure I2C through the [board configuration](/developer/board-configuration)
