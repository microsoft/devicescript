//@ts-check
const { readJsonSync } = require("fs-extra")

async function createConfig() {
    const { version: langVersion } = readJsonSync("../package.json", {})
    const config = {
        languages: [
            // languages where you want to enable interactivity in editable code blocks
            {
                name: "Jacscript", // your language name
                label: "ts", // label for the language in markdown code blocks
                highlight: "typescript", // syntax highlighting provided by prism for the language
                showLineNumbers: true, // whether to show line numbers in all code block of this language
                buildConfig: {
                    version: "1",
                    langVersion,
                    timeout: 2000, // timeout for execution of each code snippet in milliseconds during build
                    processToExecute: "./src/remark/compile.js",
                    statusCodes: {
                        success: "z3-ran",
                        timeout: "z3-timed-out",
                        runError: "z3-failed",
                        runtimeError: "z3-runtime-error",
                    },
                },
                githubRepo: "microsoft/jacscript",
                githubDiscussion: false,
            },
        ],
        solutionsDir: "./solutions",
    }

    return config
}

module.exports = createConfig
