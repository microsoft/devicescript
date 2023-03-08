# Test

The `@devicescript/test` module provides a lightweight unit test framework, with a subset of familiar APIs to Jest/Mocha/Chai users (`describe`, `test`, `expect`).

## Setup

Add test support using the `devicescript` command line.

```bash
deviescript add test
```

You can also add the package manually.

```bash npm2yarn
npm install @devicescript/test
```

## `describe`

Declares and encapsulates a test suite. `describe` calls can be nested.

```ts skip
import { describe } from "@devicescript/test"

// highlight-next-line
describe("this is a test suite", () => {})
```

## `test`

Defines a test with a name and a callback. There can be many tests and the callback can be `async`. Tests should not be nested.

```ts skip
import { describe, test } from "@devicescript/test"

describe("this is a test suite", () => {
    // highlight-next-line
    test("this is a test", async () => {})
})
```

## `expect`

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

## Package

The test framework is implemented in the [@devicescript/test](https://www.npmjs.com/package/@devicescript/test) package.
