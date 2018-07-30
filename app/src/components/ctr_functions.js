var LOCAL_COURSE_DATA_ID;

export function initCtr(CtrContentXML, elementID,localStorageID) {
  LOCAL_COURSE_DATA_ID = localStorageID;
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentCtr = $(CtrContentXML).find('Ctr[id="'+elementID+'"]');
  if(currentCtr.length == 0){
    currentCtr = $(CtrContentXML).find('Ctr');
  }
  var currentID = $(currentCtr).attr("id");

  if(courseData.ctrData.ctrs != null){
    for(var i=0; i < courseData.ctrData.ctrs.length; i++){
      if(courseData.ctrData.ctrs[i].id == currentID){
        var id = getCtrIndex(currentID);
        console.log("Ctr Loaded Previously");
        setupCtr(id, elementID);
        return;
      }
    }
  }

  else{
    console.log("Ctr Initialized");
    courseData.ctrData.completed = 0;
    courseData.ctrData.ctrs = [];
  }

  var ctr = {
    id: $(currentCtr).attr("id"),
    completed: false,
    completion: {},
    score: 0,
    position: currentCtr.attr("position"),
    sections: []
  };

  if(currentCtr.find("completion").attr("gated") == "true"){
  ctr.completion = {
    gate : {
      chapter: currentCtr.find("chapter").text(),
      page: currentCtr.find("page").text(),
      lock: currentCtr.find("lock").text()
      }
    }
  };

  $(currentCtr).find("section").each(function() {
    var section ={
      click:$(this).find('click').text(),
      reveal:$(this).find('reveal').text(),
      completed: false
    }
    ctr.sections.push(section);
  });

  courseData.ctrData.ctrs.push(ctr);


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var id = getCtrIndex(currentID);
  setupCtr(id,elementID);
}

export function setupCtr(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var num = courseData.ctrData.ctrs[id].sections.length;
  var position = courseData.ctrData.ctrs[id].position;
  var colNum = 12/num;

  var html = '<div class="row"><div class="col-md-12 mx-auto p-0"><div id=""><div class="ctr"><div class="row"></div></div></div></div></div>';

  $('#'+elementID).append(html);


  for(var i = 0; i < courseData.ctrData.ctrs[id].sections.length; i++){
    var click = courseData.ctrData.ctrs[id].sections[i].click;
    var reveal = courseData.ctrData.ctrs[id].sections[i].reveal;

    var sectionHtml = '<div class="col-md-'+colNum+' p-0" id="'+elementID+'-'+i+'"><div class="ctr-wrapper '+elementID+'-section-'+i+'"><div class="click">'+click+'</div></div><div class="ctr-wrapper"><div class="reveal">'+reveal+'</div></div></div>';

    $('#'+elementID + ' .ctr .row').append(sectionHtml);

    $("."+elementID+"-section-"+i).click(function(){
      var parent = $(this).parent();
      var reveal = parent.find(".reveal");
      reveal.css({"display":"block"});
      var sectionID = parent.attr('id');
      sectionID = sectionID.substr(sectionID.length-1, sectionID.length);
      checkCTRCompletion(id, sectionID)
    });

  }


  //$('#'+elementID).append(html);

  //DEFAULT POSITION IS RIGHT
  var click = $('#'+elementID+ ' .click').parent();
  var reveal = $('#'+elementID+ ' .reveal').parent();

  if(position == "right"){
    click.css({"left": "0"});
    reveal.css({"right": "0"});

  }
  else if(position == "left"){
    click.css({"right": "0"});
    reveal.css({"left": "0"});
  }

  else if(position == "top"){
    click.css({
      "bottom": "0",
      "width": "100%",
      "height": "50%"
    });
    reveal.css({
      "top": "0",
      "width": "100%",
      "height": "50%"
    });
  }
  else if(position == "bottom"){
    click.css({
      "top": "0",
      "width": "100%",
      "height": "50%"
    });
    reveal.css({
      "bottom": "0",
      "width": "100%",
      "height": "50%"
    });
  }
}

export function getCtrIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.ctrData.ctrs.length; i++){
    if(courseData.ctrData.ctrs[i].id == currentID){
      return i;
    }
  }
}

export function checkCTRCompletion(id, sectionID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  console.log(id);

  if(courseData.ctrData.ctrs[id].sections[sectionID].completed == false){
    courseData.ctrData.ctrs[id].sections[sectionID].completed = true;
    courseData.ctrData.ctrs[id].score += 1;
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

    if(courseData.ctrData.ctrs[id].score >= courseData.ctrData.ctrs[id].sections.length){
      courseData.ctrData.ctrs[id].completed = true;
      courseData.ctrData.completed += 1;
      courseData.COMPLETED_INTERACTIVES += 1;
      localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
      console.log("Ctr Completed");
      if(courseData.ctrData.ctrs[id].completion.gate != null) {
        var chapter = courseData.ctrData.ctrs[id].completion.gate.chapter;
        var page = courseData.ctrData.ctrs[id].completion.gate.page;
        var lock = courseData.ctrData.ctrs[id].completion.gate.lock;
        openLock(chapter, page, lock);
      }
    }
  }
  //console.log("ID" + id);
  //console.log(courseData.ctrData.ctrs[id].sections.length);


}

export function setCtrInteractions(){

}
