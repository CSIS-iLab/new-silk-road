import path from 'path';

const entryBase = './website/assets';

export default {
  entry: {
    megamap: `${entryBase}/apps/megamap/app.js`,
    projectmap: `${entryBase}/apps/projectmap/app.js`,
  },
  output: {
    path: path.join(__dirname, "website/static/js"),
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: [/node_modules/],
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
