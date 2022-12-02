# Command Line Interface

## Setup

-   install [Node.js](https://nodejs.org/en/download/)
-   install the CLI using npm or yarn

```bash
npm install -g devicescript
```

```bash
corepack enable
yarn add devicescript
```

The command tool is named `devicescript` or `devsc` for short.
The full list of options for each command is available through the CLI by running `devsc help <command>`.

## build

The `build` command compiles a DeviceScript file (default is `main.ts`), using the resolution rules in `tsconfig.json`. It is the default command.

```bash
devsc build main.ts
```

### --watch

To automatically rebuild your program based on file changes,
add `--watch`.

```bash
devsc build --watch
```

When the build is run in watch mode, it also opens a developer tool web server that allows
to execute the compiled program in a virtual device or physical devices. Follow the console
application instructions to open the web page.

#### --internet

To access the developer tools outside localhost, add `--internet`

```bash
devsc build --watch --internet
```

## devtools

The `devtools` command launches the developer tool server, without trying to build a project.

```bash
devsc devtools
```

#### --internet

To access the developer tools outside localhost, add `--internet`

```bash
devsc devtools --internet
```

## init

The `init` commands creates or updates the necessary files to get syntax completion
and checking in DeviceScript project (typically from Visual Studio Code). The command expects to be in the project folder.

```bash
devsc init
```