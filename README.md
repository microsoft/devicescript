# DeviceScript

DeviceScript brings a professional TypeScript developer experience to low-resource microcontroller-based devices.
DeviceScript is compiled to a custom VM bytecode, which can run in very constrained
environments (VM itself compiles to 10kB of code, with the floating point library and Jacdac SDK adding further 30kB).

-   [Read the documentation](https://microsoft.github.io/devicescript)

## Release process

Run `npm run bump` (or `make bump`). Alteratively, edit `img_version_patch` in `bytecode/bytecode.md` and push.

The cloud build will rebuild and check-in the VM, update version numbers in all `package.json` files, and publish them.

## Contributing

Contributions are welcome! See [contributing page](./CONTRIBUTING.md).

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
