var path = require('path');

module.exports = {
  entry: './app/src/js/app_functions.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/src')
  },
  watch: true,
  mode: 'production',
  devtool: "source-map"
};
