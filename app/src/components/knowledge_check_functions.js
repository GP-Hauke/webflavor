//INITIALIZE AND RENDER CARDS
function initKnowledgeCheck(knowledgeCheckXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentKnowledgeCheck = $(knowledgeCheckXML).find("knowledgeCheck");

  courseData.knowledgeCheckData = {
    completed: $(currentKnowledgeCheck).attr("completed"),
    score: $(currentKnowledgeCheck).attr("score"),
    title: $(currentKnowledgeCheck).attr("title"),
    questions: []
  };

  $(currentKnowledgeCheck).find("question").each(function() {
    var currentQuestion = $(this);

    var question = {
      body: currentQuestion.find("body").text(),
      answers: []
    };

    currentQuestion.find("answer").each(function() {
      var currentAnswer = $(this);

      var answer = {
        correct: currentAnswer.attr("correct"),
        body: currentAnswer.text()
      };

      question.answers.push(answer);
    });

    courseData.knowledgeCheckData.questions.push(question);
  });

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
  setupKnowledgeCheck();
}

function setupKnowledgeCheck(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var knowledgeCheckData= courseData.knowledgeCheckData;

  var questionBody = "";
  var answerBody = "";

  var questionHTML = "";
  for(var i = 0; i < knowledgeCheckData.questions.length; i++){
    var answersHTML = "";
    questionBody = knowledgeCheckData.questions[i].body;

    for(var j = 0; j < knowledgeCheckData.questions[i].answers.length; j++){
      answerBody = knowledgeCheckData.questions[i].answers[j].body;

      answersHTML += '<div><input type="radio" name="question-'+i+'-answers" id="question-'+i+'-answers-'+j+'" value="'+j+'" /><label for="question-'+i+'-answers-'+j+'">'+answerBody+'</label></div>';
    }

    questionHTML += '<li><p>'+questionBody+'</p>' + answersHTML + '</li>';
  }

  var title= courseData.knowledgeCheckData.title;
  var html = '<div class="row margin-below"><div id="knowledgeCheck" class="col-md-7 mx-auto"><form id="myForm"><h3>'+title+'</h3>' + questionHTML + '<a class="btn btn-default" onclick="submitAnswers()">Submit Answers</a></form></div></div>';

  $("#pageContent").append(html);
}

function submitAnswers(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var knowledgeCheckData= courseData.knowledgeCheckData;

  var selected = $('#knowledgeCheck form li input:checked');
  var answers = [];

  if(selected.length != knowledgeCheckData.questions.length){
    alert("Answer all questions");
    return;
  }

  for(var i = 0; i < knowledgeCheckData.questions.length; i++){
    for(var j = 0; j < knowledgeCheckData.questions[i].answers.length; j++){
      if(knowledgeCheckData.questions[i].answers[j].correct == "true"){
        answers.push(knowledgeCheckData.questions[i].answers[j].body);
      }
    }
  }

  for(var i = 0; i < selected.length; i++){
    if(selected.eq(i).siblings('label').html() != answers[i]){
      $('#knowledgeCheck form li').eq(i).addClass("wrong");
    }
    else{
      $('#knowledgeCheck form li').eq(i).removeClass("wrong");
    }
  }
}
