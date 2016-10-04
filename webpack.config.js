const path = require('path');

const PRODUCTION = !!process.env.PRODUCTION;

function gatewayPath(...args) {
  return path.join(__dirname, 'app', 'gateway', ...args);
}

module.exports = {
  context: gatewayPath('fe'),
  entry: {
    admin: [
      './entry-admin',
    ],
  },
  output: {
    filename: '[name].js',
    path: gatewayPath('fe-dist'),
    publicPath: '/static/',
  },
  debug: !PRODUCTION,
  devtool: 'cheap-module-eval-source-map',
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
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.styl$/,
        loader: 'style!stylus',
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
    ],
  },
};

