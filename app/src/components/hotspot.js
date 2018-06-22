//INITIALIZE AND RENDER DRAG AND DROP
function initHotspot(hotspotContentXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  courseData.hotspotData.VERSION = $(hotspotContentXML).find("version").text();

  var currentHotspot = $(hotspotContentXML).find("hotspot");

  courseData.hotspotData.hotspot = {
    completed: $(currentHotspot).attr("completed"),
    spots: []
  };

  $(currentHotspot).find("spot").each(function() {
    var currentSpot = $(this);
    spot ={
      label:currentSpot.find('label').text(),
      popup:currentSpot.find('popup').text()
    }
    courseData.hotspotData.hotspot.spots.push(spot);
  });


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  setupHotSpot();

}



function setupHotSpot(){

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));


  var html ='<div class="row"><div class="col-md-12"><div id="hotSpot"><img class="hotSpot-img" src="dir/media/img/assets/City-Map.jpg">';

  for(var i = 0; i < courseData.hotspotData.hotspot.spots.length; i++){
    var label = courseData.hotspotData.hotspot.spots[i].label;
    html += '<div id="spot-'+i+'" class="hotSpot-spot circle-'+label+'">'+label+'</div>';
  }

  html += '<div class="hotSpot-popup"></div></div></div>';


  $("#pageContent").append(html);

  var popup_1 = "<ul><li>Ask your Sales Manager about recommended routes.</li><li>Include a variety of speed zones. Make sure there are stretches that allow the customer to drive more than 45 mph.</li><li>Alternate your route as needed.</li></ul>";

  var popup_2 = "<ul><li>Be flexible on the drive. Your customer may want a longer or shorter drive than planned.</li><li>Ask your manager how to handle these situations.</li><li>If the customer wants a shorter drive, know how to return to the dealership quuickly using streets with varied speeds that will still enhance the drive.</li></ul>";

  var popup_3 = "<ul><li>Know your drive.</li><li>Shadow a live demo drive with an experienced consultant and a customer.</li><li>Play the role of a customer and let an experienced consultant show you how he or she conducts a demo drive.</li></ul>";


  $('#hotSpot .hotSpot-spot').click(function(){

    var spotID = $(this).attr("id").substr($(this).attr("id").length - 1);


    var popupHTML =     courseData.hotspotData.hotspot.spots[spotID].popup;


    $('#hotSpot .hotSpot-popup').empty();
    $('#hotSpot .hotSpot-popup').append('<a class="hotSpot-close">x</a>' + popupHTML);
    $('#hotSpot .hotSpot-popup').css('display','block');

    $('#hotSpot .hotSpot-popup .hotSpot-close').click(function(){
      $('#hotSpot .hotSpot-popup').css('display','none');
    });
  });
}
