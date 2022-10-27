function mymain(m) {
    m.setupWebsocketTransport("ws://localhost:8081")
    m.jacsSetDeviceId("1989f4eee0ebe206")
    m.jacsStart()
    fetch("built/prog.jacs")
        .then(r => {
            if (r.status == 200)
                r.arrayBuffer()
                    .then(v => m.jacsDeploy(new Uint8Array(v)))
            else
                console.log("you can copy or symlink built/prog.jacs to vm/built/prog.jacs to pre-load it here")
        })
}
Module().then(mymain)
