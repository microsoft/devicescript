import useBaseUrl from "@docusaurus/useBaseUrl"
import React from "react"
import styles from "./styles.module.css"

export default function DeviceCard(props: {
    image: string
    href: string
    imageAlt?: string
    description: string
    title: string
}) {
    const { image, imageAlt, description, title, href } = props
    const bhref = useBaseUrl(href)
    return (
        <a href={bhref} className="avatar margin-vert--md">
            <img
                className={`avatar__photo-link avatar__photo avatar__photo--xl ${styles.device__photo}`}
                alt={imageAlt || `photograph of ${title}`}
                src={image}
                decoding="async"
            />
            <div className="avatar__intro">
                <div className="avatar__name">{title}</div>
                {description ? (
                    <small className="avatar__subtitle">{description}</small>
                ) : null}
            </div>
        </a>
    )
}
