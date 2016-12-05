/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import path from 'path';
import webpack from 'webpack';

const entryBase = './website/assets';

export default {
  entry: {
    megamap: `${entryBase}/apps/megamap/app.jsx`,
    projectmap: `${entryBase}/apps/projectmap/app.jsx`,
  },
  output: {
    path: path.join(__dirname, 'website/static/js'),
    publicPath: '/static/js/',
    filename: '[name].js',
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
