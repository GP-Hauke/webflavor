/*
------------ GRUNT INIT SCRIPT CONTENTS ------------
-[xmlpoke:settings] - Updates version number in setings.xml
-[xmlpoke:sco01] - Cleans (deletes) dist folder for new build
-[xmlpoke:imsmanifest] - Converts settings.xml to JSON file to be used in Grunt
------------ END GRUNT INIT SCRIPT CONTENTS ------------
*/


/*
------------ GRUNT BUILD SCRIPT CONTENTS ------------
-[xml_validator] - Validates XML files before building
-[xmlpoke:verion] - Updates version number in setings.xml
-[clean:rebuild] - Cleans (deletes) dist folder for new build
-[convert:xml2json] - Converts settings.xml to JSON file to be used in Grunt
-[copy:build] - Copies over core files that are not minified/concatenated
-[preprocess] - Removes localStorage.clear() line used in development
-[uglify] - Concatenates JS files and copies them into dist folder
-[cssmin] - Minifies CSS files and copies them into dist folder
-[useminPrepare] - Preprocessor for usemin
-[usemin] - Changes all HTML link tags to the new dist version
-[copy:vendors] - Copies over only needed vendors
-[clean:finishbuild] - Deletes uneeded files from dist folder
-[compress] - Creates scorm_package.zip file for LMS
-[connect] - Starts localhost:9000 to test build version
------------ END GRUNT BUILD SCRIPT CONTENTS ------------
*/

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
        src: ['**', '!**/api/**', '!**/themes/*/'],
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

          else if(require('path').dirname(filepath) == "app\\src\\components"){
            var path = require('path').basename(filepath)
            var json = grunt.file.readJSON('settings.json');

            if(path == 'assessment_functions.js'){
              if(json.settings.hasAssessments == 'false'){
                return false;
              }
            }
            else if(path == 'drag_drop_functions.js'){
              if(json.settings.hasDragDrops == 'false'){
                return false;
              }
            }
            else if(path == 'hotspot.js'){
              if(json.settings.hasHotspots == 'false'){
                return false;
              }
            }
            else if(path == 'thumbnails_functions.js'){
              if(json.settings.hasThumbnails == 'false'){
                return false;
              }
            }

            return true;
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
        src: ['dist/src/vendors/*/', 'dist/src/js/*.js', '!dist/src/js/functions.js', 'dist/src/components/*.js', '!dist/src/components/components.js', 'settings.json']
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
          'dist/src/components/components.js': [ 'dist/src/components/*.js' ],
          'dist/src/js/functions.js': [ 'dist/src/js/*.js' ],
          'dist/src/js/api/api.js': [ 'app/src/js/api/*.js' ],
          'dist/src/vendors/vendors.min.js': ['dist/src/vendors/jquery/jquery-3.2.1.min.js', 'dist/src/vendors/bootstrap/js/bootstrap.min.js', 'dist/src/vendors/**/*.min.js']
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
            cwd: 'app/dir/content/course_content',
            src: ['2_1.xml'],
            dest: '',
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
      settings: {
        options: {
          replacements: [
            {
              xpath: '/settings/cookieName/text()',
              value: function (node) {
                var json = grunt.file.readJSON('settings.json');
                return "cookie_"+json.settings.cookies;
              }
            }
          ]
        },

        files: {
          'app/dir/content/settings.xml': 'app/dir/content/settings.xml',
        },
      },

      sco01: {
        options: {
          namespaces: {
            'w':'http://www.imsglobal.org/xsd/imsmd_rootv1p2p1',
          },
          replacements: [
              {
                xpath: '/w:lom/w:general/w:catalogentry/w:catalog/text()',
                value: function (node) {
                  var json = grunt.file.readJSON('settings.json');
                  return json.settings.cookies;
                }
              },
              {
                xpath: '/w:lom/w:general/w:catalogentry/w:entry/w:langstring/text()',
                value: function (node) {
                  var json = grunt.file.readJSON('settings.json');
                  return json.settings.courseTitle +": "+json.settings.courseSubTitle;
                }
              },
              {
                xpath: '/w:lom/w:general/w:title/w:langstring/text()',
                value: function (node) {
                  var json = grunt.file.readJSON('settings.json');
                  return json.settings.courseTitle +": "+json.settings.courseSubTitle;
                }
              }]
          },
        files: {
          'app/sco01.xml': 'app/sco01.xml',
        },
      },

      imsmanifest: {
        options: {
          namespaces: {
            'w':'http://www.imsproject.org/xsd/imscp_rootv1p1p2',
            'w2':'http://www.imsglobal.org/xsd/imsmd_rootv1p2p1',
            'w3':'http://www.imsproject.org/xsd/imscp_rootv1p1p2'
          },
          replacements: [
            {
              xpath: '/w:manifest/@identifier',
              value: function (node) {
                var json = grunt.file.readJSON('settings.json');
                return json.settings.cookies;
              }
            },
            {
              xpath: '/w:manifest/w:metadata/w2:lom/w2:general/w2:catalogentry/w2:entry/w2:langstring/text()',
              value: function (node) {
                var json = grunt.file.readJSON('settings.json');
                return json.settings.cookies;
              }
            },
            {
              xpath: '/w:manifest/w:metadata/w2:lom/w2:general/w2:title/w2:langstring/text()',
              value: function (node) {
                var json = grunt.file.readJSON('settings.json');
                return json.settings.courseTitle +": "+json.settings.courseSubTitle;
              }
            },
            {
              xpath: '/w:manifest/w3:organizations/w3:organization/w3:title/text()',
              value: function (node) {
                var json = grunt.file.readJSON('settings.json');
                return json.settings.courseTitle +": "+json.settings.courseSubTitle;
              }
            },
            {
              xpath: '/w:manifest/w3:organizations/w3:organization/w3:item/w3:title/text()',
              value: function (node) {
                var json = grunt.file.readJSON('settings.json');
                return json.settings.courseTitle +": "+json.settings.courseSubTitle;
              }
            }]
        },

        files: {
          'app/imsmanifest.xml': 'app/imsmanifest.xml',
        },
      },

      version: {
        options: {
          replacements: [
            {
              xpath: '/settings/version/text()',
              value: function (node) {
                return (parseFloat(node.nodeValue)+0.1).toFixed(1).toString();
              }
            }]
        },
        files: {
          'app/dir/content/settings.xml': 'app/dir/content/settings.xml',
        },
      },
    },

    xml_validator: {
      your_target: {
        src: ['app/**/*.xml']
      },
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
  grunt.loadNpmTasks('grunt-xml-validator');

  grunt.registerTask('test', ['convert:jsonconvert']);

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    ['xml_validator', 'xmlpoke:version', 'clean:rebuild', 'convert:xml2json', 'copy:build', 'preprocess', 'uglify', 'cssmin', 'useminPrepare', 'usemin', 'copy:vendors', 'clean:finishbuild', 'compress', 'connect']
  );

  grunt.registerTask(
    'init',
    'Compiles all of the assets and copies the files to the build directory.',
    ['xmlpoke:settings','xmlpoke:sco01','xmlpoke:imsmanifest']
  );
}
