// for some reason symbols cannot be exported normally from the 'core' library
// they are only exported via the ambient declarations
// we import the modules, as they assign to various prototypes
import "./utils"
import "./clientcmds"
import "./timeouts"
import "./array"
import "./events"
import "./jacdac"
import "./led"
export { standby } from "./clientcmds"
export { rgb, hsl } from "./led"
