export interface CmdOptions {
    verbose?: boolean
    noVerify?: boolean
}
export const GENDIR = ".devicescript"
export const LIBDIR = `${GENDIR}/lib`
export const BINDIR = `${GENDIR}/bin`
export const log = console.log
export const debug = console.debug
export const error = console.error
