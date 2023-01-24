---
sidebar_position: 1
hide_table_of_contents: true
---
# Installation

DeviceScript has been designed to gradual adoption. From editing scripts online in the docs, to building customized embedded firmware images.
This section will get you started at the level of the stack you're looking for.

## Try DeviceScript

You do not need hardware or install any tools to try out DeviceScript. Try running this snippet!

```ts edit codesandbox
ds.every(1, () => {
    console.log(`hello`)
})
```

You can edit it directly and press `Edit` to load it in the DeviceScript simulator in the documentation.

## Try DeviceScript locally (or remotely)

Install the [DeviceScript command line](/api/cli) and use your favorite TypeScript IDE to write your scripts.

Getting started with a fresh project can be done with 3 commands.

```bash
# install DeviceScript command line (requires node.js 16+)
npm install -g -u @devicescript/cli
# setup files for project
devsc init
# start developer build
devsc build --watch
```

:::tip
The DeviceScript tools also works from containers and hosted development environments such
as GitHub Codespaces, CodeSandbox, Docks, Windows WSL.
:::
