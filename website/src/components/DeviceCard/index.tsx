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
        <div className="avatar">
            <a
                className={`avatar__photo-link avatar__photo avatar__photo--xl ${styles.device__photo}`}
                href={bhref}
            >
                <img alt={imageAlt || `photograph of ${title}`} src={image} />
            </a>
            <div className="avatar__intro">
                <div className="avatar__name">{title}</div>
                {description && (
                    <small className="avatar__subtitle">{description}</small>
                )}
            </div>
        </div>
    )
}
