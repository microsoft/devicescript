import { jdpack, JDServiceServer, Packet } from "jacdac-ts"
import {
    SRV_TEST_MANAGER,
    TestManagerCmd,
    TestManagerCmdPack,
    TestManagerEvent,
    TestManagerEventPack,
} from "../.devicescript/ts/constants"

export const DISCOVER_TEST = "discoverTest"
export const REPORT_TEST_RESULT = "reportTestResult"

/**
 * Implements a test manager server in TS. To be used by vscode to interface with hardware.
 */
export class TestManagerServer extends JDServiceServer {
    static SERVICE_CLASS = SRV_TEST_MANAGER

    constructor() {
        super(SRV_TEST_MANAGER)

        this.addCommand(
            TestManagerCmd.RegisterTest,
            this.handleRegisterTest.bind(this)
        )
        this.addCommand(
            TestManagerCmd.ReportTestResult,
            this.handleReportTestResult.bind(this)
        )
    }

    private handleRegisterTest(pkt: Packet) {
        const [path, name] = pkt.jdunpack(TestManagerCmdPack.RegisterTest)
        this.emit(DISCOVER_TEST, { path, name })
    }

    private handleReportTestResult(pkt: Packet) {
        const [path, error] = pkt.jdunpack(TestManagerCmdPack.ReportTestResult)
        this.emit(REPORT_TEST_RESULT, { path, error })
    }

    /**
     * Instructs all test runners to run tests
     */
    async startRunAllTests() {
        await this.sendEvent(TestManagerEvent.RunAllTests)
    }

    /**
     * Run a single test
     */
    async startRunTest(path: string) {
        await this.sendEvent(
            TestManagerEvent.RunTest,
            jdpack(TestManagerEventPack.RunTest, [path])
        )
    }

    /**
     * Registers a handler for test discovery
     * @param handler
     */
    subscribeDiscoverTest(
        handler: (info: { name: string; path: string }) => void
    ) {
        return this.subscribe(DISCOVER_TEST, handler)
    }

    /**
     * Registers a handler for test discovery
     * @param handler
     */
    subscribeReportTestResult(
        handler: (info: { path: string; error: string }) => void
    ) {
        return this.subscribe(REPORT_TEST_RESULT, handler)
    }
}
