# Command Line Interface

## Setup

* install [Node.js](https://nodejs.org/en/download/)
* install the CLI using npm or yarn

```bash
npm install -g devicescript
```

```bash
corepack enable
yarn add devicescript
```

The command tool is named `devicescript` or `devsc` for short.

## Build

The `build` command compiles the DeviceScript files in the current folder, using the resolution rules in `tsconfig.json`.

```bash
devsc build
```

This is the default command, so you can omit build.

```bash
devsc
```
