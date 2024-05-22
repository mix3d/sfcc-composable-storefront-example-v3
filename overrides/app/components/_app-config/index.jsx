// Inject custom components registration into the Composable App configuration.
import AppConfig from '@salesforce/retail-react-app/app/components/_app-config/index.jsx'
import {register} from '@builder.io/sdk-react'

// Register the custom components with Builder to show in the editor menu
register('insertMenu', {
    name: 'Salesforce Products Components',
    items: [{name: 'ProductBox'}, {name: 'ProductsGrid'}, {name: 'EinsteinProductsGrid'}]
})

register('insertMenu', {
    name: 'Blog',
    items: [{name: 'BlogCard'}]
})

export default AppConfig
