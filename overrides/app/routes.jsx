/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import loadable from '@loadable/component'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

// Components
import {Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'
import {configureRoutes} from '@salesforce/retail-react-app/app/utils/routes-utils'
import {routes as _routes} from '@salesforce/retail-react-app/app/routes'

const fallback = <Skeleton height="75vh" width="100%" />

// Create your pages here and add them to the routes array
// Use loadable to split code into smaller js chunks
const Home = loadable(() => import('./pages/home'), {fallback})
const MarketingPages = loadable(() => import('./pages/marketing-pages'), {fallback})
const BlogPages = loadable(() => import('./pages/blog-pages'))
const ProductDetail = loadable(() => import('./pages/product-detail'), {fallback})
const ProductList = loadable(() => import('./pages/product-list'), {fallback})

const routes = [
    // Override the home page
    {
        path: '/',
        component: Home,
        exact: true
    },
    // Add a new route for blog pages
    {
        path: '/blog/**',
        component: BlogPages
    },
    // Override the product detail page
    {
        path: '/product/:productId',
        component: ProductDetail
    },
    {
        path: '/search',
        component: ProductList
    },
    {
        path: '/category/:categoryId',
        component: ProductList
    },
    // Add a catchall route for marketing pages that also handles 404's
    // Make sure your catchall route is the last route in the array
    {
        path: '*',
        component: MarketingPages
    }
]

const overridePaths = routes.map((route) => route.path)

// Insert the overridden routes before the template paths, but use our custom catchall route at the end
routes.splice(
    routes.length - 1,
    0,
    ..._routes.filter((route) => !overridePaths.includes(route.path))
)

export default () => {
    const config = getConfig()
    return configureRoutes(routes, config, {
        ignoredRoutes: ['/callback', '*']
    })
}
