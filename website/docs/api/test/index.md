# Test

The `@devicescript/test` module provides a lightweight unit test framework, with a subset of familiar APIs to Jest/Vitest/Mocha/Chai users (`describe`, `test`, `expect`).

## Setup

Add test support using the `devicescript` command line.

```bash
devicescript add test
```

You can also add the package manually.

```bash npm2yarn
npm install @devicescript/test
```

## Usage

### `test`

Defines a test with a name and a callback. There can be many tests and the callback can be `async`. Tests should not be nested.

```ts skip
import { describe, test } from "@devicescript/test"

describe("this is a test suite", () => {
    // highlight-next-line
    test("this is a test", async () => {})
})
```

### `describe`

Declares and encapsulates a test suite. `describe` calls can be nested.

```ts skip
import { describe } from "@devicescript/test"

// highlight-next-line
describe("this is a test suite", () => {})
```

### `expect`

BDD style assertion API.

```ts skip
import { describe, test, expect } from "@devicescript/test"

describe("this is a test suite", () => {
    test("this is a test", async () => {
        // highlight-next-line
        expect(1 + 1).toBe(2)
    })
})
```

### `beforeEach`

Registers a callback to be called before each test in the current test suite.

```ts skip
import { describe, test, expect } from "@devicescript/test"

describe("this is a test suite", () => {
    beforeEach(() => {
        // highlight-next-line
        console.log(`...`)
    })
    test("this is a test", () => {})
})
```

### `afterEach`

Registers a callback to be called after each test in the current test suite.

```ts skip
import { describe, test, expect } from "@devicescript/test"

describe("this is a test suite", () => {
    afterEach(() => {
        // highlight-next-line
        console.log(`...`)
    })
    test("this is a test", () => {})
})
```

## Package

The test framework is implemented in the [@devicescript/test](https://www.npmjs.com/package/@devicescript/test) package.
