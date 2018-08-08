//////////////////////////////////////////////////////////////////////
//
//     Interface JS
//      - Builds shell of course and interface
//      - Controlls UI functions
//
//////////////////////////////////////////////////////////////////////

import * as Content from './Content.jsx';
import * as Tracking from './Tracking.jsx';
import * as Modal from './components/modal_functions';

var LOCAL_COURSE_DATA_ID;
var courseData;
var cookieName;
var totalPages;
var currentChapter
var currentPage;
var activePageCount;
var pageIsLoading;

export function initInterface(id) {
  //console.log("Building Interface...");
  LOCAL_COURSE_DATA_ID = id;
  courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var pageCount = 0;

  document.title = courseData.TITLE;

  cookieName = courseData.COOKIE_NAME;

  totalPages = pageCount;
  currentChapter = 1;
  currentPage = 1;

  Tracking.SetCookieName(cookieName);

  var bm = Tracking.GetBookmark();

  if(bm && bm != "" && bm.indexOf("_")) {
    if(!isNaN(parseInt(bm.split("_")[0],10))) {
      currentChapter = parseInt(bm.split("_")[0],10);
    }

    if(!isNaN(parseInt(bm.split("_")[1],10))) {
      currentPage = parseInt(bm.split("_")[1],10);

    }
  }

  if(courseData.HAS_SPLASH_PAGE === 'true' && currentChapter === 1 && currentPage === 1) {
    Modal.openModal(LOCAL_COURSE_DATA_ID, 'splashPage');
  }

  buildShellUI();
  enforcedShow($("#mainContainer"));
  loadPage();
}

export function enforcedShow(elem) {
  elem.show();
  if(elem.hasClass("hidden")) {
    elem.removeClass("hidden");
  }
}

export function buildShellUI() {
  //console.log("buildShellUI()");

  if(courseData.MENU_PLACEMENT === 'top') {
    buildTopNav();

  } else if(courseData.MENU_PLACEMENT === 'left') {
    buildLeftNav();
  }
  else if(courseData.MENU_PLACEMENT === 'tab') {
    buildTabNav();
  }
  else {
    buildNoneNav();
  }
}

