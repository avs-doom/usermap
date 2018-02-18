'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const RESOURCE_PATH = path.resolve('resource');
const NODE_MODULES_PATH = path.resolve('node_modules');


module.exports = {

    devtool: 'source-map',
    context: path.resolve(__dirname, '..', RESOURCE_PATH),
    
    devServer: {
        historyApiFallback: false,
        hot: false,
        https: false,
        compress: true,
        inline: true
    },
    
    entry: [
        'babel-polyfill',
        path.posix.join('js', 'main.js'),
    ],

    output: {
        filename: 'assets/[name].js',
        path: path.resolve(__dirname, '..', 'build'),
        publicPath: '/'
    },

    module: {

        rules: [
            // POST LOADERS
            {
                test: /\.js|.jsx?$/,
                exclude: /(node_modules|templates)/,
                include: /(js)/,
                enforce: 'post',
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        ['env', {
                            'loose': true
                        }],
                        'stage-0',
                        'react'
                    ],
                    plugins: [
                        'transform-decorators-legacy',
                        ['transform-runtime', {
                            helpers: false,
                            polyfill: true,
                            regenerator: true,
                            moduleName: 'babel-runtime'
                        }]
                    ]
                }
            },
            {
                test: /\.html$/,
                exclude: /(node_modules)|js/,
                include: /(templates)/,
                enforce: 'post',
                use: [{
                    loader: 'html-loader'
                }, {
                    loader: 'preprocess-loader'
                }]
            }
        ]
    },

    resolve: {
        modules: [
            NODE_MODULES_PATH,
            RESOURCE_PATH
        ],
        extensions: ['.html', '.js', '.jsx']
    },

    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: path.posix.join(RESOURCE_PATH, 'templates', 'index.html'),
            filename: 'index.html',
            inject: true,
            hash: true
        })
    ]
};