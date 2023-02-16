// This is in separate file to speed-up intellisense (TS Server gets confused about the type of the JSON file)

// declare var require: any
// const jacdacDefaultSpecificationsData = require("../../runtime/jacdac-c/jacdac/dist/services.json")
import { RepoInfo } from "@devicescript/srvcfg"
import jacdacDefaultSpecificationsData from "../../runtime/jacdac-c/jacdac/dist/services.json"
import boardsJson from "./boards.json"

export const jacdacDefaultSpecifications =
    jacdacDefaultSpecificationsData as jdspec.ServiceSpec[]

export const boardSpecifications = boardsJson as RepoInfo
