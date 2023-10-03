import React from "react"
import styles from "./styles.module.css"

export default function WokwiEditor(props: { projectId: string }) {
    const { projectId } = props
    const url = `https://wokwi.com/projects/${projectId}`
    return <iframe className={styles.editor} src={url} />
}
