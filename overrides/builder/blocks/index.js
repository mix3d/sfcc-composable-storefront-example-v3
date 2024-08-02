import {BlogCardDefinition} from './blog-card'
import {EinsteinProductsGridDefinition} from './einstein-products-grid'
import {ProductDetailDefinition} from './product-detail'
import {ProductsGridDefinition} from './products-grid'
import {AccordionDefinition} from './accordion'
import {IconDefinition} from './icon-picker'

// This is the global registry for your custom components.
// Passing this array of component definitions to a Builder.io <Content> component surfaces them into the Visual Editor
// More Info: https://www.builder.io/c/docs/custom-components-setup (use Gen2 SDK)
// Note: You can create a subset of custom components for a specific model by passing only the specific definitions to the <Content> component instead
export const customComponents = [
    BlogCardDefinition,
    EinsteinProductsGridDefinition,
    ProductDetailDefinition,
    ProductsGridDefinition,
    AccordionDefinition,
    IconDefinition
]
