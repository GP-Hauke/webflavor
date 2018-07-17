//INITIALIZE AND RENDER DRAG AND DROP
function initHotspot(hotspotContentXML, elementID) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentHotspot = $(hotspotContentXML).find('Hotspot[id="'+elementID+'"]');
  if(currentHotspot.length == 0){
    currentHotspot = $(hotspotContentXML).find('Hotspot');
  }
  var currentID = $(currentHotspot).attr("id");

  if(courseData.hotspotData.hotspots != null){
    for(var i=0; i < courseData.hotspotData.hotspots.length; i++){
      if(courseData.hotspotData.hotspots[i].id == currentID){
        var id = getHotspotIndex(currentID);
        console.log("Hotspot Loaded Previously");
        setupHotSpot(id,elementID);
        return;
      }
    }
  }

  else{
    console.log("Hotspot Initialized");
    courseData.hotspotData = {
      completed: false,
      hotspots: []
    };
  }

  var hotspot = {
    id: $(currentHotspot).attr("id"),
    completed: false,
    completion: {},
    score: 0,
    img: $(currentHotspot).find("img").text(),
    spots: []
  };

  if(currentHotspot.find("completion").attr("gated") == "true"){
  hotspot.completion = {
    gate : {
      chapter: currentHotspot.find("chapter").text(),
      page: currentHotspot.find("page").text(),
      lock: currentHotspot.find("lock").text()
      }
    }
  };

  $(currentHotspot).find("spot").each(function() {
    var currentSpot = $(this);
    spot ={
      label:currentSpot.find('label').text(),
      popup:currentSpot.find('popup').text(),
      completed: false
    }
    hotspot.spots.push(spot);
  });

  courseData.hotspotData.hotspots.push(hotspot);


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var id = getHotspotIndex(currentID);
  setupHotSpot(id,elementID);
}


function setupHotSpot(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var img = courseData.hotspotData.hotspots[id].img;
  var html ='<div id="hotSpot"><img class="hotSpot-img" src="'+img+'">';

  for(var i = 0; i < courseData.hotspotData.hotspots[id].spots.length; i++){
    var label = courseData.hotspotData.hotspots[id].spots[i].label;
    html += '<div id="spot-'+i+'" class="hotSpot-spot circle-'+label+'">'+label+'</div>';
  }

  html += '<div class="hotSpot-popup"></div>';


  if(elementID != null){
    $("#"+elementID).empty();
    $("#"+elementID).html(html);
  }
  else{
    $('#pageContent').append(html);
  }

  var popup_1 = "<ul><li>Ask your Sales Manager about recommended routes.</li><li>Include a variety of speed zones. Make sure there are stretches that allow the customer to drive more than 45 mph.</li><li>Alternate your route as needed.</li></ul>";

  var popup_2 = "<ul><li>Be flexible on the drive. Your customer may want a longer or shorter drive than planned.</li><li>Ask your manager how to handle these situations.</li><li>If the customer wants a shorter drive, know how to return to the dealership quuickly using streets with varied speeds that will still enhance the drive.</li></ul>";

  var popup_3 = "<ul><li>Know your drive.</li><li>Shadow a live demo drive with an experienced consultant and a customer.</li><li>Play the role of a customer and let an experienced consultant show you how he or she conducts a demo drive.</li></ul>";


  $('#' + elementID + ' .hotSpot-spot').click(function(){

    var spotID = $(this).attr("id").substr($(this).attr("id").length - 1);
    var popupHTML = courseData.hotspotData.hotspots[id].spots[spotID].popup;

    if(courseData.hotspotData.hotspots[id].spots[spotID].completed == false){
      courseData.hotspotData.hotspots[id].spots[spotID].completed = true;
      courseData.hotspotData.hotspots[id].score += 1;
    }

    $('#' + elementID + ' .hotSpot-popup').empty();
    $('#' + elementID + ' .hotSpot-popup').append('<a class="hotSpot-close">x</a>' + popupHTML);
    $('#' + elementID + ' .hotSpot-popup').css('display','block');

    $('#' + elementID + ' .hotSpot-popup .hotSpot-close').click(function(){
      $('#' + elementID + ' .hotSpot-popup').css('display','none');
    });

    if(courseData.hotspotData.hotspots[id].score >= courseData.hotspotData.hotspots[id].spots.length){
      console.log("Hotspot Completed");
      courseData.hotspotData.hotspots[id].completed = true;
      if(courseData.hotspotData.hotspots[id].completion.gate != null) {
        var chapter = courseData.hotspotData.hotspots[id].completion.gate.chapter;
        var page = courseData.hotspotData.hotspots[id].completion.gate.page;
        var lock = courseData.hotspotData.hotspots[id].completion.gate.lock;
        openLock(chapter, page, lock);
      }
    }
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  });
}

function getHotspotIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.hotspotData.hotspots.length; i++){
    if(courseData.hotspotData.hotspots[i].id == currentID){
      return i;
    }
  }
}
