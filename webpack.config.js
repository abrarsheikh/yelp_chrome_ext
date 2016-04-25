var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/client.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  output: {
    path: __dirname + "/dist/",
    filename: "client.min.js"
  },
  devServer: {
      // This is required for webpack-dev-server. The path should
      // be an absolute path to your build destination.
      outputPath: path.join(__dirname, 'dist')
  },
  plugins: debug ? [new CopyWebpackPlugin([
      {
          from: path.join(__dirname, "src/index.html"),
          to: path.join(__dirname, "dist/index.html")
      },
      {
          from: path.join(__dirname, "src/images/yelp-logo.png"),
          to: path.join(__dirname, "dist/images/yelp-logo.png")
      },
      {
          from: path.join(__dirname, "src/images/yelp_icon.png"),
          to: path.join(__dirname, "dist/yelp_icon.png")
      },
      {
          from: path.join(__dirname, "manifest.json"),
          to: path.join(__dirname, "dist/manifest.json")
      },
    ])
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new CopyWebpackPlugin([
      {
          from: path.join(__dirname, "src/index.html"),
          to: path.join(__dirname, "dist/index.html")
      },
    ])
  ],
};
