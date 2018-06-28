function updatePagination() {
  var currChap = currentChapter + 1;
  //var totalChaps = parseInt(totalPages);
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var totalChaps = courseData.chapters.length;


  //var totalChaps = 1;
  $(".page-number").empty();
  $(".page-number").append("<span>"+currChap+"</span> of <span>"+totalChaps+"</span>");
}

function populateCards() {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var cardsOnPage = $('div[id*="card"]');

  if(cardsOnPage.length >= 1){
    var refreshTimer = setTimeout(function() {
      location.reload();
    }, 10000);

    var cardNums = [];

    for(var i = 0; i < cardsOnPage.length; i++) {
      cardNums.push(parseInt(cardsOnPage[i].id.substring(4,6), 10));
    }

    var minNum = Math.min.apply(Math, cardNums);

    for(var i = minNum; i < cardsOnPage.length+minNum; i++) {
      var dataIndex = i - 1;
      var card = $("#card"+i);

      card.TYPE = courseData.cardData.cardContent[dataIndex].TYPE;

      // POPUP TYPES
      if(card.TYPE === "popup") {
        if(courseData.cardData.cardContent[dataIndex].actions[0].executed === "false"){
          card.append("<div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div>");

        } else {
          card.append("<div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div><div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div>");
        }

        card.click(function() {
          if($(this).has(".viewed-overlay").length === 0) {
            $(this).append("<div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div>");
          }
          var cardNum = parseInt($(this).attr("id").substring(4,6), 10);
          var clickDataIndex = cardNum - 1;
          var heading = courseData.cardData.cardContent[clickDataIndex].cardHeading;
          var content = courseData.cardData.cardContent[clickDataIndex].popupContent;

          courseData.cardData.cardContent[clickDataIndex].actions[0].executed = "true";
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

          openContentModal(heading, content);
        });

      }

      else if(card.TYPE === "text") {
        if(courseData.cardData.cardContent[dataIndex].actions[0].executed === "false"){
          card.append("<div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div>");

        } else {
          card.append("<div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div><div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div>");
        }

        card.click(function() {
          if($(this).has(".viewed-overlay").length === 0) {
            $(this).append("<div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div>");
          }
          var cardNum = parseInt($(this).attr("id").substring(4,6), 10);
          var clickDataIndex = cardNum - 1;
          var heading = courseData.cardData.cardContent[clickDataIndex].cardHeading;
          var content = courseData.cardData.cardContent[clickDataIndex].popupContent;
          var img = courseData.cardData.cardContent[clickDataIndex].imgStr;

          courseData.cardData.cardContent[clickDataIndex].actions[0].executed = "true";
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

          openPageModal(heading, content, img);
        });

      }

      else if(card.TYPE === "links") {
        if(courseData.cardData.cardContent[dataIndex].actions[0].executed === "false") {
          card.append("<a href='' alt='' target='_blank'><div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div></a>");

        } else {
          card.append("<a href='' alt='' target='_blank'><div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div><div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div></a>");
        }

        card.find("a").attr("href", courseData.cardData.cardContent[dataIndex].actions[0].urlstr);
        card.find("a").attr("alt", courseData.cardData.cardContent[dataIndex].cardHeading);

        card.click(function() {
          if($(this).has(".viewed-overlay").length === 0) {
            $(this).append("<div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div>");
          }

          var cardNum = parseInt($(this).attr("id").substring(4,6), 10);
          var clickDataIndex = cardNum - 1;

          courseData.cardData.cardContent[clickDataIndex].actions[0].executed = "true";
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
        });

      }

      else if(card.TYPE === "video") {
        if(courseData.cardData.cardContent[dataIndex].actions[0].executed === "false"){
          card.append("<div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div>");

        } else {
          card.append("<div class='loading-overlay'><p>Loading...</p></div><div class='img-container'><img class='img-zoom card-img' src='' alt=''></div><div class='caption'><h3></h3><p></p></div><div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div>");
        }

        card.click(function() {
          if($(this).has(".viewed-overlay").length === 0) {
            $(this).append("<div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'/></div>");
          }
          var cardNum = parseInt($(this).attr("id").substring(4,6), 10);
          var clickDataIndex = cardNum - 1;
          var heading = courseData.cardData.cardContent[clickDataIndex].cardHeading;
          var vidSrc = courseData.cardData.cardContent[clickDataIndex].vidSrc;
          var posterSrc = courseData.cardData.cardContent[clickDataIndex].posterSrc;

          courseData.cardData.cardContent[clickDataIndex].actions[0].executed = "true";
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

          openVidModal(heading, vidSrc, posterSrc);
        });

      }

      else if(card.TYPE === "plain") {


      }

      else if(card.TYPE === "page-content") {
        card.append("<div class='img-container'><img class='img-zoom card-img' src='' alt=''></div>");
      }

      var blurb = card.find(".caption p");
      blurb.html(courseData.cardData.cardContent[dataIndex].blurb);

      var cardHeading = card.find(".caption h3");
      cardHeading.text(courseData.cardData.cardContent[dataIndex].cardHeading);

      var imgTag = card.find("img.card-img");
      imgTag.attr("src", courseData.cardData.cardContent[dataIndex].imgStr);
      imgTag.attr("alt", courseData.cardData.cardContent[dataIndex].cardHeading);

      $("#card"+i+" .loading-overlay").fadeOut("fast");
    }

    clearTimeout(refreshTimer);
  }
}

