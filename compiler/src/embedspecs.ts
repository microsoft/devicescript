// This is in separate file to speed-up intellisense (TS Server gets confused about the type of the JSON file)

import { RepoInfo } from "./archconfig"
import jacdacDefaultSpecificationsData from "../../runtime/jacdac-c/jacdac/dist/services.json"
import boardsJson from "./boards.json"

export const jacdacDefaultSpecifications =
    jacdacDefaultSpecificationsData as jdspec.ServiceSpec[]

export const boardSpecifications = boardsJson as RepoInfo
