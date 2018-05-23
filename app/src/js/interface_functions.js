var Signal;
var courseData;

var settingsLoaded = false;
var glossaryLoaded = false;
var resourcesLoaded = false;
var navigationLoaded = false;
var cardContentLoaded = false;
var stringsLoaded = false;
var assessmentsLoaded = false;
var dragDropsLoaded = false;
var splashLoaded = false;

var totalPages;
var activePageCount;
var currentChapter;
var currentPage;
var pageIsLoading = false;
var resources;
var strings = [];

var cookieName = "cookieName";

var muted = false;
var volume = .6;

function initInterface() {

  //Clear Local Storage for Development: REMOVE LATER
  localStorage.clear();

  //  Signal = signals.Signal;

  $(window).resize(function() {
    calculateHeight();
  });

  $(window).on("unload", function(){
    QuitLMS();
  });

  StartLMS();

  loadXMLData();
}

function loadXMLData() {
  if(settingsLoaded === false) {
    GetInterfaceXML("../../dir/content/settings.xml");
    return;
  }

  courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  if(courseData.HAS_RESOURCES === 'true' && resourcesLoaded === false) {
    GetInterfaceXML("../../dir/content/course_resources.xml");
    return;
  }

  if(courseData.MENU_PLACEMENT !== 'none' && navigationLoaded === false) {
    GetInterfaceXML("../../dir/content/navigation.xml");
    return;
  }

  if(courseData.cardData !== undefined && cardContentLoaded === false) {
    GetInterfaceXML("../../dir/content/card_content.xml");
    return;
  }

  if(courseData.assessmentData !== undefined && assessmentsLoaded === false) {
    GetInterfaceXML("../../dir/content/assessments.xml");
    return;
  }

  if(courseData.dragDropData !== undefined && dragDropsLoaded === false) {
    GetInterfaceXML("../../dir/content/drag_drops.xml");
    return;
  }

  if(courseData.HAS_GLOSSARY === 'true' && glossaryLoaded === false) {
    GetInterfaceXML("../../dir/content/glossary.xml");
    return;

  }
  if(courseData.HAS_SPLASH_PAGE === 'true' && splashLoaded === false){
    GetInterfaceXML("../../dir/content/splash.xml");
    return;

  } else {
    checkXMLLoadingComplete();
  }
}

function GetInterfaceXML(args) {
  $.get(args)

  .done(function(xml) {

    if(args.indexOf("settings") != -1) {
      settingsLoaded = true;
      initSettings(xml); // function lives in settings.js
      loadXMLData();

    } else if(args.indexOf("course_resources") != -1) {
      resourcesLoaded = true;
      buildReources(xml);
      loadXMLData();

    } else if(args.indexOf("navigation") != -1) {
      navigationLoaded = true;
      addNavToLocalStorage(xml);
      buildInterface();
      loadXMLData();

    } else if(args.indexOf("card_content") != -1) {
      cardContentLoaded = true;
      initCardContent(xml); // lives in card_content_functions.js
      loadXMLData();

    } else if(args.indexOf("assessments") != -1) {
      assessmentsLoaded = true;
      initAssessments(xml); // lives in assessment_functions.js
      loadXMLData();

    } else if(args.indexOf("drag_drops") != -1) {
      dragDropsLoaded = true;
      initDragDrops(xml); // lives in assessment_functions.js
      loadXMLData();

    } else if(args.indexOf("strings") != -1) {
      stringsLoaded = true;
      buildStrings(xml);
    }
    else if(args.indexOf("glossary") != -1) {
      glossaryLoaded = true;
      addGlossaryToLocalStorage(xml);
      loadXMLData();
    }
    else if(args.indexOf("splash") != -1) {
      splashLoaded = true;
      addSplashToLocalStorage(xml);
      loadXMLData();
    }
  });
}

function buildInterface() {
  var pageCount = 0;

  document.title = courseData.TITLE;

  cookieName = courseData.COOKIE_NAME;

  totalPages = pageCount;
  currentChapter = 0;
  currentPage = 0;

  buildShellUI();

  if(courseData.COUNT_PAGES === 'true') {
    courseData.pageCount.pagesTotal = totalPages;
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  }
}

