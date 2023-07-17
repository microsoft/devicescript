# DeviceScript

**TypeScript developer experience for low-resource microcontroller-based devices.**
DeviceScript is compiled to a custom VM bytecode, which can run in very constrained
environments.

-   [Read the documentation](https://microsoft.github.io/devicescript/)

![Screenshot of the extension](https://github.com/microsoft/devicescript/blob/main/vscode/screenshot.png?raw=true "Annotated screenshot of DeviceScript in Visual Studio Code")

## Features

-   Build and watch using DeviceScript compiler
    Deploy to simulator or hardware
-   Debugger with breakpoints, stack traces, exceptions, stepping
-   DeviceScript simulator
-   Sensor and Jacdac simulator
-   Connection to native DeviceScript device
-   Device, services, register Explorer view
-   Register and Event watch

> **If you fancy building your own tiny DOM/UI framework, this is your chance!** We have a limited implementation of [CanvasRenderingContext2D](https://microsoft.github.io/devicescript/developer/graphics) for LCD/OLED/eInk screens (like SSD1306, ST7735, UC8151) that you can use to display a UI. Limited memory, limited pixels, limited battery, it's a great challenge ([discussion](https://github.com/microsoft/devicescript/discussions/485))! We have TSX support to build a React like framework as well.

## Telemetry

This extension collects telemetry data to help us build a better experience working remotely from VS Code. We only collect data on which commands are executed. We do not collect any information about image names, paths, etc. The extension respects the `telemetry.enableTelemetry` setting which you can learn more about in the [Visual Studio Code FAQ](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).

## Contributing

Contributions are welcome! See [contributing page](../CONTRIBUTING.md).

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