export function buildTopNav() {

  var navMarkup = '';
  var navMarkup = '<div id="navbar" class="nav-container navbar-fixed-left"><nav class="navbar navbar-dark"><div class="container"><div class="mobile-container container-fluid d-block d-md-none"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain" aria-controls="navbarsExample01" aria-expanded="false" aria-label="Toggle navigation">            <span class="navbar-toggler-icon"></span>         </button>          <span id="titleMainMobile" class="title-main"></span>          <span id="subTitleMobile" class=""></span> <ul class="headerLinks nav page-assist float-right"></ul>       </div>        <div class="title-container d-none d-sm-none d-md-block ">          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain" aria-controls="navbarsExample01" aria-expanded="false" aria-label="Toggle navigation">            <span class="navbar-toggler-icon"></span></button>  <a class="navbar-brand"></a><span id="titleMain" class="title-main"></span><span id="subTitle" class=""></span></div><div class="links-container d-none d-sm-none d-md-block "><ul class="headerLinks nav page-assist float-right"></ul></div>      </div>      <div id="navbarMain" class="navbar-collapse collapse"><ul id="navbarMobile" class="navbar-nav mr-auto"></ul>      </div>    </nav>  </div>';

    $("#navContainer").append(navMarkup);

    $('#titleMain').html(courseData.TITLE+":");
    $('#subTitle').html(courseData.SUB_TITLE);
    $('#subTitleMobile').html(courseData.SUB_TITLE);

    // MOBILE NAV DRAWER
    var mobileNav = '';

    for(var i = 0; i < courseData.chapters.length; i++) {

      var mobileMenuButton = "";

      if(courseData.chapters[i].pages.length > 1) {

        mobileMenuButton = '<li id="courseTitleChapter'+i+'" class="courseTitleChapter dropdown"><div class="dropdown-link-wrapper" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><p class="nav-link" >'+courseData.chapters[i].title+'</p></div><ul class="dropdown-menu">';

        for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
          mobileMenuButton = mobileMenuButton + '<li onclick = "openPage('+eval(i+1)+','+eval(j+1)+')"><p>'+courseData.chapters[i].pages[j].title+'</p></li>';
        }

        mobileMenuButton = mobileMenuButton + '</ul></li>';

      } else {
        mobileMenuButton = '<li class="courseTitleChapter" id="courseTitleChapter'+i+'" onclick="openPage('+eval(i+1)+',1)"><p class="nav-link">'+courseData.chapters[i].title+'</p></li>';
      }

      mobileNav = mobileNav + mobileMenuButton;

    }

    $("#navbarMobile").append(mobileNav);
    // END MOBILE NAV DRAWER

    // HEADER LINKS
    var headerLinks = "";
    if(courseData.HAS_RESOURCES === "true"){
      var headerLinkEl = '<li><a class="btnResources" href="#" target=""><img src="dir/media/img/resources.png" style="height:50px;" alt=""></a></li>';
      headerLinks = headerLinks + headerLinkEl;
    }
    if(courseData.HAS_GLOSSARY === "true"){
      var headerLinkEl = '<li><a class="btnGlossary" href="#" target=""><img src="dir/media/img/glossary.png" style="height:50px;" alt=""></a></li>';
      headerLinks = headerLinks + headerLinkEl;
    }
    if(courseData.HAS_HELP === "true"){
      var headerLinkEl = '<li><a class="btnHelpModal" href="#" target=""><img src="dir/media/img/help.png" style="height:50px;" alt=""></a></li>';
      headerLinks = headerLinks + headerLinkEl;
    }
    $(".headerLinks").append(headerLinks);
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

      if(courseData.MENU_STYLE === 'tab' && courseData.MENU_PLACEMENT === 'top') {
        $('#navbarMain').addClass('tabbed');
        $('.navbar .container').addClass('navbar-expand-md');
      }
      else{
        $('#navbarMain').addClass('default');
      }
    }

    bottomNav = bottomNav + '</ul></div></div>';

    $("#navbarMain").on('hidden.bs.collapse', function () {
      calculateHeight();
    });

    $("#navbarBottom").append(bottomNav);
    // END BOTTOM NAV

    if(courseData.HAS_MENU_LOGO == "true"){
      $('#navbar .navbar-brand').append('<img src="'+courseData.THEME_PATH+'/img/logo.png" alt="logo">')
    }
    $('.btnGlossary').click(function(){Modal.openModal(LOCAL_COURSE_DATA_ID, 'glossary');});
    $('.btnHelpModal').click(function(){Modal.openModal(LOCAL_COURSE_DATA_ID, 'help');});
    $('.btnResources').click(function(){Modal.openModal(LOCAL_COURSE_DATA_ID, 'resources');});

    updateNavigation();

    //var width = $('#navbarMobile li.courseTitleChapter').css("width");
    //$('#navbarMobile li.courseTitleChapter').css("max-width", width);

  var notSelectedClass = "menuItemNotSelected";
}

