import ivm from 'isolated-vm'

export function testIsolatedVM() {
    const vm = new ivm.Isolate()
    const isolateContext = vm.createContextSync()
    const foo = isolateContext.evalSync('1 + 1')

    console.log('testing isolated-vm execution: ', foo)
}
