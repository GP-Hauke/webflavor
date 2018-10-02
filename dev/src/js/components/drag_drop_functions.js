//INITIALIZE AND RENDER DRAG AND DROP
var LOCAL_COURSE_DATA_ID;
export function initDragAndDrop(dragDropContentXML, elementID, localStorageID) {
  LOCAL_COURSE_DATA_ID = localStorageID;

  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentDragDrop = $(dragDropContentXML).find('DragAndDrop[id="'+elementID+'"]');
  if(currentDragDrop.length == 0){
    currentDragDrop = $(dragDropContentXML).find('DragAndDrop');
  }
  var currentID = $(currentDragDrop).attr("id")

  if(courseData.dragDropData.dragDrops != null){
    for(var i=0; i < courseData.dragDropData.dragDrops.length; i++){
      if(courseData.dragDropData.dragDrops[i].id == currentID){
        var id = getDragDropIndex(currentID);
        console.log("DragDrop Loaded Previously");
        setupDragDrop(id, elementID);
        return;
      }
    }
  }

  else{
    console.log("DragDrop Initialized");
    courseData.dragDropData.completed = 0;
    courseData.dragDropData.dragDrops = [];

  }

  var dragDrop = {
    id: $(currentDragDrop).attr("id"),
    completed: false,
    completion: {
      minimumScore: $(currentDragDrop).find("completion").find("minimumScore").text()
    },
    matchings: []
  };

  $(currentDragDrop).find("pair").each(function() {
    var currentPair = $(this);

    var pair = {
      drag: currentPair.find("drag").text(),
      drop: currentPair.find("drop").text()
    };
    dragDrop.matchings.push(pair);
  });

  var currentGate = $(dragDropContentXML).find("completion");
  if(currentGate.attr("gated") == "true"){
    dragDrop.completion.gate = {
      chapter: currentGate.find("chapter").text(),
      page: currentGate.find("page").text(),
      lock: currentGate.find("lock").text()
    }
  }
  courseData.dragDropData.dragDrops.push(dragDrop);
  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
  var id = getDragDropIndex(currentID);
  setupDragDrop(id, elementID);

}

export function setupDragDrop(id, elementID){

  if(elementID == null){
    $('#dragAndDrop').remove();
  }
  $('#'+elementID).empty();
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var dragDropData = courseData.dragDropData.dragDrops[id];

  var submitBtn = `
  </div>
    <p class="feedback">
      <a class="btn btn-reversed btn-restart">Restart
      </a>
      <a class="btn btn-default-main btn-submit">Submit
      </a>
    </p>`;

  var leftContainerHtml = `<div class="col-6 left"></div>`;

  var rightContainerHtml = `<div class="col-6 right"></div>`;

  var html = `
    <div id="dragAndDrop" class="container">
      <div class="row">` + leftContainerHtml + rightContainerHtml + submitBtn;


  if(elementID != null){
    $("#"+elementID).empty();
    $("#"+elementID).html(html);
  }

  for(var i = 0; i < dragDropData.matchings.length; i++){
    var holderID = elementID+'_holder' + i;
    var draggableID = elementID+'_p' + i;
    var draggableText = dragDropData.matchings[i].drag;
    var droppableID = elementID+'_t' + i;
    var droppableText = dragDropData.matchings[i].drop;

    var draggable = `
      <div class="item-container holder" id="`+ holderID +`" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">
        <p class="draggable" id="`+ draggableID +`" draggable="true" ondragstart="dragstart_handler(event);" ontouchstart="dragstart_handler(event);" >`+ draggableText +`
        </p>
      </div>`;

    var droppable = '<div class="item-container" id="'+ droppableID +'" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">'+ droppableText +'</div>';

    $("#"+elementID + ' .left').append(draggable);
    $("#"+elementID + ' .right').append(droppable);
  }


  $(".btn-restart").click(function(){
    setupDragDrop(id, elementID);
  });
  $(".btn-submit").click(function(){
    submitDragDrop(id, elementID);
  });

  $('#dragAndDrop .btn-reversed').on({
    mouseenter: function () {
      $(this).removeClass('btn-reversed');
      $(this).addClass('btn-default-main');
      $(this).next().removeClass('btn-default-main');
      $(this).next().addClass('btn-reversed');

    },
    mouseleave: function () {
      $(this).addClass('btn-reversed');
      $(this).removeClass('btn-default-main');
      $(this).next().addClass('btn-default-main');
      $(this).next().removeClass('btn-reversed');
    }
  })
  shuffleDrags(elementID);
  shuffleDrops(elementID);


}

export function shuffleDrags(elementID){
  var draggables = $("#"+elementID + ' .left').children();
  var j, x;
  for (var i = draggables.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = draggables[i];
    draggables[i] = draggables[j];
    draggables[j] = x;
  }

  $("#"+elementID + ' .left').empty();

  for(var i = 0; i < draggables.length; i++){
    $("#"+elementID + ' .left').append(draggables[i]);
  }
  return;
}

export function shuffleDrops(elementID){
  var droppables = $("#"+elementID + ' .right').children();

  var j, x;
  for (var i = droppables.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = droppables[i];
    droppables[i] = droppables[j];
    droppables[j] = x;
  }

  $("#"+elementID + ' .right').empty();

  for(var i = 0; i < droppables.length; i++){
    $("#"+elementID + ' .right').append(droppables[i]);
  }
  return;
}

