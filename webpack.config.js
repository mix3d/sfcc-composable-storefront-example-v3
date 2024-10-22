/* eslint-disable @typescript-eslint/no-var-requires */
// Require is required for this file, hence the eslint-disable comment
const config = require('@salesforce/pwa-kit-dev/configs/webpack/config')
const {SSR, SERVER} = require('@salesforce/pwa-kit-dev/configs/webpack/config-names')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

config.forEach((c) => {
    // Add a new alias to the webpack config for easy imports in your project
    // eg: import '~/app/constants' vs import '../../../app/constants'
    c.resolve = {
        ...c.resolve,
        alias: {
            ...c?.resolve?.alias,
            '~': path.resolve(__dirname, './overrides')
        }
    }

    // add a CSS loader to handle CSS file imports directly
    // Not required for Builder integration, but useful for most projects
    c.module.rules.push({
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
    })

    c.plugins.push(new MiniCssExtractPlugin({filename: '[name].css'}))

    // Server-only config changes here
    // if (c.name === SERVER || c.name === SSR) {
    //     // add node-loader plugin so Builder's isolated-vm module will be included in server-side bundle:
    //     c.resolve.extensions.push('.node')

    //     // here we list acceptable file names because `.node` files are binaries
    //     // and we want to be really selective about which we'll import using this loader.
    //     c.module.rules.push({
    //         test: /(isolated_vm)\.node$/,
    //         loader: 'node-loader'
    //     })
    // }
})

module.exports = config