function buildShellUI() {

  if(courseData.MENU_PLACEMENT === 'top') {
    buildTopNav();

  } else if(courseData.MENU_PLACEMENT === 'left') {
    buildLeftNav();
  }
  else {
    buildNoneNav();
  }
}

function buildReources(xml) {
  resources = new Glossary(xml);
}

function buildStrings(xml) {
  for(var i = 0; i < xml.getElementsByTagName("string").length; i++) {
    strings.push(xml.getElementsByTagName("string")[i].childNodes[0].nodeValue);
  }
  checkXMLLoadingComplete();
}

function checkXMLLoadingComplete() {
  if(courseData.chapters !== null) {

    // if strings.xml is used, populate html here, e.g.:
    //    $("#mainMenuLabel").html(strings[0]);

    if(courseData.HAS_LOCAL_BOOKMARKING == 'true') {
      var goToPage = courseData.localBookmarkingStorage;

      currentChapter = goToPage.chapter;

      currentPage = goToPage.page;

    } else {
      var bm = GetBookmark();
      //      console.log("bm ", bm);
      if(bm && bm != "" && bm.indexOf("_")) {
        if(!isNaN(parseInt(bm.split("_")[0],10))) {
          currentChapter = parseInt(bm.split("_")[0],10);
        }

        if(!isNaN(parseInt(bm.split("_")[1],10))) {
          currentPage = parseInt(bm.split("_")[1],10);
        }
      }

    }

    loadPage();

    enforcedShow($("#mainContainer"));
    if(courseData.HAS_SPLASH_PAGE === 'true' && currentChapter === 0 && currentPage === 0) {
      openModal('splashPage');
    }
    if(courseData.HAS_GLOSSARY === 'true') {
      $('#btnGlossary').click(function(){openModal('glossary');});
    }
    $('#btnHelpModal').click(function(){openModal('help');});

    $("#mainContainer").css("opacity",1);
    $("body").css("opacity",1);
    $("body").focus();
  }
}

function enforcedShow(elem) {
  elem.show();
  if(elem.hasClass("hidden")) {
    elem.removeClass("hidden");
  }
}

function resumeYes() {
  $("#resumeFrame").hide();

  if(courseData.chapters[currentChapter].pages[currentPage].audio!="") {
    $("#audioBar").show();
    startAudio(courseData.chapters[currentChapter].pages[currentPage].audio);

  } else {
    $("#audioBar").hide();
  }
}

function resumeNo() {
  $("#resumeFrame").hide();
  openPage(0,0)
}

