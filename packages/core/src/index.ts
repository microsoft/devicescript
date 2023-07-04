// for some reason symbols cannot be exported normally from the 'core' library
// they are only exported via the ambient declarations
// we import the modules, as they assign to various prototypes
import "./utils"
import "./buffer"
import "./timeouts"
import "./array"
import "./string"
import "./events"
import "./jacdac"
import "./led"
import "./lightbulb"
import "./rotaryencoder"
import "./button"
import "./magneticfieldlevel"
import "./buzzer"
import "./map"
