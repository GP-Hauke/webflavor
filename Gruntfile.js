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
-[validateHTML] - Copies over core files that are not minified/concatenated
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
        src: ['**', '!**/themes/*/'],
        dest: 'dist',
        expand: true,

        filter: function(filepath){
          if(require('path').dirname(filepath) == "app\\dir\\content"){
            var path = require('path').basename(filepath)
            var json = grunt.file.readJSON('app/settings.json');

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
            var json = grunt.file.readJSON('app/settings.json');

            var required = 'app\\dir\\themes\\'+json.settings.theme;

            if(dir != required){
              return false;

            }
          }

          else if(require('path').dirname(filepath) == "app\\dir\\themes"){
            var path = require('path').basename(filepath)
            var json = grunt.file.readJSON('app/settings.json');

            if(path != json.settings.theme){
              return false;
            }
          }

          else if(require('path').relative(require('path').dirname(filepath), 'app\\src\\vendors') == '..'){
            var dir = require('path').dirname(filepath).split(require('path').sep)
            var json = grunt.file.readJSON('app/settings.json');

            //var required = 'app\\dir\\themes\\'+json.settings.theme;
            var folder = dir[dir.length -1];
            if(json.settings.vendors[folder] == "false"){
              return false;
            }
          }

          else if(require('path').dirname(filepath) == "app\\src\\components"){
            var path = require('path').basename(filepath)
            var json = grunt.file.readJSON('app/settings.json');

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
      },
      validate: {
        src: ['dist/dir/content/course_content/*', '!dist/dir/content/course_content/*.xml']
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
      jsonconvert: {
        files: [
          {
            expand: true,
            cwd: 'dist/dir/content/course_content',
            src: ['*.xml'],
            dest: 'dist/dir/content/course_content',
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
      sco01: {
        options: {
          namespaces: {
            'w':'http://www.imsglobal.org/xsd/imsmd_rootv1p2p1',
          },
          replacements: [
              {
                xpath: '/w:lom/w:general/w:catalogentry/w:catalog/text()',
                value: function (node) {
                  var json = grunt.file.readJSON('app/settings.json');
                  return json.settings.cookieName;
                }
              },
              {
                xpath: '/w:lom/w:general/w:catalogentry/w:entry/w:langstring/text()',
                value: function (node) {
                  var json = grunt.file.readJSON('app/settings.json');

                  if(json.settings.courseSubTitle.length == 0){
                    return json.settings.courseTitle;
                  }

                  return json.settings.courseTitle +": "+json.settings.courseSubTitle;
                }
              },
              {
                xpath: '/w:lom/w:general/w:title/w:langstring/text()',
                value: function (node) {
                  var json = grunt.file.readJSON('app/settings.json');

                  if(json.settings.courseSubTitle.length == 0){
                    return json.settings.courseTitle;
                  }

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
                var json = grunt.file.readJSON('app/settings.json');
                return json.settings.cookieName;
              }
            },
            {
              xpath: '/w:manifest/w:metadata/w2:lom/w2:general/w2:catalogentry/w2:entry/w2:langstring/text()',
              value: function (node) {
                var json = grunt.file.readJSON('app/settings.json');
                return json.settings.cookieName;
              }
            },
            {
              xpath: '/w:manifest/w:metadata/w2:lom/w2:general/w2:title/w2:langstring/text()',
              value: function (node) {
                var json = grunt.file.readJSON('app/settings.json');

                if(json.settings.courseSubTitle.length == 0){
                  return json.settings.courseTitle;
                }

                return json.settings.courseTitle +": "+json.settings.courseSubTitle;
              }
            },
            {
              xpath: '/w:manifest/w3:organizations/w3:organization/w3:title/text()',
              value: function (node) {
                var json = grunt.file.readJSON('app/settings.json');

                if(json.settings.courseSubTitle.length == 0){
                  return json.settings.courseTitle;
                }

                return json.settings.courseTitle +": "+json.settings.courseSubTitle;
              }
            },
            {
              xpath: '/w:manifest/w3:organizations/w3:organization/w3:item/w3:title/text()',
              value: function (node) {
                var json = grunt.file.readJSON('app/settings.json');

                if(json.settings.courseSubTitle.length == 0){
                  return json.settings.courseTitle;
                }

                return json.settings.courseTitle +": "+json.settings.courseSubTitle;
              }
            }]
        },

        files: {
          'app/imsmanifest.xml': 'app/imsmanifest.xml',
        },
      },
    },

    xml_validator: {
      your_target: {
        src: ['app/**/*.xml']
      },
    },

    htmlhint: {
      html1: {
        options: {
          'tag-pair': true
        },
        src: ['dist/dir/content/course_content/*.html']
      }
    }
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
  grunt.loadNpmTasks('grunt-htmlhint');

  grunt.registerTask('version', function(key, value) {
    var settingsFile = "app/settings.json";
    if (!grunt.file.exists(settingsFile)) {
      grunt.log.error("file " + settingsFile + " not found");
      return true; //return false to abort the execution
    }

    var json = grunt.file.readJSON(settingsFile); //get file as json object
    currentVersion = json.settings.version;

    json.settings.version = (parseFloat(currentVersion)+0.1).toFixed(1).toString();
    grunt.log.oklns("VERSION: " + json.settings.version);

    grunt.file.write(settingsFile, JSON.stringify(json, null, 2));
  });

  grunt.registerTask('settings', function(key, value) {
    var settingsFile = "app/settings.json";
    if (!grunt.file.exists(settingsFile)) {
      grunt.log.error("file " + settingsFile + " not found");
      return true; //return false to abort the execution
    }

    var json = grunt.file.readJSON(settingsFile); //get file as json object
    var courseTitle = json.settings.courseTitle + " " + json.settings.courseSubTitle;
    courseTitle = courseTitle.replace(/\s+/g, '_') + "_";

    var acronym = json.settings.courseTitle + " " + json.settings.courseSubTitle;
    var matches = acronym.match(/\b(\w)/g);              // ['J','S','O','N']
    var cookie = matches.join('').toLowerCase()+"_";

    var possible = "abcdefghijklmnopqrstuvwxyz01234567890123456789";

    for (var i = 0; i < 5; i++){
      var r = possible.charAt(Math.floor(Math.random() * possible.length));
      cookie += r;
      courseTitle += r;

    }

    grunt.log.oklns("VERSION: "['green'].bold + "1.0".yellow);
    grunt.log.oklns("Course ID: "['green'].bold + courseTitle.yellow);
    grunt.log.oklns("Cookie: "['green'].bold + cookie.yellow);


    json.settings.courseStorageID = courseTitle;
    json.settings.version = "1.0";
    json.settings.cookieName = cookie;
    grunt.file.write(settingsFile, JSON.stringify(json, null, 2));
  });

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    ['xml_validator', 'version', 'clean:rebuild', 'copy:build', 'validate', 'preprocess', 'uglify', 'cssmin', 'useminPrepare', 'usemin', 'copy:vendors', 'clean:finishbuild', 'compress', 'connect']
  );

  grunt.registerTask(
    'init',
    'Compiles all of the assets and copies the files to the build directory.',
    ['settings','xmlpoke:sco01','xmlpoke:imsmanifest']
  );

  grunt.registerTask('validate', function(key, value) {
    var xmldoc = require('xmldoc');
    var pages = grunt.file.expand(["dist/dir/content/course_content/*.xml"]);

    for(var i = 0; i < pages.length; i++){
      var xml = grunt.file.read(pages[i]);
      var xmlDoc = new xmldoc.XmlDocument(xml);
      var html = xmlDoc.valueWithPath("content");

      grunt.file.write(pages[i].substring(0, pages[i].length - 3) + 'html', html);
    }

    grunt.log.oklns('HTML Created')
    grunt.task.run('htmlhint');
    grunt.task.run('clean:validate');
  });




  grunt.registerTask('test', ['validate']);

}
