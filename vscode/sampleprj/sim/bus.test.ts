import { beforeAll, beforeEach, describe, test, afterEach } from "@jest/globals"
import {
    createNodeWebSocketTransport,
    createWebSocketTransport,
    delay,
    DEVICE_ANNOUNCE,
    ERROR,
    JDBus,
    SRV_BUTTON,
    startServiceProviderFromServiceClass,
} from "jacdac-ts"

let bus: JDBus
let subscriptions: (() => void)[]

const mount = (unsub: () => void) => subscriptions.push(unsub)

beforeAll(async () => {
    const ws = createNodeWebSocketTransport("127.0.0.1:8081", {
        protocols: "ws",
    })
    bus = new JDBus([ws], { client: false, disableRoleManager: true })
    bus.on(ERROR, err => {
        console.log("Bus error", err)
    })
    bus.autoConnect = true
    await delay(1000)
    await bus.connect(false)
})

beforeEach(async () => {
    subscriptions = []
    bus.clear(0)
})

afterEach(() => {
    subscriptions?.forEach(s => s())
})

describe("jdom", () => {
    test("list 1 button", async () => {
        mount(
            bus.subscribe(DEVICE_ANNOUNCE, () => {
                console.log(bus.describe())
            })
        )
        startServiceProviderFromServiceClass(bus, SRV_BUTTON)
    }, 5000)
})
