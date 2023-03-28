import { unparse } from "papaparse"

export function JSONtoCSV(data: any[]) {
    // collect headers
    const cs: any = {}
    data.forEach(d =>
        Object.keys(d).forEach(k => {
            cs[k] = 1
        })
    )
    const columns = Object.keys(cs)

    return unparse(data, {
        quotes: false, //or array of booleans
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ",",
        header: true,
        newline: "\n",
        skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        columns,
    })
}
