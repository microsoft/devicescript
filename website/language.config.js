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
                                scripts: {
                                    build: "./node_modules/bin/devicescript build",
                                    watch: "./node_modules/bin/devicescript build --watch",
                                    init: "./node_modules/bin/devicescript init",
                                    postinstall: "yarn init & yarn watch",
                                },
                            },
                        },
                        "sandbox.config.json": {
                            content: {
                                template: "node",
                                container: {
                                    node: "16",
                                    port: 8000,
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
