export interface FetchOptions {
    method:
        | "GET"
        | "HEAD"
        | "POST"
        | "PUT"
        | "DELETE"
        | "OPTIONS"
        | "PATCH"
        | string
    headers: Record<string, string>
    body: string | Buffer
}

export class Headers {}
export class Response {
    status: number
    statusText: string
    headers: Headers
}

export async function fetch(url: string, options?: FetchOptions) {
    const { method = "GET", headers = {}, body = "" } = options || {}
    url.slice
    let req = `${method}`
}
