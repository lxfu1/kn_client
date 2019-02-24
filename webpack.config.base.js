const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sourcePath = path.resolve('src');

module.exports = {
    output: {
        path: path.resolve('./static'),
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            resource: path.resolve('./src/util/resource.js'),
            static: path.resolve('./src/static'),
            utils: path.resolve('./src/util/utils.js'),
            service: path.resolve('./src/service'),
            components: path.resolve('./src/components'),
            containers: path.resolve('./src/containers'),
            micro: path.resolve('./src/constants/storage'),
            loginStore: path.resolve('./src/store/LoginStore/index.jsx')
        },
        modules: [sourcePath, 'node_modules']
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: path.resolve('./src/static/images/favicon.ico'),
            template: './src/index.html', // 模板文件
            filename: './index.html', // 产出后的文件名称
            chunks: ['vendor', 'bundle']
        }),
        new CopyWebpackPlugin([
            { from: path.resolve('src/static'), to: 'static' }
        ])
    ]
};
