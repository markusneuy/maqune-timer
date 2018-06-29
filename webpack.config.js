/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const RenameOutputPlugin = require('rename-output-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpackMerge = require('webpack-merge');
// const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = PRODUCTION === 'production';

const webpackConfig = {
  mode: PRODUCTION,
  entry: {
    main: './src/index.js',
    sw: './src/sw.js',
  },
  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              partialDirs: [
                path.join(__dirname, 'src', 'partials'),
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
    ],
  },
  performance: {},
  devtool: IS_PRODUCTION ? 'none' : 'cheap-eval-source-map',
  // devServer: {
  //   hot: true,
  //   https: true,
  //   open: false,
  //   overlay: true,
  //   historyApiFallback: true,
  //   quiet: true,
  //   contentBase: './dist',
  // },
  context: __dirname,
  target: 'web',
  stats: 'none',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.hbs',
      minify: IS_PRODUCTION,
      test: 'hallo welt',
      excludeChunks: ['sw'],
    }),
    new ScriptExtHtmlWebpackPlugin({
      sync: 'components.js',
      defaultAttribute: 'async',
    }),
    new ResourceHintWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin({
    //   openAnalyzer: false,
    //   analyzerMode: 'static',
    //   reportFilename: path.join(__dirname, 'docs', 'bundle-report.html'),
    // }),
    new MiniCssExtractPlugin({
      filename: IS_PRODUCTION ? '[name].[hash].css' : '[name].css',
      chunkFilename: IS_PRODUCTION ? '[id].[hash].css' : '[id].css',
    }),
    // new CleanWebpackPlugin(['build']),
    new webpack.NamedModulesPlugin(),
    new StyleLintPlugin({
      files: './src/**/*.css',
    }),
    new RenameOutputPlugin({
      sw: 'sw.js',
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      'src/manifest.json',
      'src/browserconfig.xml',
      'src/site.webmanifest',
      'src/favicon.ico',
      'src/images/',
    ]),
    new ImageminPlugin({
      disable: !IS_PRODUCTION,
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),
    // new HtmlCriticalWebpackPlugin({
    //   base: path.resolve(__dirname, 'build'),
    //   src: 'index.html',
    //   dest: 'index.html',
    //   inline: true,
    //   minify: true,
    //   width: 375,
    //   height: 565,
    //   penthouse: {
    //     blockJSRequests: false,
    //   },
    // }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
        },
      },
    },
  },
};


module.exports = webpackMerge(
  webpackConfig,
  IS_PRODUCTION ? require('./webpack/production.config') : require('./webpack/development.config'),
);
