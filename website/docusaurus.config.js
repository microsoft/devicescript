// @ts-nocheck
const { configure } = require("@rise4fun/docusaurus-plugin-rise4fun")

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/vsDark")

const lightTheme = {
    ...lightCodeTheme,
    styles: [
        ...lightCodeTheme.styles,
        {
            types: ["title"],
            style: {
                color: "#0550AE",
                fontWeight: "bold",
            },
        },
        {
            types: ["parameter"],
            style: {
                color: "#953800",
            },
        },
        {
            types: [
                "boolean",
                "rule",
                "color",
                "number",
                "constant",
                "property",
            ],
            style: {
                color: "#005CC5",
            },
        },
        {
            types: ["atrule", "tag"],
            style: {
                color: "#22863A",
            },
        },
        {
            types: ["script"],
            style: {
                color: "#24292E",
            },
        },
        {
            types: ["operator", "unit", "rule"],
            style: {
                color: "#D73A49",
            },
        },
        {
            types: ["font-matter", "string", "attr-value"],
            style: {
                color: "#C6105F",
            },
        },
        {
            types: ["class-name"],
            style: {
                color: "#116329",
            },
        },
        {
            types: ["attr-name"],
            style: {
                color: "#0550AE",
            },
        },
        {
            types: ["keyword"],
            style: {
                color: "#CF222E",
            },
        },
        {
            types: ["function"],
            style: {
                color: "#8250DF",
            },
        },
        {
            types: ["selector"],
            style: {
                color: "#6F42C1",
            },
        },
        {
            types: ["variable"],
            style: {
                color: "#E36209",
            },
        },
        {
            types: ["comment"],
            style: {
                color: "#6B6B6B",
            },
        },
    ],
}

const darkTheme = {
    plain: {
        color: "#D4D4D4",
        backgroundColor: "#212121",
    },
    styles: [
        ...darkCodeTheme.styles,
        {
            types: ["title"],
            style: {
                color: "#569CD6",
                fontWeight: "bold",
            },
        },
        {
            types: ["property", "parameter"],
            style: {
                color: "#9CDCFE",
            },
        },
        {
            types: ["script"],
            style: {
                color: "#D4D4D4",
            },
        },
        {
            types: ["boolean", "arrow", "atrule", "tag"],
            style: {
                color: "#569CD6",
            },
        },
        {
            types: ["number", "color", "unit"],
            style: {
                color: "#B5CEA8",
            },
        },
        {
            types: ["font-matter"],
            style: {
                color: "#CE9178",
            },
        },
        {
            types: ["keyword", "rule"],
            style: {
                color: "#C586C0",
            },
        },
        {
            types: ["regex"],
            style: {
                color: "#D16969",
            },
        },
        {
            types: ["maybe-class-name"],
            style: {
                color: "#4EC9B0",
            },
        },
        {
            types: ["constant"],
            style: {
                color: "#4FC1FF",
            },
        },
    ],
}

const config = configure(
    {
        title: "DeviceScript",
        tagline: "TypeScript for Tiny IoT Devices",
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
                announcementBar: {
                    id: "support_us",
                    content:
                        'Experimental Project from Microsoft Research - Join the <a href="https://github.com/microsoft/devicescript/discussions">discussions</a> to provide feedback.',
                    backgroundColor: "#fafbfc",
                    textColor: "#091E42",
                    isCloseable: true,
                },
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
                            docId: "getting-started/index",
                            position: "left",
                            label: "Download",
                        },
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
                            title: "Info",
                            items: [
                                {
                                    label: "GitHub",
                                    href: "https://github.com/microsoft/devicescript/",
                                },
                                {
                                    label: "Discussions",
                                    href: "https://github.com/microsoft/devicescript/discussions",
                                },
                                {
                                    label: "Consumer Health Privacy",
                                    href:"https://go.microsoft.com/fwlink/?linkid=2259814"
                                }
                            ],
                        },
                    ],
                },
                prism: {
                    theme: lightTheme,
                    darkTheme: darkTheme,
                },
            }),
    },
    {
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
                                    setup: "devicescript build", // generates node_modules/@devicescript/* files
                                    postinstall: "devicescript build",
                                    "build:devicescript": "devicescript build",
                                    build: "yarn build:devicescript",
                                    "watch:devicescript": `devicescript devtools`,
                                    watch: "yarn watch:devicescript",
                                    "test:devicescript":
                                        "devicescript run src/main.ts --test --test-self-exit",
                                    test: "yarn test:devicescript",
                                    start: "yarn watch",
                                },
                            },
                        },
                        "sandbox.config.json": {
                            content: {
                                template: "node",
                                view: "terminal",
                                container: {
                                    node: "18",
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
                    lang: "rx",
                    nodeBin: "swirly",
                    npmPackage: "swirly",
                    extension: "txt",
                    inputLang: null,
                    outputLang: null,
                    outputFiles: [
                        {
                            name: "output.svg",
                        },
                    ],
                    args: ["input.txt", "output.svg"],
                },
            ],
        },
    }
)

module.exports = config