function buildTopNav() {

  var navMarkup = '';
  $.get("src/components/navigation/nav.html", function(data) {
    navMarkup = data;
    $("#navContainer").append(navMarkup);

    $('#titleMain').html(courseData.TITLE+":");
    $('#titleMainMobile').html(courseData.TITLE);
    $('#subTitle').html(courseData.SUB_TITLE);
    $('#subTitleMobile').html(courseData.SUB_TITLE);

    // MOBILE NAV DRAWER
    var mobileNav = '';

    for(var i = 0; i < courseData.chapters.length; i++) {

      var mobileMenuButton = "";

      if(courseData.chapters[i].pages.length > 1) {

        mobileMenuButton = '<li><button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse'+i+'" aria-expanded="false" aria-controls="collapseExample">'+courseData.chapters[i].title+'</button><div class="collapse" id="collapse'+i+'"><ul class="">';

        for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
          mobileMenuButton = mobileMenuButton + '<li><a href="javascript:openPage('+i+','+j+')">'+courseData.chapters[i].pages[j].title+'</a></li>';
        }

        mobileMenuButton = mobileMenuButton + '</ul></div></li>';

      } else {
        mobileMenuButton = '<li class="courseTitleChapter" id="courseTitleChapter'+i+'" onclick="openPage('+i+',0)">'+courseData.chapters[i].title+'</li>';
      }

      mobileNav = mobileNav + mobileMenuButton;

    }

    $("#navbarMobile").append(mobileNav);
    // END MOBILE NAV DRAWER

    // HEADER LINKS
    if(courseData.headerLinks.included === "true") {
      var headerLinks = "";
      for(var i = 0; i < courseData.headerLinks.links.length; i++) {
        var headerLinkEl = '<li><a id="'+courseData.headerLinks.links[i].id+'" href="'+courseData.headerLinks.links[i].href+'" target="'+courseData.headerLinks.links[i].target+'">'+courseData.headerLinks.links[i].title+'</a></li>';
        headerLinks = headerLinks + headerLinkEl;
      }
      $("#headerLinks").append(headerLinks);
    }
    // END HEADER LINKS

    // BOTTOM NAV
    var bottomNav = '<div class="container"><div id="navbarBottomCollapse" class="navbar-collapse collapse"><ul id="nav-items-bottom-row" class="nav nav-justified">';

    for(var i = 0; i < courseData.chapters.length; i++) {

      var menuButton = "";

      if(courseData.chapters[i].pages.length > 1) {

        menuButton = '<li class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+courseData.chapters[i].title+'<span class="caret"></span></button><ul class="dropdown-menu">';

        for(var k = 0; k < courseData.chapters[i].pages.length; k++) {
          menuButton = menuButton + '<li><a href="javascript:openPage('+i+','+k+')">'+courseData.chapters[i].pages[k].title+'</a></li>';
        }

        menuButton = menuButton + '</ul></li>';

      } else {
        menuButton = '<li class="courseTitleChapter" id="courseTitleChapter'+i+'" onclick="openPage('+i+',0)">'+courseData.chapters[i].title+'</li>';
      }

      bottomNav = bottomNav + menuButton;

      /*var currentTitle = chapters[i].title;

      if(chapters[i].titleIndex != -1) {
      currentTitle = chapters[i].title.split(";")[chapters[i].titleIndex];
    }

    if(i == currentChapter) {
    if(chapters.length > 1) {
    navMarkup = navMarkup+'<div id="chapter'+i+'" class="chapterSelected chapterIncomplete chapterTitle" style="margin-top:0em" onclick="openPage('+i+',0)">'+currentTitle+'</div>';

  } else {
  navMarkup = navMarkup+'<div id="chapter'+i+'" class="chapterSelected chapterIncomplete chapterTitle" style="margin-top:0em" onclick="openPage('+i+',0)">'+currentTitle+'</div>';
}
navMarkup = navMarkup+'<div id="pages'+i+'">';

} else {
navMarkup = navMarkup+'<div id="chapter'+i+'" class="chapterNotSelected chapterIncomplete chapterTitle" onclick="openPage('+i+',0)">'+currentTitle+'</div>';

navMarkup = navMarkup+'<div id="pages'+i+'">';
}

for(var j = 0; j < chapters[i].pages.length; j++) {

if(i == currentChapter && j == currentPage) {
navMarkup = navMarkup+'<a href="javascript:openPage('+i+','+j+');void(0)"><div id="mi'+i+'_'+j+'" class="menuItem menuItemSelected">'+chapters[i].pages[j].title+'</div></a>';

} else {
navMarkup = navMarkup+'<a href="javascript:openPage('+i+','+j+');void(0)"><div id="mi'+i+'_'+j+'" class="menuItem '+notSelectedClass+'">'+chapters[i].pages[j].title+'</div></a>';
}
}
navMarkup = navMarkup+'</div>';*/
}

bottomNav = bottomNav + '</ul></div></div>';

$("#navbarMain").on('hidden.bs.collapse', function () {
  calculateHeight();
});

$("#navbarBottom").append(bottomNav);
// END BOTTOM NAV

loadInterfaceStyles();

});

var notSelectedClass = "menuItemNotSelected";

}

