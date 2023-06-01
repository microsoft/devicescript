# Settings

The `@devicescript/settings` [builtin](/developer/packages) module provides a lightweight flash storage for small setting values.
Settings values are serialized in flash and available across device reset. Firmware updates might erase the settings.

## Usage

You can store settings and secrets in `.env` files.

### `.env.defaults` and `.env.local` files

Don't store secrets or settings in the code, use `.env` files instead.

-   `./.env.defaults`: store general settings (**tracked by version control**)
-   `./.env.local`: store secrets or override for general settings (**untracked by version control**)

The `.env*` file use a similar format to node.js `.env` file.

```env title="./.env.defaults"
# This file is tracked by git. DO NOT store secrets in this file.
TEMP=68
```

```env title="./.env.local"
# This file is **NOT** tracked by git and may contain secrets
PASSWORD=VALUE
TEMP=70 # override TEMP
```

The secrets can only be accessed by the DeviceScript program and are not available through the Jacdac protocol.

-   multiline values, and `#` in quote strings are not supported.
-   key length should be less than 14 characters.

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
