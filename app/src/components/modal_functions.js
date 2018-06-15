function openModal(modalType, assessmentID, clickTarget) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var pathStr = courseData.THEME_PATH;
  switch(modalType) {
    case 'splashPage':
      $('#modalContainer').html(getSplashPage());
      break;
    case 'glossary':
      $('#modalContainer').html(getGlossary());
      glossaryNavigate();
      break;
    case 'resources':
      $('#modalContainer').html(getResources());
      break;
    case 'help':
      $('#modalContainer').html(getHelpPage());
      break;
    case 'assessment':
      $('#modalContainer').html(getAssessment());
      launchAssessment(assessmentID, clickTarget);
      break;
  }

  $('#beginCourse').click(function(){
    $('#modalContainer').html('');
    $('.modal-backdrop').remove();
  });

  $('.modal').on('shown.bs.modal', function (e) {
    $('.modal .modal-body').css({height: $('.modal').height()});
  });

  $('.modal').on('hidden.bs.modal', function (e) {
    $('#modalContainer').html('');
  });

  $('.modal').modal();
}

function openContentModal(heading, content) {
  $('#modalContainer').html('<div class="modal fade" id="contentModal" tabindex="-1" role="dialog" aria-labelledby="contentModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="'+pathStr+'/resouces/img/btn_close.png" alt="close the modal"></span></button><h4 class="modal-title" id="">'+heading+'</h4></div><div class="modal-body clearfix">'+content+'</div></div></div></div>');

  $('.modal').on('hidden.bs.modal', function (e) {
    $('#modalContainer').html('');
  });

  $('.modal').modal();
}

function openVidModal(heading,vidSrc,posterSrc) {
  $('#modalContainer').html("<div class='modal fade' id='vidModal' tabindex='-1' role='dialog' aria-labelledby='vidModalLabel'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'><img src='"+pathStr+"/media/img/btn_close.png' alt='close the modal'></span></button><h4 class='modal-title' id=''>"+heading+"</h4></div><div class='modal-body clearfix'><video id='' src='"+vidSrc+"' preload='none' controls poster='"+posterSrc+"'>Sorry, your browser doesn't support embedded videos, but don't worry, you can <a href=''>download it</a> and watch it with your favorite video player!</video></div></div></div></div>");

  $('.modal').on('hidden.bs.modal', function (e) {
    $('#modalContainer').html('');
  });

  $('.modal').modal();
}

function getSplashPage() {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));


  var title = courseData.splash.title;
  var caption = courseData.splash.caption;
  var intro = courseData.splash.introduction;


  var html = '<div class="modal" id="splashPageModal" tabindex="-1" role="dialog" aria-labelledby="splashPageModalLabel"><div class="modal-dialog" role="document" style="max-width: 1000px"><div class="modal-content"><div class="row"><div class="col-md-5 col"><h3>'+title+'</h3><h1>'+caption+'</h1><p>'+intro+'</p> <a id="beginCourse" class="btn btn-default d-block mx-auto" role="button">Begin Course</a></div></div></div></div></div><audio autoplay><source src="dir/media/audio/0.mp3"/></audio>';

  return html;
}

/* NEW GLOSSARY METHOD USING XML */

function getGlossary() {
  var glossary = '<div class="modal fade" id="glossaryModal" tabindex="-1" role="dialog" aria-labelledby="glossaryModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><div class="modal-title-wrapper"><h4 class="modal-title" id="glossaryModalLabel">GLOSSARY</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="dir/media/img/btn_close_glossary.png" alt="close the glossary"></span></button></div><div class="alphabet"><a id="" href="#">#</a><a id="" href="#">a</a><a id="" href="#">b</a><a id="" href="#">c</a><a id="" href="#">d</a><a id="" href="#">e</a><a id="" href="#">f</a><a id="" href="#">g</a><a id="" href="#">h</a><a id="" href="#">i</a><a id="" href="#">j</a><a id="" href="#">k</a><a id="" href="#">l</a><a id="" href="#">m</a><a id="" href="#">n</a><a id="" href="#">o</a><a id="" href="#">p</a><a id="" href="#">q</a><a id="" href="#">r</a><a id="" href="#">s</a><a id="" href="#">t</a><a id="" href="#">u</a><a id="" href="#">v</a><a id="" href="#">w</a><a id="" href="#">x</a><a id="" href="#">y</a><a id="" href="#">z</a></div></div><div class="modal-body">';


  for(i = 0; i < courseData.glossary.items.length; i++){

    var term = courseData.glossary.items[i].term;
    var def = courseData.glossary.items[i].definition;
    var glossID = term.charAt(0);


    var glossItem = '<div class="gloss-item" id="'+glossID+'"><h5>'+term+'</h5><p>'+ def +'</p></div>'

    glossary += glossItem;
  }

  glossary += '</div></div></div></div>';

  return glossary;

}

