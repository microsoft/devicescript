// @ts-check
const { configure } = require("@rise4fun/docusaurus-plugin-rise4fun")

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

const config = configure(
    {
        title: "DeviceScript",
        tagline:
            "TypeScript-like Language and Runtime for Small Embedded Devices.",
        url: "https://microsoft.github.io/",
        baseUrl: "/devicescript/",
        onBrokenLinks: "throw",
        favicon: "img/favicon.svg",
        trailingSlash: false,

        // GitHub pages deployment config.
        // If you aren't using GitHub pages, you don't need these.
        organizationName: "microsoft", // Usually your GitHub org/user name.
        projectName: "devicescript", // Usually your repo name.
        deploymentBranch: "gh-pages",
        presets: [
            [
                "classic",
                /** @type {import('@docusaurus/preset-classic').Options} */
                ({
                    docs: {
                        routeBasePath: "/",
                        sidebarPath: require.resolve("./sidebars.js"),
                        remarkPlugins: [],
                    },
                    blog: false,
                    theme: {
                        customCss: require.resolve("./src/css/custom.css"),
                    },
                }),
            ],
        ],

        themeConfig:
            /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
            ({
                colorMode: {
                    disableSwitch: false,
                },
                navbar: {
                    title: "DeviceScript",
                    logo: {
                        alt: "DeviceScript language",
                        src: "img/logo.svg",
                        srcDark: "img/logo_dark.svg",
                    },
                    items: [
                        {
                            type: "doc",
                            docId: "intro",
                            position: "left",
                            label: "Docs",
                        },
                        {
                            type: "doc",
                            docId: "devices/index",
                            position: "left",
                            label: "Devices",
                        },
                        {
                            type: "doc",
                            docId: "api/cli",
                            position: "left",
                            label: "API",
                        },
                    ],
                },
                footer: {
                    style: "dark",
                    links: [
                        {
                            title: "Docs",
                            items: [
                                {
                                    label: "Introduction",
                                    to: "/intro",
                                },
                                {
                                    label: "Developer",
                                    to: "/developer",
                                },
                                {
                                    label: "Language Reference",
                                    to: "/language",
                                },
                                {
                                    label: "API",
                                    to: "/api/cli",
                                },
                            ],
                        },
                        {
                            title: "Community",
                            items: [
                                {
                                    label: "GitHub",
                                    href: "https://github.com/microsoft/devicescript/",
                                },
                                {
                                    label: "Discussions",
                                    href: "https://github.com/microsoft/devicescript/discussions",
                                },
                            ],
                        },
                    ],
                },
                prism: {
                    theme: lightCodeTheme,
                    darkTheme: darkCodeTheme,
                },
            }),
    },
    {
        appInsights: {
            instrumentationKey: "06283122-cd76-493c-9641-fbceeeefd9c6",
        },
        algolia: {
            appId: "AL1OJNE8M9",
            apiKey: "0d31b2119e202cd71b47e914cc567fab",
            indexName: "devicescript",
        },
        codeSandbox: {
            defaultTemplate: "devicescript",
            templates: {
                devicescript: {
                    files: {
                        "devsconfig.json": { content: {} },
                        "package.json": {
                            content: {
                                version: "0.0.0",
                                private: true,
                                dependencies: {},
                                devDependencies: {
                                    "@devicescript/cli": "*",
                                },
                                scripts: {
                                    "setup": "devicescript init",
                                    "build": "devicescript build",
                                    "watch": "devicescript devtools main.ts",
                                    "start": "yarn watch",
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
                                startScript: "setup",
                            },
                        },
                    },
                },
            },
        },
        compileCode: {
            langs: [
                {
                    lang: "ts",
                    nodeBin: "devicescript",
                    args: ["--no-colors", "--quiet", "--ignore-missing-config"],
                    npmPackage: "@devicescript/cli",
                    excludedFiles: ["**/api/clients/*.md"],
                    prefix: 'import * as ds from "@devicescript/core"',
                },
                {
                    lang: "rx",
                    nodeBin: "swirly",
                    npmPackage: "swirly",
                    extension: "txt",
                    outputLang: null,
                    outputFiles: [{
                        "name": "output.svg"
                    }],
                    args: ["input.txt", "output.svg"]
                }
            ],
        },
    }
)

module.exports = config
