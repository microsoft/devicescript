import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface LightBulb {
        /**
         * Turns the light on at the given intensity.
         * @param intensity if specified, the light will be turned on at this intensity (0-1]
         */
        on(intensity?: number): Promise<void>

        /**
         * Turns the light off.
         */
        off(): Promise<void>

        /**
         * Toggle light between off and full brightness
         * @param lowerThreshold if specified, the light will be turned off if the current brightness is above this threshold
         * @param intensity if specified, the light will be turned on at this intensity
         * @see {@link https://microsoft.github.io/devicescript/api/clients/lightbulb/#cmd:toggle | Documentation}
         */
        toggle(lowerThreshold?: number, intensity?: number): Promise<void>
    }
}

ds.LightBulb.prototype.off = async function () {
    await this.intensity.write(0)
}

ds.LightBulb.prototype.on = async function (intensity?: number) {
    const i = intensity === undefined ? 1 : intensity
    await this.intensity.write(i)
}

ds.LightBulb.prototype.toggle = async function (
    lowerThreshold?: number,
    intensity?: number
) {
    const value = await this.intensity.read()
    const on = value > (lowerThreshold || 0)
    const i = intensity === undefined ? 1 : intensity
    await this.intensity.write(on ? 0 : i)
}
