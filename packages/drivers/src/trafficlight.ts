import * as ds from "@devicescript/core"
import { AsyncValue, GPIOMode, OutputPin, TrafficLightServerSpec } from "@devicescript/core";
import { Server, ServerOptions, startServer } from "@devicescript/server";

export interface TrafficLightOptions extends ServerOptions {
    red: OutputPin,
    yellow: OutputPin,
    green: OutputPin
}

class TrafficLightServer extends Server implements TrafficLightServerSpec {
    private lights: { pin: OutputPin, state: boolean }[] = []

    constructor(options: TrafficLightOptions) {
        super(ds.TrafficLight.spec, options)
        this.lights = [
            {pin: options.red, state: false},
            {pin: options.yellow, state: false},
            {pin: options.green, state: false}
        ]
        for(const light of this.lights) {
            light.pin?.setMode(GPIOMode.Output)
            light.pin?.write(light.state)
        }
    }

    private setState(index: number, value: boolean) {
        this.lights[index].state = !!value
        this.lights[index].pin?.write(this.lights[index].state)
    }

    red(): AsyncValue<boolean> {
        return this.lights[0].state
    }
    set_red(value: boolean): AsyncValue<void> {
        return this.setState(0, value)
    }
    yellow(): AsyncValue<boolean> {
        return this.lights[1].state
    }
    set_yellow(value: boolean): AsyncValue<void> {
        return this.setState(1, value)   
     }
    green(): AsyncValue<boolean> {
        return this.lights[2].state
    }
    set_green(value: boolean): AsyncValue<void> {
        return this.setState(2, value)   
    }
}

/**
 * Starts a traffic light driver over 3 output pins
 */
export async function startTrafficLight(options: TrafficLightOptions & ServerOptions) {
    const server = new TrafficLightServer(options)
    return new ds.TrafficLight(startServer(server, options))
}