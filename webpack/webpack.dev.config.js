process.env.NODE_ENV = 'development';

const os = require('os');
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HappyPack = require('happypack');
const openBrowser = require('react-dev-utils/openBrowser');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const webpackConfig = require('./config');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// style files regexes
const sassRegex = /\.(scss|sass)$/;
const sassGlobalRegex = /\.global\.(scss|sass)$/;

const srcPath = path.resolve('./', 'src');

const pathAlias = {
    '@': srcPath
};

module.exports = {
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './src/index.jsx']
    },
    output: {
        pathinfo: true,
        publicPath: webpackConfig.publicPath,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].js',
        devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
    devServer: {
        hot: webpackConfig.hot,
        inline: true,
        disableHostCheck: true,
        historyApiFallback: true,
        port: webpackConfig.port,
        publicPath: webpackConfig.publicPath,
        contentBase: './',
        host: '0.0.0.0',
        overlay: false,
        public: 'http://localhost:' + webpackConfig.port,
        open: false,
        quiet: true,
        after: function(app, server) {
            if (openBrowser('http://localhost:' + webpackConfig.port)) {
                console.log('The browser tab has been opened!');
            }
        },
        proxy: {
            '/kn': {
                target: 'http://192.168.2.54:3000',
                changeOrigin: true
            }
        }
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        alias: pathAlias,
        modules: [srcPath, 'node_modules']
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['happypack/loader?id=happyBabel']
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: sassRegex,
                exclude: sassGlobalRegex,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 2,
                            localIdentName: '[name]__[local]___[hash:base64:6]'
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: sassGlobalRegex,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?t=[\s\S]+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'fonts/[name].[ext]',
                            limit: webpackConfig.imgLimit
                        }
                    }
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.(jpeg|jpg)$/, /\.png$/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'images/[name].[ext]',
                            limit: webpackConfig.imgLimit
                        }
                    }
                ]
            }
        ]
    },
    devtool: webpackConfig.devtool,
    optimization: {
        namedModules: true,
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    // 将第三方模块提取出来
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10, // 优先
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ErrorOverlayPlugin(),
        new CaseSensitivePathsPlugin(),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: ['启动成功: http://localhost:' + webpackConfig.port]
            }
        }),
        new HappyPack({
            id: 'happyBabel',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool
        }),
        new HtmlWebpackPlugin({
            title: webpackConfig.appTitle,
            template: './src/index.html',
            filename: './index.html',
            favicon: './src/static/images/favicon.ico'
        }),
        new InlineManifestWebpackPlugin('runtime'),
        new CopyWebpackPlugin([{ from: path.resolve('src/static/js'), to: 'thr' }])
    ]
};
