/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

module.exports = {
  devServer: {
    hot: true,
    https: true,
    open: false,
    overlay: true,
    historyApiFallback: true,
    quiet: true,
    contentBase: './dist',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
