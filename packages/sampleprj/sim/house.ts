/**
 * prompt bing chat:
 *
 * write a thermal model of a house in TypeScript
 *
 * use physical values and R values
 *
 * explain your steps, cite your sources
 *
 * Add air conditioning
 *
 * Add windows
 */

import {
    AnalogSensorServer,
    JDServiceServer,
    RelayReg,
    SRV_RELAY,
    SRV_TEMPERATURE,
    TemperatureReg,
    TemperatureVariant,
    addServiceProvider,
} from "jacdac-ts"
import { bus } from "./runtime"
import { parse, unparse } from "papaparse"

const HEAT_CAPACITY_AIR = 1005 // J/(kg*K)
const DENSITY_AIR = 1.225 // kg/m^3
const THERMAL_TRANSMITTANCE_WALLS = 5.5 // W/(m^2*K)
const THERMAL_TRANSMITTANCE_WINDOWS = 2.0 // W/(m^2*K)

interface House {
    temperature: number
    outsideTemperature: number
    volume: number
    insulationRValue: number
    wallSurfaceArea: number
    windowSurfaceArea: number
    heaterPower: number
    heaterOn: boolean
    acPower: number
    acOn: boolean
}

function updateTemperature(house: House, deltaTime: number) {
    const heatCapacity = house.volume * DENSITY_AIR * HEAT_CAPACITY_AIR
    const heatLossWalls =
        ((house.temperature - house.outsideTemperature) *
            house.wallSurfaceArea *
            THERMAL_TRANSMITTANCE_WALLS) /
        house.insulationRValue
    const heatLossWindows =
        (house.temperature - house.outsideTemperature) *
        house.windowSurfaceArea *
        THERMAL_TRANSMITTANCE_WINDOWS
    const heatLoss = heatLossWalls + heatLossWindows
    const heatGain = house.heaterOn ? house.heaterPower : 0
    const heatRemoval = house.acOn ? house.acPower : 0
    const temperatureChange =
        ((heatGain - heatLoss - heatRemoval) / heatCapacity) * deltaTime
    house.temperature += temperatureChange
}

export function startHouse() {
    const heater = new JDServiceServer(SRV_RELAY, {
        instanceName: "furnace",
        intensityValues: [false],
        isActive: values => !!values?.[0],
    })
    const ac = new JDServiceServer(SRV_RELAY, {
        instanceName: "ac",
        intensityValues: [false],
        isActive: values => !!values?.[0],
    })
    const indoorTemperature = new AnalogSensorServer(SRV_TEMPERATURE, {
        readingValues: [21.5],
        streamingInterval: 1000,
        minReading: -5,
        maxReading: 50,
        readingError: [0.25],
        variant: TemperatureVariant.Indoor,
    })
    const outdoorTemperature = new AnalogSensorServer(SRV_TEMPERATURE, {
        readingValues: [21.5],
        streamingInterval: 1000,
        minReading: -40,
        maxReading: 120,
        readingError: [0.25],
        variant: TemperatureVariant.Outdoor,
    })
    addServiceProvider(bus, {
        name: "house",
        serviceClasses: [
            SRV_RELAY,
            SRV_RELAY,
            SRV_TEMPERATURE,
            SRV_TEMPERATURE,
        ],
        services: () => [heater, ac, indoorTemperature, outdoorTemperature],
    })
    const house: House = {
        temperature: 20,
        outsideTemperature: 10,
        volume: 100,
        insulationRValue: 10,
        wallSurfaceArea: 100,
        windowSurfaceArea: 10,
        heaterPower: 1000,
        acPower: 1000,
        heaterOn: false,
        acOn: false,
    }

    let index = 0
    const deltaTime = 1

    const updateHouse = () => {
        outdoorTemperature
            .register(TemperatureReg.Temperature)
            .setValues([20 + Math.sin(index++ / 30) * 10])

        // read values from input
        house.heaterOn = !!heater.register(RelayReg.Active).values()[0]
        house.acOn = !!ac.register(RelayReg.Active).values()[0]

        house.outsideTemperature = outdoorTemperature
            .register(TemperatureReg.Temperature)
            .values()[0]

        // compute new values
        updateTemperature(house, deltaTime)

        // apply computed values to sensors
        indoorTemperature
            .register(TemperatureReg.Temperature)
            .setValues([house.temperature])
    }

    setInterval(updateHouse, deltaTime * 1000)
}
