var ctrTracker = [];
var currentClip;

function initAudio() {
  $("div.caption div").css("display","none");

  var imgBtns = $('.thumbnail img');

  for(var i = 0; i < imgBtns.length; i++) {
    $(imgBtns[i]).click(playAudioClip);
  }
}

function playAudioClip() {
  if(currentClip !== undefined) {
    currentClip.pause();
  }

  currentClip = new Audio($(this).data("audio-src"));
  currentClip.play();
}