export function buildLeftNav() {

  var navMarkup = '<div id="navbar" class="nav-container navbar-fixed-left leftNav">    <nav class="navbar navbar-dark">      <div class="container">        <div class="mobile-container container-fluid d-block d-md-none">          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain" aria-controls="navbarsExample01" aria-expanded="false" aria-label="Toggle navigation">            <span class="navbar-toggler-icon"></span>          </button>          <a class="navbar-brand logo-mobile"></a>          <span id="titleMainMobile" class="title-main"></span>          <span id="subTitleMobile" class=""></span>   <ul class="headerLinks nav page-assist float-right"></ul>      </div>        <div class="title-container d-none d-sm-none d-md-block ">          <button class="navbar-toggler" onclick="leftNav();">            <span class="navbar-toggler-icon"></span>          </button>          <a class="navbar-brand"></a>          <span id="titleMain" class="title-main"></span>          <span id="subTitle" class=""></span>        </div>        <div class="links-container d-none d-sm-none d-md-block ">          <ul class="headerLinks nav page-assist float-right"></ul>        </div>      </div>      <div id="navbarMain" class="navbar-collapse">        <ul id="navbarMobile" class="navbar-nav mr-auto"></ul>      </div>    </nav>  </div>';

    $("#navContainer").append(navMarkup);

    $('#titleMain').html(courseData.TITLE+":");
    $('#titleMainMobile').html(courseData.TITLE);
    $('#subTitle').html(courseData.SUB_TITLE);
    $('#subTitleMobile').html(courseData.SUB_TITLE);


    // MOBILE NAV DRAWER
    // MOBILE NAV DRAWER
    var mobileNav = '';

    for(var i = 0; i < courseData.chapters.length; i++) {

      var mobileMenuButton = "";

      if(courseData.chapters[i].pages.length > 1) {

        mobileMenuButton = '<li id="courseTitleChapter'+i+'" class="courseTitleChapter dropdown"><p class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+courseData.chapters[i].title+'</p><ul class="dropdown-menu">';

        for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
          mobileMenuButton = mobileMenuButton + '<li onclick = "openPage('+eval(i+1)+','+eval(j+1)+')"><p>'+courseData.chapters[i].pages[j].title+'</p></li>';
        }

        mobileMenuButton = mobileMenuButton + '</ul></li>';

      } else {
        mobileMenuButton = '<li class="courseTitleChapter" id="courseTitleChapter'+i+'" onclick="openPage('+eval(i+1)+',1)"><p>'+courseData.chapters[i].title+'</p></li>';
      }

      mobileNav = mobileNav + mobileMenuButton;

    }

    // HEADER LINKS
    var headerLinks = "";
    if(courseData.HAS_RESOURCES === "true"){
      var headerLinkEl = '<li><a id="btnResources" href="#" target="">RESOURCES</a></li>';
      headerLinks = headerLinks + headerLinkEl;
    }
    if(courseData.HAS_GLOSSARY === "true"){
      var headerLinkEl = '<li><a id="btnGlossary" href="#" target="">GLOSSARY</a></li>';
      headerLinks = headerLinks + headerLinkEl;
    }
    if(courseData.HAS_HELP === "true"){
      var headerLinkEl = '<li><a id="btnHelpModal" href="#" target="">?</a></li>';
      headerLinks = headerLinks + headerLinkEl;
    }
    $(".headerLinks").append(headerLinks);
    // END HEADER LINKS

    $("#navbarMobile").append(mobileNav);
    // END MOBILE NAV DRAWER

    if(courseData.HAS_MENU_LOGO == "true"){
      $('#navbar .navbar-brand').append('<img src="'+courseData.THEME_PATH+'/img/logo.png" alt="logo">')
    }

    $('#navbarMain').addClass('default');

    $("#navbarMain").on('hidden.bs.collapse', function () {
      calculateHeight();
    });

    loadInterfaceStyles();

  var notSelectedClass = "menuItemNotSelected";
}

export function leftNav(){
  $(".navbar-fixed-left #navbarMain").toggleClass('toggled');
}

export function buildNoneNav() {

  loadInterfaceStyles();
  var notSelectedClass = "menuItemNotSelected";

}

