var LOCAL_COURSE_DATA_ID;

function initSettings(xml) {
  LOCAL_COURSE_DATA_ID = $(xml).find("courseStorageID").text();

  /*var localStorageLen = JSON.stringify(localStorage).length;
    console.log("localStorageLen ", localStorageLen);

    var l = 1;
    localStorage.setItem(l, "x");

    for(var i = 0; i < 100000; i++) {
      console.log("uh oh... ", i);
      var ls = localStorage.getItem(l);
      var templs = JSON.stringify(ls);
    }*/

  var localStorageSize = ((JSON.stringify(localStorage).length * 2) / 1048576).toFixed(4);
  console.log("localStorage in megabytes: ", localStorageSize);

  var currentVersion = $(xml).find("version").text();

  var tempStorage = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  if(tempStorage === null || tempStorage.SETTINGS_VERSION !== currentVersion) {

    populateStorage(xml, tempStorage);

  }
}

function populateStorage(xml, tempStorage) {
  var courseStorageObj = {};
  courseStorageObj.TITLE = $(xml).find("courseTitle").text();
  courseStorageObj.SUB_TITLE = $(xml).find("courseSubTitle").text();
  courseStorageObj.SETTINGS_VERSION = $(xml).find("version").text();
  courseStorageObj.THEME = $(xml).find("theme").text();
  courseStorageObj.THEME_PATH = "dir/themes/" + courseStorageObj.THEME;
  courseStorageObj.COOKIE_NAME = $(xml).find("cookieName").text();
  courseStorageObj.MENU_PLACEMENT = $(xml).find("menuPlacement").text();
  courseStorageObj.COMPLETION_METHOD = $(xml).find("completionMethod").text();
  courseStorageObj.HAS_STRINGS = $(xml).find("hasStrings").text();
  courseStorageObj.HAS_GLOSSARY = $(xml).find("hasGlossary").text();
  courseStorageObj.HAS_RESOURCES = $(xml).find("hasResources").text();
  courseStorageObj.HAS_SPLASH_PAGE = $(xml).find("hasSplashPage").text();

  /* if course is loaded for first time or hasCards was set to true for first time, cardData will be undefined, so set it here as stub. if course had been loaded previously with hasCards set to true, copy card data from previous localStorage. */
  if($(xml).find("hasCards").text() === "true") {
    if(tempStorage === null || tempStorage.cardData === undefined) {
      courseStorageObj.cardData = {};

    } else {
      courseStorageObj.cardData = tempStorage.cardData;
    }
  }

  courseStorageObj.HAS_LOCAL_BOOKMARKING = $(xml).find("hasLocalBookmarking").text();

  courseStorageObj.COUNT_PAGES = $(xml).find("countPages").text();
  if(courseStorageObj.COUNT_PAGES == "true") {
    var pageCountObj = {"pagesTotal":0,"pagesVisited":0,"pageIds":[]};
    courseStorageObj.pageCount = pageCountObj;
  }

  if($(xml).find("hasAssessments").text() === "true") {
    if(tempStorage === null || tempStorage.assessmentData === undefined) {
      courseStorageObj.assessmentData = {};

    } else {
      courseStorageObj.assessmentData = tempStorage.assessmentData;
    }
  }

  if($(xml).find("hasGlossary").text() === "true") {
    if(tempStorage === null || tempStorage.glossary === undefined) {
      courseStorageObj.glossary = {};

    } else {
      courseStorageObj.glossary = tempStorage.glossary;
    }
  }


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseStorageObj));
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


