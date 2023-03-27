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
            description: "Bytecode interpreter for low power / flash / memory.",
            link: "/devicescript/devices",
        },
        {
            title: "Hardware as Services",
            description:
                "Client/server architecture for sensors and actuators.",
            link: "/developer/defining-roles",
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
            title: "Development Gateway",
            description:
                "Prototype cloud service with device management, firmware deployment and message queues.",
            link: "/devicescript/developer/cloud",
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
