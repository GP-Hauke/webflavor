function buildTopNav() {

  var navMarkup = '';
  $.get("src/components/navigation/nav.html", function(data) {
    navMarkup = data;
    $("#navContainer").append(navMarkup);

    $('#titleMain').html(courseData.TITLE+":");
    $('#titleMainMobile').html(courseData.TITLE+":");
    $('#subTitle').html(courseData.SUB_TITLE);
    $('#subTitleMobile').html(courseData.SUB_TITLE);

    // MOBILE NAV DRAWER
    var mobileNav = '';

    for(var i = 0; i < courseData.chapters.length; i++) {

      var mobileMenuButton = "";

      if(courseData.chapters[i].pages.length > 1) {

        mobileMenuButton = '<li id="courseTitleChapter'+i+'" class="courseTitleChapter dropdown"><p class="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+courseData.chapters[i].title+'</p><ul class="dropdown-menu">';

        for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
          mobileMenuButton = mobileMenuButton + '<li onclick = "openPage('+eval(i+1)+','+eval(j+1)+')"><p>'+courseData.chapters[i].pages[j].title+'</p></li>';
        }

        mobileMenuButton = mobileMenuButton + '</ul></li>';

      } else {
        mobileMenuButton = '<li class="courseTitleChapter" id="courseTitleChapter'+i+'" onclick="openPage('+eval(i+1)+',1)"><p>'+courseData.chapters[i].title+'</p></li>';
      }

      mobileNav = mobileNav + mobileMenuButton;

    }

    $("#navbarMobile").append(mobileNav);
    // END MOBILE NAV DRAWER

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
    $("#headerLinks").append(headerLinks);
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

      if(courseData.MENU_STYLE === 'tab') {
        $('#navbarMain').addClass('tabbed');
        $('.navbar .container').addClass('navbar-expand-md');
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

    var width = $('#navbarMobile li.courseTitleChapter').css("width");
    $('#navbarMobile li.courseTitleChapter').css("max-width", width);


    loadInterfaceStyles();

    });

  var notSelectedClass = "menuItemNotSelected";
}
