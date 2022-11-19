# Jacscript

Jacscript is a programming language for scripting [Jacdac](https://aka.ms/jacdac) services.

It has JavaScript-like syntax and is compiled to a custom VM bytecode, which can run in very constrained
environments (VM itself compiles to 10kB of code, with the floating point library and Jacdac SDK adding further 30kB).

This repository contains:
* [jacdac-c submodule](https://github.com/microsoft/jacdac-c), including sources for Jacdac client libraries and Jacscript VM
* `compiler/` - sources for Jacscript compiler
* `runtime/jacscript-vm/` - glue files to build Jacscript VM as WASM module using [emscripten](https://emscripten.org/); `vm/dist/` contain pre-built files
* `jacs/samples/` - sample Jacscript programs
* `runtime/posix/` - implementation of Jacdac SDK HAL for grown-up POSIX-like operating systems (as opposed to embedded platforms)


## Usage

You can just use the devcontainer to build.

If you want to build locally you need to install node.js. After cloning, the repo run

```bash
yarn setup
```

* start `jacdac devtools` (the npm version) and let is running
* open this folder in VSCode; use "Reopen in Container" if needed
* start Terminal in VSCode
* run `yarn install`
* run `yarn build`
* run `node run.js jacs/samples/something.ts` - this will execute given Jacscript program using the WASM binary

If you want to develop the runtime (as opposed to compiler or website), you will also need
GNU Make, C compiler, and [emscripten](https://emscripten.org/docs/getting_started/downloads.html).
Once you have it all:

* run `make native` to compile using native C compiler
* run `node run.js -c jacs/samples/something.ts` - this will execute given Jacscript program using the POSIX/native binary
* run `./runtime/built/jdcli 8082` - this will run the POSIX/native Jacscript server, which can be accessed from the devtools dashboard
* run `make em` to compile using emscripten

## Design goals for Jacscript VM

* secure - can predictably execute untrusted code (random bytes)
* easy to analyze - should be possible to statically determine the set of APIs used
* small memory (RAM) footprint
* small code (flash) footprint
* leave space for extensions in future

## Random notes

### Memory usage analysis

Main dynamic memory usage - function activation records (and fibers).
* `BG_MAX1` call frames can be only allocated once
* whatever they call may need additional frames
* can collect all register gets and estimate memory for them (do we need a size limit on these?)


## TODO

* add `Date.now()` ?
* hang properties off roles - `high`, `lastHigh` for bar graph eg
* more dynamic buffers? (offline store of pixels)

* `role.control` -> control service of device that has this role ?
* role for control service of the brain (to set status light, reset, etc)

* disallow top-level code?
* add opcode to cache current packet (in onChanged())
* extend format strings to include numfmt
* shift buffer opcode?
* somehow deal with events with legit args (button and barcode reader currently) - doesn't work so well in handler-pending model
* add `role.waitConnected()` or something?
* add `bg(() => { ... })`, also `bg1()` ?
* do fiber round-robin for yields?
* some testing framework? (depends on services?)

### Implementing services in jacscript

* this generally doesn't work with handler-pending model
* opcode to send current packet
* opcode to set the command
* opcode to set service number
* some way of building announce packets
* handler when a packet is received
* support 1 or more devices per VM instance?
* add `try_again` report in addition to `command_not_implemented` ?

### Cloud

* specific uploads: `hum.autoUpload(5, 1) // 5s, 1%`
* auto-upload of everything

### Debugger interface

* fiber list, locals, globals
* setting breakpoints - breakpoint instruction? (based on source code location)
* more "debug" info in compiled program - role names, etc for error messages?


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