function buildLeftNav() {

  var navMarkup = '';
  $.get("src/components/navigation/navLeft.html", function(data) {
    navMarkup = data;
    $("#navContainer").append(navMarkup);

    $('#titleMain').html(courseData.TITLE+":");
    $('#titleMainMobile').html(courseData.TITLE);
    $('#subTitle').html(courseData.SUB_TITLE);
    $('#subTitleMobile').html(courseData.SUB_TITLE);

    $('#contentFrame').css('width', '87.5%');
    // HEADER LINKS
    if(courseData.headerLinks.included === "true") {
      var headerLinks = "";
      for(var i = 0; i < courseData.headerLinks.links.length; i++) {
        var headerLinkEl = '<li><a id="'+courseData.headerLinks.links[i].id+'" href="'+courseData.headerLinks.links[i].href+'" target="'+courseData.headerLinks.links[i].target+'">'+courseData.headerLinks.links[i].title+'</a></li>';
        headerLinks = headerLinks + headerLinkEl;
      }
      $("#headerLinks").append(headerLinks);
    }
    // END HEADER LINKS

    // MOBILE NAV DRAWER
    var mobileNav = '';

    for(var i = 0; i < courseData.chapters.length; i++) {

      var mobileMenuButton = "";

      if(courseData.chapters[i].pages.length > 1) {

        mobileMenuButton = '<li><button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse'+i+'" aria-expanded="false" aria-controls="collapseExample">'+courseData.chapters[i].title+'</button><div class="collapse" id="collapse'+i+'"><ul class="">';

        for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
          mobileMenuButton = mobileMenuButton + '<li><a href="javascript:openPage('+i+','+j+')">'+courseData.chapters[i].pages[j].title+'</a></li>';
        }

        mobileMenuButton = mobileMenuButton + '</ul></div></li>';

      } else {
        mobileMenuButton = '<li class="courseTitleChapter" id="courseTitleChapter'+i+'" onclick="openPage('+i+',0)">'+courseData.chapters[i].title+'</li>';
      }

      mobileNav = mobileNav + mobileMenuButton;

    }

    $("#navbarMobile").append(mobileNav);
    // END MOBILE NAV DRAWER

    $("#navbarMain").on('hidden.bs.collapse', function () {
      calculateHeight();
    });

    loadInterfaceStyles();

  });

  var notSelectedClass = "menuItemNotSelected";
}

function buildNoneNav() {

  loadInterfaceStyles();
  var notSelectedClass = "menuItemNotSelected";

}

function openPage(c,p) {
  if(!checkLock(c,p)) {
    return;
  }
  currentChapter = c;
  currentPage = p;
  loadPage();
}

function nextPage() {
  if(pageIsLoading) {
    return;
  }

  pageIsLoading = true;

  if(courseData.chapters[currentChapter].pages[currentPage].count != activePageCount) {
    if(currentPage + 1 < courseData.chapters[currentChapter].pages.length) {
      if(!checkLock(currentChapter, currentPage + 1)) {
        pageIsLoading = false;
        return;
      }

      currentPage++;
      courseData.localBookmarkingStorage.page += 1;
      loadPage();

    }

    else {
      if(!checkLock(currentChapter + 1, 0)) {
        pageIsLoading=false;
        return;
      }

      do {
        currentChapter++;
      }
      while(courseData.chapters[currentChapter].isActive == "false");

      selectChapter(currentChapter);
      currentPage = 0;
      loadPage();
    }
  }
}

function prevPage() {
  if(courseData.chapters[currentChapter].pages[currentPage].count!=1) {

    if(currentPage-1 != -1) {
      currentPage--;
      loadPage();

    } else {
      do {
        currentChapter--;
      }
      while(courseData.chapters[currentChapter].isActive == "false");

      currentPage = courseData.chapters[currentChapter].pages.length-1;
      loadPage();
    }
  }
}

function loadPage() {
  try {
    stopAudio();
    if(courseData.chapters[currentChapter].pages[currentPage].audio != "") {
      $("#audioBar").show();
      startAudio(courseData.chapters[currentChapter].pages[currentPage].audio);
    } else {
      $("#audioBar").hide();
    }
  }
  catch(e){}

  openLock(currentChapter,currentPage,0);
  pageIsLoading = false;
  $("body").scrollTop(0);

  document.getElementById("contentFrame").src="src/components/content/"+courseData.chapters[currentChapter].pages[currentPage].file+".html";

  $(".footer-nav").html(getFooterNav());
}

function startAudio(args) {
  document.getElementById("pagePlayer").src="media/audio/"+args;
  document.getElementById("pagePlayer").load();
  document.getElementById("pagePlayer").play();
  $("#playBtn").hide();
  $("#pauseBtn").show();
}

function stopAudio() {
  document.getElementById("pagePlayer").pause();
  $("#playBtn").show();
  $("#pauseBtn").hide();
}

function playAudio() {
  document.getElementById("pagePlayer").play();
  $("#playBtn").hide();
  $("#pauseBtn").show();
}

function updateProgressTime() {
  $("#whiteProgBarAudio").css("width",((document.getElementById("pagePlayer").currentTime/document.getElementById("pagePlayer").duration)*100)+"%");
}

function openAudioTranscript() {
  //  Popup("content/"+chapters[currentChapter].pages[currentPage].file+"_audioTran.html",800,600);
}

