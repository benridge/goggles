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
          dest: 'es6-compiled',
          ext: '.js'
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
        entry: "./es6-compiled/init.js",
        output: {
          path: './public/dist',
          filename: "webpack_bundle.js"
        },
        module: {
          loaders: [
            {test: /\.css$/, loader: "style!css"}
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
            dest: 'lib/bootstrap/dist/'
          },
          {
            expand: true,
            cwd: 'node_modules/bootstrap/js',
            src: '*.js',
            dest: 'lib/bootstrap/dist/js/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/jquery/dist',
            src: 'jquery*.js',
            dest: 'lib/jquery/dist/',
            filter: 'isFile'
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

  grunt.registerTask('pack', ['webpack:build']);
  grunt.registerTask('compile', ['6to5']);
  grunt.registerTask('build', ['copy', 'compile', 'webpack:build']);
  grunt.registerTask('default', ['build']);

};