export function submitDragDrop(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var score = 0;
  var minScore = parseInt(courseData.dragDropData.dragDrops[id].completion.minimumScore);

  var answers = $("#"+elementID + ' .right').children();
  for(var i = 0; i < answers.length; i++){
    var answerID = answers[i].id;


    if($('#'+answerID).find('p')[0] == null){
      $("#"+elementID + ' .feedback').html('Finish dragging items to their correct location.<a class="btn btn-reversed btn-restart">Restart</a><a class="btn btn-default-main btn-submit">Submit</a>')

      $(".btn-restart").click(function(){
        setupDragDrop(id, elementID);
      });
      $(".btn-submit").click(function(){
        submitDragDrop(id, elementID);
      });

      $('#dragAndDrop .btn-reversed').on({
        mouseenter: function () {
          $(this).removeClass('btn-reversed');
          $(this).addClass('btn-default-main');
          $(this).next().removeClass('btn-default-main');
          $(this).next().addClass('btn-reversed');

        },
        mouseleave: function () {
          $(this).addClass('btn-reversed');
          $(this).removeClass('btn-default-main');
          $(this).next().addClass('btn-default-main');
          $(this).next().removeClass('btn-reversed');
        }
      });
      return;
    }
  }

  for(var i = 0; i < answers.length; i++){
    var answerID = answers[i].id;
    var matchID = $('#'+answerID).find('p')[0].id;
    var answerTemp = answerID.substr(answerID.indexOf("_") + 2);
    var matchTemp = matchID.substr(matchID.indexOf("_") + 2);

    if(answerTemp == matchTemp){
      $('#'+matchID).addClass('correct');
      score += 10;
    }
    else{
      $('#'+matchID).addClass('wrong');
    }
  }

  if(score >= minScore && courseData.dragDropData.dragDrops[id].completed == false){
    console.log("DragDrop Completed");
    courseData.dragDropData.dragDrops[id].completed = true;
    courseData.dragDropData.completed += 1;
    courseData.INTERACTIVES_COMPLETED += 1;
    if(courseData.dragDropData.dragDrops[id].completion.gate != null) {
      var chapter = courseData.dragDropData.dragDrops[id].completion.gate.chapter;
      var page = courseData.dragDropData.dragDrops[id].completion.gate.page;
      var lock = courseData.dragDropData.dragDrops[id].completion.gate.lock;
      openLock(chapter, page, lock);
    }
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

  }

  courseData.dragDropData.dragDrops[id].score = score;
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var percentage = courseData.dragDropData.dragDrops[id].matchings.length;
  var correctPercentage = score / percentage;
  correctPercentage = parseFloat(correctPercentage.toFixed(0));
  var gameFeedback;

  switch(correctPercentage) {
    case 0: case 1: case 2: case 3: case 4: case 5:
    gameFeedback = "Try again?";
    break;
    case 6: case 7: case 8:
    gameFeedback = "Keep practicing.";
    break;
    case 9: case 10:
    gameFeedback = "Nice job!";
    break;
  }

  gameFeedback += " <span> Total Score: +"+score+" points</span.>";


  $("#"+elementID + ' .feedback').html(gameFeedback+'<a class="btn btn-restart btn-reversed ">Restart</a><a  class="btn btn-default-main btn-submit">Submit</a>');
  $("#"+elementID + ' .feedback').after('');
  $(".btn-restart").click(function(){
    setupDragDrop(id, elementID);
  });
  $(".btn-submit").click(function(){
    submitDragDrop(id, elementID);
  });
  $('#dragAndDrop .btn-reversed').on({
    mouseenter: function () {
      $(this).removeClass('btn-reversed');
      $(this).addClass('btn-default-main');
      $(this).next().removeClass('btn-default-main');
      $(this).next().addClass('btn-reversed');

    },
    mouseleave: function () {
      $(this).addClass('btn-reversed');
      $(this).removeClass('btn-default-main');
      $(this).next().addClass('btn-default-main');
      $(this).next().removeClass('btn-reversed');
    }
  });
}

export function getDragDropIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.dragDropData.dragDrops.length; i++){
    if(courseData.dragDropData.dragDrops[i].id == currentID){
      return i;
    }
  }
}

// DRAG AND DROP CORE FUNCTIONALITY
export function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dropEffect = "move";
}

export function dragover_handler(ev) {
  if($(ev.target).hasClass('item-container')){
    ev.dataTransfer.dropEffect = "move"
    ev.preventDefault();
    return;
  }
  else if($(ev.target).hasClass('draggable')){
    ev.dataTransfer.dropEffect = "move"
    ev.preventDefault();
    return;
  }
}

export function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  var dragVal = ev.dataTransfer.getData("text");
  var dropVal = ev.target.id;

  var dragId = "#"+dragVal;
  var dropId = "#"+dropVal;

  var tempVal = dropVal.substr(dropVal.indexOf("_") + 1);

  if(tempVal.charAt(0) == 'p'){
    var tempDropId = dropId;
    dropId = '#'+$(dropId).parent('.item-container').attr('id');

    var index = $(tempDropId).parent('.item-container').index();
    $(dragId).parent('.item-container').append($(tempDropId));
  }

  $(dropId).append($(dragId));

  $(dragId).removeClass('correct');
  $(dragId).removeClass('wrong');
}

window.dragstart_handler = dragstart_handler;
window.dragover_handler = dragover_handler;
window.drop_handler = drop_handler;
