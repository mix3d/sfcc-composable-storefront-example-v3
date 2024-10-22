/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use strict'

import path from 'path'
import {getRuntime} from '@salesforce/pwa-kit-runtime/ssr/server/express'
// TODO: fix the jsconfig to prevent this warning
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {defaultPwaKitSecurityHeaders} from '@salesforce/pwa-kit-runtime/utils/middleware'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import helmet from 'helmet'

import {initializeNodeRuntime} from '@builder.io/sdk-react/node/init'
/*
  THIS IS THE ERROR HERE, EVEN THOUGH THERE IS THE NODE FILE IN THE BUNDLE:
  'errorType': 'UnhandledPromiseRejection', 'errorMessage': 'Error: node-loader:\nError: /var/task/build/5dd78dd2dd30c4c9c75e0f991ffec557.node: cannot open shared object file: No such file or directory'

  I have also tried this specifically in the app.get(*) route definition below
*/
// if (typeof window === 'undefined') {im

const options = {
    // The build directory (an absolute path)
    buildDir: path.resolve(process.cwd(), 'build'),

    // The cache time for SSR'd pages (defaults to 600 seconds)
    defaultCacheTimeSeconds: 600,

    // The contents of the config file for the current environment
    mobify: getConfig(),

    // The port that the local dev server listens on
    port: 3000,

    // The protocol on which the development Express app listens.
    // Note that http://localhost is treated as a secure context for development,
    // except by Safari.
    protocol: 'http'
}

const runtime = getRuntime()

const {handler} = runtime.createHandler(options, (app) => {
    // Set default HTTP security headers required by PWA Kit
    app.use(defaultPwaKitSecurityHeaders)
    app.use(builderMiddleware)
    // Set custom HTTP security headers
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'img-src': [
                        // Default source for product images - replace with your CDN
                        '*.commercecloud.salesforce.com',
                        'via.placeholder.com',
                        // Builder CDN support
                        'data:',
                        '*.builder.io',
                        'builder.io'
                    ],
                    'media-src': [
                        // Local/static Media assets
                        "'self'",
                        // Builder Media asset support
                        '*.builder.io'
                    ],
                    'script-src': [
                        // Used by the service worker in /worker/main.js
                        'storage.googleapis.com',
                        // Builder requires unsafe-eval and unsafe-inline to run custom code defined in the CMS
                        "'self'",
                        "'unsafe-eval'",
                        "'unsafe-inline'",
                        '*.builder.io'
                    ],
                    'connect-src': [
                        // Connect to Einstein APIs
                        'api.cquotient.com',
                        // Connect to Builder APIs
                        '*.builder.io',
                        'builder.io'
                    ],
                    'frame-ancestors': [
                        // Allow iframes from Builder.io for the Visual Editor's iframe preview
                        '*.builder.io',
                        'builder.io',
                        'localhost'
                    ]
                }
            }
        })
    )

    // Handle the redirect from SLAS as to avoid error
    app.get('/callback?*', (req, res) => {
        // This endpoint does nothing and is not expected to change
        // Thus we cache it for a year to maximize performance
        res.set('Cache-Control', `max-age=31536000`)
        res.send()
    })
    app.get('/robots.txt', runtime.serveStaticFile('static/robots.txt'))
    app.get('/favicon.ico', runtime.serveStaticFile('static/ico/favicon.ico'))

    app.get('/worker.js(.map)?', runtime.serveServiceWorker)
    app.get('*', (...args) => {
        // initializeNodeRuntime()
        runtime.render(...args)
    })
})

// SSR requires that we export a single handler function called 'get', that
// supports AWS use of the server that we created above.
export const get = handler

function builderMiddleware(req, res, next) {
    console.log('DEBUG: builderMiddleware before initializeNodeRuntime')
    initializeNodeRuntime()
    console.log('DEBUG: builderMiddleware after initializeNodeRuntime')

    next()
}
