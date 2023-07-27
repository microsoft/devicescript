import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

type FeatureItem = {
    title: string
    Svg?: React.ComponentType<React.ComponentProps<"svg">>
    description: string
    link?: string
}

function Feature({ title, Svg, description, link }: FeatureItem) {
    return (
        <div className={clsx("col col--4")}>
            {Svg && (
                <div className="text--center">
                    <Svg className={styles.featureSvg} role="img" />
                </div>
            )}
            <div className="text--center padding-horiz--md">
                <h3>{link ? <a href={link}>{title}</a> : title}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default function HomepageFeatures(): JSX.Element {
    const features: FeatureItem[] = [
        {
            title: "TypeScript for IoT",
            description:
                "The familiar syntax and tooling, all at your fingertips.",
            link: "/devicescript/language",
        },
        {
            title: "Small Runtime",
            description: "Bytecode interpreter for low power/flash/memory.",
            link: "/devicescript/devices",
        },
        {
            title: "Debugging",
            description:
                "In Visual Studio Code, for embedded hardware or simulated devices.",
            link: "/devicescript/getting-started/vscode/debugging",
        },
        {
            title: "Simulation and Testing",
            description:
                "Develop and test your firmware using hardware/mock sensors. CI friendly.",
            link: "/devicescript/developer/simulation",
        },
        {
            title: "Local and Remote Workspace",
            description:
                "Develop your firmware from your local machine or a remote container",
        },
        {
            title: "TypeScript Drivers",
            description:
                "Write drivers in TypeScript using I2C, SPI, ... without having to go down to C (limitations apply :) )",
            link: "/devicescript/developer/drivers",
        },
        {
            title: "ESP32, RP2040, ...",
            description:
                "Supported on popular microcontrollers. Portable to more...",
            link: "/devicescript/devices",
        },
        {
            title: "Networking",
            description: "fetch, TCP, TLS, HTTP/S, MQTT, ...",
            link: "/devicescript/developer/net",
        },
        {
            title: "Package Ecosystem",
            description:
                "Leverage npm, yarn or pnpm to distribute and consume DeviceScript packages.",
            link: "/devicescript/developer/packages",
        },
    ]

    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {features.map(props => (
                        <Feature key={props.title} {...props} />
                    ))}
                </div>
            </div>
        </section>
    )
}
