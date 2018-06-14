//INITIALIZE AND RENDER DRAG AND DROP
function initDragDrops(dragDropContentXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(window.parent.LOCAL_COURSE_DATA_ID));

  courseData.dragDropData.VERSION = $(dragDropContentXML).find("version").text();

  courseData.dragDropData.dragDrops = [];

  for(var i = 0; i < $(dragDropContentXML).find("drag_drop").length; i++) {
    var currentDragDrop = $(dragDropContentXML).find("drag_drop")[i];

    var dragDropObj = {
      id: parseFloat($(currentDragDrop).attr("id")),
      completed: $(currentDragDrop).attr("completed"),
      score: 0,
      title: $(currentDragDrop).attr("title"),
      matchings: []
    };

    $(currentDragDrop).find("pair").each(function() {
      var currentPair = $(this);

      var pair = {
        drag: currentPair.find("drag").text(),
        drop: currentPair.find("drop").text()
      };
      dragDropObj.matchings.push(pair);
    });
    courseData.dragDropData.dragDrops.push(dragDropObj);
  }
  localStorage.setItem(window.parent.LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  setupDragDrop();
}

function setupDragDrop(){
  $('#dragAndDrop').remove();

  var courseData = JSON.parse(localStorage.getItem(window.parent.LOCAL_COURSE_DATA_ID));
  var dragDropData= courseData.dragDropData;

  var leftContainerHtml = '<div class="col-md-6 left">';
  var rightContainerHtml = '<div class="col-md-6 right">';

  for(var i = 0; i < dragDropData.dragDrops[0].matchings.length; i++){
    var holderID = 'holder' + i;
    var draggableID = 'p' + i;
    var draggableText = dragDropData.dragDrops[0].matchings[i].drag;
    var droppableID = 't' + i;
    var droppableText = dragDropData.dragDrops[0].matchings[i].drop;

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
  var courseData = JSON.parse(localStorage.getItem(window.parent.LOCAL_COURSE_DATA_ID));
  var score = 0;

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
  courseData.dragDropData.dragDrops[0].completed = true;
  courseData.dragDropData.dragDrops[0].score = score;
  localStorage.setItem(window.parent.LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var percentage = courseData.dragDropData.dragDrops[0].matchings.length;
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
  })
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
}

function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  var dragVal = ev.dataTransfer.getData("text");
  var dropVal = ev.target.id;

  var dragId = "#"+dragVal;
  var dropId = "#"+dropVal;

  $(dropId).append($(dragId));

  $(dragId).removeClass('correct');
  $(dragId).removeClass('wrong');

  /*
  if($(ev.target).hasClass('holder')){
  $(dragId).removeClass('correct');
  $(dragId).removeClass('wrong');
}
else if(dragVal.charAt(1) == dropVal.charAt(1)){
$(dragId).addClass('correct');
$(dragId).removeClass('wrong');

}
else{
$(dragId).addClass('wrong');
$(dragId).removeClass('correct');
}
*/
}
