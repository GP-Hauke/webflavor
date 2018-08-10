//////////////////////////////////////////////////////////////////////
//
//     App JS
//      - Main JS file and entry point.
//      - Loads localStorage and initializes settings.
//
//////////////////////////////////////////////////////////////////////


import * as Interface from './Interface.jsx';
import * as Tracking from './Tracking.jsx';
import * as Game from './components/assessment_functions';

var LOCAL_COURSE_DATA_ID;

var Signal;
var courseData;

var settingsLoaded = false;
var glossaryLoaded = false;
var resourcesLoaded = false;
var navigationLoaded = false;
var cardContentLoaded = false;
var stringsLoaded = false;
var assessmentsLoaded = false;
var splashLoaded = false;
var splashViewed = false;

var totalPages;
var activePageCount;
var currentChapter;
var currentPage;
var pageIsLoading = false;
var resources;
var strings = [];
var checkingXMLCompleteAlready = false;
var cookieName = "cookieName";
var muted = false;
var volume = .6;

window.onresize = function() {
  if($(window).width() < $('#navbarMain').width()){
    console.log("COLLAPSE");
    //$('#navbarMain').css({'display':'none'})
  }
  else{
    //$('#navbarMain').css({'display':'block'})
  }
}

$(document).ready(function() {
  initLocalStorage();
});

function initLocalStorage() {
  //console.log("initInterface()");

  //LOGIC FOR DEVELOPING


  $(window).resize(function() {
    calculateHeight();
  });
  $(window).on("unload", function(){
    Tracking.QuitLMS();
  });

  Tracking.StartLMS();

  $.get("settings.json")
  .done(function(json) {
    settingsLoaded = true;
    LOCAL_COURSE_DATA_ID = json.settings.courseStorageID;

    var localStorageSize = ((JSON.stringify(localStorage).length * 2) / 1048576).toFixed(4);
    console.log("localStorage in megabytes: ", localStorageSize);

    var currentVersion = json.settings.version;

    if(json.settings.production == null){
      localStorage.clear();
    }

    var tempStorage = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

    if(tempStorage === null || tempStorage.SETTINGS_VERSION !== currentVersion) {
      populateStorage(json, tempStorage);
      console.log("localStorage has reloaded");
    }

    else{
      loadInterfaceStyles();
      Interface.initInterface(LOCAL_COURSE_DATA_ID);
      return;
    }
  });
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
  courseStorageObj.HAS_FOOTER = json.settings.hasFooter;
  courseStorageObj.HAS_GLOSSARY = json.settings.hasGlossary;
  courseStorageObj.HAS_RESOURCES = json.settings.hasResources;
  courseStorageObj.HAS_HELP = json.settings.hasHelp;
  courseStorageObj.HAS_SPLASH_PAGE = json.settings.hasSplashPage;
  courseStorageObj.HAS_INTERACTIVE_COMPLETION = json.settings.hasInteractiveCompletion;
  courseStorageObj.SETTINGS_LOADED = false;
  courseStorageObj.INTERACTIVES_TOTAL = 0;
  courseStorageObj.INTERACTIVES_COMPLETED = 0;
  courseStorageObj.CONTENTS = {
    toc: json.settings.contents,
    completed: []
  };

  courseStorageObj.HAS_VEHICLE_GAME = json.settings.hasVehicleGame;

  courseStorageObj.ctrData = {TOTAL: 0};
  courseStorageObj.dragDropData = {TOTAL: 0};
  courseStorageObj.flipCardData = {TOTAL: 0};
  courseStorageObj.hotspotData = {TOTAL: 0};
  courseStorageObj.knowledgeCheckData = {TOTAL: 0};
  courseStorageObj.thumbnailData = {TOTAL: 0};
  courseStorageObj.videoAudioData = {TOTAL: 0};
  courseStorageObj.assessmentData = {TOTAL: 0};

  courseStorageObj.COUNT_PAGES = json.settings.hasCountPages;
  if(courseStorageObj.COUNT_PAGES == "true") {
    var pageCountObj = {"pagesTotal":0,"pagesVisited":0,"pageIds":[]};
    courseStorageObj.pageCount = pageCountObj;
  }

  if(json.settings.hasFooter === "false") {
    $('.footer').remove();
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseStorageObj));
  getNavigationData();
}

