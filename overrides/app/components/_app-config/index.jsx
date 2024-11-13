// Inject Custom Components Menu registration into the Composable App configuration.
import AppConfig from '@salesforce/retail-react-app/app/components/_app-config/index.jsx'
import {register} from '@builder.io/sdk-react'

// Register Editor Menus for custom components with Builder to show in the Visual Editor.
// This can be run at the page level too, to register components for a specific page / view.
// Any Custom Components that are registed but not specifically referenced in a custom Insert Menu,
//  will all lump together in a single "Custom Components" menu.
register('insertMenu', {
    name: 'Salesforce Products Components',
    items: [
        {name: 'ProductBox'},
        {name: 'ProductsGrid'},
        {name: 'ProductsScroller'},
        {name: 'EinsteinProductsGrid'}
    ]
})

register('insertMenu', {
    name: 'Blog',
    items: [{name: 'BlogCard'}]
})

// Note: Custom Components registration for Gen2 SDK is accomplished through passing an array of the Component Definitions to each <Content> component.
// See /builder/blocks/index.js for the customComponents array, and
// /app/pages/home/index.jsx for an example of passing the customComponents array to a <Content> component.

// You can also register Design Tokens with Builder to use in the Visual Editor.
register('editor.settings', {
    // StrictMode: If no design tokens are set for a given area, hide that section's input
    // see https://www.builder.io/c/docs/design-tokens#strict-mode
    // styleStrictMode: true,
    // Make your design tokens optional, still allowing for free-form input
    // see https://www.builder.io/c/docs/design-tokens#making-design-tokens-optional
    // designTokensOptional: true,
    // Let users still use the built-in
    // see https://www.builder.io/c/docs/design-tokens#allowing-custom-values-with-allow-overriding-tokens
    // allowOverridingTokens: true,
})

export default AppConfig
