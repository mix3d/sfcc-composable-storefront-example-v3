import ivm from 'isolated-vm'

export function testIsolatedVM() {
    const foo = new ivm.Isolate().createContextSync().evalSync('1 + 1')

    console.log('testing isolated-vm execution: ', foo)
}
