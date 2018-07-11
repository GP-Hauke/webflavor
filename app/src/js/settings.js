var LOCAL_COURSE_DATA_ID;

function initSettings(json) {
  LOCAL_COURSE_DATA_ID = json.settings.courseStorageID;

  var localStorageSize = ((JSON.stringify(localStorage).length * 2) / 1048576).toFixed(4);
  console.log("localStorage in megabytes: ", localStorageSize);

  var currentVersion = json.settings.version;

  var tempStorage = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  if(tempStorage === null || tempStorage.SETTINGS_VERSION !== currentVersion) {
    console.log("localStorage has reloaded");
    populateStorage(json, tempStorage);
  }
}

function populateStorage(json, tempStorage) {
  var courseStorageObj = {};
  courseStorageObj.TITLE = json.settings.courseTitle;
  courseStorageObj.SUB_TITLE = json.settings.courseSubTitle;
  courseStorageObj.SETTINGS_VERSION = json.settings.version;
  courseStorageObj.THEME = json.settings.theme;
  courseStorageObj.THEME_PATH = "dir/themes/" + courseStorageObj.THEME;
  courseStorageObj.COOKIE_NAME = json.settings.cookieName;
  courseStorageObj.MENU_PLACEMENT = json.settings.menuPlacement;
  courseStorageObj.MENU_STYLE = json.settings.menuStyle;
  courseStorageObj.HAS_MENU_LOGO = json.settings.hasMenuLogo;
  courseStorageObj.COMPLETION_METHOD = json.settings.completionMethod;
  courseStorageObj.HAS_FOOTER = json.settings.hasFooter;
  courseStorageObj.HAS_GLOSSARY = json.settings.hasGlossary;
  courseStorageObj.HAS_RESOURCES = json.settings.hasResources;
  courseStorageObj.HAS_HELP = json.settings.hasHelp;
  courseStorageObj.HAS_SPLASH_PAGE = json.settings.hasSplashPage;
  courseStorageObj.CONTENTS = json.settings.contents;
  courseStorageObj.TEST_FINISHED = false;

  /* if course is loaded for first time or hasCards was set to true for first time, cardData will be undefined, so set it here as stub. if course had been loaded previously with hasCards set to true, copy card data from previous localStorage. */
  if(json.settings.hasCards === "true") {
    if(tempStorage === null || tempStorage.cardData === undefined) {
      courseStorageObj.cardData = {};

    } else {
      courseStorageObj.cardData = tempStorage.cardData;
    }
  }

  courseStorageObj.HAS_LOCAL_BOOKMARKING = json.settings.bookmarking.hasLocalBookmarking;

  courseStorageObj.COUNT_PAGES = json.settings.pageCount.countPages;
  if(courseStorageObj.COUNT_PAGES == "true") {
    var pageCountObj = {"pagesTotal":0,"pagesVisited":0,"pageIds":[]};
    courseStorageObj.pageCount = pageCountObj;
  }

  if(json.settings.hasAssessments === "true") {
    if(tempStorage === null || tempStorage.assessmentData === undefined) {
      courseStorageObj.assessmentData = {};

    } else {
      courseStorageObj.assessmentData = tempStorage.assessmentData;
    }
  }

  if(json.settings.hasDragDrops === "true") {
    if(tempStorage === null || tempStorage.dragDropData === undefined) {
      courseStorageObj.dragDropData = {};

    } else {
      courseStorageObj.dragDropData = tempStorage.dragDropData;
    }
  }

  if(json.settings.hasHotspots === "true") {
    if(tempStorage === null || tempStorage.hotspotData === undefined) {
      courseStorageObj.hotspotData = {};

    } else {
      courseStorageObj.hotspotData = tempStorage.hotspotData;
    }
  }

  if(json.settings.hasKnowledgeChecks === "true") {
    if(tempStorage === null || tempStorage.knowledgeCheckData === undefined) {
      courseStorageObj.knowledgeCheckData = {};

    } else {
      courseStorageObj.knowledgeCheckData = tempStorage.knowledgeCheckData;
    }
  }

  if(json.settings.hasFlipCards === "true") {
    if(tempStorage === null || tempStorage.flipCardData === undefined) {
      courseStorageObj.flipCardData = {};

    } else {
      courseStorageObj.flipCardData = tempStorage.flipCardData;
    }
  }

  if(json.settings.hasThumbnails === "true") {
    if(tempStorage === null || tempStorage.thumbnailsData === undefined) {
      courseStorageObj.thumbnailsData = {};

    } else {
      courseStorageObj.thumbnailsData = tempStorage.thumbnailsData;
    }
  }

  if(json.settings.hasGlossary === "true") {
    if(tempStorage === null || tempStorage.glossary === undefined) {
      courseStorageObj.glossary = {};

    } else {
      courseStorageObj.glossary = tempStorage.glossary;
    }
  }
  if(json.settings.hasFooter === "false") {
    $('.footer').remove();
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseStorageObj));
  getNavigationData();
  loadXMLData();
}

