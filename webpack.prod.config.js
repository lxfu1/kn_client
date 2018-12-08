// 上帝保佑,永无bug
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const workDir = path.resolve('.');

module.exports = webpackMerge(baseConfig, {
    // output: {
    //     publicPath: '/static/'
    // },
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
    module: {
        // 配置编译打包规则
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.scss/,
                exclude: path.resolve(__dirname, './src/static/scss/app.scss'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[local]__[hash:base64:6]'
                            }
                        },
                        'postcss-loader',
                        'fast-sass-loader'
                    ]
                })
            },
            {
                test: /\.scss/,
                include: path.resolve(__dirname, './src/static/scss/app.scss'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'fast-sass-loader']
                })
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
                    'file-loader?limit=1000&name=[md5:hash:base64:10].[ext]&outputPath=assets/images/',
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.json$/,
                use: ['json-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '信用中国-广东汕头', // 标题
            template: './src/index.html', // 模板文件
            filename: './index.html' // 产出后的文件名称
        }),
        new UglifyJsPlugin({
            output: {
                comments: false // remove all comments
            },
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: workDir
            },
            debug: false,
            minimize: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        /*
     * For react you can use this plugin for production. It reduces the size of the react lib to ~95kb (yes thats less than the prebuild minimized react.min.js in the bower package).
     * */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity,
            filename: 'js/[name].js'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].[chunkhash:8].css',
            allChunks: true
        })
    ]
});
