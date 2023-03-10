# Test Manager

    identifier: 0x1b217f80
    tags: test

A Test Manager.

## Commands

    command register_test @ 0x80 {
        path: string0
        name: string
    }

Registers a test with the manager

    command report_test_result @ 0x81 {
        path: string0
        error: string
    }

Reports a test result to the test manager.

## Events

    event run_test @ 0x80 {
        path: string
    }

The test manager is requesting to run a particular test.

    event run_all_tests @ 0x81

The test manager is requesting to run all tests.

    event discover_tests @ 0x82

The test manager is requesting to declare all tests