export function updateNavigation() {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  //console.log("Update navigation");
  var notSelectedClass = "menuItemNotSelected";
  activePageCount = 0;

  var locked = false;
  var singlePage = false;
  var previousLocks = false;

  for(var i = 0; i < courseData.chapters.length; i++) {
    singlePage = false;

    if(courseData.chapters[i].isActive=="false") {
      $("#chapter"+i).hide();

    } else {
      $("#chapter"+i).show();
    }

    var completeCount = 0;

    for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
      activePageCount += 1;
      if(courseData.chapters[i].pages.length > 1){
        singlePage = true;
      }

      //console.log("!checkLock("+eval(i+1)+","+eval(j+1)+"):  " + !checkLock(eval(i+1),eval(j+1)));
      if(!checkLock(eval(i+1),eval(j+1))){
        //If Multiple Pages of a Chapter

        if(j > 0){
          $('#courseTitleChapter'+i +' .dropdown-menu li p').eq(j).addClass('courseTitleGatedPage');
          previousLocks = true;
        }
        else{
          $('#courseTitleChapter'+i + ' .nav-link').addClass('courseTitleGated');
          if(previousLocks){
            $('#courseTitleChapter'+i +' .dropdown-menu li p').addClass('courseTitleGatedPage');
          }
          previousLocks = true;
        }
      }
      else{
        $('#courseTitleChapter'+i + ' .nav-link').removeClass('courseTitleGated');
        $('#courseTitleChapter'+i +' .dropdown-menu li p').eq(j).removeClass('courseTitleGatedPage');
      }
    }

    if(courseData.chapters[i].pages.length==$('#courseTitleChapter'+i +' .dropdown-menu li .courseTitleGatedPage').length){
      $('#courseTitleChapter'+ i + ' .nav-link').addClass('courseTitleGated');
    }

    if(completeCount == courseData.chapters[i].pages.length) {
      $("#chapter"+i).removeClass("chapterIncomplete").addClass("chapterComplete");
    }
  }

  $("#mi"+currentChapter+"_"+currentPage).removeClass("menuItemNotSelected").removeClass("menuItemNotActive").removeClass("menuItemVisited").addClass("menuItemSelected");

  if(currentPage == 1 && currentChapter == 1) {
    $("#prevBtn").hide();
    $("#nextBtn").show();

  } else if(currentChapter == courseData.chapters.length && currentPage == courseData.chapters[currentChapter-1].pages.length) {
    $("#prevBtn").show();
    $("#nextBtn").hide();

  } else {
    $("#prevBtn").show();
    $("#nextBtn").show();
  }

  if(courseData.chapters[currentChapter-1].pages[currentPage-1].gated && courseData.chapters[currentChapter-1].pages[currentPage-1].locks.toString().indexOf("0")!=-1) {
    $("#nextBtn").hide();
  }

  $("#navbarMobile .courseTitleChapter").eq(currentChapter-1).addClass('courseTitleChapterSelected');

}

export function activateChapter(active,deactive,titleIndex) {
  //console.log("activateChapter()");

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

export function checkLock(chapter,page) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < chapter; i++) {
    for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
      if(i == chapter - 1 && j == page - 1) {
        break;
      }

      if(courseData.chapters[i].pages[j].gated && courseData.chapters[i].pages[j].locks.toString().indexOf("0")!=-1 && courseData.chapters[i].isActive=="true") {
        return false;
      }
    }
  }
  return true;
}

export function openLock(chapter,page,lock) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  //console.log("openLock("+chapter+","+page+","+lock+")");
  if(lock >= courseData.chapters[chapter-1].pages[page-1].locks.length) {
    return;
  }

  courseData.chapters[chapter-1].pages[page-1].locks[lock] = 1;

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

  updateNavigation();
  //CreatePathmarks();
}

export function openPage(c,p) {
  //console.log("---------openPage("+c+","+p+")---------");

  if(!checkLock(c, p)) {
    return;
  }

  currentChapter = c;
  currentPage = p;
  loadPage();
}

export function nextPage() {
  if(pageIsLoading) {
    return;
  }

  pageIsLoading = true;

  if(courseData.chapters[currentChapter-1].pages[currentPage-1].count != activePageCount) {
    if(currentPage < courseData.chapters[currentChapter-1].pages.length) {
      if(!checkLock(currentChapter, currentPage + 1)) {

        pageIsLoading = false;
        return;
      }

      currentPage++;
      loadPage();

    }

    else {
      if(!checkLock(currentChapter + 1, 1)) {

        pageIsLoading = false;
        return;
      }

      do {
        currentChapter++;
      }
      while(courseData.chapters[currentChapter - 1].isActive == "false");
      currentPage = 1;
      loadPage();
    }
  }
}

export function prevPage() {
  //console.log("prevPage()");
  if(courseData.chapters[currentChapter-1].pages[currentPage-1].count!=1) {

    if(currentPage-1 != 0) {
      currentPage--;
      loadPage();

    } else {
      do {
        currentChapter--;
      }
      while(courseData.chapters[currentChapter-1].isActive == "false");

      currentPage = courseData.chapters[currentChapter-1].pages.length;
      loadPage();
    }
  }
}

