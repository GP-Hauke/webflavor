//INITIALIZE AND RENDER DRAG AND DROP
import * as Modal from '../components/modal_functions';

var LOCAL_COURSE_DATA_ID;
export function initVideoAudio(videoAudioComponentXML, elementID, localStorageID) {
  LOCAL_COURSE_DATA_ID = localStorageID;

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
    embedded: $(currentVideoAudio).find('embedded').text(),
    poster: $(currentVideoAudio).find('poster').text(),
    source: $(currentVideoAudio).find('source').text(),
    heading: $(currentVideoAudio).find('heading').text(),
    caption: $(currentVideoAudio).find('caption').text(),
    youtube: $(currentVideoAudio).find('youtube').text(),
    popup: $(currentVideoAudio).find('popup').text()

  };

  courseData.videoAudioData.videoAudio.push(videoAudio);


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var id = getVideoAudioIndex(currentID);
  setupVideoAudio(id,elementID);
}

export function setupVideoAudio(id,elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var src = courseData.videoAudioData.videoAudio[id].source;
  var poster = courseData.videoAudioData.videoAudio[id].poster;
  var embedded = courseData.videoAudioData.videoAudio[id].embedded;
  var type = courseData.videoAudioData.videoAudio[id].type;
  var heading = courseData.videoAudioData.videoAudio[id].heading;
  var caption = courseData.videoAudioData.videoAudio[id].caption;
  var youtube = courseData.videoAudioData.videoAudio[id].youtube;
  var popup = courseData.videoAudioData.videoAudio[id].popup;

  if(popup == "true"){
    var html = '<div class="videoAudio"><div class="img-container"><img class="popupImg" style="width: 100%; cursor: pointer" src="'+poster+'"></div>';
  }

  else{
    if(youtube == "true"){
      var html = '<div class="videoAudio"><div class="youtube-container"><iframe class="youtube" width="100%" height="120%" src="'+src+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
    }
    else{
      var html = '<div class="videoAudio"><video id="'+elementID+'-video-embed" poster="'+poster+'" style="margin-bottom: -6px;"" controls><source src="'+src+'" type="video/mp4"">Your browser does not support the video tag.</video>';

    }
  }

  if(heading.length > 0){
    html += '<div class="caption"><div class="caption-title"><span>'+ heading+'</span></div><p>'+caption+'</p></div></div></div>';
  }
  else{
    html += '</div>'
  }

  $("#"+elementID).empty();
  $("#"+elementID).append(html);

  $('#'+elementID+' .popupImg').click(function(){
    console.log("HERE");
    Modal.openVideoModal(src);
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));
  });

  $('#'+elementID+'-video').click(function(){
    Modal.openVideoModal(src);
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));
  });

  $('#'+elementID+'-audio-embed').on('play', function (e) {
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));

  });

  $('#'+elementID+'-video-embed').on('play', function (e) {
    checkVideoAudioCompletion(getVideoAudioIndex(elementID));
  });


}

export function getVideoAudioIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.videoAudioData.videoAudio.length; i++){
    if(courseData.videoAudioData.videoAudio[i].id == currentID){
      return i;
    }
  }
}


export function checkVideoAudioCompletion(elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  if(courseData.videoAudioData.videoAudio[elementID].completed == false){
    courseData.videoAudioData.videoAudio[elementID].completed = true;
    courseData.videoAudioData.completed += 1;
    courseData.INTERACTIVES_COMPLETED += 1;

    if(courseData.videoAudioData.videoAudio[elementID].completion.gate != null) {
      var chapter = courseData.videoAudioData.videoAudio[elementID].completion.gate.chapter;
      var page = courseData.videoAudioData.videoAudio[elementID].completion.gate.page;
      var lock = courseData.videoAudioData.videoAudio[elementID].completion.gate.lock;
      openLock(chapter, page, lock);
    }
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

}
