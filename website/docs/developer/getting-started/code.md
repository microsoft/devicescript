---
sidebar_position: 1
---

# Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/) (`code`) is a popular editor for TypeScript program. It is the
preferred editor for DeviceScript projects.

The command line tool is compatible with container and virtual machines so you can run it
in Docker, GitHub Codespaces, ...

## Setting up the project

Let's get started by installing the [DeviceScript command line](/developer/cli) and create an empty project

-   Open `code` in a new empty folder
-   Open a terminal (`` Ctrl + ` ``)
-   Install the command line globally. You can call it using `devsc`

```bash
npm install -g -u @devicescript/cli
```

-   Use the `init` command to setup the files

```bash
devsc init
```

You will have the following files created.

```
.devicescript     reserved folder for devicescript generated
    /lib          supporting runtime types and libraries
    /bin          compilation file output
.gitignore        if you are using git, make sure to ignore .devicescript
main.ts           usual name for your entry point application
package.json      additional dependencies and also has the `devicescript` field entry
tsconfig.json     configure the TypeScript compiler to compile DeviceScript syntax
...               A few additional files supporting the coding experience in VS Code
```

-   open `main.ts` and copy the following code

```ts
import * as ds from "@devicescript/core"

console.log("starting...")
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
// listen for pressure changes
sensor.pressure.onChange(10, () => {
    // read sensor reading
    const pressure = sensor.pressure.read()
    console.log(pressure)
    // user blows in straw
    if (pressure > 1400) {
        // click!
        console.log(`click!`)
        mouse.setButton(ds.HidMouseButton.Left, ds.HidMouseButtonEvent.Click)
        // debouncing
        ds.wait(0.05)
    }
})
```

## Launch the build watch

Assuming `main.ts` is the root file of your application,
launch a compilation task in watch mode using this command.

```bash
devsc build --watch
```

The command line task will also start a local web server that will send the compiled bytecode
to a developer tools page similar to the one hosted in the docs.

-   open the developer tools page, typically http://localhost:8081/ (see cli output)
-   use te developer tools page similarly to the embedded docs page

## Edit, deploy, debug loop

From here, your developer inner loop will be very similar to building/debugging a web site with hot reload.

-   make an edit in your source file, say `main.ts`
-   after a couple seconds, the compiler picks up the changes, produces a new bytecode and sends it to the developer tools
-   the developer tools automatically deploy thew bytecode to the select device (by default the simulator)
-   switch from VS Code to the browser and debug your new code
