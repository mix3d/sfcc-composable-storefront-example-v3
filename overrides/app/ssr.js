/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use strict'

import path from 'path'
import {getRuntime} from '@salesforce/pwa-kit-runtime/ssr/server/express'
import {defaultPwaKitSecurityHeaders} from '@salesforce/pwa-kit-runtime/utils/middleware'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import helmet from 'helmet'
// import cheerio from 'cheerio'

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
                        'data:',
                        '*.builder.io',
                        'builder.io'
                    ],
                    'script-src': [
                        // Used by the service worker in /worker/main.js
                        'storage.googleapis.com',
                        "'self'",
                        "'unsafe-eval'",
                        'storage.googleapis.com',
                        '*.builder.io',
                        // Builder requires unsafe-inline to run custom code defined in the CMS
                        "'unsafe-inline'"
                    ],
                    'connect-src': [
                        // Connect to Einstein APIs
                        'api.cquotient.com',
                        '*.builder.io',
                        'builder.io'
                    ],
                    'frame-ancestors': ['*.builder.io', 'builder.io', 'localhost']
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
    app.get('*', runtime.render)

    // temporarily removed, to confirm if still an issue with newer SDKs?
    // app.get('*', (req, res, next) => {
    //     const interceptedResponse = interceptMethodCalls(res, 'send', ([result]) => {
    //         const styles = extractABTestingStyles(result)
    //         return [result.replace('<body>', `<body><style>${styles}</style>`)]
    //     })
    //     return runtime.render(req, interceptedResponse, next)
    // })
})

/**
 * See this issue for more details https://github.com/emotion-js/emotion/issues/2040
 * Chakra using emotion which render styles inside template tags causing it not to apply when rendering
 * A/B test variations on the server, this fixes this issue by extracting those styles and appending them to body
 */
function extractABTestingStyles(body) {
    let globalStyles = ''

    if (body.includes('<template')) {
        const $ = cheerio.load(body)
        const templates = $('template')
        templates.toArray().forEach((element) => {
            const str = $(element).html()
            const styles = cheerio.load(String(str))('style')
            globalStyles += styles
                .toArray()
                .map((el) => $(el).html())
                .join(' ')
        })
    }
    return globalStyles
}

function interceptMethodCalls(obj, methodName, fn) {
    return new Proxy(obj, {
        get(target, prop) {
            // (A)
            if (prop === methodName) {
                return new Proxy(target[prop], {
                    apply: (target, thisArg, argumentsList) => {
                        // (B)
                        const result = fn(argumentsList)
                        return Reflect.apply(target, thisArg, result)
                    }
                })
            } else {
                return Reflect.get(target, prop)
            }
        }
    })
}

// SSR requires that we export a single handler function called 'get', that
// supports AWS use of the server that we created above.
export const get = handler
