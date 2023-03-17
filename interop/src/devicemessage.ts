export interface SideDeviceMessage {
    type: string
    deviceId?: string
}

export interface SideUploadJsonFromDevice extends SideDeviceMessage {
    type: "uploadJson"
    topic: string
    value: any
}

export interface SideUploadBinFromDevice extends SideDeviceMessage {
    type: "uploadBin"
    topic: string
    payload64: string
}

export interface SideWarningFromDevice extends SideDeviceMessage {
    type: "warning"
    message: string
}

export interface SideExceptionFromDevice extends SideDeviceMessage {
    type: "exception"
    name: string
    message: string
    stack?: string
    logs?: string
}

export interface SideLogsFromDevice extends SideDeviceMessage {
    type: "logs"
    logs: string[]
}

export type SideFromDeviceMessage =
    | SideUploadJsonFromDevice
    | SideUploadBinFromDevice
    | SideUploadJsonFromDevice
    | SideWarningFromDevice
    | SideExceptionFromDevice
    | SideLogsFromDevice
