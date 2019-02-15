// 上帝保佑,永无bug
const path = require('path');
const webpack = require('webpack');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

const workDir = path.resolve('.');

const local = false;

const knHost = 'http://192.168.2.54:3000';
// const knHost = 'http://192.168.2.54:80';

module.exports = webpackMerge(baseConfig, {
    entry: {
        bundle: ['babel-polyfill', path.resolve('src/index.jsx')],
        vendor: [
            'es5-shim',
            'console-polyfill',
            'es6-promise',
            'match-media',
            'react',
            'react-dom',
            'react-router-dom',
            'mobx',
            'mobx-react',
            'rodal'
        ]
    },
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        port: 12341, // 配置端口号
        host: '0.0.0.0',
        noInfo: false,
        contentBase: './', // 配置文件的根目录
        proxy: {
            '/kn': {
                target: knHost,
                changeOrigin: true
            }
        }
    },
    module: {
        // 配置编译打包规则
        rules: [
            /* {
             enforce: 'pre',
             test: /\.(js|jsx)$/,
             exclude: /node_modules/,
             loader: 'eslint-loader'
             }, */
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader', 'postcss-loader?sourceMap']
            },
            {
                test: /\.scss/,
                exclude: path.resolve(__dirname, './src/static/scss/app.scss'),
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:6]'
                        }
                    },
                    'postcss-loader?sourceMap',
                    'fast-sass-loader?sourceMap'
                ]
            },
            {
                test: /\.scss/,
                include: path.resolve(__dirname, './src/static/scss/app.scss'),
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader?sourceMap',
                    'fast-sass-loader?sourceMap'
                ]
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?t=[\s\S]+)?$/,
                use: [
                    'url-loader?limit=1000&name=[md5:hash:base64:10].[ext]&outputPath=assets/fonts/'
                ]
            },
            {
                test: /\.(jpg|png|gif|swf)$/,
                use: [
                    'file-loader?limit=1000&name=[md5:hash:base64:10].[ext]&outputPath=assets/images/'
                ]
            },
            {
                test: /\.json$/,
                use: ['json-loader']
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity,
            filename: '[name].js'
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: workDir
            },
            debug: true,
            minimize: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),

        new OpenBrowserWebpackPlugin({ url: 'http://localhost:12341' })
    ]
});
