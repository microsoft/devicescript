import { AsyncVoid, reboot, TestManager } from "@devicescript/core"

export type SuiteFunction = () => void
export type Subscription = () => void
export type SubscriptionAsync = Subscription | Promise<Subscription>
export type TestFunction = () => AsyncVoid | SubscriptionAsync
export enum TestState {
    NotRun,
    Running,
    Passed,
    Error,
    Ignored,
}
export interface NodeOptions {
    /**
     * Short id used for reporting
     */
    id?: string
}
export interface TestOptions extends NodeOptions {
    /**
     * Test should fail
     */
    expectedError?: boolean
}
export class AssertionError extends Error {
    constructor(matcher: string, message: string) {
        super()
        this.name = "AssertionError"
        this.message = `${matcher}: ${message}`
    }
}
export interface TestQuery {
    testFilter?: (test: TestNode) => boolean
    suiteFilter?: (suite: SuiteNode) => boolean
}

// communicate with IDE if any
const testManager = new TestManager()

export type RunOptions = TestQuery & {
    reportTestManager?: boolean
}
export class Node {
    constructor(
        readonly parent: SuiteNode | undefined,
        readonly name: string,
        readonly options: NodeOptions | undefined
    ) {}

    id() {
        return this.options?.id || this.name
    }
    path(): string {
        return this.parent ? `${this.parent.path()}/${this.id}` : this.id()
    }
}
export interface SuiteOptions extends NodeOptions {}
export class SuiteNode extends Node {
    readonly children: SuiteNode[] = []
    readonly tests: TestNode[] = []

    constructor(parent: SuiteNode, name: string, options: SuiteOptions) {
        super(parent, name, options)
    }

    testCount(query?: TestQuery): number {
        const { testFilter, suiteFilter } = query || {}
        return (
            this.tests.filter(test => !testFilter || testFilter(test)).length +
            this.children
                .filter(child => !suiteFilter || suiteFilter(child))
                .reduce<number>((prev, curr) => prev + curr.testCount(query), 0)
        )
    }

    resolveTest(path: string) {
        if (this.path().slice(0, path.length) !== path) return undefined

        for (const test of this.tests) {
            if (test.path() === path) return test
        }

        return undefined
    }

    async register() {
        console.log(`registering tests...`)
        for (const test of this.tests) {
            await test.register()
        }
    }

    async run(options: RunOptions) {
        if (this.name) console.log(this.name)
        const { suiteFilter, testFilter } = options

        const result = {
            total: 0,
            pass: 0,
            error: 0,
        }

        for (const child of this.children.filter(
            child => !suiteFilter || suiteFilter(child)
        )) {
            const r = await child.run(options)
            result.total += r.total
            result.pass += r.pass
            result.error += r.error
        }
        for (const test of this.tests.filter(
            test => !testFilter || testFilter(test)
        )) {
            await test.run(options)
            result.total++
            switch (test.state) {
                case TestState.Passed:
                    result.pass++
                    break
                case TestState.Error:
                    result.error++
                    break
            }
        }

        return result
    }
}
export class TestNode extends Node {
    state: TestState = TestState.NotRun
    error: string

    constructor(
        parent: SuiteNode,
        name: string,
        options: TestOptions,
        public readonly body: TestFunction
    ) {
        super(parent, name, options)
    }

    async register() {
        await testManager.registerTest(this.path(), this.name)
    }

    async run(runOptions: RunOptions) {
        let { expectedError } = (this.options as TestOptions) || {}
        const { reportTestManager } = runOptions

        console.log(`  ${this.name}`)
        try {
            this.state = TestState.Running
            this.error = undefined

            const unsubscribe = await this.body()
            if (typeof unsubscribe === "function") await unsubscribe()

            if (expectedError) {
                // the throw below should be logged as error, not as expectedError
                expectedError = false
                throw new AssertionError(
                    "expectedError",
                    "expected an error from test"
                )
            }
            this.state = TestState.Passed
        } catch (error: any) {
            if (expectedError) {
                this.state = TestState.Passed
            } else {
                this.state = TestState.Error
                this.error = "" + error
                if (error.print) error.print()
            }
        }

        if (reportTestManager)
            testManager.reportTestResult(
                this.path(),
                this.error ? this.error.slice(0, 64) : ""
            )
    }
}

export const root = new SuiteNode(undefined, "", {})
export let autoRun = true
let autoRunTestTimer: number
const AUTORUN_TEST_DELAY = 10
const stack: SuiteNode[] = [root]

function currentSuite() {
    const parent = stack[stack.length - 1]
    return parent
}

export function describe(
    name: string,
    body: SuiteFunction,
    options?: SuiteOptions
) {
    // debounce autorun
    clearTimeout(autoRunTestTimer)

    const parent = currentSuite()
    const node = new SuiteNode(parent, name, options || {})
    parent.children.push(node)

    try {
        stack.push(node)
        body()
    } finally {
        stack.pop()
    }

    // autorun
    if (autoRun) {
        autoRunTestTimer = setTimeout(async () => {
            // don't auto run if test manager
            const bound = testManager.binding().read()
            if (bound) {
                await activateTestManager()
            } else {
                await runTests()
                reboot()
            }
        }, AUTORUN_TEST_DELAY)
    }
}

async function activateTestManager() {
    await testManager.discoverTests.subscribe(async () => {
        await root.register()
    })
    await testManager.runAllTests.subscribe(async () => {
        await runTests({ reportTestManager: true })
    })
    await testManager.runTest.subscribe(async path => {
        // find test
        const test = root.resolveTest(path)
        if (test) await test.run({ reportTestManager: true })
    })
    await root.register()
}

/**
 * Registers a test function
 * @param name name and identifier of the test
 * @param body test function to execute
 * @param options
 * @alias it
 */
export function test(name: string, body: TestFunction, options?: TestOptions) {
    const parent = currentSuite()
    parent.tests.push(new TestNode(parent, name, options, body))
}

/**
 * Registers a test function
 * @param name name and identifier of the test
 * @param body test function to execute
 * @param options
 * @alias test
 */
export const it = test

/**
 * Executes all tests, with an optional filter
 * @param options
 */
export async function runTests(options: RunOptions = {}) {
    const { ...query } = options
    const testOptions = {
        ...query,
    }
    console.log(`running ${root.testCount()} tests`)
    const { total, pass, error } = await root.run(testOptions)
    console.log(`tests: ${total}, pass: ${pass}, error: ${error}`)

    if (error) throw new Error("test errors")
}
