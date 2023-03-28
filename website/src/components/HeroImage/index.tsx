import React from "react"
import styles from "./styles.module.css"
import hero from "../../../static/hero.png"
import boards from "../../../docs/devices/boards.json"

export default function HeroImage() {
    return (
        <div className={styles.grid}>
            <div>
                <img
                    className={styles.hero}
                    loading="lazy"
                    src={hero}
                    alt="screenshot of the visual studio integration"
                />
            </div>
            <div className={styles["mid-grid"]}>💖</div>
            <div className={styles["vertical-grid"]}>
                {Object.entries(boards)
                    .map(([id, { img, devName, url }]) => ({
                        id,
                        img,
                        devName,
                        url,
                    }))
                    .filter(({ img, url }) => !!img && !!url)
                    .map(({ id, img, devName }) => (
                        <img key={id} src={img} alt={devName} title={devName} />
                    ))}
            </div>
        </div>
    )
}
