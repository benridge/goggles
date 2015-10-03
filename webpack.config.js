
module.exports = function(){
  return {
    main: {
      entry: "./src/App.js",
      output: {
        path: './public/dist',
        filename: 'goggles.js'
      },
      externals: {
        jquery: true,
        lodash: "_",
        superagent: true,
        react: "React",
        moment: true
      },

      debug: true,
      devtool: "#inline-source-map",
      resolve: {
        modulesDirectories: [".", "node_modules"],
        extensions: ["", ".webpack.js", ".js"]
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            loader: "source-map-loader"
          }
        ],
        loaders: [
          {
            test: /\.css$/,
            loader: "style!css"
          },
          {
            test: /\.js$/,
            exclude: /unit|node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ]
      }
    }
  };
}