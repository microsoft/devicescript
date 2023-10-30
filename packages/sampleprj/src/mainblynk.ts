import { sleep } from "@devicescript/core"
import { fetch } from "@devicescript/net"
import { readSetting } from "@devicescript/settings"

const token = await readSetting("BLYNK_TOKEN")

export type VirtualPinValueType = number | string

/**
 * VirtualPin on top of HTTP; should really use the TCP protocol.
 */
export class VirtualPin<T extends VirtualPinValueType> {
    constructor(
        public readonly id: number,
        public value: T
    ) {}

    /**
     * Writes the current value of the pin
     * { @link https://docs.blynk.io/en/blynk.cloud/update-datastream-value }
     */
    async write(value: T) {
        if (value === undefined) throw new Error("Value not set")
        if (!token) throw new Error("Blynk token not set")

        const pin = `V${this.id}`
        const url = `https://blynk.cloud/external/api/update?token=${token}&${pin}=${
            value || ""
        }`
        const resp = await fetch(url)
        if (resp.ok) this.value = value
        return resp.status
    }

    /**
     * Gets the Datastream value
     * { @link https://docs.blynk.io/en/blynk.cloud/get-datastream-value }
     */
    async read() {
        const pin = `V${this.id}`
        const url = `https://blynk.cloud/external/api/get?token=${token}&${pin}`
        const resp = await fetch(url)
        if (resp.ok) {
            let v: any = await resp.text()
            if (typeof this.value === "number") v = parseFloat(v)
            this.value = v
        }
        return this.value
    }
}

const switchControl = new VirtualPin(0, 0)
while (true) {
    await switchControl.read()
    console.log(switchControl.value)
    await sleep(1000)
}
