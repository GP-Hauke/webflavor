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
          entry: './dev/src/js/App.jsx',
          output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'public/src')
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
          src : ['public/**/*', '!public/**/*.map']
        },
        options: {
          server: {
            baseDir: "./public"
          },
          watchTask: true,
          notify: false
        }
      },
      build : {
        bsFiles: {
          src : ['public/**/*', '!public/**/*.map']
        },
        options: {
          server: {
            baseDir: "./public"
          },
          notify: false
        }
      }
    },

    sass: {
      default: {
        options:{
        },
        files: [{
          expand: true,
          cwd: 'dev/src/scss',
          src: ['main.scss'],
          dest: 'public/src',
          ext: '.css'
        }]
      },
      theme: {
        options:{
        },
        files: [{
          expand: true,
          cwd: '',
          src: ['theme.scss'],
          dest: 'public/src',
          ext: '.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['dev/**'],
        tasks: [],
        options: {
          spawn: false
        }
      }
    },

    copy: {
      public: {
        files: [
          {
            expand: true,
            cwd: 'dev',
            src: ['**/*', '!view/themes/**','!src/**'],
            dest: 'public',
          }
        ]
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: 'public ',
            src: ['THIS IS UPDATED ON-RUN OF GRUNT'],
            dest: 'THIS IS UPDATED ON-RUN OF GRUNT',
          }
        ]
      }
    },

    clean: {
      dev: {
        src: ['public/view/**/*','public/src/**/*','!public/src/api/**', 'public/settings.json']
      },
      build: {
        src: ['public/**/*.map']
      },
      validate: {
        src: ['public/*.html', '!public/index.html']
      },
    },

    cssmin: {
      build: {
        files: [
        {
          'public/src/main.css': ['public/src/main.css']
        }]
      },
      vendors: {
        files: [
        {
          'public/src/vendors.min.css': ['dev/src/vendors/**/*.min.css']
        }]
      }
    },

    uglify: {
      vendors: {
        options: {
          mangle: false
        },

        files: {
          'public/src/vendors.min.js': ['dev/src/vendors/jquery/jquery-3.2.1.min.js', 'dev/src/vendors/bootstrap/js/bootstrap.min.js', 'dev/src/vendors/**/*.min.js']
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
          cwd: 'public',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'public'
        }]
      }
    },

    htmlhint: {
      html1: {
        options: {
          'tag-pair': true
        },
        src: ['public/**/*.html']
      }
    },

    compress: {
      main: {
        options: {
          archive: 'scorm_package.zip'
        },
        files: [{
          src: ['**/*'],
          cwd: 'public/',
          expand: true
        }]
      }
    },

    size_report: {
      your_target: {
        options: {
          header: 'PACKAGE SIZE REPORT'
        },
        files: {
          list: ['public/']
        }
      }
    }
  });

  //'browserSync:dev', 'watch', 'webpack'
  grunt.registerTask('dev', ['clean:dev', 'settings', 'update', 'copy:public', 'uglify:vendors', 'cssmin:vendors', 'build:theme', 'webpack', 'browserSync:dev', 'watch']);

  grunt.registerTask('build', ['validate','imagemin', 'cssmin:build', 'version', 'production', 'build:clean', 'compress', 'browserSync:build']);

  grunt.event.on('watch', function(action, filepath, target) {
    var filetype = path.extname(filepath);
    grunt.log.oklns(filetype.green);
      if(filetype == '.scss'){
      grunt.log.oklns();
      if(filepath.indexOf('themes') != -1){
        grunt.task.run('sass:theme');
      }
      else if(filepath.indexOf('src') != -1){
        grunt.task.run('sass:default');
      }
      else{
        grunt.task.run('sass');
      }
    }
      else if(filetype == '.js' || filetype == '.jsx'){
      grunt.task.run('webpack');
    }
      else{
      var dest = "public/"+filepath.substring(4, filepath.length).replace(path.basename(filepath), "");
      var files = [
        {
          expand: true,
          src: [filepath],
          dest: dest,
          flatten: true
        }
      ];
        grunt.config.set("copy.dev.files", files);
      grunt.task.run('copy:dev');
    }
  });

  grunt.registerTask('build:theme', function(key, value) {
    var settingsFile = "dev/settings.json";
    var json = grunt.file.readJSON(settingsFile);
    var theme = json.settings.theme;
    var themeDirect = [{
      expand: true,
      cwd: 'dev/view/themes/'+theme+'/scss',
      src: ['theme.scss'],
      dest: 'public/view/themes/'+theme,
      ext: '.css'
    }];

    var themeMisc = [
      {
        expand: true,
        cwd: 'dev',
        src: ['view/themes/'+theme+'/**', '!view/themes/'+theme+'/scss/**'
      ],
        dest: 'public',
      }
    ];
    grunt.config.set("copy.dev.files", themeMisc);
    grunt.task.run('copy:dev');

    grunt.log.oklns("THEME: " + theme.green);
    grunt.config.set("sass.theme.files", themeDirect);
    grunt.config.set("copy.build.src", themeMisc);
    grunt.task.run('sass:default', 'sass:theme');
  });

  grunt.registerTask('build:clean', function(key, value) {
    var settingsFile = "public/settings.json";
    var json = grunt.file.readJSON(settingsFile);
    var src =[];

    grunt.task.run('clean:build');

    if(json.settings.hasSplashPage == 'false'){
      src.push('public/view/content/splash.xml');
    }
    if(json.settings.hasGlossary == 'false'){
      src.push('public/view/content/glossary.xml');
    }
    if(json.settings.hasResources == 'false'){
      src.push('public/view/content/resources.xml');
    }
    if(json.settings.hasVehicleGame == 'false'){
      src.push('public/view/content/assessments.xml');
    }

    grunt.config.set("clean.build.src", src);
    grunt.task.run('clean:build');
  });

  grunt.registerTask('version', function(key, value) {
    var settingsFile = "dev/settings.json";
    var settingsFile2 = "public/settings.json";

    if (!grunt.file.exists(settingsFile)) {
      grunt.log.error("file " + settingsFile + " not found");
      return true; //return false to abort the execution
    }

    var json = grunt.file.readJSON(settingsFile); //get file as json object
    currentVersion = json.settings.version;
    var version = (parseFloat(currentVersion)+0.1).toFixed(1).toString();

    json.settings.version = version;
    grunt.log.oklns("VERSION: ".green + (json.settings.version).cyan);

    grunt.file.write(settingsFile, JSON.stringify(json, null, 2));
    grunt.file.write(settingsFile2, JSON.stringify(json, null, 2));

  });

  grunt.registerTask('production', function(key, value) {
    var settingsFile = "public/settings.json";
    if (!grunt.file.exists(settingsFile)) {
      grunt.log.error("file " + settingsFile + " not found");
      return true; //return false to abort the execution
    }

    var json = grunt.file.readJSON(settingsFile); //get file as json object

    json.settings.production = "true";

    grunt.file.write(settingsFile, JSON.stringify(json, null, 2));
  });

  grunt.registerTask('files', ['size_report']);

  grunt.registerTask('settings', function(key, value) {
    var settingsFile = "dev/settings.json";
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

  grunt.registerTask('update', function(key, value) {
    var pages = grunt.file.expand(["dev/view/content/pages/*.xml"]);
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

    var json = grunt.file.readJSON('dev/settings.json'); //get file as json object

    json.settings.contents = contents;
    grunt.file.write('dev/settings.json', JSON.stringify(json, null, 2));
    grunt.log.oklns("UPDATED TABLE OF CONTENTS"['green'].bold);

  });

  grunt.registerTask('validate', function(key, value) {
    var xmldoc = require('xmldoc');
    var pages = grunt.file.expand(["public/view/content/pages/*.xml"]);

    for(var i = 0; i < pages.length; i++){
      var xml = grunt.file.read(pages[i]);
      var xmlDoc = new xmldoc.XmlDocument(xml);
      var html = xmlDoc.valueWithPath("layout");

      var filename = pages[i].split("pages/")[1];
      filename = "public/"+filename.substring(0, filename.length - 3)+"html";

      grunt.file.write(filename, html);
    }

    grunt.log.oklns('HTML Created')
    grunt.task.run('htmlhint');
    grunt.task.run('clean:validate');
  });
};
