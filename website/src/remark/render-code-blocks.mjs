/**
 * Turns a "```lang" code block into a code block and an output area
 */

// TODO: factor into an independent plugin
import visit from "unist-util-visit"
import fs_extra_pkg from "fs-extra"
import { spawnSync } from "child_process"
const { readJsonSync, writeJsonSync, ensureDirSync } = fs_extra_pkg
import { createHash } from "crypto"

// site version
import sitePkg from "../../../package.json" assert { type: "json" }
// for version `x.y.z`, only recompute hashes if `x` changes
// to avoid recomputation over minor changes on the website
// (so we only recompute for every major release)
const VERSION = sitePkg.version.replace(/(\..)*$/g, "")

console.log(`rendering snippets ${VERSION}`)
// language configs
import getLangConfig from "../../language.config.js"
const languageConfig = await getLangConfig()

const SOLUTIONS_DIR = languageConfig.solutionsDir

function checkRuntimeError(
    lang,
    langVersion,
    input,
    output,
    hash,
    errRegex,
    skipErr
) {
    if (skipErr) {
        return output
    }

    const hasError = output.match(errRegex)
    if (hasError !== null) {
        throw new Error(
            `\n******************************************
${lang} (version ${langVersion}) Runtime Error

- Snippet: 
${input}

- Error Msg: 
${output}

- Hash: 
${hash}
******************************************\n`
        )
    }

    return ""
}

const memoryCache = {}

async function getOutput(config, input, lang, skipErr) {
    const {
        timeout,
        langVersion,
        processToExecute,
        moduleToExecute,
        statusCodes,
        cache,
    } = config
    const hashObj = createHash("sha1")

    // TODO: add rise4fun engine version to the hash

    const hash = hashObj
        .update(VERSION)
        .update(input)
        .update(lang)
        .update(langVersion)
        .update(String(timeout))
        .digest("hex")
    const dir = `${SOLUTIONS_DIR}/${lang}/${langVersion}/${hash}`
    ensureDirSync(dir)
    const pathIn = `${dir}/input.json`
    const pathOut = `${dir}/output.json`
    // console.log(hash);

    // TODO: error handling for z3-js etc?
    const errRegex = /(\(error)|(unsupported)|([eE]rror:)/
    const data =
        memoryCache[pathOut] ||
        (cache && readJsonSync(pathOut, { throws: false })) // don't throw an error if file not exist
    if (data) {
        console.log(`cache hit ${hash}`)
        const errorToReport = checkRuntimeError(
            lang,
            langVersion,
            input,
            data.output,
            hash,
            errRegex,
            skipErr
        ) // if this call fails an error will be thrown
        if (errorToReport !== "") {
            // we had erroneous code with ignore-error / no-build meta
            data.error = errorToReport
            data.status = statusCodes.runtimeError
            memoryCache[pathOut] = data
            if (cache) writeJsonSync(pathOut, data) // update old cache
        }
        return data
    }

    let output = ""
    let error = ""
    let status = "success" // default to be success

    const inputObj = { input: input }
    writeJsonSync(pathIn, inputObj)

    try {
        if (processToExecute) {
            const result = spawnSync("node", [processToExecute, pathIn], {
                timeout: timeout,
            })
            output = result.stdout.length > 0 ? result.stdout.toString() : ""
            error = result.stderr.length > 0 ? result.stderr.toString() : ""
        } else if (moduleToExecute) {
            const run = require(moduleToExecute)
            const result = await run({ input, config })
            error = result.error
            output = result.output
        }
        status = error === "" ? statusCodes.success : statusCodes.runError
    } catch (e) {
        error = `${lang} timed out after ${timeout}ms.`
        output = ""
        status = statusCodes.timeout
    }

    if (status === statusCodes.runError && !skipErr) {
        throw new Error(
            `${lang} runtime error: ${hash}, ${status}, ${input}, ${error}`
        )
    }

    console.debug(`${lang}: ${hash}, ${status}, ${error}`)

    const errorToReport = checkRuntimeError(
        langVersion,
        input,
        output,
        hash,
        errRegex,
        skipErr
    ) // if this call fails an error will be thrown

    if (errorToReport !== "") {
        // we had erroneous code with ignore-error / no-build meta
        error = errorToReport
        status = statusCodes.runtimeError
    }

    const result = {
        output: output,
        error: error,
        status: status,
        hash: hash,
    }

    // write to file
    memoryCache[pathOut] = result
    if (cache) writeJsonSync(pathOut, result)

    return result
}

export default function plugin() {
    // console.log({ options });
    const transformer = async ast => {
        ensureDirSync(SOLUTIONS_DIR)

        const promises = []

        /** @type {import("unified").Transformer} */
        visit(ast, "root", node => {
            node.children.unshift({
                type: "import",
                value: "import CustomCodeBlock from '@site/src/components/TutorialComponents'",
            })
        })

        visit(ast, "code", (node, index, parent) => {
            const { value, lang, meta } = node
            const langConfig = languageConfig.languages.find(
                l => l.label === lang
            )
            if (!langConfig) return

            const skipRegex = /(no-build)|(ignore-errors)/
            const skipErr = skipRegex.test(meta)
            const editableRegex = /(always-editable)/
            const alwaysEditable = editableRegex.test(meta)
            const lineNumRegex = /(show-line-numbers)/i

            const label = langConfig.label
            const highlight = langConfig.highlight

            // line numbers can be shown for all blocks through `language.config.js`,
            // or for a specific block through `show-line-numbers`
            // e.g. ```z3 show-line-numbers
            const showLineNumbers =
                langConfig.showLineNumbers || lineNumRegex.test(meta)
            if (!langConfig.buildConfig) {
                // there is no runtime configured,
                // so just add the syntax highlighting and github discussion button (if configured)

                let code = value
                let result = {}

                const val = JSON.stringify({
                    lang: lang,
                    highlight: highlight,
                    statusCodes: langConfig.statusCodes ?? {},
                    code,
                    result: result,
                    editable: true,
                    readonly: langConfig.readonly ?? true,
                    showLineNumbers: showLineNumbers,
                })
                parent.children.splice(index, 1, {
                    type: "jsx",
                    value: `<CustomCodeBlock input={${val}} />`,
                })
                return
            }

            promises.push(async () => {
                // console.log(`num promises: ${promises.length}; `);
                const buildConfig = langConfig.buildConfig
                const result = await getOutput(
                    buildConfig,
                    value,
                    lang,
                    skipErr
                )

                // console.log({ node, index, parent });

                const val = JSON.stringify({
                    lang: lang,
                    highlight: highlight,
                    statusCodes: buildConfig.statusCodes,
                    code: value,
                    result: result,
                    editable: alwaysEditable,
                    readonly: false,
                    showLineNumbers: showLineNumbers,
                    langVersion: buildConfig.langVersion,
                    tool: buildConfig.npmPackage,
                })
                parent.children.splice(index, 1, {
                    type: "jsx",
                    // TODO: encode the source into jsx tree to avoid XSS?
                    // TODO: create a generic <CodeBlock and pass lang={lang} />
                    // TODO: pass syntax highlighting to CodeBlock
                    value: `<CustomCodeBlock input={${val}} />`,
                })
            })
        })

        for (const p of promises) {
            // need to run sync according to Kevin
            await p()
            // console.log(`num promises: ${promises.length}`);
        }
    }
    return transformer
}
