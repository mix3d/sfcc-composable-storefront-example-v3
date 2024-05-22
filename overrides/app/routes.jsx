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
const MarketingPages = loadable(() => import('./pages/marketing-pages'))
const BlogPages = loadable(() => import('./pages/blog-pages'))

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
    // copy the rest of the routes from the original app, minus the catchall route
    ..._routes.filter((route) => route.path !== '*'),
    // Add a catchall route for marketing pages that also handles 404's
    {
        path: '*',
        component: MarketingPages
    }
]

export default () => {
    const config = getConfig()
    return configureRoutes(routes, config, {
        ignoredRoutes: ['/callback', '*']
    })
}