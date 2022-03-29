import { JDDevice, Packet } from "jacdac-ts"

export interface JacsEnv {
    now(): number
    selfDevice: JDDevice
    roleManager: JacsRoleMgr

    setTimeout(handler: () => void, delay: number): any
    clearTimeout(handle: any): void
    devices(): JDDevice[]
    send(pkt: Packet): void

    onDisconnect: (dev: JDDevice) => void
    onConnect: (dev: JDDevice) => void
    onPacket: (pkt: Packet) => void
}

export interface JacsRole {
    name: string
    classIdenitifer: number
}

export interface JacsServiceDesc {
    device: JDDevice
    serviceIndex: number
}

export interface JacsRoleMgr {
    setRoles(roles: JacsRole[]): void
    getRole(name: string): JacsServiceDesc | undefined
    onAssignmentsChanged: () => void
}
