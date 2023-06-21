function invalidURL(url: string): never {
    throw new TypeError(`invalid url: '${url}'`)
}

function split2(str: string, ch: string): [string, string] {
    const idx = str.indexOf(ch)
    if (idx >= 0) {
        return [str.slice(0, idx), str.slice(idx + 1)]
    } else {
        return [str, ""]
    }
}

export class URL {
    protocol: string // 'https:',
    username = "" // 'user'
    password = "" // 'pass'
    hostname: string // 'sub.example.com'
    port: string // '8080'
    pathname: string // '/p/a/t/h'
    search = "" // '?query=string',
    hash = "" // '#hash'

    // 'sub.example.com:8080'
    host() {
        if (this.port) return this.hostname + ":" + this.port
        return this.hostname
    }

    // '/p/a/t/h?query=string',
    path() {
        return this.pathname + this.search
    }

    // 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash',
    href() {
        let cred = ""
        if (this.password) cred = `${this.username}:${this.password}@`
        else if (this.username) cred = `${this.username}@`
        return `${this.protocol}//${cred}${this.host()}${this.pathname}${
            this.search
        }${this.hash}`
    }

    constructor(input: string | URL) {
        if (typeof input !== "string") input = input.href()

        let url = input

        {
            const [schema, rest] = split2(input, ":")
            if (!rest) invalidURL(input)
            this.protocol = schema + ":"
            url = rest
        }

        {
            let ptr = 0
            while (url[ptr] === "/") ptr++
            url = url.slice(ptr)
        }

        {
            let slash = url.indexOf("/")
            let at = url.indexOf("@")
            if (at >= 0 && (slash < 0 || at < slash)) {
                const [user, pass] = split2(url.slice(0, at), ":")
                url = url.slice(at + 1)
                this.username = user
                this.password = pass
            }
        }

        const [host, afterHost] = split2(url, "/")

        const [hostname, port] = split2(host, ":")
        this.hostname = hostname
        this.port = port

        if (afterHost.includes("?")) {
            const [path, afterPath] = split2(afterHost, "?")
            this.pathname = "/" + path
            const [search, hash] = split2(afterPath, "#")
            if (search) this.search = "?" + search
            if (hash) this.hash = "#" + hash
        } else {
            const [path, hash] = split2(afterHost, "#")
            this.pathname = "/" + path
            if (hash) this.hash = "#" + hash
        }
    }
}
