var lockTracker = [];

function initVideo() {
  vids = $('video');

  for(var i = 0; i < vids.length; i++) {
    lockTracker[i] = i;
    vidNum = parseInt(vids[i].id);
    $('#'+vidNum).attr("poster", "../resources/media/img/video_poster_"+vidNum+".jpg");
    $('#'+vidNum).hover(vidOverHandler, vidOutHandler);

    $('#'+vidNum).click(function(){
      vidClickHandler($(this));
    });

    $('#'+vidNum)[0].onplay = function () {
      window.parent.openLock(window.parent.currentChapter,window.parent.currentPage,lockTracker.length);
      lockTracker.pop();
    };
  }
}

function vidOverHandler() {
  var imgNum = $(this).attr('id');
  $(this).attr("poster", "../resources/media/img/video_poster_hover_"+imgNum+".jpg");
}

function vidOutHandler() {
  var imgNum = $(this).attr('id');
  $(this).attr("poster", "../resources/media/img/video_poster_"+imgNum+".jpg");
}

function vidClickHandler(obj) {
  obj.get(0).play();
}
