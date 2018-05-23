//INITIALIZE AND RENDER DRAG AND DROP
function initDragDrops(dragDropContentXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  /* if course is loaded for first time, or assessment content xml was updated, initialize assessment data. otherwise do nothing. */
  if(courseData.dragDropData.VERSION === undefined || courseData.dragDropData.VERSION !== $(dragDropContentXML).find("version").text()) {

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
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  }
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

  var submitBtn = '</div><div class="row btn-row"><a class="btn">Submit</a></div>';

  var html = '<div id="dragAndDrop"><div class="row intro">Match the following cities with their states. Complete the task by dragging and dropping the items into their correct spots. Correct answers will turn green, while the wrong answers will turn red. Good luck!</div><div class="row">' + leftContainerHtml + rightContainerHtml + submitBtn;

  $("#pageContent").after(html);
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
}
