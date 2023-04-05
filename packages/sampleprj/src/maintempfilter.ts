import { Temperature } from "@devicescript/core"
import { auditTime, ewma, tap } from "@devicescript/observables"

const thermometer = new Temperature()
const { temperature } = thermometer

temperature
    .pipe(
        tap(t_raw => console.data({ t_raw })),
        ewma(0.9),
        tap(t_ewma => console.data({ t_ewma })),
        auditTime(5000)
    )
    .subscribe(t => console.data({ t }))
console.log(`waiting for data...`)
