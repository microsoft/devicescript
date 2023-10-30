function mymain(m) {
    m.setupWebsocketTransport("ws://localhost:8081").then(
        () => {
            m.devsSetDeviceId("1989f4eee0ebe206")
            m.devsStart()
            fetch("built/bytecode.devs").then(r => {
                if (r.status == 200)
                    r.arrayBuffer().then(v => m.devsDeploy(new Uint8Array(v)))
                else
                    console.log(
                        "you can copy or symlink built/bytecode.devs to devicescript-vm/built/bytecode.devs to pre-load it here"
                    )
            })
        },
        err => {
            console.log(
                "failed to connect to devtools; please run 'jacdac devtools' in console"
            )
        }
    )
}
Module().then(mymain)
