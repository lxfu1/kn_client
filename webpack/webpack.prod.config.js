process.env.NODE_ENV = 'production';

const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const webpackConfig = require('./config');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// style files regexes
const sassRegex = /\.(scss|sass)$/;
const sassGlobalRegex = /\.global\.(scss|sass)$/;

const srcPath = path.resolve('./', 'src');

const pathAlias = {
    '@': srcPath
};

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new CaseSensitivePathsPlugin(),
    new CleanWebpackPlugin({
        root: path.resolve('../static'),
        dry: false
    }),
    new HappyPack({
        id: 'happyBabel',
        loaders: ['babel-loader?cacheDirectory=true'],
        threadPool: happyThreadPool
    }),
    new MiniCssExtractPlugin({
        filename: 'assets/css/[name].[chunkhash].css',
        chunkFilename: 'assets/css/[name].[chunkhash].css'
    }),
    new HtmlWebpackPlugin({
        title: webpackConfig.appTitle,
        template: './src/index.html',
        filename: './index.html',
        favicon: './src/statics/favicon.ico',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }
    }),
    //new InlineManifestWebpackPlugin('runtime'),
    new CopyWebpackPlugin([{ from: path.resolve('src/static/js'), to: 'thr' }])
    new FriendlyErrorsWebpackPlugin()
];

if (webpackConfig.isAnalyzer) {
    plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
    stats: 'none',
    mode: 'production',
    entry: {
        main: ['@babel/polyfill', './src/index.jsx']
    },
    output: {
        path: path.resolve('./', webpackConfig.outDirName),
        publicPath: webpackConfig.publicPath,
        filename: 'assets/js/[name].[chunkhash].js',
        chunkFilename: 'assets/js/[name].[chunkhash].js',
        devtoolModuleFilenameTemplate: info =>
            path
                .relative(srcPath, info.absoluteResourcePath)
                .replace(/\\/g, '/')
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: pathAlias,
        modules: [srcPath, 'node_modules']
    },
    performance: {
        maxAssetSize: 1024 * 500, // 图片建议最大 500kb， 可到 https://tinypng.com 压缩图片
        assetFilter: function(assetFilename) {
            return /\.(jpg|png|gif)$/.test(assetFilename); // 这里只对照片做大小检查，只是警告不影响打包
        }
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
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: webpackConfig.publicPath
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: false
                        }
                    },
                    'postcss-loader'
                ],
                // Don't consider CSS imports dead code even if the
                // containing package claims to have no side effects.
                // Remove this when webpack adds a warning or an error for this.
                // See https://github.com/webpack/webpack/issues/6571
                sideEffects: true
            },
            {
                test: sassRegex,
                exclude: sassGlobalRegex,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: webpackConfig.publicPath
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local][hash:base64:6]'
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ],
                sideEffects: true
            },
            {
                test: sassGlobalRegex,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: webpackConfig.publicPath
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: false
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ],
                sideEffects: true
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?t=[\s\S]+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'fonts/[name].[hash:8].[ext]',
                            limit: webpackConfig.imgLimit
                        }
                    }
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.(jpeg|jpg)$/, /\.png$/],
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name].[hash:8].[ext]',
                        limit: webpackConfig.imgLimit
                    }
                }
            }
        ]
    },
    devtool: webpackConfig.devtool,
    optimization: {
        minimize: true,
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
                    test: /[\\/]src[\\/]util[\\/]/,
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
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    exclude: /\.min\.js$/,
                    parse: {
                        // we want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minfication steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        drop_console: true, // 删除代码中所有的console
                        drop_debugger: true, // 删除代码中所有的debugger
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending futher investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        ecma: 5,
                        beautify: false,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true
                    }
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: !!webpackConfig.devtool
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true },
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                }
            })
        ]
    },
    plugins: plugins

};