function removeDupes(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = a[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}

function tallyActions() {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var displayCompleteBtn = false;

  var executedActions = [];
  var requiredActions = [];
  var requiredExecutedActions = [];
  var requiredNotExecutedActions = [];

  for(var i = 0; i < courseData.assessmentData.assessments.length; i++) {
    if(courseData.assessmentData.assessments[i].completed === "true") {
      requiredExecutedActions.push(courseData.assessmentData.assessments[i].title);
    }
  }

  for(var i = 0; i < courseData.assessmentData.assessments.length; i++) {
    if(courseData.assessmentData.assessments[i].completed === "false") {
      requiredNotExecutedActions.push(courseData.assessmentData.assessments[i].title);
    }
  }

  requiredNotExecutedActions = removeDupes(requiredNotExecutedActions);

  for(var i = 0; i < requiredExecutedActions.length; i++) {
    for(var j = requiredNotExecutedActions.length-1; j >= 0 ; j-- ) {
      if(requiredExecutedActions[i] === requiredNotExecutedActions[j]) {
        requiredNotExecutedActions.splice(j, 1);
      }
    }
  }

  for(var i = 0; i < courseData.cardData.cardContent.length; i++) {
    for(var j = 0; j < courseData.cardData.cardContent[i].actions.length; j++) {

      var cardActionExecuted = courseData.cardData.cardContent[i].actions[j].executed;
      var cardActionRequired = courseData.cardData.cardContent[i].actions[j].required;
      if(cardActionExecuted === "true") {
        executedActions.push(courseData.cardData.cardContent[i].actions[j]);
      }
      if(cardActionRequired === "true") {
        requiredActions.push(courseData.cardData.cardContent[i].actions[j]);
      }
      if(cardActionExecuted === "true" && cardActionRequired === "true") {
        requiredExecutedActions.push(courseData.cardData.cardContent[i].actions[j].label);
      }
      if(cardActionExecuted === "false" && cardActionRequired === "true") {
        requiredNotExecutedActions.push(courseData.cardData.cardContent[i].actions[j].label);
      }
    }
  }

  if(requiredExecutedActions.length === 4) {
    displayCompleteBtn = true;
    var clickedLinksNum = executedActions.length;
    var msg = "";
    switch (clickedLinksNum) {
      case 0: case 1: case 2: case 3: case 4:
      msg = "Great Job! You completed the required elements but there are other topics that may help you with your customers. Consider reviewing those pieces before you go.";
      break;
      case 5: case 6: case 7: case 8:
      msg = "Pretty good! You've completed some of the elements for the Connected Vehicle Services but there are other pieces that can help you better serve your customers. You may want to take the time to go back and review them before exiting the course.";
      break;
      case 9: case 10: case 11:
      msg = "Great job! You've completed most of the elements required for the course. You may want to consider going back and reviewing some of the elements you may have missed.";
      break;
      case 12: case 13: case 14: case 15: default:
      msg = "Well done! You've completed all the required elements for the course!";
      break;
    }
    $("#completionBox").append("<p>"+msg+"</p>");

  } else {
    var list = "";
    for(var i = 0; i < requiredNotExecutedActions.length; i++) {
      list = list + "<li>"+requiredNotExecutedActions[i]+"</li>"
    }

    $("#completionBox").append("<p>Not quite. You haven't completed your requirements yet. Please go back and review the required elements before exiting the course or you will not receive credit for this course. Remember, the required elements include:</p><ul>"+list+"</ul>");
  }

  if(displayCompleteBtn === true) {
    $("#completionBox").append('<div class="row"><div class="col-sm-offset-2 col-sm-8"><a class="btn btn-default center-block btn-complete" id="btnComplete" role="button" onclick="setComplete()">Click Here for Credit</a></div></div>')
  }
}

function setupAssessment() {

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var assessmentID = parseInt($(".btn-assess").attr("id").substring(13,15), 10) - 1;

  if(assessmentID === 0){
    for(var i = 0; i < 3; i++){
      if(courseData.assessmentData.assessments[i].completed === "true"){
        $(".btn-assess").append("<div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'></div>");
        continue;
      }
    }

  } else if(assessmentID === 3) {
    if(courseData.assessmentData.assessments[assessmentID].completed === "true"){
      $(".btn-assess").append("<div class='viewed-overlay'><img src='/dir/media/img/icon_viewed.png'></div>");
    }
  }

  $(".btn-assess").click(function() {
    openModal('assessment', assessmentID, $(this));
  });


}

function setComplete() {
  SetComplete();

  $("#btnComplete").hide();

  var confirmMsg = "Thank you for completing this course. Your training record will be updated.";

  $("#sectionComplete").text(confirmMsg);
}

function disableSwiping() {
  $(window).off("swipeleft");
  $(window).off("swiperight");
}

function changeVolume(args) {
  $("video").prop("volume",args);
  $("audio").prop("volume",args);
}

function openPageModal(heading,content,img) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  $('#pageModalContainer').html('<div class="modal fade" id="pageModal" tabindex="-1" role="dialog" aria-labelledby="pageModalLabel" style="background:url('+img+') center bottom / cover no-repeat fixed"><div class="container"><div class="row"><div class="modal-dialog" role="document"><div class="modal-page text-container col-md-8"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="/'+courseData.THEME_PATH+'/media/img/btn_close.png" alt="close the modal"></span></button><h4 class="modal-title" id="">'+heading+'</h4></div><div class="modal-body clearfix">'+content+'</div></div></div></div></div></div>');

  $('.modal').on('hidden.bs.modal', function (e) {
    $('#pageModalContainer').html('');
  });

  $('.modal').modal();
}

