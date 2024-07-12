// Inject Custom Components Menu registration into the Composable App configuration.
import AppConfig from '@salesforce/retail-react-app/app/components/_app-config/index.jsx'
import {register} from '@builder.io/sdk-react'

// Register Editor Menus for custom components with Builder to show in the Visual Editor.
// This can be run at the page level too, to register components for a specific page / view.
// If Custom Components are registed but not referenced in a custom Insert Menu,
//  then they will all lump together in a single "Custom Components" menu.
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

export default AppConfig
