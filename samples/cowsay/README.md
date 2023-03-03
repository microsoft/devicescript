# - project name -

This project uses [DeviceScript](https://microsoft.github.io/devicescript/).

## Project structures

```
.devicescript      reserved folder for devicescript generated files
main.ts            default DeviceScript entry point
...
/sim/app.ts        default node simulation entry point
/sim/...
/services/...      custom service definitions
/boards/...        custom board definitions
```


## Local/container development

-  install node.js 16+

```bash
nvm install 18
nvm use 18
```

-  install dependencies

```bash
yarn install
```

### Using Visual Studio Code

- open the project folder in code

```bash
code .
```

- install the [DeviceScript extension](https://microsoft.github.io/devicescript/getting-started/vscode)

- start debugging!

### Using the command line

- start the watch build and developer tools server

```bash
yarn watch
```

-  navigate to devtools page (see terminal output) 
to use the simulators or deploy to hardware.

-  open `main.ts` in your favorite TypeScript IDE and start editing.

