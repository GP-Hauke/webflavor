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
-[browserSync] - Starts localhost to test build version
------------ END GRUNT BUILD SCRIPT CONTENTS ------------
*/

var path = require('path');
var timer = require("grunt-timer");

module.exports = function(grunt){
  timer.init(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concurrent: {
      target1: ['dev:theme', 'sass', 'browserSync:dev', 'watch', 'webpack']
    },

    webpack: {
      myconfig: function() {
        return {
          entry: './app/src/js/App.jsx',
          output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'app/src')
          },
          watch: false,
          mode: 'production',
          devtool: "source-map"
        };
      }
    },

    browserSync: {
      dev : {
        bsFiles: {
          src : ['app/**/*', '!app/src/js/**/*', '!**/*.scss']
        },
        options: {
          server: {
            baseDir: "./app"
          },
          watchTask: true,
          notify: false

        }
      },

      build : {
        bsFiles: {
          src : 'dist/**/*'
        },
        options: {
          server: {
            baseDir: "./dist"
          },
          notify: false

        }
      }
    },

    sass: {
      dist: {
        options:{
        },
        files: [{
          expand: true,
          cwd: 'app/dir/themes/forest/scss',
          src: ['theme.scss'],
          dest: 'app/dir/themes/forest',
          ext: '.css'
        },
        {
          expand: true,
          cwd: 'app/src/scss/',
          src: ['main.scss'],
          dest: 'app/src',
          ext: '.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['app/src/js/**/*', 'app/**/*.scss'],
        tasks: [],
        options: {
          spawn: false
        },
      },
    },

    useminPrepare: {
      html: 'app/**/index.html',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      html:['dist/**/*.html']
    },

    copy: {
      build: {
        cwd: 'app',
        src: [],
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
            }else if(path == 'resources.xml'){
              if(json.settings.hasResources == 'false'){
                return false;
              }
            }else if(path == 'assessments.xml'){
              if(json.settings.hasVehicleGame == 'false'){
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
      },

      test: {
        files: [
          {
            expand: true,
            src: ['app/dir/content/course_content/1_1.xml'],
            dest: 'dist/dir/content/course_content/',
            flatten: true
          }
        ]
      }
    },

    clean: {
      rebuild: {
        src: [ 'dist']
      },

      finishbuild: {
        src: ['dist/src/vendors', 'dist/src/scss', 'dist/src/js','dist/src/api/APIWrapper2004.js','dist/src/api/SCOFunctions2004.js', 'dist/dir/media/fonts/*','!dist/dir/media/fonts/*.woff']
      },

      validate: {
        src: ['dist/*.html', '!dist/index.html']
      },

      media: {
        src: ['app/dir/media/audio/**/*', 'app/dir/media/videos/**/*', 'app/dir/media/img/assets/*']
      },
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
          cwd: 'dist/src',
          src: ['main.css'],
          dest: 'dist/src',
          ext: '.css'
        },
        {
          'dist/src/vendors.min.css': ['dist/src/vendors/**/*.min.css']
        }]
      }
    },

    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'dist/src/vendors.min.js': ['dist/src/vendors/jquery/jquery-3.2.1.min.js', 'dist/src/vendors/bootstrap/js/bootstrap.min.js', 'dist/src/vendors/**/*.min.js'],

          'dist/src/api/APIWrapper.js': ['dist/src/api/APIWrapper.js'],
          'dist/src/api/SCOFunctions.js': ['dist/src/api/SCOFunctions.js']
        }
      }
    },

    imagemin: {
      build: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{removeViewBox: false}],
        },
        files: [{
          expand: true,
          cwd: 'dist/dir/media/img/assets',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/dir/media/img/assets'
        }]
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
          archive: 'scorm_package.zip'
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

    exec: {
      list_files: {
        cmd: 'webpack'
      }
    },

    preprocess: {
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
        src: ['dist/*.html']
      }
    },

    size_report: {
      dist: {
        options: {
          header: 'MEDIA SIZE REPORT'
        },
        files: {
          list: ['dist/**/*']
        }
      },
      test: {
        options: {
          header: 'MEDIA SIZE REPORT'
        },
        files: {
          list: ['dist/dir/media/fonts/**/*']
        }
      }
    }
  });

  grunt.registerTask('size', ['size_report:dist']);
  grunt.registerTask('media', ['clean:media']);
  grunt.registerTask('test', ['jslint']);

  grunt.registerTask('dev', ['update','dev:theme', 'sass', 'browserSync:dev', 'watch', 'webpack']);

  grunt.registerTask('build',
    'Compiles all of the assets and copies the files to the build directory.',
    ['version','init', 'xml_validator', 'preprocess', 'clean:rebuild', 'build:theme', 'copy:build', 'validate', 'uglify', 'cssmin', 'imagemin', 'useminPrepare', 'usemin', 'copy:vendors', 'clean:finishbuild', 'production', 'compress', 'browserSync:build']
  );

  grunt.registerTask('init',
    'Compiles all of the assets and copies the files to the build directory.',
    ['settings','xmlpoke:sco01','xmlpoke:imsmanifest']
  );

  grunt.registerTask('build:theme', function(key, value) {
    var settingsFile = "app/settings.json";
    var json = grunt.file.readJSON(settingsFile);
    var theme = json.settings.theme;
    var settingsFile = ['**', '!**/themes/*/**', '**/themes/'+theme+'/**', '!**/src/js/*.js', '!**/src/components/*.js', '!**/*.map', '!**/*.scss','**/src/js/tracking_functions.js'];
    grunt.log.oklns("THEME: " + theme.green);
    grunt.config.set("copy.build.src", settingsFile);
  });

  grunt.registerTask('version', function(key, value) {
    var settingsFile = "app/settings.json";
    if (!grunt.file.exists(settingsFile)) {
      grunt.log.error("file " + settingsFile + " not found");
      return true; //return false to abort the execution
    }

    var json = grunt.file.readJSON(settingsFile); //get file as json object
    currentVersion = json.settings.version;
    grunt.log.oklns("VERSION: " + (parseFloat(currentVersion)+0.1));

    json.settings.version = (parseFloat(currentVersion)+0.1).toFixed(1).toString();
    //grunt.log.oklns("VERSION: " + json.settings.version);

    grunt.file.write(settingsFile, JSON.stringify(json, null, 2));
  });

  grunt.registerTask('production', function(key, value) {
    var settingsFile = "dist/settings.json";
    if (!grunt.file.exists(settingsFile)) {
      grunt.log.error("file " + settingsFile + " not found");
      return true; //return false to abort the execution
    }

    var json = grunt.file.readJSON(settingsFile); //get file as json object

    json.settings.production = "true";

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

    grunt.log.oklns("Course ID: "['green'].bold + courseTitle.yellow);
    grunt.log.oklns("Cookie: "['green'].bold + cookie.yellow);


    json.settings.courseStorageID = cookie;
    json.settings.cookieName = cookie;
    grunt.file.write(settingsFile, JSON.stringify(json, null, 2));
  });

  grunt.registerTask('validate', function(key, value) {
    var xmldoc = require('xmldoc');
    var pages = grunt.file.expand(["dist/dir/content/course_content/*.xml"]);

    for(var i = 0; i < pages.length; i++){
      var xml = grunt.file.read(pages[i]);
      var xmlDoc = new xmldoc.XmlDocument(xml);
      var html = xmlDoc.valueWithPath("layout");

      var filename = pages[i].split("course_content/")[1];
      filename = "dist/"+filename.substring(0, filename.length - 3)+"html";

      grunt.file.write(filename, html);
    }

    grunt.log.oklns('HTML Created')
    grunt.task.run('htmlhint');
    grunt.task.run('clean:validate');
  });

  grunt.registerTask('testing', function(key, value) {
    var xmldoc = require('xmldoc');
    var pages = grunt.file.expand(["dist/dir/content/course_content/*.xml"]);

    //for(var i = 0; i < pages.length; i++){
      var xml = grunt.file.read("dist/dir/content/course_content/1_3.xml");
      var xmlDoc = new xmldoc.XmlDocument(xml);
      var html = xmlDoc.childrenNamed("img");

      grunt.log.oklns(html[0]);

      //var filename = pages[i].split("course_content/")[1];
      //filename = "dist/"+filename.substring(0, filename.length - 3)+"html";

      //grunt.file.write(filename, html);
    //}
  });

  grunt.registerTask('update', function(key, value) {
    var pages = grunt.file.expand(["app/dir/content/course_content/*.xml"]);
    var lastChapter = "";
    var currentChapter = "";
    var contents = [];
    var currentXML = "";

    for(var i = 0; i < pages.length; i++){
      var path = require('path').basename(pages[i])
      //grunt.log.oklns(path.substring(0, path.length - 4))
      currentChapter = path.substr(0, path.indexOf('_'));
      currentXML = path.substr(0, path.indexOf('.'));

      if(currentChapter != lastChapter){
        contents[currentChapter - 1] = [];
      }

      contents[currentChapter - 1].push(currentXML);
      lastChapter = currentChapter;

    }

    var json = grunt.file.readJSON('app/settings.json'); //get file as json object

    json.settings.contents = contents;
    grunt.file.write('app/settings.json', JSON.stringify(json, null, 2));
  });

  grunt.registerTask('dev:theme', function(key, value) {
    var settingsFile = "app/settings.json";
    var json = grunt.file.readJSON(settingsFile);
    var theme = json.settings.theme;
    var files = [{
      expand: true,
      cwd: 'app/dir/themes/'+theme+'/scss',
      src: ['theme.scss'],
      dest: 'app/dir/themes/'+theme+'',
      ext: '.css'
    },
    {
      expand: true,
      cwd: 'app/src/scss/',
      src: ['main.scss'],
      dest: 'app/src',
      ext: '.css'
    }];


    grunt.log.oklns("THEME: " + theme.green);
    grunt.config.set("sass.dist.files", files);
  });

  grunt.event.on('watch', function(action, filepath, target) {
    var filetype = filepath.substring(filepath.indexOf('.'), filepath.length);
    grunt.log.oklns(filetype);

    if(filetype == '.scss'){
      grunt.task.run('sass');
    }
    else{
      grunt.task.run('webpack');
    }
  });
}
