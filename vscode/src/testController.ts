import * as vscode from "vscode"
import { DeviceScriptExtensionState } from "./state"
import {
    CHANGE,
    DeviceScriptTestControllerServer,
    SRV_DEVS_TEST,
} from "jacdac-ts"
import { readFileText } from "./fs"
import { Utils } from "vscode-uri"

interface TestData {
    type: "describe" | "test" | "it"
    // identifier used in devicescript
    testId: string
    indent: string
}

export function activateTestController(
    extensionState: DeviceScriptExtensionState
) {
    const { context, devtools, bus } = extensionState
    const { subscriptions } = context

    const testData = new WeakMap<vscode.TestItem, TestData>()

    const controller = vscode.tests.createTestController(
        "deviceScriptTests",
        "DeviceScript"
    )
    subscriptions.push(controller)
    devtools.subscribe(CHANGE, parseTests)

    // When text documents are open, parse tests in them.
    subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(parseTestsInDocument)
    )
    // We could also listen to document changes to re-parse unsaved changes:
    subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e =>
            parseTestsInDocument(e.document)
        )
    )

    // add run, debug profiles
    subscriptions.push(
        controller.createRunProfile(
            "Run",
            vscode.TestRunProfileKind.Run,
            (request, token) => runHandler(false, request, token)
        ),
        controller.createRunProfile(
            "Debug",
            vscode.TestRunProfileKind.Debug,
            (request, token) => runHandler(true, request, token)
        )
    )

    function parseTestsInDocument(e: vscode.TextDocument) {
        const { currentFile } = devtools
        if (e.uri.scheme === "file" && e.uri === currentFile) {
            parseTests()
        }
    }
    async function parseTests() {
        const { currentFile, projectFolder } = devtools

        // clear all tests
        if (!currentFile) {
            controller.items.replace([])
            return
        }

        const suite = `${Utils.basename(projectFolder)}/${Utils.basename(
            currentFile
        )}`
        const content = await readFileText(currentFile)
        const lines = content.split("\n")

        let parent: vscode.TestItem
        for (const line of lines) {
            const mopen =
                /^(?<indent>\s*)(?<type>describe|it|test)\(['"](?<name>.*?)['"],/.exec(
                    line
                )
            if (mopen) {
                const { indent, name, type } = mopen.groups
                const id = `${parent?.id || suite}/${name}`
                let test = controller.items.get(id)
                if (!controller.items.get(id)) {
                    const parentData = parent && testData.get(parent)
                    const testId = parentData
                        ? `${parentData.testId}/${name}`
                        : name
                    test = controller.createTestItem(id, name, currentFile)
                    if (parent) parent.children.add(test)
                    else controller.items.add(test)
                    testData.set(test, { type, indent, testId } as TestData)
                }
                if (type === "describe") parent = test
                continue
            }

            const mclose = /^(?<indent>\s*)}\s*\)\s*;?\s*$/.exec(line)
            // don't pop top level test
            if (mclose) {
                const { indent } = mclose.groups
                const parentData = testData.get(parent)
                if (!parentData) continue
                if (indent.length <= parentData.indent.length) {
                    parent = parent.parent
                }
                continue
            }
        }
    }

    async function runHandler(
        shouldDebug: boolean,
        request: vscode.TestRunRequest,
        token: vscode.CancellationToken
    ) {
        // recursively expand all tests
        const tests: vscode.TestItem[] = []
        {
            const todo: vscode.TestItem[] = []
            const { include, exclude } = request
            if (include) todo.push(...include)
            else controller.items.forEach(item => todo.push(item))
            while (todo.length) {
                const next = todo.pop()
                if (exclude?.includes(next)) continue
                tests.push(next)
                next.children.forEach(child => todo.push(child))
            }
            console.log({ tests, include, exclude })
        }

        const testControllerService = bus.services({
            serviceClass: SRV_DEVS_TEST,
        })[0]
        const testController = bus
            .findServiceProvider(testControllerService.device.deviceId)
            .service(
                testControllerService.serviceIndex
            ) as DeviceScriptTestControllerServer
        const run = controller.createTestRun(request)
        try {
            // mark tests as undefined
            tests.forEach(test => run.enqueued(test))

            const testIds = tests.map(test => testData.get(test)?.testId)
            console.log({ testIds })

            // start sniffing console.log
            testController.tests = testIds

            // start running
            await vscode.commands.executeCommand(
                `extension.devicescript.editor.${shouldDebug ? "debug" : "run"}`
            )

            if (token.isCancellationRequested) return
        } finally {
            // stop sniffing console.log
            testController.tests = []

            // fail remaining tests
            tests.forEach(test => run.errored(test, { message: "cancelled" }))

            // and done
            run.end()
        }
    }
}
