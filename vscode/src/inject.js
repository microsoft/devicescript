// replace console with a copy local to the bundle
const consoleObj = {
    ...console,
}
export { consoleObj as console }
