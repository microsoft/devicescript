# Settings

The `@devicescript/settings` module provides a lightweight flash storage for small setting values.
Settings values are serialized in flash and available accross device reset. Firmware updates might erase the settings.

## Setup

Add test support using the `devicescript` command line.

```bash
devicescript add settings
```

You can also add the package manually.

```bash npm2yarn
npm install @devicescript/settings
```

## Usage

### `writeSetting`

Serializes an object into a setting at a given key. The key name should be less than 16 characters.

```ts
import { writeSetting } from "@devicescript/settings"

// highlight-next-line
await writeSetting("hello", { world: true })
```

### `readSetting`

Deserializes an object from a setting at a given key. If the key is missing or invalid format, returns undefined.

```ts
import { readSetting } from "@devicescript/settings"

// highlight-next-line
const world = await readSetting("hello")
```

## Package

The test framework is implemented in the [@devicescript/settings](https://www.npmjs.com/package/@devicescript/settings) package.
