// can put base64-encoded bytecode here
var myprog = ""

function mymain(m) {
    m.setupWebsocketTransport("ws://localhost:8081")
    m.jacsSetDeviceId("1989f4eee0ebe206")
    m.jacsStart()
    if (myprog)
        m.jacsDeploy(m.b64ToBin(myprog))
}
Module().then(mymain)
