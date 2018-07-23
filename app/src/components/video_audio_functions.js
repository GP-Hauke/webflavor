//INITIALIZE AND RENDER DRAG AND DROP
function initVideoAudio(videoAudioComponentXML, elementID) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentVideoAudio = $(videoAudioComponentXML).find('VideoAudio[id="'+elementID+'"]');
  if(currentVideoAudio.length == 0){
    currentVideoAudio = $(videoAudioComponentXML).find('VideoAudio');
  }
  var currentID = $(currentVideoAudio).attr("id");

  if(courseData.videoAudioData.videoAudio != null){
    for(var i=0; i < courseData.videoAudioData.videoAudio.length; i++){
      if(courseData.videoAudioData.videoAudio[i].id == currentID){
        var id = getVideoAudioIndex(currentID);
        console.log("Video/Audio Loaded Previously");
        setupVideoAudio(id,elementID);
        return;
      }
    }
  }

  else{
    console.log("Video/Audio Initialized");
    courseData.videoAudioData.completed = 0;
    courseData.videoAudioData.videoAudio = [];

  }

  var videoAudio = {
    id: $(currentVideoAudio).attr("id"),
    completed: false,
    completion: {},
    type: $(currentVideoAudio).find('type').text(),
    embeded: $(currentVideoAudio).find('embeded').text(),
    poster: $(currentVideoAudio).find('poster').text(),
    source: $(currentVideoAudio).find('source').text()
  };

  courseData.videoAudioData.videoAudio.push(videoAudio);


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var id = getVideoAudioIndex(currentID);
  setupVideoAudio(id,elementID);
}

function setupVideoAudio(id,elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var src = courseData.videoAudioData.videoAudio[id].source;
  var poster = courseData.videoAudioData.videoAudio[id].poster;
  var embeded = courseData.videoAudioData.videoAudio[id].embeded;
  var type = courseData.videoAudioData.videoAudio[id].type;

  if(embeded == "true"){
    if(type == "video"){
      var html = '<video id="'+elementID+'-video-embed" poster="'+poster+'" controls><source src="'+src+'" type="video/mp4">Your browser does not support the video tag.</video>';
    }
    else{
      var html = '<audio id="'+elementID+'-audio-embed" controls><source src="'+src+'" type="audio/mp3">Your browser does not support the audio element.</audio>';
    }
  }
  else{
    //openAudioModal(src);
    //openVideoModal(src);
    if(type == "video"){
      var html = '<img src="'+poster+'" alt="poster" class="embeded-vidAud"><img id="'+elementID+'-video" class="playBtnOverlay" src="dir/media/img/play_overlay.png">';
    }
    else{
      var html = '<img src="'+poster+'" alt="poster"  class="embeded-vidAud"><img id="'+elementID+'-audio" class="playBtnOverlay" src="dir/media/img/play_overlay.png">';
    }
  }

  $("#"+elementID).empty();
  $("#"+elementID).append(html);

  $('#'+elementID+'-audio').click(function(){
    console.log("HERE");
    openAudioModal(src);
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));
  });

  $('#'+elementID+'-video').click(function(){
    openVideoModal(src);
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));
  });

  $('#'+elementID+'-audio-embed').on('play', function (e) {
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));

  });

  $('#'+elementID+'-video-embed').on('play', function (e) {
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));
  });


}

function getVideoAudioIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.videoAudioData.videoAudio.length; i++){
    if(courseData.videoAudioData.videoAudio[i].id == currentID){
      return i;
    }
  }
}


function checkVideoAudioCompletion(elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  if(courseData.videoAudioData.videoAudio[elementID].completed == false){
    courseData.videoAudioData.videoAudio[elementID].completed = true;
    courseData.videoAudioData.completed += 1;
    courseData.COMPLETED_INTERACTIVES += 1;

    if(courseData.videoAudioData.videoAudio[elementID].completion.gate != null) {
      var chapter = courseData.videoAudioData.videoAudio[elementID].completion.gate.chapter;
      var page = courseData.videoAudioData.videoAudio[elementID].completion.gate.page;
      var lock = courseData.videoAudioData.videoAudio[elementID].completion.gate.lock;
      openLock(chapter, page, lock);
    }
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

}
