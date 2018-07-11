//INITIALIZE AND RENDER CARDS
function initKnowledgeCheck(knowledgeCheckXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentKnowledgeCheck = $(knowledgeCheckXML).find("knowledgeCheck");

  var currentID = $(currentKnowledgeCheck).attr("id")

  if(courseData.knowledgeCheckData.knowledgeChecks != null){
    for(var i=0; i < courseData.knowledgeCheckData.knowledgeChecks.length; i++){
      if(courseData.knowledgeCheckData.knowledgeChecks[i].id == currentID){
        var id = getKnowledgeCheckIndex(currentID);
        console.log("KnowledgeCheck Loaded Previously");
        setupKnowledgeCheck(id);
        return;
      }
    }
  }
  else{
    console.log("KnowledgeCheck Initialized");
    courseData.knowledgeCheckData = {
      totalScore : 0,
      completed : false,
      knowledgeChecks : []
    };
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
  setupKnowledgeCheck(id);

}

function setupKnowledgeCheck(id){
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

      answersHTML += '<div><input type="radio" name="question-'+i+'-answers" id="question-'+i+'-answers-'+j+'" value="'+j+'" /><label for="question-'+i+'-answers-'+j+'">'+answerBody+'</label></div>';
    }

    questionHTML += '<li><p>'+questionBody+'</p>' + answersHTML + '</li>';
  }

  var title= currentKnowledgeCheck.title;
  var html = '<div class="row margin-below"><div id="knowledgeCheck" class="col-md-7 mx-auto"><form id="myForm"><h3>'+title+'</h3>' + questionHTML + '<div id="feedback"></div><a id="submitKnowledge" class="btn btn-default" onclick="submitAnswers('+id+')">Submit Answers</a></form></div></div>';

  $("#pageContent").append(html);

  if(currentKnowledgeCheck.completed == true){
    //console.log("KnowledgeCheck Completed Previously");
    $('#submitKnowledge').remove();
    endKnowledgeCheck(id);
  }
}

function submitAnswers(id){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentKnowledgeCheck = courseData.knowledgeCheckData.knowledgeChecks[id];

  var selected = $('#knowledgeCheck form li input:checked');

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
    if($('#knowledgeCheck .invalid').length == 0){
      console.log($('#submitKnowledge'));
      $('#feedback').append('<p class="invalid feedback">Please answer <span class="bolded">all questions.</span></p>');
      return;
    }
    else{
      return;
    }
  }

  $('#submitKnowledge').remove();

  currentKnowledgeCheck.completed = true;
  var totalCorrect = 0;
  for(var i = 0; i < currentKnowledgeCheck.questions.length; i++){
    if(currentKnowledgeCheck.questions[i].correct == false){
      $('#knowledgeCheck form li').eq(i).addClass("wrong");
    }
    else{
      $('#knowledgeCheck form li').eq(i).removeClass("wrong");
      totalCorrect += 1;
    }
  }
  currentKnowledgeCheck.score = totalCorrect;
  courseData.knowledgeCheckData.totalScore += totalCorrect;

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));

  endKnowledgeCheck(id);
}

function endKnowledgeCheck(id){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentKnowledgeCheck = courseData.knowledgeCheckData.knowledgeChecks[id];
  currentKnowledgeCheck.completed = true;

  for(var i = 0; i < currentKnowledgeCheck.questions.length; i++){
    if(currentKnowledgeCheck.questions[i].correct == false){
      $('#knowledgeCheck form li').eq(i).addClass("wrong");
    }
    else{
      $('#knowledgeCheck form li').eq(i).removeClass("wrong");
    }
  }

  var feedback = '<p class="feedback">You scored a <span class="bolded">'+currentKnowledgeCheck.score+' out of '+currentKnowledgeCheck.questions.length+'</span></p>';
  $('#knowledgeCheck .invalid').remove();
  $('#feedback').append(feedback);

  if(currentKnowledgeCheck.completion.gate != null) {
    var chapter = currentKnowledgeCheck.completion.gate.chapter;
    var page = currentKnowledgeCheck.completion.gate.page;
    var lock = currentKnowledgeCheck.completion.gate.lock;
    openLock(chapter, page, lock);
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
}

function getKnowledgeCheckIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.knowledgeCheckData.knowledgeChecks.length; i++){
    if(courseData.knowledgeCheckData.knowledgeChecks[i].id == currentID){
      return i;
    }
  }
}