function getNavigationData(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var contents = courseData.CONTENTS.toc;
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
  courseData.CONTENTS.completed = xmlArray;
  if(courseData.COUNT_PAGES == "true"){
    courseData.pageCount.pagesTotal = pageTotal;
  }

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
            var pathMark = Tracking.GetPathmark();

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

            tempData.chapters[this.chapterIndex].pages[this.pageIndex].title = $(xml).find("title").find("pageTitle").text();
            if($(xml).find("title").find("gated").text() == "true"){
              tempData.chapters[this.chapterIndex].pages[this.pageIndex].gated = true;
            }

            tempData.chapters[this.chapterIndex].pages[this.pageIndex].locks = [0];
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].audio = false;
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].video = false;
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].count = this.activeCount;
            tempData.chapters[this.chapterIndex].pages[this.pageIndex].content = $(xml).find("layout").text();

            var components = $(xml).find("components");
            components.children().each(function(){
              var type = $(this)[0].tagName;
              tempData = countInteractives(type, tempData)
            });

            localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempData));
            //console.log(tempData.chapters[this.chapterIndex].pages[this.pageIndex].title);
          },
          complete: function(){
            var current = tempData.chapters[this.chapterIndex].pages[this.pageIndex].file;

            tempData.CONTENTS.completed.forEach(function(item, index){
              if(item.page == current){
                item.completed = true;
              }

            });

            for(var i = 0; i < tempData.CONTENTS.completed.length; i++){
              if(tempData.CONTENTS.completed[i].completed != true){
                tempData.SETTINGS_LOADED = false;
                break;
              }
              else{
                tempData.SETTINGS_LOADED = true;
              }
            }
            if(tempData.SETTINGS_LOADED){
              console.log("Navigation loading completed:");
              //RUN REST OF INITALIZE LOCALSTORAGE DATA
              navigationLoaded = true;
              settingsLoaded = true;

              //buildInterface();
              loadXMLData();
            }
          }
      });
    }
  }
}

function loadXMLData() {
  //console.log("loadXMLData()");
  courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));


  if(courseData.HAS_RESOURCES === 'true' && resourcesLoaded === false) {
    GetInterfaceXML("dir/content/resources.xml");
    return;
  }

  if(courseData.HAS_GLOSSARY === 'true' && glossaryLoaded === false) {
    GetInterfaceXML("dir/content/glossary.xml");
    return;

  }
  if(courseData.HAS_SPLASH_PAGE === 'true' && splashLoaded === false){
    GetInterfaceXML("dir/content/splash.xml");
    return;

  }

  if(courseData.HAS_VEHICLE_GAME === 'true' && assessmentsLoaded === false) {
    GetInterfaceXML("dir/content/assessments.xml");
    return;
  }
 else {
    loadInterfaceStyles();
    Interface.initInterface(LOCAL_COURSE_DATA_ID);
    return;
  }
}

function GetInterfaceXML(args) {
  $.get(args).done(function(xml) {
    if(args.indexOf("glossary") != -1) {
      glossaryLoaded = true;
      addGlossaryToLocalStorage(xml);
      loadXMLData();
    }
    else if(args.indexOf("resources") != -1) {
      resourcesLoaded = true;
      addResourcesToLocalStorage(xml);
      loadXMLData();
    }
    else if(args.indexOf("splash") != -1) {
      splashLoaded = true;
      addSplashToLocalStorage(xml);
      loadXMLData();
    }
    else if(args.indexOf("assessments") != -1) {
      assessmentsLoaded = true;
      Game.initAssessments(LOCAL_COURSE_DATA_ID, xml); // lives in assessment_functions.js
      loadXMLData();
    }
  });
}

function addGlossaryToLocalStorage(xml) {
  var storage = localStorage.getItem(LOCAL_COURSE_DATA_ID);
  var tempStorage = JSON.parse(storage);

  tempStorage.glossary = {"items":[]}

  var itemsXML = $(xml).find("item");
  var items = [];

  for(var hl = 0; hl < itemsXML.length; hl++) {
    var item = {};

    item.term = $(itemsXML[hl]).find('term').text();
    item.definition = $(itemsXML[hl]).find('definition').text();
    items.push(item);
  }
  tempStorage.glossary.items = items;
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempStorage));
}

