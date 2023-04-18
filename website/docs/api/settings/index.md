# Settings

The `@devicescript/settings` [builtin](/developer/packages) module provides a lightweight flash storage for small setting values.
Settings values are serialized in flash and available accross device reset. Firmware updates might erase the settings.

## Usage

### writeSetting

Serializes an object into a setting at a given key. The key name should be less than 16 characters.

```ts
import { writeSetting } from "@devicescript/settings"

// highlight-next-line
await writeSetting("hello", { world: true })
```

### readSetting

Deserializes an object from a setting at a given key. If the key is missing or invalid format, it returns `undefined` or the second argument.

```ts
import { readSetting } from "@devicescript/settings"

// highlight-next-line
const world = await readSetting("hello", ":)")
```

### deleteSetting

Deletes a setting at the given key. If the setting does not exist, does nothing.

```ts
import { deleteSetting } from "@devicescript/settings"

// highlight-next-line
await deleteSetting("hello")
```