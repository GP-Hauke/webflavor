//////////////////////////////////////////////////////////////////////
//
//     Content JS
//      - Loads in content for each individual page
//      - Inner most module, cannot control outer parts
//
//////////////////////////////////////////////////////////////////////

import * as Ctr from './components/ctr_functions';
import * as DragAndDrop from './components/drag_drop_functions';
import * as FlipCard from './components/flip_cards_functions';
import * as Hotspot from './components/hotspot_functions';
import * as KnowledgeCheck from './components/knowledge_check_functions';
import * as Text from './components/text_functions';
import * as Thumbnails from './components/thumbnails_functions';
import * as VideoAudio from './components/video_audio_functions';
import * as Modal from './components/modal_functions';
import * as Assessment from './components/assessment_functions';
import * as Game from './components/game_functions.js';
import * as Tracking from './Tracking.jsx';


var LOCAL_COURSE_DATA_ID;
var currentChapter;
var currentPage;
var courseData;

export function loadContent(chapter, page, id){
  LOCAL_COURSE_DATA_ID = id;
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  currentChapter = chapter;
  currentPage = page;
  var param = eval(currentChapter)+'_'+eval(currentPage);
  var arg = 'view/content/pages/' + param +'.xml';
  $.get(arg)
  .done(function(xml) {
    $('#pageContent').empty();

    if($(xml).find("title").find("included").text() == "true"){
      var titleSize = $(xml).find("title").find("size").text();
      var titleHTML = '<div class="row"><div class="col-sm-'+titleSize+'"><h1 id="pageTitle"></h1><div class="page-number"></div></div></div>';
      $('#pageContent').append(titleHTML);
    }

    var completion = $(xml).find("layout").attr("completion");
    if(completion){
      $('#pageContainer').addClass("completion");
    }
    else{
      $('#pageContainer').removeClass("completion");

    }
    $('#pageContent').append($(xml).find('layout').text());

    $('#contentContainer').scrollTop(
      0
    );

    var modal = $(xml).find('modal').text();
    if(modal != ""){
      Modal.openContentModal(modal);
    }

    var components = $(xml).find("components");
    components.children().each(function(){
      var type = $(this)[0].tagName;
      var componentID = $(this).attr("id");
      if(type == "Ctr"){
        Ctr.initCtr(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "Modal"){
        Modal.initModal(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "Game"){
        Game.initGame(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "DragAndDrop"){
        DragAndDrop.initDragAndDrop(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "FlipCard"){
        FlipCard.initFlipCard(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "Hotspot"){
        Hotspot.initHotspot(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "KnowledgeCheck"){
        KnowledgeCheck.initKnowledgeCheck(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "Text"){
        Text.initText(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "Thumbnails"){
        Thumbnails.initThumbnails(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "VideoAudio"){
        VideoAudio.initVideoAudio(xml, componentID, LOCAL_COURSE_DATA_ID);
      }
      else if(type == "VehicleGame"){
        var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
        console.log("setupassessment");
        var assessmentID = parseInt($(".btn-assess").attr("id").substring(13,15), 10) - 1;

        if(assessmentID === 0){
          for(var i = 0; i < 3; i++){
            if(courseData.assessmentData.assessments[i].completed === "true"){
              $(".btn-assess").append("<div class='viewed-overlay'><img src='/view/media/img/icon_viewed.png'></div>");
              continue;
            }
          }

        } else if(assessmentID === 3) {
          if(courseData.assessmentData.assessments[assessmentID].completed === "true"){
            $(".btn-assess").append("<div class='viewed-overlay'><img src='/view/media/img/icon_viewed.png'></div>");
          }
        }

        $(".btn-assess").click(function() {
          Modal.openModal(LOCAL_COURSE_DATA_ID, 'assessment', assessmentID, $(this));
        });
      }
    })

    //FlipCard.setCalculatedHeight();


    if($(xml).find("title").find("pagination").text() == "true"){
      updatePagination();
    }

    if(courseData.COUNT_PAGES == 'true') {
      registerPageVisit(param); // lives in tracking_functions.js
    }

    try {
      $("#pageTitle").html(getPageTitle());
    } catch(e) {
      console.log('something went wrong ', e);
    }

    if($('.footer-spacer').length) {
      $('.footer-spacer').css({height:getFooterHeight()+25});
    }

    try {
      pageLoaded();
    } catch(e) {
      console.log('something went wrong ', e);
    }
  });
}

export function updatePagination() {
  var currChap = currentChapter;
  //var totalChaps = parseInt(totalPages);
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var totalChaps = courseData.chapters.length;


  //var totalChaps = 1;
  $(".page-number").empty();
  $(".page-number").append("<span>"+currChap+"</span> of <span>"+totalChaps+"</span>");
}

export function getPageTitle() {
  courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  return courseData.chapters[currentChapter-1].pages[currentPage-1].title;
}

export function registerPageVisit(pageId) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  if(courseData.pageCount.pageIds.indexOf(pageId) == -1) {
    courseData.pageCount.pageIds.push(pageId);
    courseData.pageCount.pagesVisited++;
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
}

export function pageLoaded() {
  //  console.log("pageLoaded");
  Tracking.SetBookmark(currentChapter,currentPage);
  calculateHeight();
}

export function setComplete() {
  if(courseData.HAS_INTERACTIVE_COMPLETION == "true"){
    if(courseData.INTERACTIVES_TOTAL != courseData.INTERACTIVES_COMPLETED){
      var confirmMsg = "Please attempt <span class='bolded'>all interactives</span> within the course to be able to recieve";
      $("#sectionComplete").html(confirmMsg);
      return
    }
  }

  Tracking.SetComplete();
  $("#btnComplete").hide();
  var confirmMsg = "Thank you for completing this course. Your training record will be updated.";
  $("#sectionComplete").text(confirmMsg);
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

window.setComplete = setComplete;
