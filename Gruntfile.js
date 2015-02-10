module.exports = function(grunt) {

  grunt.initConfig({
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

  grunt.registerTask('build', ['copy']);
  grunt.registerTask('default', ['build']);

};