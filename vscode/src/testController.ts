import * as vscode from "vscode"
import { DeviceScriptExtensionState } from "./state"
import { CHANGE } from "jacdac-ts"
import { readFileText } from "./fs"
import { Utils } from "vscode-uri"

interface TestData {
    type: "describe" | "test" | "it"
}

export function activateTestController(
    extensionState: DeviceScriptExtensionState
) {
    const { context, devtools } = extensionState
    const { subscriptions } = context

    const testData = new WeakMap<vscode.TestItem, TestData>()

    const controller = vscode.tests.createTestController(
        "deviceScriptTests",
        "DeviceScript"
    )
    subscriptions.push(controller)
    devtools.subscribe(CHANGE, () => parseTests)

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
        const { currentFile } = devtools

        // clear all tests
        if (!currentFile) {
            controller.items.replace([])
            return
        }

        const suite = Utils.basename(currentFile)
        const content = await readFileText(currentFile)
        const lines = content.split("\n")

        let parent: vscode.TestItem = controller.createTestItem(suite, suite)
        for (const line of lines) {
            const m =
                /^\s*(?<type>describe|it|test)\(['"](?<name>.*?)['"],/.exec(
                    line
                )
            if (m) {
                const { name, type } = m.groups
                const id = `${parent.id}/${name}`
                let test = controller.items.get(id)
                if (!controller.items.get(id)) {
                    test = controller.createTestItem(id, name)
                    parent.children.add(test)
                    testData.set(test, { type } as TestData)
                }
                if (type === "describe") parent = test
            }
        }
    }

    async function runHandler(
        shouldDebug: boolean,
        request: vscode.TestRunRequest,
        token: vscode.CancellationToken
    ) {
        const run = controller.createTestRun(request)
        const queue: vscode.TestItem[] = []

        // Loop through all included tests, or all known tests, and add them to our queue
        if (request.include) {
            request.include.forEach(test => queue.push(test))
        } else {
            controller.items.forEach(test => queue.push(test))
        }

        // For every test that was queued, try to run it. Call run.passed() or run.failed().
        // The `TestMessage` can contain extra information, like a failing location or
        // a diff output. But here we'll just give it a textual message.
        while (queue.length > 0 && !token.isCancellationRequested) {
            const test = queue.pop()!

            // Skip tests the user asked to exclude
            if (request.exclude?.includes(test)) {
                continue
            }
            run.passed(test, 0)

            // queue children
            test.children.forEach(test => queue.push(test))
        }

        // Make sure to end the run after all tests have been executed:
        run.end()
    }
}
