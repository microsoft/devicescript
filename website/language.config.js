//@ts-check
const { readJsonSync } = require("fs-extra")

async function createConfig() {
    const { version: langVersion } = readJsonSync("../package.json", {})
    const config = {
        languages: [
            // languages where you want to enable interactivity in editable code blocks
            {
                name: "DeviceScript", // your language name
                label: "ts", // label for the language in markdown code blocks
                highlight: "typescript", // syntax highlighting provided by prism for the language
                showLineNumbers: false, // whether to show line numbers in all code block of this language
                buildConfig: {
                    version: "1",
                    langVersion,
                    timeout: 2000, // timeout for execution of each code snippet in milliseconds during build
                    processToExecute: "./src/remark/compile.js",
                    statusCodes: {
                        success: "success",
                        timeout: "timeout",
                        runError: "error",
                        runtimeError: "runtimeerror",
                    },
                },
                githubRepo: "microsoft/devicescript",
                sandbox: {
                    files: {
                        "package.json": {
                            content: {
                                dependencies: {},
                                devDependencies: {
                                    "devicescript-cli": "*",
                                },
                                descriptscript: {},
                                scripts: {
                                    setup: "node node_modules/devicescript-cli/built/devicescript-cli.cjs init",
                                    build: "node node_modules/devicescript-cli/built/devicescript-cli.cjs build",
                                    watch: "node node_modules/devicescript-cli/built/devicescript-cli.cjs build --watch",
                                    start: "yarn setup && yarn watch",
                                },
                            },
                        },
                        "sandbox.config.json": {
                            content: {
                                template: "node",
                                view: "terminal",
                                container: {
                                    node: "16",
                                },
                            },
                        },
                    },
                    main: "main.ts",
                },
            },
        ],
        solutionsDir: "./solutions",
    }

    return config
}

module.exports = createConfig
