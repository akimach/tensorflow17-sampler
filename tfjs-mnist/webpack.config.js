const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    'index': [
      path.resolve(__dirname, 'src/index.js')
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.js',],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'public')
  },
};