function pageLoaded() {
  //  console.log("pageLoaded");
  //$("#courseTitle").html(chapters[currentChapter].title)
  SetBookmark(currentChapter,currentPage);
  calculateHeight();
}

function getFooterNav() {
  var hasLocks = checkLock();
  var nextBtnImgPath = '';
  var backBtnImgPath = '';

  // USE THIS TO DISPLAY CURRENT PAGE NUMBER AND TOTAL PAGES SEPARATED BY A DIVIDER
  /*var footerNavHTML = '<span class="page-current">'+(currentChapter+1)+'</span>&nbsp;<span><img src="'+courseData.THEME_PATH+'/media/img/divider_pagination.png" alt="pagination divider"></span>&nbsp;<span class="page-total">'+parseInt(totalPages)+'</span>';*/

  var footerNavHTML = '<span><img src="../../dir/media/img/btn_play_pause_inactive.png" alt="play/pause button"></span>';

  /* current page is not the last page in the current chapter so display next button
  OR current chapter is not the last chapter so display next button */
  if(currentPage != courseData.chapters[currentChapter].pages.length-1 || currentChapter != courseData.chapters.length-1) {

    if(hasLocks) {
      nextBtnImgPath = '/img/btn_next.png';
    } else {
      nextBtnImgPath = '/img/btn_next.png';
    }

    footerNavHTML = footerNavHTML + '<a class="next" href="#" onclick="nextPage();"><img src="../../dir/media'+nextBtnImgPath+'" alt="go to next page"></a>';

  } else {
    nextBtnImgPath = '/img/btn_next_inactive.png';

    footerNavHTML = footerNavHTML + '<a class="next" href="#" onclick="nextPage();"><img src="../../dir/media'+nextBtnImgPath+'" alt="go to next page"></a>';

  }

  /* current page is not the first page in the current chapter so display back button
  OR current chapter is not the first chapter so display back button */
  if(currentPage != 0 || currentChapter != 0) {
    backBtnImgPath = '/img/btn_back.png';

    footerNavHTML = '<a class="back" href="#" onclick="prevPage();"><img src="../../dir/media'+backBtnImgPath+'" alt="go to previous page"></a>' + footerNavHTML;

  } else {
    backBtnImgPath = '/img/btn_back_inactive.png';

    footerNavHTML = '<a class="back" href="#" onclick="prevPage();"><img src="../../dir/media/'+backBtnImgPath+'" alt="go to previous page"></a>' + footerNavHTML;
  }

  return footerNavHTML;
}

function getPageTitle() {
  return courseData.chapters[currentChapter].pages[currentPage].title;
}

function updateNavigation() {
  //  console.log("updateNavigation");
  var notSelectedClass = "menuItemNotSelected";
  activePageCount = 0;
  for(var i = 0; i < courseData.chapters.length; i++) {
    if(courseData.chapters[i].isActive=="false") {
      $("#chapter"+i).hide();

    } else {
      $("#chapter"+i).show();
    }

    var completeCount = 0;
    for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
      if(courseData.chapters[i].pages[j].locks.toString().indexOf("0") == -1) {
        $("#mi"+i+"_"+j).removeClass("menuItemSelected").removeClass("menuItemNotActive").removeClass("menuItemNotSelected").addClass("menuItemVisited");
        completeCount++;

      } else {
        $("#mi"+i+"_"+j).removeClass("menuItemSelected").removeClass("menuItemNotActive").removeClass("menuItemNotSelected").addClass(notSelectedClass);
      }

      if(courseData.chapters[i].pages[j].gated && courseData.chapters[i].pages[j].locks.toString().indexOf("0")!=-1 && courseData.chapters[i].isActive=="true") {
        notSelectedClass="menuItemNotActive";
      }
      if(courseData.chapters[i].isActive!="false") {
        activePageCount++;
        courseData.chapters[i].pages[j].count = activePageCount;
      }
    }

    if(completeCount == courseData.chapters[i].pages.length) {
      $("#chapter"+i).removeClass("chapterIncomplete").addClass("chapterComplete");
    }
  }

  $("#mi"+currentChapter+"_"+currentPage).removeClass("menuItemNotSelected").removeClass("menuItemNotActive").removeClass("menuItemVisited").addClass("menuItemSelected");

  selectChapter(currentChapter);

  $("#navbarMobile .courseTitleChapter").removeClass("courseTitleChapterSelected");
  $("#navbarMobile #courseTitleChapter"+currentChapter).addClass("courseTitleChapterSelected");

  $("#nav-items-bottom-row .courseTitleChapter").removeClass("courseTitleChapterSelected");
  $("#nav-items-bottom-row #courseTitleChapter"+currentChapter).addClass("courseTitleChapterSelected");

  if(currentPage == 0 && currentChapter == 0) {
    $("#prevBtn").hide();
    $("#nextBtn").show();

  } else if(currentChapter == courseData.chapters.length-1 && currentPage == courseData.chapters[currentChapter].pages.length-1) {
    $("#prevBtn").show();
    $("#nextBtn").hide();

  } else {
    $("#prevBtn").show();
    $("#nextBtn").show();
  }

  if(courseData.chapters[currentChapter].pages[currentPage].gated && courseData.chapters[currentChapter].pages[currentPage].locks.toString().indexOf("0")!=-1) {
    $("#nextBtn").hide();
  }

  if($(".footer-nav") !== null) {
    $(".footer-nav").html(getFooterNav());
  }
}

