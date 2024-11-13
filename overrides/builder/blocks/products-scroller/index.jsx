import React from 'react'
import loadable from '@loadable/component'
import {Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'

const fallback = <Skeleton height="75vh" width="100%" />
const ProductsScroller = loadable(() => import('./products-scroller'), {fallback})

export const ProductsScrollerDefinition = {
    component: ProductsScroller,
    name: 'ProductsScroller',
    image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/list.svg',
    inputs: [
        {
            name: 'productIds',
            friendlyName: 'Products',
            type: 'SFCommerceProductsList',
            required: true
        },
        {
            name: 'title',
            type: 'string'
        }
    ]
}
