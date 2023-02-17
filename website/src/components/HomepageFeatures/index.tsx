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
            title: "TypeScript Goodness",
            description:
                "The familiar syntax, the tooling, the language, all at your fingertips for your project.",
        },
        {
            title: "Portable",
            description: "Port the DeviceScript VM to your microcontroller.",
        },
        {
            title: "Hardware as Services",
            description: "Write reusable application/firmware on top of abstract hardware services.",
        },
        {
            title: "Small",
            description:
                "Designed for low power, low flash, low memory embedded projects.",
        },
        {
            title: "Simulation & Tracing",
            description:
                "Develop and test your firmware using simulated or real sensors.",
        },
        {
            title: "Debugging",
            description:
                "Full debugging experience in Visual Studio Code, for hardware or simulated devices.",
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
