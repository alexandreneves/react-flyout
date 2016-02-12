var webpack = require('path');
var webpack = require('webpack');

module.exports = {
    entry: __dirname + '/example/src/example.js',
    output: {
        path: __dirname + '/example',
        filename: 'example.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
};