function addNavToLocalStorage(xml) {
  var storage = localStorage.getItem(LOCAL_COURSE_DATA_ID);
  var tempStorage = JSON.parse(storage);

  var useNextPrevLabelXML = xml.getElementsByTagName("course")[0].getAttribute("useNextPrevLabel");

  if(useNextPrevLabelXML == "true") {
    tempStorage.USE_PREV_NEXT_LBL = true;
  }

  tempStorage.headerLinks = {"included":$(xml).find("headerLinks").attr("included"), "links":[]}

  if(tempStorage.headerLinks.included === "true") {
    var headerlinksXML = $(xml).find("headerLink");
    var headerLinks = [];

    for(var hl = 0; hl < headerlinksXML.length; hl++) {
      headerlink = {};
      headerlink.title = $(headerlinksXML[hl]).text();
      headerlink.href = $(headerlinksXML[hl]).attr("href");
      headerlink.id = $(headerlinksXML[hl]).attr("itemId");
      headerlink.target = $(headerlinksXML[hl]).attr("target");
      headerLinks.push(headerlink);
    }

    tempStorage.headerLinks.links = headerLinks;
  }

  var chapters = [];
  var pageCount = 0;

  var pm = GetPathmark();
  if(pm && pm != "" && pm.indexOf("]") != -1) {
    if(pm.indexOf(":") != -1) {
      pm = pm.split(":");

    } else {
      pm = [pm];
    }
  } else {
    pm = "";
  }

  var chapterXML = $(xml).find("chapter");

  for(var i = 0; i < chapterXML.length; i++) {
    var chp = {};

    chp.title = $(chapterXML[i]).find("title").text()

    if(pm && pm != "" && pm[i] != undefined) {
      var active = "false";
      if(pm[i].split("}")[0].split("]")[0] == "1") {
        active = "true";
      }

      chp.isActive = active;
      chp.titleIndex = pm[i].split("}")[0].split("]")[1];

    } else {
      chp.isActive = "true";
      chp.titleIndex =- 1;
    }

    chp.pages = new Array();
    var lpm;
    if(pm && pm != "" && pm[i] != undefined) {
      lpm = pm[i].split("}")[1].split(";");
    }

    var pageXML = chapterXML[i].getElementsByTagName("pages")[0].getElementsByTagName("page");

    for(var j = 0; j < pageXML.length; j++) {
      pageCount++;

      var pg = new Object;

      pg.title = pageXML[j].childNodes[0].nodeValue;

      pg.gated = (pageXML[j].getAttribute("gated") == "true") ? true : false;

      pg.audio = "";
      pg.video = false;

      if(pageXML[j].getAttribute("audio")) {
        pg.audio = pageXML[j].getAttribute("audio");
      }

      if(pageXML[j].getAttribute("video") && pageXML[j].getAttribute("video") == "true") {
        pg.video = true;
      }

      pg.locks = [0];

      if(lpm && lpm[j]) {
        if(lpm[j].indexOf(",") != -1) {
          var tpm = lpm[j].split(",");
          lpm[j] = tpm;

        } else {
          lpm[j] = [lpm[j]];
        }
        pg.locks[0] = parseInt(lpm[j][0],10);
      }

      for(var l = 0; l < parseInt(pageXML[j].getAttribute("locks"), 10); l++) {
        if(lpm && lpm[j][l+1]) {
          pg.locks.push(parseInt(lpm[j][l+1],10));

        } else {
          pg.locks.push(0);
        }
      }

      pg.file = i + "_" + j;
      pg.count = pageCount;
      chp.pages.push(pg);
    }
    chapters.push(chp);
  }

  tempStorage.chapters = chapters;
  // console.log("tempStorage ", tempStorage);

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempStorage));
}

function loadInterfaceStyles() {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  $(".add-theme-path").attr("src", function () {
    return $(this).attr("src").replace("theme-path", courseData.THEME_PATH);
  });

  $(".add-theme-path-head").attr("href", function () {
    return $(this).attr("href").replace("theme-path", courseData.THEME_PATH);
  });
}

function loadContentStyles() {
  var courseData = JSON.parse(localStorage.getItem(window.parent.LOCAL_COURSE_DATA_ID));
  $(".add-theme-path").attr("src", function () {
    return $(this).attr("src").replace("theme-path", courseData.THEME_PATH);
  });

  $(".add-theme-path-head").attr("href", function () {
    return $(this).attr("href").replace("theme-path", courseData.THEME_PATH);
  });
}
