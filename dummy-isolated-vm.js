const ivm = {
    Isolate: class {
        createContextSync() {
            return {
                evalSync: (code) => {
                    console.log('dummy isolated-vm evalSync')
                    // Simple eval implementation for the example
                    return eval(code)
                }
            }
        }
    }
}

module.exports = ivm