/* ADD GLOSSARY ITEMS TO LOCAL STORAGE */
function addGlossaryToLocalStorage(xml) {
  var storage = localStorage.getItem(LOCAL_COURSE_DATA_ID);
  var tempStorage = JSON.parse(storage);

  tempStorage.glossary = {"items":[]}

  var itemsXML = $(xml).find("item");
  var items = [];

  for(var hl = 0; hl < itemsXML.length; hl++) {
    item = {};

    item.term = $(itemsXML[hl]).find('term').text();
    item.definition = $(itemsXML[hl]).find('definition').text();
    items.push(item);
  }

  tempStorage.glossary.items = items;



  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempStorage));
}
/*end ADD GLOSSARY TO LOCAL STORAGE */

/* ADD GLOSSARY ITEMS TO LOCAL STORAGE */
function addResourcesToLocalStorage(xml) {
  var storage = localStorage.getItem(LOCAL_COURSE_DATA_ID);
  var tempStorage = JSON.parse(storage);

  tempStorage.resources = {"items":[]}

  var itemsXML = $(xml).find("item");
  var items = [];

  for(var hl = 0; hl < itemsXML.length; hl++) {
    item = {};

    item.term = $(itemsXML[hl]).find('term').text();
    item.definition = $(itemsXML[hl]).find('definition').text();
    item.source = $(itemsXML[hl]).find('source').text();
    item.name = $(itemsXML[hl]).find('name').text();
    items.push(item);
  }

  tempStorage.resources.items = items;



  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempStorage));
}
/*end ADD GLOSSARY TO LOCAL STORAGE */

function addSplashToLocalStorage(xml) {
  var storage = localStorage.getItem(LOCAL_COURSE_DATA_ID);
  var tempStorage = JSON.parse(storage);

  tempStorage.splash = {
    "title": $(xml).find("title").text(),
    "caption": $(xml).find("caption").text(),
    "introduction": $(xml).find("introduction").text()
  }
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempStorage));
}

function getNavigationData(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var contents = courseData.CONTENTS;
  var pageCount = 0;
  var loadingComplete = false;
  var pageTotal = 0;
  var xmlArray = [];
  courseData.chapters = new Array(contents.length);

  for (var i = 0; i < contents.length; i++) {
    courseData.chapters[i] = {
      title: null,
      titleIndex: -1,
      isActive: true,
      pages: []
    }
    courseData.chapters[i].pages = new Array(contents[i].length);

    for (var j = 0; j < contents[i].length; j++) {
      pageTotal += 1;
      courseData.chapters[i].pages[j] = {
        title: null,
        file: contents[i][j],
        gated: false,
        locks: [0],
        audio: "",
        video: false
      }

      xmlArray.push({
        page: contents[i][j],
        completed: false
      });
    }
  }
  courseData.PAGE_TOTAL = pageTotal;
  activePageCount = pageTotal;
  courseData.TEST_CONTENTS = xmlArray;

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
  getChapterData();
}