function activateChapter(active,deactive,titleIndex) {
  //  console.log("activateChapter");

  for(var i = 0; i < active.length; i++) {
    courseData.chapters[active[i]].isActive="true";
  }

  for(var j = 0; j < deactive.length; j++) {
    courseData.chapters[deactive[j]].isActive="false";
  }

  if(titleIndex != -1) {
    courseData.chapters[active[0]].titleIndex = titleIndex;
    $("#chapter"+active[0]).html(chapters[active[0]].title.split(";")[titleIndex]);
  }
  updateNavigation();
}

function selectChapter(args) {
  //  console.log("selectChapter");

  for(var i = 0; i < courseData.chapters.length; i++) {
    $("#chapter"+i).removeClass("chapterSelected").addClass("chapterNotSelected");
    //$("#pages"+i).hide();
    if(i == args) {
      $("#chapter"+i).removeClass("chapterNotSelected").addClass("chapterSelected");
      //$("#pages"+i).show();
    }
  }
}

function checkLock(chapter,page) {
  for(var i = 0; i <= chapter; i++) {
    for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
      if(i == chapter && j == page) {
        break;
      }

      if(courseData.chapters[i].pages[j].gated && courseData.chapters[i].pages[j].locks.toString().indexOf("0")!=-1 && courseData.chapters[i].isActive=="true") {
        return false;
      }
    }
  }
  return true;
}

function openLock(chapter,page,lock) {
  if(lock >= courseData.chapters[chapter].pages[page].locks.length) {
    return;
  }

  courseData.chapters[chapter].pages[page].locks[lock] = 1;
  updateNavigation();
  CreatePathmarks();
}

function changeVolume(args) {
  volume = args/100;
  $("video").prop("volume",volume);
  $("audio").prop("volume",volume);
  try{
    var el = document.getElementById('contentFrame');
    if(el.contentWindow) {
      el.contentWindow.changeVolume(volume)
    }
    else if(el.contentDocument) {
      el.contentDocument.changeVolume(volume);
    }
  }catch(e){}
}

function muteAudio() {
  $("#volumeSlider").toggle();
}

function unmuteAudio() {
  $("#volumeSlider").toggle();
}

function calculateHeight() {
  // subtracting one pixel ensures that second scroll bar doesn't appear
  // adding padding to accommodate Bootstrap header nav
  //  console.log("calculateHeight");
  //  console.log($("#navbar").height());

  //  $("#contentContainer").css({height:$(window).height() - 1, paddingTop:$("#navbar").height()});
  $("#contentContainer").css({height:$(window).height() - 1});

  //  $("#contentFrame").css({height:$("#contentContainer").height()});
  $("#contentFrame").css({height:$("#contentContainer").height() - $("#navbar").height(), top:$("#navbar").height()});
  //  $("#contentFrame").css({height:$("#contentContainer").height() - 7});

  $("#audioBar").width($("#mainContainer").width()-216-$("#navBtns").width());
}

function closeCourse() {
  top.window.close();
}

/* GETTERS */
function getFooterHeight() {
  return $('footer').height();
}
