function initCTR(CTRContentXML, elementID) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentCTR = $(CTRContentXML).find('ctr[id="'+elementID+'"]');
  if(currentCTR.length == 0){
    currentCTR = $(CTRContentXML).find('ctr');
  }
  var currentID = $(currentCTR).attr("id");

  if(courseData.ctrData.ctrs != null){
    for(var i=0; i < courseData.ctrData.ctrs.length; i++){
      if(courseData.ctrData.ctrs[i].id == currentID){
        var id = getCTRIndex(currentID);
        console.log("CTR Loaded Previously");
        setupCTR(id, elementID);
        return;
      }
    }
  }

  else{
    console.log("CTR Initialized");
    courseData.ctrData = {
      completed: false,
      ctrs: []
    };
  }

  var ctr = {
    id: $(currentCTR).attr("id"),
    completed: false,
    completion: {},
    score: 0,
    position: currentCTR.attr("position"),
    sections: []
  };

  if(currentCTR.find("completion").attr("gated") == "true"){
  ctr.completion = {
    gate : {
      chapter: currentCTR.find("chapter").text(),
      page: currentCTR.find("page").text(),
      lock: currentCTR.find("lock").text()
      }
    }
  };

  $(currentCTR).find("section").each(function() {
    var section ={
      click:$(this).find('click').text(),
      reveal:$(this).find('reveal').text(),
      completed: false
    }
    ctr.sections.push(section);
  });

  courseData.ctrData.ctrs.push(ctr);


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var id = getCTRIndex(currentID);
  setupCTR(id,elementID);
}

function setupCTR(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var num = courseData.ctrData.ctrs[id].sections.length;
  var position = courseData.ctrData.ctrs[id].position;
  var colNum = 12/num;

  var html = '<div class="row"><div class="col-md-12 mx-auto p-0"><div id=""><div id="ctr"><div class="row">';

  for(var i = 0; i < courseData.ctrData.ctrs[id].sections.length; i++){
    var click = courseData.ctrData.ctrs[id].sections[i].click;
    var reveal = courseData.ctrData.ctrs[id].sections[i].reveal;

    var sectionHtml = '<div class="col-md-'+colNum+' p-0"><div class="ctr-wrapper ctr-clickable"><div class="click">'+click+'</div></div><div class="ctr-wrapper"><div class="reveal">'+reveal+'</div></div></div>';

    html += sectionHtml;
  }


  html += '</div></div></div></div></div>';
  $('#'+elementID).append(html);

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

  $(".ctr-clickable").click(function(){

    var parent = $(this).parent();
    var reveal = parent.find(".reveal");
    reveal.css({"display":"block"});
    //$(this).css({"right": "0"});

  });

}

function getCTRIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.ctrData.ctrs.length; i++){
    if(courseData.ctrData.ctrs[i].id == currentID){
      return i;
    }
  }
}