function onAssessmentDone(param1, param2){
  alert(param1 + param2);
}

function loadContent(param){
  var arg = 'dir/content/course_content/' + param +'.xml';

  $.get(arg)
  .done(function(xml) {
    var titleSize = $(xml).find("title").text();
    var titleHTML = '<div class="row"><div class="col-sm-'+titleSize+'"><h1 id="pageTitle"></h1><div class="page-number"></div></div></div>';

    var completion = $(xml).find("content").attr("completion");
    if(completion){
      $('#pageContainer').addClass("completion");
      titleHTML = '<div class="row"><div class="col-sm-'+titleSize+'"><h1 id="pageTitle"></h1></div></div>';
    }

    $('#pageContent').append(titleHTML);
    $('#pageContent').append($(xml).find('content').text());

    //CERTAIN PAGES NEED SPECIFIC METHODS RUN FOR THE COMPONENTS
    //MUST BE RUN AFTER THE CONTENT HAS LOADED
    //MOVED FROM HTML BODY onLoad="" TO HERE DUE TO ASYNC
    var component = $(xml).find('component').text();
    if(component == 'game'){
      setupAssessment();
    }
    else if(component == 'dragAndDrop'){
      initDragDrops(xml);
    }
    else if(component == 'hotspot'){
      initHotspot(xml);
    }
    else if(component == 'cards'){
      initCards(xml);
    }
    else if(component == 'thumbnails'){
      initThumbnails(xml);
    }
    else if(component == 'knowledgeCheck'){
      initKnowledgeCheck(xml);
    }


    var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
    updatePagination();

    if(courseData.COUNT_PAGES == 'true') {
      registerPageVisit(LOCAL_COURSE_DATA_ID, pageID); // lives in tracking_functions.js
    }

    if(courseData.cardData !== undefined) {
      populateCards();
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
