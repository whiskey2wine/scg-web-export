const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './public/js/script.js',
  mode: 'development',
  output: {
    path: path.join(__dirname, '/public/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
};
