/// <reference types="emscripten" />
declare type ptr = number;
declare type int32 = number;
export declare type JacsModule = EmscriptenModule & typeof Exts & {
    _jd_em_set_device_id_2x_i32(id0: int32, id1: int32): void;
    _jd_em_set_device_id_string(str: ptr): void;
    _jd_em_init(): void;
    _jd_em_process(): void;
    _jd_em_frame_received(frame: ptr): int32;
    _jd_em_devs_deploy(img: ptr, size: int32): int32;
    _jd_em_devs_client_deploy(img: ptr, size: int32): int32;
    sendPacket(pkt: Uint8Array): void;
};
export declare module Exts {
    function handlePacket(pkt: Uint8Array): void;
    function setupNodeTcpSocketTransport(require: any, host: string, port: number): Promise<void>;
    function setupWebsocketTransport(url: string, proto?: string): Promise<void>;
    function b64ToBin(s: string): Uint8Array;
    function jacsDeploy(binary: Uint8Array): number;
    function jacsClientDeploy(binary: Uint8Array): number;
    function jacsInit(): void;
    function jacsStart(): void;
    function jacsStop(): void;
    function jacsSetDeviceId(id0: string | number, id1?: number): void;
}
declare function factory(): Promise<JacsModule>;
export = factory;
//# sourceMappingURL=wasmpre.d.ts.map