/* AUDIO FUNCITONS */
export function startAudio(args) {
  document.getElementById("pagePlayer").src="media/audio/"+args;
  document.getElementById("pagePlayer").load();
  document.getElementById("pagePlayer").play();
  $("#playBtn").hide();
  $("#pauseBtn").show();
}

export function stopAudio() {
  document.getElementById("pagePlayer").pause();
  $("#playBtn").show();
  $("#pauseBtn").hide();
}

export function playAudio() {
  document.getElementById("pagePlayer").play();
  $("#playBtn").hide();
  $("#pauseBtn").show();
}

export function changeVolume(args) {
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

export function muteAudio() {
  $("#volumeSlider").toggle();
}

export function unmuteAudio() {
  $("#volumeSlider").toggle();
}

/* GETTERS */
export function getFooterNav() {
  //console.log("getFooterNav()");
  if(currentChapter == courseData.chapters.length && currentPage == courseData.chapters[currentChapter-1].pages.length){
    var hasLocks = true;
  }
  else if(currentPage < courseData.chapters[currentChapter-1].pages.length) {
    var hasLocks = !checkLock(currentChapter, currentPage + 1);
  }
  else {
    var hasLocks = !checkLock(currentChapter + 1, 1);
  }

  var nextBtnImgPath = '';
  var backBtnImgPath = '';

  // USE THIS TO DISPLAY CURRENT PAGE NUMBER AND TOTAL PAGES SEPARATED BY A DIVIDER
  /*var footerNavHTML = '<span class="page-current">'+(currentChapter+1)+'</span>&nbsp;<span><img src="'+courseData.THEME_PATH+'/media/img/divider_pagination.png" alt="pagination divider"></span>&nbsp;<span class="page-total">'+parseInt(totalPages)+'</span>';*/

  var footerNavHTML = '<span><img src="dir/media/img/btn_play_pause_inactive.png" alt="play/pause button"></span>';

  /* current page is not the last page in the current chapter so display next button
  OR current chapter is not the last chapter so display next button */
  var next_inactive = false;
  var nextBtnImgPath = '/img/btn_next.png';
  var styles = "";

  if(currentPage != courseData.chapters[currentChapter-1].pages.length || currentChapter != courseData.chapters.length) {
    if(hasLocks) {
      nextBtnImgPath = '/img/btn_next_inactive.png';
      styles = 'style="cursor:default"';
    }

  } else {
    nextBtnImgPath = '/img/btn_next_inactive.png';
    styles = 'style="cursor:default"';
  }

  footerNavHTML = footerNavHTML + '<a '+styles+' class="next" href="#"><img src="dir/media'+nextBtnImgPath+'" alt="go to next page"></a>';

  /* current page is not the first page in the current chapter so display back button
  OR current chapter is not the first chapter so display back button */
  var back_inactive = false;
  var backBtnImgPath = '/img/btn_back.png';
  var styles = "";

  if(currentPage == 1 && currentChapter == 1) {

    backBtnImgPath = '/img/btn_back_inactive.png';
    styles = 'style="cursor:default"';

  }

  footerNavHTML = '<a '+styles+' class="back" href="#"><img src="dir/media/'+backBtnImgPath+'" alt="go to previous page"></a>' + footerNavHTML;

  return footerNavHTML;
}

export function closeCourse() {
  top.window.close();
}

export function loadPage() {
  //console.log("loadPage()");

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

  //document.getElementById("contentFrame").src="src/components/content/"+courseData.chapters[currentChapter].pages[currentPage].file+".html";

  Content.loadContent(currentChapter, currentPage, LOCAL_COURSE_DATA_ID);
  $("#navbarMobile .courseTitleChapter").removeClass("courseTitleChapterSelected");
  $(".navbar-fixed-left #navbarMain").removeClass('toggled');
  $("#navbarMobile .courseTitleChapter").eq(currentChapter-1).addClass('courseTitleChapterSelected');
  $(".footer-nav").html(getFooterNav());

  $(".next").click(function(){
    nextPage();
  });

  $(".back").click(function(){
    prevPage();
  });
}

export function calculateHeight() {
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

export function getFooterHeight() {
  if($('footer').height() == null){
    return 0;
  }
  return $('footer').height();
}

window.openPage = openPage;