function getChapterData(){
  var tempData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var activeCount = 0;
  for(var i = 0; i < tempData.chapters.length; i++){
    for(var j = 0; j < tempData.chapters[i].pages.length; j++){
      activeCount += 1;
      var arg = 'dir/content/course_content/' + tempData.chapters[i].pages[j].file +'.xml';
      $.ajax({
          url: arg,
          type: 'GET',
          chapterIndex: i,
          pageIndex: j,
          activeCount: activeCount,
          success: function(xml) {
            var pathMark = GetPathmark();

            if(this.pageIndex == 0){

              tempData.chapters[this.chapterIndex].title = $(xml).find("title").find("chapterTitle").text();

              if(pathMark && pathMark != "" && pathMark[i] != undefined) {
                var active = "false";
                if(pathMark[i].split("}")[0].split("]")[0] == "1") {
                  active = "true";
                }

                tempData.chapters[this.chapterIndex].isActive = active;
                tempData.chapters[this.chapterIndex].titleIndex = pathMark[i].split("}")[0].split("]")[1];

              }
              //No Scorm Interaction
              else {
                tempData.chapters[this.chapterIndex].isActive = "true";
                tempData.chapters[this.chapterIndex].titleIndex =- 1;
              }
            }

            var splitPathMark;
            if(pathMark && pathMark != "" && pathMark[i] != undefined) {
              splitPathMark = pathMark[i].split("}")[1].split(";");
            }

            tempData.chapters[this.chapterIndex].pages[this.pageIndex].title = $(xml).find("title").find("pageTitle").text();
            if($(xml).find("title").find("gated").text() == "true"){
              tempData.chapters[this.chapterIndex].pages[this.pageIndex].gated = true;
            }
            
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].locks = [0];
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].audio = false;
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].video = false;
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].count = this.activeCount;

            if(splitPathMark && splitPathMark[j]) {
              if(splitPathMark[j].indexOf(",") != -1) {
                var tpm = splitPathMark[j].split(",");
                splitPathMark[j] = tpm;

              } else {
                splitPathMark[j] = [splitPathMark[j]];
              }
                tempData.chapters[this.chapterIndex].pages[this.pageIndex].locks[0] = parseInt(splitPathMark[j][0],10);
            }

            for(var l = 0; l < parseInt($(xml).find("title").find("gated").attr("locks"), 10); l++) {
              if(splitPathMark && splitPathMark[j][l+1]) {
                  tempData.chapters[this.chapterIndex].pages[this.pageIndex].locks.push(parseInt(splitPathMark[j][l+1],10));
              } else {
                  tempData.chapters[this.chapterIndex].pages[this.pageIndex].locks.push(0);
              }
            }


            localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempData));

            //console.log(tempData.chapters[this.chapterIndex].pages[this.pageIndex].title);
          },
          complete: function(){
            var current = tempData.chapters[this.chapterIndex].pages[this.pageIndex].file;

            tempData.TEST_CONTENTS.forEach(function(item, index){
              if(item.page == current){
                item.completed = true;
              }

            });

            for(var i = 0; i < tempData.TEST_CONTENTS.length; i++){
              if(tempData.TEST_CONTENTS[i].completed != true){
                tempData.TEST_FINISHED = false;
                break;
              }
              else{
                tempData.TEST_FINISHED = true;
              }
            }
            if(tempData.TEST_FINISHED){
              console.log("Navigation loading completed:");
              //RUN REST OF INITALIZE LOCALSTORAGE DATA
              navigationLoaded = true;
              buildInterface();
              loadXMLData();
            }
          }
      });
    }
  }
}

function checkContentComplete(xmlArray){
  xmlArray.forEach(function(item) {
    if(item.completed != true){
      return false;
    }
  });
  return true;
}

function loadInterfaceStyles() {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  $(".add-theme-path").attr("src", function () {
    return $(this).attr("src").replace("theme-path", courseData.THEME_PATH);
  });

  $(".add-theme-path-head").attr("href", function () {
    $(this).attr("href").replace("theme-path", courseData.THEME_PATH);

    return $(this).attr("href").replace("theme-path", courseData.THEME_PATH);
  });

}

function loadContentStyles() {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  $(".add-theme-path").attr("src", function () {
    return $(this).attr("src").replace("theme-path", courseData.THEME_PATH);
  });

  $(".add-theme-path-head").attr("href", function () {
    return $(this).attr("href").replace("theme-path", courseData.THEME_PATH);
  });
}
