const config = require('@salesforce/pwa-kit-dev/configs/webpack/config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

config.forEach((c) => {
    c.resolve = {
        ...c.resolve,
        alias: {
            ...c?.resolve?.alias,
            '~': path.resolve(__dirname, './overrides')
        }
    }
    c.module.rules.push({
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
    })
    c.plugins.push(new MiniCssExtractPlugin({filename: '[name].css'}))
})

module.exports = config
