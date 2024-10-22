// Inject Custom Components Menu registration into the Composable App configuration.
// import {withLegacyGetProps} from '@salesforce/pwa-kit-react-sdk/ssr/universal/components/with-legacy-get-props'
import AppConfig from '@salesforce/retail-react-app/app/components/_app-config/index.jsx'
import {register} from '@builder.io/sdk-react'

// Register Editor Menus for custom components with Builder to show in the Visual Editor.
// This can be run at the page level too, to register components for a specific page / view.
// Any Custom Components that are registed but not specifically referenced in a custom Insert Menu,
//  will all lump together in a single "Custom Components" menu.
register('insertMenu', {
    name: 'Salesforce Products Components',
    items: [{name: 'ProductBox'}, {name: 'ProductsGrid'}, {name: 'EinsteinProductsGrid'}]
})

register('insertMenu', {
    name: 'Blog',
    items: [{name: 'BlogCard'}]
})

// Note: Custom Components registration for Gen2 SDK is accomplished through passing an array of the Component Definitions to each <Content> component.
// See /builder/blocks/index.js for the customComponents array, and
// /app/pages/home/index.jsx for an example of passing the customComponents array to a <Content> component.
// import ivm from 'isolated-vm'

// function testIsolatedVM() {
//     const foo = new ivm.Isolate().createContextSync().evalSync('1 + 1')

//     console.log('testing isolated-vm execution: ', foo)
// }

// testIsolatedVM()

// AppConfig.getProps = async () => {
//     throw new Error('AppConfig.getProps not implemented')
//     if (typeof window === 'undefined') {
//         console.log('DEBUG: AppConfig.getProps')
//         const {initializeNodeRuntime} = await import('@builder.io/sdk-react/node/init')
//         initializeNodeRuntime()
//     }

//     return {}
// }
// console.log('DEBUG: AppConfig before initializeNodeRuntime import')
// import {initializeNodeRuntime} from '@builder.io/sdk-react/node/init'
// console.log('DEBUG: AppConfig after initializeNodeRuntime import')
// initializeNodeRuntime()
// console.log('DEBUG: AppConfig after initializeNodeRuntime call')

export default AppConfig
