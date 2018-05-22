module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'app/**/*.html',
      options: {
        dest: 'dist'
      }
    },

    usemin:{
      html:['dist/**/*.html']
    },

    copy: {
      build: {
        cwd: 'app',
        src: ['**', '!**/*.scss', '!**/vendors/**',
        '!**/base/**', '!**/component/**', '!**/layout/**', '!**/components/*.js', '!**src/js/*.js', '!**/api/**'],
        dest: 'dist',
        expand: true
      }
    },

    clean: {
      build: {
        src: [ 'dist' ]
      },
    },

    sass: {
      dist: {
        files: {
          //Default Sass to CSS
          'app/dir/css/default/main.css': 'app/dir/css/default/style.scss',
          //GM Selling Skills Sass to CSS
          'app/dir/css/themes/gm_selling_skills/theme.css': 'app/dir/css/default/themes/gm_selling_skills/style.scss'
        }
      }
    },

    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      }
    },

    cssmin: {
      build: {
        files: {
          'dist/dir/css/default/main.css': [ 'dist/dir/css/default/main.css' ],
          'dist/dir/css/themes/gm_selling_skills/theme.css': [ 'dist/dir/css/themes/gm_selling_skills/theme.css' ],
          'dist/src/vendors/vendors.min.css': ['app/src/vendors/**/*.min.css'],
        }
      }
    },

    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'dist/src/components/components.js': [ 'app/src/components/*.js' ],
          'dist/src/js/functions.js': [ 'app/src/js/*.js' ],
          'dist/src/js/api/api.js': [ 'app/src/js/api/*.js' ],
          'dist/src/vendors/vendors.min.js': ['app/src/vendors/jquery/jquery-3.2.1.min.js', 'app/src/vendors/bootstrap/js/bootstrap.min.js', 'app/src/vendors/**/*.min.js']
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['app/src/vendors/jquery/jquery-3.2.1.min.js', 'app/src/vendors/**/*.min.js'],
        dest: 'dist/src/vendors/vendors.min.js',
      },
    },

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'dist',
          keepalive: true
        }
      }
    },

    compress: {
      main: {
        options: {
          archive: 'dist/scorm_package.zip'
        },
        files: [{
           src: ['**/*'],
           cwd: 'dist/',
           expand: true
       }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('test', ['compress']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean', 'copy', 'uglify', 'cssmin', 'useminPrepare', 'usemin', 'compress', 'connect']
  );
}
