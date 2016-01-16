var webpackConfig = require('./webpack.config.js');

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    "eslint": {
      options: {
        format: 'tap'
      },
      target: ['src/**/*.js']
    },
    htmllint: {
        all: ['public/index.html']
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
      files: ['Gruntfile.js', 'webpack.config.js', 'src/**/*.js', 'test/**/*.js', 'public/css/*.css'],
      tasks: ['webpack']
    },
    webpack: webpackConfig(),
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/react/dist/',
            src: 'react.js',
            dest: 'public/lib/react/dist/'
          },
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
          },
          {
            expand: true,
            cwd: 'node_modules/moment',
            src: 'moment.js',
            dest: 'public/lib/moment/dist/',
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
  grunt.loadNpmTasks("grunt-react");

  grunt.registerTask('pack', ['webpack:build']);
  // eslint throwing errors on valid jsx, need to investigate
  grunt.registerTask('lint', ['eslint', 'htmllint']);
  grunt.registerTask('build', ['copy', 'webpack']);
  grunt.registerTask('local-deploy', ['build', 'copy:local-dist']);
  grunt.registerTask('default', ['build']);
};
