# Simulators (node.js)

This folder contains a Node.JS/TypeScript application that will be executed side-by-side with
the DeviceScript debugger and simulators. The application uses the [Jacdac TypeScript package](https://microsoft.github.io/jacdac-docs/clients/javascript/)
to communicate with DeviceScript.

The default entry point file is `app.ts`, which uses the Jacdac bus from `runtime.ts` to communicate
with the rest of the DeviceScript execution.

Feel free to modify to your needs and taste.
