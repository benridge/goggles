module.exports = function(grunt) {

  grunt.initConfig({
    "6to5": {
      options: {
        sourceMap: 'inline'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'es6-compiled'
        }]
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    webpack: {
      options: {
        entry: "./src/init.react.js",
        output: {
          path: './public/dist',
          filename: 'webpack_bundle.js'
        },
        externals: {
          jquery: true,
          lodash: "_",
          superagent: true,
          react: "React"
        },

        debug: true,
        devtool: "#inline-source-map",
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
              loader: 'jsx-loader?harmony'
            }
          ]
        }
      },
      build: {

      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap/dist/',
            src: '**',
            dest: 'public/lib/bootstrap/dist/'
          },
          {
            expand: true,
            cwd: 'node_modules/bootstrap/js',
            src: '*.js',
            dest: 'public/lib/bootstrap/dist/js/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/jquery/dist',
            src: 'jquery*.js',
            dest: 'public/lib/jquery/dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/superagent',
            src: 'superagent.js',
            dest: 'public/lib/superagent/dist/',
            filter: 'isFile'
          }
        ]
      },
      'local-dist': {
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: '**',
            dest: '../webdev/docroot/public/'
          }
        ]
      }
    },
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'es6-compiled',
            src: ['**/*.react.js'],
            dest: 'jsx-compiled/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-6to5");
  grunt.loadNpmTasks("grunt-react");

  grunt.registerTask('pack', ['webpack:build']);
  grunt.registerTask('compile', ['6to5']);
  grunt.registerTask('build', ['copy', 'compile', 'webpack:build']);
  grunt.registerTask('local-deploy', ['build', 'copy:local-dist']);
  grunt.registerTask('default', ['build']);


};