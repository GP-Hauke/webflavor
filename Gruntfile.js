module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'app/**/index.html',
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
        src: ['**', '!**/components/*.js', '!**/api/**', '!**/component/**', '!**/themes/*/'],
        dest: 'dist',
        expand: true,

        filter: function(filepath){
          if(require('path').dirname(filepath) == "app\\dir\\content"){
            var path = require('path').basename(filepath)
            var json = grunt.file.readJSON('settings.json');

            if(path == 'splash.xml'){
              if(json.settings.hasSplashPage == 'false'){
                return false;
              }
            }else if(path == 'glossary.xml'){
              if(json.settings.hasGlossary == 'false'){
                return false;
              }
            }else if(path == 'course_resources.xml'){
              if(json.settings.hasResources == 'false'){
                return false;
              }
            }else if(path == 'card_content.xml'){
              if(json.settings.hasCards == 'false'){
                return false;
              }
            }else if(path == 'assessments.xml'){
              if(json.settings.hasAssessments == 'false'){
                return false;
              }
            }else if(path == 'drag_drops.xml'){
              if(json.settings.hasDragDrops == 'false'){
                return false;
              }
            }

            return true;
          }

          else if(require('path').relative(require('path').dirname(filepath), 'app\\dir\\themes') == '..'){
            var dir = require('path').dirname(filepath)
            var json = grunt.file.readJSON('settings.json');

            var required = 'app\\dir\\themes\\'+json.settings.theme;

            if(dir != required){
              return false;

            }
          }

          else if(require('path').dirname(filepath) == "app\\dir\\themes"){
            var path = require('path').basename(filepath)
            var json = grunt.file.readJSON('settings.json');

            if(path != json.settings.theme){
              return false;
            }
          }

          else if(require('path').relative(require('path').dirname(filepath), 'app\\src\\vendors') == '..'){
            var dir = require('path').dirname(filepath).split(require('path').sep)
            var json = grunt.file.readJSON('settings.json');

            //var required = 'app\\dir\\themes\\'+json.settings.theme;
            var folder = dir[dir.length -1];
            if(json.settings.vendors[folder] == "false"){
              return false;
            }
          }

          return true;
        }
      },

      vendors: {
        files: [
          {
            expand: true,
            src: ['dist/src/vendors/**/*.ttf','dist/src/vendors/**/*.otf','dist/src/vendors/**/*.eot','dist/src/vendors/**/*.svg','dist/src/vendors/**/*.woff','dist/src/vendors/**/*.woff2'],
            dest: 'dist/src/vendors',
            flatten: true
          }
        ]
      }
    },

    clean: {
      rebuild: {
        src: [ 'dist' ]
      },
      finishbuild: {
        src: ['dist/src/vendors/*/', 'dist/src/js/*.js', '!dist/src/js/functions.js']
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/dir/themes',
          src: ['**/theme.css'],
          dest: 'dist/dir/themes',
          ext: '.css'
        },
        {
          expand: true,
          cwd: 'dist/src/css',
          src: ['default.css'],
          dest: 'dist/src/css',
          ext: '.css'
        },
        {
          'dist/src/vendors/vendors.min.css': ['dist/src/vendors/**/*.min.css']
        }]
      }
    },

    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'dist/src/components/components.js': [ 'app/src/components/*.js' ],
          'dist/src/js/functions.js': [ 'dist/src/js/*.js' ],
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
    },

    convert: {
      options: {
        explicitArray: false,
      },
      xml2json: {
        files: [
          {
            expand: true,
            cwd: 'app/dir/content/',
            src: ['settings.xml'],
            dest: '',
            ext: '.json'
          }
        ]
      },
      jsonconvert: {
        files: [
          {
            expand: true,
            cwd: 'app/dir/content/',
            src: ['*.xml'],
            dest: 'xmlJson',
            ext: '.json'
          }
        ]
      }
    },

    preprocess : {
      options: {
        inline: true,
        context : {
          DEBUG: false
        }
      },
      js : {
        src: 'dist/src/js/interface_functions.js'
      }
    },

    xmlpoke: {
      upperCaseTheY: {
        options: {
          xpath: '/x/text()',
          value: function (node) { return number(node.nodeValue) + 1; }
        },
        files: {
          'dist/example.xml': 'dist/example.xml',
        },
      },
    },

    bump: {
      options: {
        files: ['dist/dir/content/settings.xml'],
        updateConfigs: [],
        commit: false,
        createTag: true,
        tagName: 'v%version%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-convert');
  grunt.loadNpmTasks('grunt-cleanempty');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-xmlpoke');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('test', ['bump']);

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean:rebuild', 'convert:xml2json', 'copy:build', 'preprocess', 'uglify', 'cssmin', 'useminPrepare', 'usemin', 'copy:vendors', 'clean:finishbuild', 'compress', 'connect']
  );
}