function addResourcesToLocalStorage(xml) {
  var storage = localStorage.getItem(LOCAL_COURSE_DATA_ID);
  var tempStorage = JSON.parse(storage);

  tempStorage.resources = {"items":[]}

  var itemsXML = $(xml).find("item");
  var items = [];

  for(var hl = 0; hl < itemsXML.length; hl++) {
    var item = {};

    item.term = $(itemsXML[hl]).find('term').text();
    item.definition = $(itemsXML[hl]).find('definition').text();
    item.source = $(itemsXML[hl]).find('source').text();
    item.name = $(itemsXML[hl]).find('name').text();
    items.push(item);
  }

  tempStorage.resources.items = items;
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(tempStorage));
}

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

function loadInterfaceStyles(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  $(".add-theme-path").attr("src", function () {
    return $(this).attr("src").replace("theme-path", courseData.THEME_PATH);
  });

  $(".add-theme-path-head").attr("href", function () {
    $(this).attr("href").replace("theme-path", courseData.THEME_PATH);

    return $(this).attr("href").replace("theme-path", courseData.THEME_PATH);
  });
}

function calculateHeight() {
  // subtracting one pixel ensures that second scroll bar doesn't appear
  // adding padding to accommodate Bootstrap header nav
  // console.log("calculateHeight");
  // console.log($("#navbar").height());

  //  $("#contentContainer").css({height:$(window).height() - 1, paddingTop:$("#navbar").height()});
  //$("#contentContainer").css({height:$(window).height() - 1});
  $("#contentContainer").css({height:$(window).height()-($('#navContainer').height()+getFooterHeight())});


  var navItemHeight = (($(window).height()-($('#navContainer').height()+getFooterHeight())) * .75)/ $('.courseTitleChapter').length;
  //$('.tabbed #navbarMobile .courseTitleChapter').css({height: navItemHeight});
  //---------------DEPRICATED AFTER REMOVING IFRAMES---------------
  //$("#contentFrame").css({height:$("#contentContainer").height()});
  //$("#contentFrame").css({height:$("#contentContainer").height() - $("#navbar").height(), top:$("#navbar").height()});
  //$("#contentFrame").css({height:$("#contentContainer").height() - 7});

  $("#audioBar").width($("#mainContainer").width()-216-$("#navBtns").width());
  $('.leftNav #navbarMain').css({height:$(window).height()-($('#navContainer').height()+getFooterHeight())});

}

function getFooterHeight() {
  if($('footer').height() == null){
    return 0;
  }
  return $('footer').height();
}

function countInteractives(interactive, tempData){
  if(interactive == "Ctr"){
    if(tempData.ctrData == null){
      tempData.ctrData = {TOTAL: 0};
    }
    tempData.ctrData.TOTAL += 1;
    tempData.INTERACTIVES_TOTAL += 1;
  }
  else if(interactive == "DragAndDrop"){
    if(tempData.dragDropData == null){
      tempData.dragDropData = {TOTAL: 0};
    }
    tempData.dragDropData.TOTAL += 1;
    tempData.INTERACTIVES_TOTAL += 1;
  }
  else if(interactive == "FlipCard"){
    if(tempData.flipCardData == null){
      tempData.flipCardData = {TOTAL: 0};
    }
    tempData.flipCardData.TOTAL += 1;
    tempData.INTERACTIVES_TOTAL += 1;
  }
  else if(interactive == "Hotspot"){
    if(tempData.hotspotData == null){
      tempData.hotspotData = {TOTAL: 0};
    }
    tempData.hotspotData.TOTAL += 1;
    tempData.INTERACTIVES_TOTAL += 1;
  }
  else if(interactive == "KnowledgeCheck"){
    if(tempData.knowledgeCheckData == null){
      tempData.knowledgeCheckData = {TOTAL: 0};
    }
    tempData.knowledgeCheckData.TOTAL += 1;
    tempData.INTERACTIVES_TOTAL += 1;
  }
  else if(interactive == "Thumbnails"){
    if(tempData.thumbnailData == null){
      tempData.thumbnailData = {TOTAL: 0};
    }
    tempData.thumbnailData.TOTAL += 1;
    tempData.INTERACTIVES_TOTAL += 1;
  }
  else if(interactive == "VideoAudio"){
    if(tempData.videoAudioData == null){
      tempData.videoAudioData = {TOTAL: 0};
    }
    tempData.videoAudioData.TOTAL += 1;
    tempData.INTERACTIVES_TOTAL += 1;
  }


  return tempData;
}