function glossaryNavigate(){
  $(".alphabet a").click(function() {
    var c = '#' + $(this).text()
    //If clicking # to see numbers, go to top
    if(c == '##'){
      $('.modal-body').scrollTop(
        0
      );
    }
    else{
      //Else, they are clicking letter
      if($(c).offset() != null){
        if($(c).offset().top > 140 || 120 > $(c).offset().top){
          $('.modal-body').scrollTop(
            0
          );

          $('.modal-body').animate({
            scrollTop: $(c).offset().top - 130
          });
        }
      }
    }
  });
}

/* end NEW GLOSSARY METHOD USING XML */

function getResources() {
  var glossary = '<div class="modal fade" id="resourcesModal" tabindex="-1" role="dialog" aria-labelledby="resourcesModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><div class="modal-title-wrapper"><h4 class="modal-title" id="resourcesModalLabel">RESOURCES</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="dir/media/img/btn_close_glossary.png" alt="close the resources"></span></button></div></div><div class="modal-body">';


  for(i = 0; i < courseData.resources.items.length; i++){

    var term = courseData.resources.items[i].term;
    var def = courseData.resources.items[i].definition;
    var name = courseData.resources.items[i].name;
    var source = courseData.resources.items[i].source;


    var resourceItem = '<div class="gloss-item""><h5>'+term+'</h5><p>'+ def +'</p><a target="blank" href="'+source+'" class="bolded">'+ name +'</a></div>'

    glossary += resourceItem;
  }

  glossary += '</div></div></div></div>';
  return glossary;

}


function getHelpPage() {
  var html = '<div class="modal fade" id="helpModal" tabindex="-1" role="dialog" aria-labelledby=""><div class="modal-dialog" style="max-width:none" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="helpModalLabel">HELP</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="dir/media/img/btn_close_help.png" alt="close the help page"></span></button></div><div class="modal-body"><div class="help-section"><h5>NAVIGATION</h5><div class="help-item"><h6>TABLE OF CONTENTS</h6><img src="dir/media/img/help_toc.png" alt="t.o.c. icon"/><p>Use this to navigate to different pages in the course.</p></div><div class="help-item"><h6>CONTENT AREA</h6><p>Content will appear here. Follow the on-screen instructions for videos or interactives. Some pages may scroll.</p></div><div class="help-item"><h6>PAGE COUNT</h6><img src="dir/media/img/help_page_count.png" alt="page count screen shot"/><p>Check your progress through the course.</p></div><div class="help-item"><h6>BACK/NEXT BUTTONS</h6><img src="dir/media/img/help_back_next.png" alt="page count screen shot"/><p>Use these buttons to move forward or backward in the course.</p></div></div><div class="help-section"><h5>HELP</h5><div class="help-item"><h6>HELP</h6><img src="dir/media/img/help_help.png" alt="page count screen shot"/><p>This page describes how to use the course.</p></div></div></div></div></div></div>';
  return html;
}

function getAssessment() {
  var html = '<div class="modal" id="assessmentModal" tabindex="-1" role="dialog" aria-labelledby="assessmentModalLabel" data-backdrop="static"><div class="modal-dialog" role="document" style="max-width: 1000px"><div class="modal-content"><div class="row"><div class="col-md-12 assessment-container"></div></div></div></div></div>';
  return html;
}
