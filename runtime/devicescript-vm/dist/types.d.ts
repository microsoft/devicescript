/// <reference types="emscripten" />
declare type ptr = number;
declare type int32 = number;
export declare type DevsModule = EmscriptenModule & typeof Exts & {
    _jd_em_set_device_id_2x_i32(id0: int32, id1: int32): void;
    _jd_em_set_device_id_string(str: ptr): void;
    _jd_em_init(): void;
    _jd_em_process(): void;
    _jd_em_frame_received(frame: ptr): int32;
    _jd_em_devs_deploy(img: ptr, size: int32): int32;
    _jd_em_devs_verify(img: ptr, size: int32): int32;
    _jd_em_devs_client_deploy(img: ptr, size: int32): int32;
    sendPacket(pkt: Uint8Array): void;
    /**
     * Overridable method called when deployment is done.
     * @param code error code, 0 is success.
     */
    deployHandler(code: int32): void;
    /**
     * Overridable method called when a panic code is raised.
     * @param exitCode the panic code
     */
    panicHandler(exitCode: int32): void;
};
export declare module Exts {
    /**
     * Debug output and stack traces are sent here.
     */
    let dmesg: (s: string) => void;
    /**
     * Logging function
     */
    let log: (...data: any[]) => void;
    /**
     * Error logging function
     */
    let error: (...data: any[]) => void;
    /**
     * Callback to invoke when a packet needs to be handled by the virtual machine
     * TODO: frame or packet?
     * @param pkt a Jacdac frame
     */
    function handlePacket(pkt: Uint8Array): void;
    interface TransportResult {
        /**
         * Callback to close the transport
         */
        close: () => void;
    }
    /**
     * Starts a packet transport over a TCP socket in a node.js application
     * @param require module resolution function, requires "net" package
     * @param host socket url host
     * @param port socket port
     */
    function setupNodeTcpSocketTransport(require: (moduleName: string) => any, host: string, port: number): Promise<TransportResult>;
    /**
     * Starts a packet transport over a WebSocket using arraybuffer binary type.
     * @param url socket url
     * @param port socket port
     */
    function setupWebsocketTransport(url: string | URL, protocols?: string | string[]): Promise<TransportResult>;
    /**
     * Utility that converts a base64-encoded buffer into a Uint8Array
     * TODO: nobody is using this?
     * @param s
     * @returns
     */
    function b64ToBin(s: string): Uint8Array;
    /**
     * Deploys a DeviceScript bytecode to the virtual machine
     * @param binary
     * @returns error code, 0 if deployment is successful
     */
    function devsDeploy(binary: Uint8Array): number;
    /**
     * Verifies the format and version of the bytecode
     * @param binary DeviceScript bytecode
     * @returns error code, 0 if verification is successful
     */
    function devsVerify(binary: Uint8Array): number;
    /**
     * Deploys to the first virtual machine on Jacdac stack (experimental)
     * @internal
     * @alpha
     * @param binary
     * @returns error code, 0 if deployment is successful
     */
    function devsClientDeploy(binary: Uint8Array): number;
    /**
     * Initialises the virtual machine data structure.
     */
    function devsInit(): void;
    /**
     * Initializes and start the virtual machine (calls init).
     */
    function devsStart(): void;
    /**
     * Stops the virtual machine
     */
    function devsStop(): void;
    /**
     * Indicates if the virtual machine is running
     * @returns true if the virtual machine is started.
     */
    function devsIsRunning(): boolean;
    /**
     * Specifies the virtual machine device id.
     * @remarks
     *
     * Must be called before `devsStart`.
     *
     * @param id0 a hex-encoded device id string or the first 32bit of the device id
     * @param id1 the second 32 bits of the device id, undefined if id0 is a string
     */
    function devsSetDeviceId(id0: string | number, id1?: number): void;
}
declare function factory(): Promise<DevsModule>;
export default factory;
//# sourceMappingURL=wasmpre.d.ts.map