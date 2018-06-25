//INITIALIZE AND RENDER DRAG AND DROP
function initDragDrops(dragDropContentXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  courseData.dragDropData.VERSION = $(dragDropContentXML).find("version").text();

  //courseData.dragDropData.dragDrops = [];

  var currentDragDrop = $(dragDropContentXML).find("drag_drop");

  courseData.dragDropData = {
    completed: $(currentDragDrop).attr("completed"),
    score: 0,
    matchings: []
  };

  $(currentDragDrop).find("pair").each(function() {
    var currentPair = $(this);

    var pair = {
      drag: currentPair.find("drag").text(),
      drop: currentPair.find("drop").text()
    };
    courseData.dragDropData.matchings.push(pair);
  });

  var currentGate = $(dragDropContentXML).find("gate");
  if(currentGate.attr("lock") == "true"){
    courseData.dragDropData.gate = {
      chapter: currentGate.find("chapter").text(),
      page: currentGate.find("page").text(),
      lock: currentGate.find("lock").text()
    }
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
  setupDragDrop();

}

function setupDragDrop(){
  $('#dragAndDrop').remove();

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var dragDropData= courseData.dragDropData;

  var leftContainerHtml = '<div class="col-6 left">';
  var rightContainerHtml = '<div class="col-6 right">';

  for(var i = 0; i < dragDropData.matchings.length; i++){
    var holderID = 'holder' + i;
    var draggableID = 'p' + i;
    var draggableText = dragDropData.matchings[i].drag;
    var droppableID = 't' + i;
    var droppableText = dragDropData.matchings[i].drop;

    var draggable = '<div class="item-container holder" id="'+ holderID +'" ondrop="drop_handler(event);" ondragover="dragover_handler(event);"><p class="draggable" id="'+ draggableID +'" draggable="true" ondragstart="dragstart_handler(event);" >'+ draggableText +'</p></div>';

    var droppable = '<div class="item-container" id="'+ droppableID +'" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">'+ droppableText +'</div>';

    leftContainerHtml += draggable;
    rightContainerHtml += droppable;
  }

  leftContainerHtml += '</div>';
  rightContainerHtml += '</div>';

  var submitBtn = '</div><div class="row btn-row"><p class="feedback"><a onclick="setupDragDrop();" class="btn btn-reversed btn-restart">Restart</a><a onclick="submitDragDrop();" class="btn btn-default-main">Submit</a></p></div>';

  var html = '<div id="dragAndDrop"><div class="row">' + leftContainerHtml + rightContainerHtml + submitBtn;


  $("#pageContent").append(html);
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
  shuffleDrags();
  shuffleDrops();
}

function shuffleDrags(){
  var draggables = $('.left').children();

  var j, x;
  for (var i = draggables.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = draggables[i];
    draggables[i] = draggables[j];
    draggables[j] = x;
  }

  $('.left').empty();

  for(var i = 0; i < draggables.length; i++){
    $('.left').append(draggables[i]);
  }
  return;
}

function shuffleDrops(){
  var droppables = $('.right').children();

  var j, x;
  for (var i = droppables.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = droppables[i];
    droppables[i] = droppables[j];
    droppables[j] = x;
  }

  $('.right').empty();

  for(var i = 0; i < droppables.length; i++){
    $('.right').append(droppables[i]);
  }
  return;
}

function submitDragDrop(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var score = 0;

  if(courseData.dragDropData.gate != null) {
    var chapter = courseData.dragDropData.gate.chapter;
    var page = courseData.dragDropData.gate.page;
    var lock = courseData.dragDropData.gate.lock;
    openLock(chapter-1, page, lock);
  }

  var answers = $('#dragAndDrop .right').children();
  for(var i = 0; i < answers.length; i++){
    var answerID = answers[i].id;

    if($('#'+answerID).find('p')[0] == null){
      $('#dragAndDrop .feedback').html('Finish dragging items to their correct location.<a onclick="setupDragDrop();" class="btn btn-reversed">Restart</a><a onclick="submitDragDrop();" class="btn btn-default-main">Submit</a>')
      return;
    }
  }

  for(var i = 0; i < answers.length; i++){
    var answerID = answers[i].id;
    var matchID = $('#'+answerID).find('p')[0].id;

    if(answerID.charAt(1) == matchID.charAt(1)){
      $('#'+matchID).addClass('correct');
      score += 10;
    }
    else{
      $('#'+matchID).addClass('wrong');
    }
  }
  courseData.dragDropData.completed = true;
  courseData.dragDropData.score = score;
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var percentage = courseData.dragDropData.matchings.length;
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


  $('#dragAndDrop .feedback').html(gameFeedback+'<a onclick="setupDragDrop();" class="btn btn-reversed ">Restart</a><a onclick="submitDragDrop();" class="btn btn-default-main">Submit</a>');
  $('#dragAndDrop .feedback').after('');
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

// DRAG AND DROP CORE FUNCTIONALITY
function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dropEffect = "move";
}

function dragover_handler(ev) {
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

function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  var dragVal = ev.dataTransfer.getData("text");
  var dropVal = ev.target.id;

  var dragId = "#"+dragVal;
  var dropId = "#"+dropVal;

  if(dropVal.charAt(0) == 'p'){
    var tempDropId = dropId;
    dropId = '#'+$(dropId).parent('.item-container').attr('id');

    var index = $(tempDropId).parent('.item-container').index();


    if($(dragId).parent().parent().hasClass('right')){
      $(dragId).parent('.item-container').append($(tempDropId));
    }
    else{
      for(var i = index; i < index + $('.right').children().length; i++){
        if($('.right').children().eq(i % $('.right').children().length).children().length == 0){
          $('.right').children().eq(i % $('.right').children().length).append($(tempDropId));
          break;
        }
      }
    }
  }

  $(dropId).append($(dragId));

  $(dragId).removeClass('correct');
  $(dragId).removeClass('wrong');
}
