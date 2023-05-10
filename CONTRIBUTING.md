# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Repository structure

This repository contains:

-   [jacdac-c submodule](https://github.com/microsoft/jacdac-c), including sources for Jacdac client libraries and DeviceScript VM
-   `compiler/` - sources for DeviceScript compiler
-   `runtime/devicescript-vm/` - glue files to build DeviceScript VM as WASM module using [emscripten](https://emscripten.org/); `vm/dist/` contain pre-built files
-   `devs/samples/` - sample DeviceScript programs
-   `runtime/posix/` - implementation of Jacdac SDK HAL for grown-up POSIX-like operating systems (as opposed to embedded platforms)

## Usage

You can just use the devcontainer to build.

If you want to build locally you need to install node.js. After cloning, the repo run

```bash
yarn setup
```

To run a watch build and the docs, run

```
nvm use 18
yarn dev
```

-   start `jacdac devtools` (the npm version) and let is running
-   open this folder in VSCode; use "Reopen in Container" if needed
-   start Terminal in VSCode
-   run `yarn install`
-   run `yarn build`
-   run `devs run devs/samples/something.ts` - this will execute given DeviceScript program using the WASM binary

If you want to develop the runtime (as opposed to compiler or website), you will also need
GNU Make, C compiler, and [emscripten](https://emscripten.org/docs/getting_started/downloads.html).
Once you have it all:

-   run `make native` to compile using native C compiler
-   run `devs crun devs/samples/something.ts` - this will execute given DeviceScript program using the POSIX/native binary
-   run `./runtime/built/jdcli 8082` - this will run the POSIX/native DeviceScript server, which can be accessed from the devtools dashboard
-   run `make em` to compile using emscripten

## Release process

Run `yarn bump` (or `make bump`). Alteratively, edit `img_version_patch` in `bytecode/bytecode.md` and push.

The cloud build will rebuild and check-in the VM, update version numbers in all `package.json` files, and publish them.

If you bump minor, you need to also bump the firmware repos:

- go to each firmware repo (https://github.com/microsoft/devicescript-esp32, https://github.com/microsoft/devicescript-pico, https://github.com/microsoft/devicescript-stm32)
- update the `devicescript` submodule
- run

```bash
make bump
```

## Adding Builtin Packages

Generally, search for `@devicescript/gpio` within the workspace.
The main places that need updating is:

-   this file, `website/docs/developer/packages.mdx`
-   list in `plugin/src/plugin.ts`
-   list in `devs/run-test/allcompile.ts`

After adding a new packages, run `yarn` at the top-level to update workspace links,
followed by the usual `yarn build`.
