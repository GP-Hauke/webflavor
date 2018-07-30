//INITIALIZE AND RENDER CARDS
var LOCAL_COURSE_DATA_ID;
export function initKnowledgeCheck(knowledgeCheckXML, elementID, localStorageID) {
  LOCAL_COURSE_DATA_ID = localStorageID;

  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentKnowledgeCheck = $(knowledgeCheckXML).find('KnowledgeCheck[id="'+elementID+'"]');
  if(currentKnowledgeCheck.length == 0){
    currentKnowledgeCheck = $(knowledgeCheckXML).find('KnowledgeCheck');
  }
  var currentID = $(currentKnowledgeCheck).attr("id")

  if(courseData.knowledgeCheckData.knowledgeChecks != null){
    for(var i=0; i < courseData.knowledgeCheckData.knowledgeChecks.length; i++){
      if(courseData.knowledgeCheckData.knowledgeChecks[i].id == currentID){
        var id = getKnowledgeCheckIndex(currentID);
        console.log("KnowledgeCheck Loaded Previously");
        setupKnowledgeCheck(id, elementID);
        return;
      }
    }
  }
  else{
    console.log("KnowledgeCheck Initialized");
    courseData.knowledgeCheckData.totalScore = 0;
    courseData.knowledgeCheckData.completed = 0;
    courseData.knowledgeCheckData.knowledgeChecks = [];
  }

  var knowledgeCheck = {
    id: $(currentKnowledgeCheck).attr("id"),
    completed: false,
    completion: {},
    scored: $(currentKnowledgeCheck).attr("scored"),
    score: 0,
    title: $(currentKnowledgeCheck).attr("title"),
    questions: []
  };

  if($(currentKnowledgeCheck).find("completion").attr("gated") == "true"){
    knowledgeCheck.completion = {
      gate : {
        chapter: $(currentKnowledgeCheck).find("chapter").text(),
        page: $(currentKnowledgeCheck).find("page").text(),
        lock: $(currentKnowledgeCheck).find("lock").text()
      }
    };
  }

  $(currentKnowledgeCheck).find("question").each(function() {
    var currentQuestion = $(this);

    var question = {
      body: currentQuestion.find("body").text(),
      answers: [],
      correct: false
    };

    currentQuestion.find("answer").each(function() {
      var currentAnswer = $(this);

      var answer = {
        correct: currentAnswer.attr("correct"),
        selected: false,
        body: currentAnswer.text()
      };

      question.answers.push(answer);
    });

    knowledgeCheck.questions.push(question);
  });

  courseData.knowledgeCheckData.knowledgeChecks.push(knowledgeCheck);

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));

  var id = getKnowledgeCheckIndex(currentID);
  setupKnowledgeCheck(id, elementID);

}

export function setupKnowledgeCheck(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var currentKnowledgeCheck= courseData.knowledgeCheckData.knowledgeChecks[id];

  var questionBody = "";
  var answerBody = "";

  var questionHTML = "";
  for(var i = 0; i < currentKnowledgeCheck.questions.length; i++){
    var answersHTML = "";
    questionBody = currentKnowledgeCheck.questions[i].body;

    for(var j = 0; j < currentKnowledgeCheck.questions[i].answers.length; j++){
      answerBody = currentKnowledgeCheck.questions[i].answers[j].body;

      answersHTML += '<div><input type="radio" name="'+elementID+'question-'+i+'-answers" id="'+elementID+'question-'+i+'-answers-'+j+'" value="'+j+'" /><label for="'+elementID+'question-'+i+'-answers-'+j+'">'+answerBody+'</label></div>';
    }

    questionHTML += '<li><p>'+questionBody+'</p>' + answersHTML + '</li>';
  }

  var title= currentKnowledgeCheck.title;
  var html = '<div id="knowledgeCheck" class="col-md-12 mx-auto"><form id="myForm"><h3>'+title+'</h3>' + questionHTML + '<div class="feedback"></div><a class="btn btn-default submitKnowledge">Submit Answers</a></form></div>';

  if(elementID != null){
    $("#"+elementID).empty();
    $("#"+elementID).html(html);
  }
  else{
    $('#pageContent').append(html);
  }
  if(currentKnowledgeCheck.completed == true){
    //console.log("KnowledgeCheck Completed Previously");
    $('#'+elementID+ ' .submitKnowledge').remove();
    endKnowledgeCheck(id, elementID);
  }

  $('#'+elementID+ ' .submitKnowledge').click(function(){
    submitAnswers(id, elementID);
  })
}

export function submitAnswers(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentKnowledgeCheck = courseData.knowledgeCheckData.knowledgeChecks[id];

  var selected =   $("#"+elementID + ' form li input:checked');
  for(var i = 0; i < selected.length; i++){
    var selectedAnswer = selected.eq(i).siblings('label').html();

    for(var j = 0; j < currentKnowledgeCheck.questions[i].answers.length; j++){
      var answer = currentKnowledgeCheck.questions[i].answers[j];
      if(answer.correct == "true"){
        if(answer.body == selectedAnswer){
          currentKnowledgeCheck.questions[i].correct = true;
        }
      }
    }
  }

  if(selected.length != currentKnowledgeCheck.questions.length){
    if($('#'+elementID + ' .invalid').length == 0){
      $('#'+elementID+' .feedback').append('<p class="invalid feedback">Please answer <span class="bolded">all questions.</span></p>');
      return;
    }
    else{
      return;
    }
  }

  $('#'+elementID+ ' .submitKnowledge').remove();

  currentKnowledgeCheck.completed = true;
  courseData.knowledgeCheckData.completed += 1;
  courseData.COMPLETED_INTERACTIVES += 1;

  if(currentKnowledgeCheck.completion.gate != null) {
    var chapter = currentKnowledgeCheck.completion.gate.chapter;
    var page = currentKnowledgeCheck.completion.gate.page;
    var lock = currentKnowledgeCheck.completion.gate.lock;
    openLock(chapter, page, lock);
  }

  var totalCorrect = 0;
  for(var i = 0; i < currentKnowledgeCheck.questions.length; i++){
    if(currentKnowledgeCheck.questions[i].correct == false){
      $('#'+elementID + ' form li').eq(i).addClass("wrong");
    }
    else{
      $('#'+elementID + ' form li').eq(i).removeClass("wrong");
      totalCorrect += 1;
    }
  }
  currentKnowledgeCheck.score = totalCorrect;
  courseData.knowledgeCheckData.totalScore += totalCorrect;

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));

  endKnowledgeCheck(id, elementID);
}

export function endKnowledgeCheck(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentKnowledgeCheck = courseData.knowledgeCheckData.knowledgeChecks[id];
  currentKnowledgeCheck.completed = true;



  for(var i = 0; i < currentKnowledgeCheck.questions.length; i++){
    if(currentKnowledgeCheck.questions[i].correct == false){
      $('#'+elementID + ' form li').eq(i).addClass("wrong");
    }
    else{
      $('#'+elementID + ' form li').eq(i).removeClass("wrong");
    }
  }

  var feedback = '<p class="feedback">You scored a <span class="bolded">'+currentKnowledgeCheck.score+' out of '+currentKnowledgeCheck.questions.length+'</span></p>';
  $('#'+elementID + ' .invalid').remove();
  $('#'+elementID +' .feedback').append(feedback);


  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
}

export function getKnowledgeCheckIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.knowledgeCheckData.knowledgeChecks.length; i++){
    if(courseData.knowledgeCheckData.knowledgeChecks[i].id == currentID){
      return i;
    }
  }
}
