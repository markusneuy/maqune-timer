/* eslint-disable import/no-extraneous-dependencies */
const postcssSystemUiFont = require('postcss-font-family-system-ui');
const postcssPresetEnv = require('postcss-preset-env');
const postcssCalc = require('postcss-calc');
const postcssImport = require('postcss-import');
const postcssStyleguide = require('postcss-style-guide');

const packageJSON = require('./package.json');

module.exports = {
  plugins: [
    postcssImport(),
    postcssSystemUiFont(),
    postcssCalc(),
    postcssPresetEnv(),
    postcssStyleguide({
      project: `${packageJSON.name} - ${packageJSON.description}`,
      dest: 'docs/styleguide/index.html',
    }),
  ],
};
