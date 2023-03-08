# Test

The `@devicescript/test` module provides a lightweight unit test framework, with familiar APIs to Jest/Mocha/Chai users (`describe`, `test`, `expect`).

## Setup

Add test support using the `devicescript` command line.

```bash
deviescript add test
```

You can also add the package manually.

```bash npm2yarn
npm install @devicescript/test
```

## describe

Declares and encapsulates a test suite. `describe` calls can be nested.

```ts skip
import { describe, test, expect, runTests } from "@devicescript/test"

describe("this is a test suite", () => {

})
```

## Package

The test framework is implemented in the [@devicescript/test](https://www.npmjs.com/package/@devicescript/test) package.
