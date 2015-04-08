// Generated on 2015-01-12 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 5555,
          hostname: '0.0.0.0',
          base: ["public", "node_modules", "bower_components"]
        }
      },
      client: {
        options: {
          port: 4000,
          hostname: '0.0.0.0',
          base: "track"
        }
      }
    },
    watch: {
      scripts: {
        files: ['public/**/*.js'],
        tasks: ['injector:js']
      },
      server: {
        files: ['server.js', 'server/**/*.js'],
        tasks: ['nodemon:dev']
      }
    },
    injector: {
      options: {
        // Task-specific options go here.
        template: 'public/index.html',
        addRootSlash: false
      },
      js: {
        // Target-specific file lists and/or options go here.
        files: {
          'public/index.html': ['public/**/*.js']
        }
      },
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    }
  });

  grunt.registerTask('default', [
    'connect', 'nodemon:dev', 'watch'
  ]);
};
