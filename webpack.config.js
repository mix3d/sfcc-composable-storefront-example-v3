/* eslint-disable @typescript-eslint/no-var-requires */
// Require is required for this file, hence the eslint-disable comment
const config = require('@salesforce/pwa-kit-dev/configs/webpack/config')
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
})

module.exports = config
