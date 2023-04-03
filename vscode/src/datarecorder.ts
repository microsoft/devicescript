import { JDEventSource, CHANGE } from "jacdac-ts"
import { CONSOLE_DATA_MAX_ROWS } from "./constants"
import { JSONtoCSV } from "./csv"

export class DataRecorder extends JDEventSource {
    private offsetMillis: number = 0
    private lastMillis: number = undefined
    private entries: { line: string }[] = undefined
    maxRows = CONSOLE_DATA_MAX_ROWS

    addEntry(millis: number, json: any) {
        if (isNaN(millis) || json === undefined) return false

        // no entries yet
        if (!this.entries) this.entries = []
        // device reset
        if (millis < this.lastMillis) {
            this.offsetMillis += this.lastMillis
            this.lastMillis = millis
        }

        if (!Array.isArray(json)) json = [json]
        json.forEach((entry: any) => {
            this.entries.push({
                time: (millis + this.offsetMillis) / 1000.0,
                ...entry,
            })
            if (this.entries.length > CONSOLE_DATA_MAX_ROWS)
                this.entries.shift()
        })

        this.emit(CHANGE)
        return true
    }

    toCSV() {
        const content = JSONtoCSV(this.entries)
        return content
    }

    clear() {
        this.entries = undefined
        this.lastMillis = undefined
        this.offsetMillis = 0

        this.emit(CHANGE)
    }
}
