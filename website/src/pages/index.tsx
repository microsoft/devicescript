import React, { CSSProperties } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import HomepageFeatures from "@site/src/components/HomepageFeatures"
import HeroImage from "@site/src/components/HeroImage"

import styles from "./index.module.css"
import StaticVideo from "../components/StaticVideo"

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext()
    const videoStyle: CSSProperties = {
        borderRadius: "0.5rem",
        marginTop: "2rem",
        maxHeight: "70vh",
        maxWidth: "70vw",
    }
    return (
        <header className={clsx("hero hero--primary", styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">
                    Device
                    <wbr />
                    Script
                </h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <div className={styles.buttons}>
                        <Link
                            className="button button--secondary button--lg"
                            to="/getting-started"
                        >
                            Getting Started - 5min ⏱️
                        </Link>
                    </div>
                </div>
                <div>
                    <StaticVideo name="blinky" style={videoStyle}/>
                </div>
            </div>
        </header>
    )
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext()
    return (
        <Layout title={siteConfig.title} description={siteConfig.tagline}>
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    )
}
