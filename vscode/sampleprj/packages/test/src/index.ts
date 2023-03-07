import * as ds from "@devicescript/core"

export type SuiteFunction = () => void
export type TestFunction = () => ds.AsyncVoid
export enum TestState {
    NotRun,
    Running,
    Passed,
    Error,
    Ignored,
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
export type RunOptions = TestQuery & {
    log: (...args: any[]) => void
}
export class SuiteNode {
    readonly children: SuiteNode[] = []
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
        const { log } = options

        if (this.name) log(this.name)
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
export class TestNode {
    state: TestState = TestState.NotRun
    error: unknown

    constructor(public name: string, public body: TestFunction) {}

    async run(options: RunOptions) {
        const { log } = options
        log(`  ${this.name}`)
        try {
            this.state = TestState.Running
            this.error = undefined

            await this.body()

            this.state = TestState.Passed
        } catch (error: unknown) {
            this.state = TestState.Error
            this.error = error
        }
    }
}

export const root = new SuiteNode("")
const stack: SuiteNode[] = [root]

function currentSuite() {
    const parent = stack[stack.length - 1]
    return parent
}

export function describe(name: string, body: SuiteFunction) {
    const node = new SuiteNode(name)

    const parent = currentSuite()
    parent.children.push(node)

    try {
        stack.push(node)
        body()
    } finally {
        stack.pop()
    }
}

export function test(name: string, body: TestFunction) {
    const parent = currentSuite()
    parent.tests.push(new TestNode(name, body))
}

export const it = test

export function expect<T>(value: T) {
    return new Expect(value, false)
}
export class Expect<T> {
    constructor(readonly value: T, private readonly _not: boolean) {}

    private check(condition: boolean) {
        return this._not ? !condition : condition
    }

    not() {
        return new Expect<T>(this.value, !this._not)
    }

    toThrow() {
        try {
            ;(this.value as any)()
            throw new AssertionError("toThrow", "Expected to throw")
        } catch (e) {}
    }

    toBe(other: T): void {
        if (this.check(other !== this.value))
            throw new AssertionError(
                "toBe",
                `Expected ${this.value}, got ${other}`
            )
    }
}

export async function runTests(
    options: TestQuery & { ignoreErrors?: boolean } = {}
) {
    const { ignoreErrors, ...query } = options
    const log = (...args: any[]) => console.log(args)
    const testOptions = {
        ...query,
        log,
    }
    log(`running ${root.testCount()} tests`)
    const { total, pass, error } = await root.run(testOptions)
    log(`tests: ${total}, pass: ${pass}, error: ${error}`)

    if (error && !ignoreErrors) throw new Error("test errors")
}
