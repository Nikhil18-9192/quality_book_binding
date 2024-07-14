const rules = require('./webpack.rules');

rules.push({
  test: [/\.s[ac]ss$/i, /\.css$/i],
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }, { loader: 'postcss-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
