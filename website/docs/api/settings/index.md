# Settings

The `@devicescript/settings` [builtin](/developer/builtin-packages) module provides a lightweight flash storage for small setting values.
Settings values are serialized in flash and available accross device reset. Firmware updates might erase the settings.

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
