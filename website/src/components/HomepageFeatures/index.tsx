import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

type FeatureItem = {
    title: string
    Svg?: React.ComponentType<React.ComponentProps<"svg">>
    description: string
}

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx("col col--4")}>
            {Svg && (
                <div className="text--center">
                    <Svg className={styles.featureSvg} role="img" />
                </div>
            )}
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
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
        },
        {
            title: "Small Runtime",
            description: "Bytecode interpreter for low power / flash / memory.",
        },
        {
            title: "Hardware as Services",
            description: "Client/server architecture for sensors and actuators.",
        },
        {
            title: "Debugging",
            description:
                "In Visual Studio Code, for embedded hardware or simulated devices.",
        },
        {
            title: "Simulation and Testing",
            description:
                "Develop and test your firmware using hardware/mock sensors. CI friendly.",
        },
        {
            title: "Development Gateway",
            description: "Prototype cloud service with device management, firmware deployment and message queues."
        }
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
