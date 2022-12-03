// This is in separate file to speed-up intellisense (TS Server gets confused about the type of the JSON file)

// declare var require: any
// const jacdacDefaultSpecificationsData = require("../../runtime/jacdac-c/jacdac/dist/services.json")
import jacdacDefaultSpecificationsData from "../../runtime/jacdac-c/jacdac/dist/services.json"

export const jacdacDefaultSpecifications =
    jacdacDefaultSpecificationsData as jdspec.ServiceSpec[]
