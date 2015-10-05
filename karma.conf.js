var webpack = require('webpack');
var path = require('path');

module.exports = function(config) {
  config.set({
    browsers: [ 'PhantomJS' ],
    singleRun: false, //just run once by default
    autoWatch: true,
    frameworks: [ 'mocha', 'es6-shim' ],
    //files: [
    //  'src/**/*.spec.js'
    //],
    files: [
      'tests.webpack.js' //just load this file
    ],
    reporters: [ 'dots' ], //report results in this format
    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    plugins: [
      require('webpack'),
      require('karma-coverage')
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap', 'coverage' ] //preprocess with webpack and our sourcemap loader
      //,'src/.(?!(spec.js)$)([^.]+$)': ['coverage']
      //,'src/**/*.js': ['coverage']
    },
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          { test: /\.js$/,
            include: [
              path.resolve(__dirname, "src")
            ],
            loader: 'babel-loader'
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