const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractText = require("extract-text-webpack-plugin");

const PRODUCTION = !!process.env.PRODUCTION;

const babelrc = JSON.parse(fs.readFileSync('.babelrc'));

babelrc.presets.push('react');
babelrc.presets.push('es2015');
babelrc.plugins.push(['import', {
  "libraryName": "antd",
  "libraryDirectory": "lib",
  "style": 'css',
}]);

function gatewayPath(...args) {
  return path.join(__dirname, 'app', 'gateway', ...args);
}

module.exports = {
  context: gatewayPath('fe'),
  entry: {
    admin: [
      'babel-polyfill',
      './admin',
    ],
  },
  output: {
    filename: '[name].js',
    path: gatewayPath('fe-dist'),
    publicPath: '/static/',
  },
  debug: !PRODUCTION,
  devtool: PRODUCTION ? void(0) : '#inline-source-map',
  devServer: {
    port: 8081,
    contentBase: gatewayPath('fe'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: Object.assign({}, babelrc, {
          cacheDirectory: true,
          babelrc: false,
        }),
      },
      {
        test: /\.styl$/,
        loader: ExtractText.extract('style', 'css!stylus'),
      },
      {
        test: /\.css$/,
        loader: ExtractText.extract('style', 'css'),
      },
    ],
  },
  plugins: (PRODUCTION ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      exclude: /node_modules/,
    }),
  ] : [
    new webpack.DefinePlugin({
      DEBUG: true,
    }),
  ]).concat([
    new webpack.NoErrorsPlugin(),
    new webpack.ProgressPlugin((progress, msg) => {
      const percentage = `${Math.floor(progress * 1000) / 10}%`;
      const tabLen = 10 - percentage.length;
      process.stdout.write(percentage);
      for (let i = 0; i < tabLen; i++) {
        process.stdout.write(' ');
      }
      process.stdout.write(`${msg}               \r`);
    }),
    new ExtractText('style.css'),
  ]),
  resolve: {
    modulesDirectories: [
      'node_modules',
      path.relative(__dirname, gatewayPath('fe')),
    ],
  },
};

