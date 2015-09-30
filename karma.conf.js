//based off of
//https://www.codementor.io/reactjs/tutorial/test-reactjs-components-karma-webpack

var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    browsers: [ 'Chrome' ], //run in Chrome
    singleRun: false, //just run once by default
    autoWatch: true,
    frameworks: [ 'mocha' ], //use the mocha test framework
    files: [
      'tests.webpack.js' //just load this file
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: [ 'dots' ], //report results in this format
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' },
          {
            test: /\.css$/,
            loader: "style!css"
          }
        ]
      },
      resolve: {
        modulesDirectories: [".", "node_modules"],
        extensions: ["", ".webpack.js", ".js"]
      }
    },
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    }
  });
};