import { addServiceProvider, delay } from "jacdac-ts"
import { SRV_TEST_MANAGER } from "../.devicescript/ts/constants"
import { bus } from "./runtime"
import { TestManagerServer } from "./testmanagerserver"

// start test manager server
const run = async () => {
    const testManager = new TestManagerServer()
    testManager.subscribeDiscoverTest(({ name, path }) =>
        console.log(`test: ${name}, ${path}`)
    )
    testManager.subscribeReportTestResult(({ path, error }) =>
        console.log(`test result: ${name}, ${error || "pass"}`)
    )

    addServiceProvider(bus, {
        name: "Test Manager",
        serviceClasses: [SRV_TEST_MANAGER],
        services: () => [testManager],
    })

    // let testers register test
    await delay(1000)

    // start test run
    await testManager.startRunAllTests()
}

run()
