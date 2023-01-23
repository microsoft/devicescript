// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const { configure } = require("@rise4fun/docusaurus-plugin-rise4fun")

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

async function createConfig() {
    /** @type {import('@docusaurus/types').Config} */
    const config = configure(
        {
            title: "DeviceScript",
            tagline:
                "Portable, small footprint virtual machine for embedded devices with a hint of TypeScript.",
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
            sideEditor: {
                languages: {
                    ts: "devicescript",
                },
                editors: [
                    {
                        id: "devicescript",
                        type: "iframe",
                        lightUrl:
                            "https://microsoft.github.io/jacdac-docs/editors/devicescript/?devicescriptvm=1&embed=1&footer=0&light=1",
                        darkUrl:
                            "https://microsoft.github.io/jacdac-docs/editors/devicescript/?devicescriptvm=1&embed=1&footer=0&dark=1",
                        message: {
                            channel: "devicescript",
                            type: "source",
                            force: true,
                            startMissingSimulators: true,
                        },
                        messageTextFieldName: "source",
                        readyMessage: {
                            channel: "jacdac",
                        },
                    },
                ],
            },
        }
    )

    const renderCodeBlocks = (
        await import("./src/remark/render-code-blocks.mjs")
    ).default

    // add custom codeblocks to the default docs
    config.presets?.forEach(preset =>
        preset[1].docs.remarkPlugins?.push(renderCodeBlocks)
    )
    config.plugins?.forEach(plugin =>
        plugin[1]?.remarkPlugins?.push(renderCodeBlocks)
    )

    return config
}

module.exports = createConfig
