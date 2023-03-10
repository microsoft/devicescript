import { DeviceScriptExtensionState } from "./state"
import * as vscode from "vscode"
import { TestManagerServer } from "./../sampleprj/packages/test/sim/testmanagerserver"
import { addServiceProvider, delay } from "jacdac-ts"

export function activateTestController(state: DeviceScriptExtensionState) {
    const { bus, context } = state
    const server = new TestManagerServer()
    const controller = vscode.tests.createTestController(
        "devicescript",
        "DeviceScrip Tests"
    )
    context.subscriptions.push(controller)
    const resolveOrCreateTestItem = (
        path: string,
        createIfMissing: boolean
    ): vscode.TestItem => {
        // recursively resolve the items
        let items = controller.items
        let item: vscode.TestItem
        let id = ""
        for (const part of path.split("/")) {
            id = path ? `${path}/${part}` : part
            item = items.get(id)
            if (!item && createIfMissing) {
                item = controller.createTestItem(path, path)
                items.add(item)
            }
            if (!item) return undefined
            items = item.children
        }
        return item
    }
    const appendTests = (tests: vscode.TestItem[], item: vscode.TestItem) => {
        if (item.children.size > 0)
            item.children.forEach(child => appendTests(tests, child))
        else tests.push(item)
    }
    const allTests = () => {
        const tests: vscode.TestItem[] = []
        controller.items.forEach(item => appendTests(tests, item))
        return tests
    }
    const runProfile = controller.createRunProfile(
        "Run",
        vscode.TestRunProfileKind.Run,
        async (request, token) => {
            const { include, exclude } = request
            const run = controller.createTestRun(request)
            const tests =
                include?.filter(test => !exclude?.includes(test)) || allTests()
            tests.forEach(test => run.enqueued(test))

            const unsub = server.subscribeReportTestResult(
                ({ path, error }) => {
                    const test = resolveOrCreateTestItem(path, false)
                    if (!test) {
                        console.error(`unknown test ${path}`)
                        run.appendOutput(`unknown test ${test.id}`)
                    } else {
                        if (!error) run.passed(test)
                        else run.errored(test, new vscode.TestMessage(error))
                        const i = tests.indexOf(test)
                        if (i >= 0) tests.splice(i, 1)
                        if (tests.length === 0) {
                            // done!
                            run.end()
                        }
                    }
                }
            )
            const cancel = () => unsub()
            token.onCancellationRequested(cancel)

            if (!include) {
                await server.startRunAllTests()
            } else {
                for (const test of tests) {
                    await server.startRunTest(test.id)
                    run.started(test)
                    await delay(500) // TODO wiat for test to resolve
                    if (token.isCancellationRequested) {
                        return
                    }
                }
            }
        }
    )
    server.subscribeDiscoverTest(({ name, path }) => {
        const item = resolveOrCreateTestItem(path, true)
        if (item) item.label = name
    })
    const provider = addServiceProvider(bus, {
        name: "Test Manager",
        serviceClasses: [TestManagerServer.SERVICE_CLASS],
        services: () => [server],
    })
    context.subscriptions.push({
        dispose: () => bus.removeServiceProvider(provider),
    })
}
