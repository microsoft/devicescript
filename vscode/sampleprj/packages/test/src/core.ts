import * as ds from "@devicescript/core"

export type SuiteFunction = () => void
export type Subscription = () => void
export type SubscriptionAsync = Subscription | Promise<Subscription>
export type TestFunction = () => ds.AsyncVoid | SubscriptionAsync
export enum TestState {
    NotRun,
    Running,
    Passed,
    Error,
    Ignored,
}
export interface TestOptions {
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
export type RunOptions = TestQuery & {}
export class SetupTeardownNode {
    constructor(readonly callback: TestFunction) {}

    async run(runOptions: RunOptions) {
        return await this.callback()
    }
}
export class SuiteNode {
    readonly children: SuiteNode[] = []
    readonly befores: SetupTeardownNode[] = []
    readonly afters: SetupTeardownNode[] = []
    readonly tests: TestNode[] = []

    constructor(public name: string) {}

    testCount(query?: TestQuery): number {
        const { testFilter, suiteFilter } = query || {}
        return (
            this.tests.filter(test => !testFilter || testFilter(test)).length +
            this.children
                .filter(child => !suiteFilter || suiteFilter(child))
                .reduce<number>((prev, curr) => prev + curr.testCount(query), 0)
        )
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
            const cleanups = []
            try {
                // before tests
                for (const before of this.befores) {
                    const cleanup = await before.run(options)
                    if (cleanup) cleanups.push(cleanup)
                }

                // actually run test
                await test.run(options)

                // run afters
                for (const after of this.afters) {
                    const cleanup = await after.run(options)
                    if (cleanup) cleanups.push(cleanup)
                }
            } finally {
                // final cleanup
                for (const cleanup of cleanups) {
                    await cleanup()
                }
            }
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
export class TestNode {
    state: TestState = TestState.NotRun
    error: unknown

    constructor(
        public readonly name: string,
        public readonly body: TestFunction,
        public readonly options: TestOptions
    ) {}

    async run(runOptions: RunOptions) {
        let { expectedError } = this.options || {}
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
                this.error = error
                if (error.print) error.print()
            }
        }
    }
}

export const root = new SuiteNode("")
export let autoRun = true
let autoRunTestTimer: number
const AUTORUN_TEST_DELAY = 10
const stack: SuiteNode[] = [root]

function currentSuite() {
    const parent = stack[stack.length - 1]
    return parent
}

/**
 * Starts a new test suite.
 *
 * A suite lets you organize your tests and benchmarks so reports are more clear.
 * @param name test suite name
 * @param body function that registers tests or more suites
 */
export function describe(name: string, body: SuiteFunction) {
    // debounce autorun
    clearTimeout(autoRunTestTimer)

    const node = new SuiteNode(name)

    const parent = currentSuite()
    parent.children.push(node)

    try {
        stack.push(node)
        body()
    } finally {
        stack.pop()
    }

    // autorun
    if (autoRun) {
        if (!autoRunTestTimer) console.log(`preparing to run tests...`)
        autoRunTestTimer = setTimeout(async () => {
            await runTests()
            ds.reboot()
        }, AUTORUN_TEST_DELAY)
    }
}

/**
 * Defines a set of related expectations. It receives the test name and a function that holds the expectations to test.
 * @alias it
 */
export function test(name: string, body: TestFunction, options?: TestOptions) {
    const parent = currentSuite()
    parent.tests.push(new TestNode(name, body, options))
}

/**
 * Alias for the test method
 */
export const it = test

/**
 * Register a callback to be called before each of the tests in the current context runs.
 * If the function returns a promise, waits until the promise resolve before running the test.
 */
export function beforeEach(body: TestFunction) {
    const parent = currentSuite()
    parent.befores.push(new SetupTeardownNode(body))
}

/**
 * Register a callback to be called after each of the tests in the current context runs.
 * If the function returns a promise, waits until the promise resolve before running the test.
 */
export function afterEach(body: TestFunction) {
    const parent = currentSuite()
    parent.afters.push(new SetupTeardownNode(body))
}

export async function runTests(options: TestQuery = {}) {
    const { ...query } = options
    const testOptions = {
        ...query,
    }
    console.log(`running ${root.testCount()} tests`)
    const { total, pass, error } = await root.run(testOptions)
    console.log(`tests: ${total}, pass: ${pass}, error: ${error}`)

    if (error) throw new Error("test errors")
}
