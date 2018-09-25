var LOCAL_COURSE_DATA_ID;
var time;

export function initGame(GameContentXML, elementID,localStorageID) {
  LOCAL_COURSE_DATA_ID = localStorageID;
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentGame = $(GameContentXML).find('Game[id="'+elementID+'"]');
  if(currentGame.length == 0){
    currentGame = $(GameContentXML).find('Game');
  }
  var currentID = $(currentGame).attr("id");

  if(courseData.gameData.games != null){
    for(var i=0; i < courseData.gameData.games.length; i++){
      if(courseData.gameData.games[i].id == currentID){
        var id = getGameIndex(currentID);
        console.log("Game Loaded Previously");
        setupGame(id,elementID);
        return;
      }
    }
  }

  else{
    console.log("Game Initialized");
    courseData.gameData.completed = 0;
    courseData.gameData.games = [];
  }

  var game = {
    id: $(currentGame).attr("id"),
    completed: false,
    completion: {},
    score: 0,
    questions: [],
    title: $(currentGame).find('title').text(),
    introText: $(currentGame).find('introText').text(),
    completionText: $(currentGame).find('completionText').text()
  };

  if(currentGame.find("completion").attr("gated") == "true"){
  game.completion = {
    gate : {
      chapter: currentGame.find("chapter").text(),
      page: currentGame.find("page").text(),
      lock: currentGame.find("lock").text()
      }
    }
  };

  $(currentGame).find("question").each(function() {
    var question ={
      body:$(this).find('body').text(),
      answers: [],
      completed: false
    }

    $(this).find("answer").each(function() {
      var answer ={
        text:$(this).find('text').text(),
        selected:false,
        correct:Boolean($(this).attr('correct'))
      }
      question.answers.push(answer);
    });


    game.questions.push(question);
  });

  courseData.gameData.games.push(game);
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var id = getGameIndex(currentID);
  setupGame(id,elementID);
}

export function getGameIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.gameData.games.length; i++){
    if(courseData.gameData.games[i].id == currentID){
      return i;
    }
  }
}

export function setupGame(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  if(courseData.gameData.games[id].completed){
    console.log("Previously Completed");
    //endGame(id, elementID);
    //return;
  }
  var html = `
  <div class="game">
    <div class="introText">
      `+courseData.gameData.games[id].title
      +courseData.gameData.games[id].introText+`
    </div>

    <div class="next">
      <button class="begin">BEGIN</button>
    </div>
  </div>
  `;


  $('#'+elementID).html(html);

  $('#'+elementID + ' .begin').click(function(){
    startGame(id, elementID, 0);

    time = 0;

    window.timingInterval = setInterval(function(){
      time += .1;
      //console.log(time);
    }, 100);
  });
}

export function startGame(id, elementID, questionIndex){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var questionObj = courseData.gameData.games[id].questions[questionIndex];
  var totalQuestions = courseData.gameData.games[id].questions.length;

  var questionBody = questionObj.body;
  var answers = questionObj.answers;

  var answersHTML = "";

  var html = `
  <div class="game">
    <div class="question">
      <h5>Question `+(questionIndex+1)+` of `+totalQuestions+`</h5>
      `+questionBody+`
    </div>

    <div class="answers">
    </div>

    <div class="next">
      <button class="next">NEXT</button>
    </div>
  </div>
  `;

  $('#'+elementID).html(html);

  answers.map(function(answer, answerIndex){
    answersHTML = `<div class="answer">`+answer.text+`</div>`;
    $('#'+elementID + ' .answers').append(answersHTML);

    //SELECTING AN ANSWER
    $('#'+elementID + ' .answers .answer').eq(answerIndex).click(function(){
      $(this).toggleClass('selected');

      courseData.gameData.games[id].questions[questionIndex].answers[answerIndex].selected=!courseData.gameData.games[id].questions[questionIndex].answers[answerIndex].selected;

      localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
    });
  });


  $('#'+elementID + ' .next').click(function(){
    nextQuestion(id, elementID, questionIndex, totalQuestions);
  });
}

export function nextQuestion(id, elementID, questionIndex, totalQuestions){
  if(questionIndex+1 < totalQuestions){
    startGame(id, elementID, questionIndex+1);
  }
  else{
    endGame(id, elementID);
  }
}

export function endGame(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  clearTimeout(timingInterval);


  var correct = calculateQuestions(id, elementID);
  var total = courseData.gameData.games[id].questions.length;

  var html = `
  <div class="game">
    <div class="introText">
      <h3>Game Over</h3>
      <p>You got <span class="bolded">`+correct+`</span> out of <span class="bolded">`+total+`</span> questions correct and it took you <span class="bolded">`+Math.round(time)+`</span> seconds to complete the game.</p>
      <p>Thanks for playing.</p>
    </div>

    <div class="next">
      <button class="results">RESULTS</button>
      <button class="begin">RETRY</button>
    </div>

    <div class="next">
    </div>
  </div>
  `;


  $('#'+elementID).html(html);

  $('#'+elementID + ' .begin').click(function(){
    setupGame(id, elementID);
  });

  $('#'+elementID + ' .results').click(function(){
    startResults(id, elementID, 0);
  });

  courseData.gameData.games[id].completed = true;
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
}

export function startResults(id, elementID, questionIndex){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var questionObj = courseData.gameData.games[id].questions[questionIndex];
  var totalQuestions = courseData.gameData.games[id].questions.length;

  var questionBody = questionObj.body;
  var answers = questionObj.answers;

  var answersHTML = "";

  var html = `
  <div class="game">
    <div class="question">
      <h5>Question `+(questionIndex+1)+` of `+totalQuestions+`</h5>
      `+questionBody+`
    </div>

    <div class="answers">
    </div>

    <div class="next">
      <button class="next">NEXT</button>
    </div>
  </div>
  `;

  $('#'+elementID).html(html);

  var classes = "";

  answers.map(function(answer, answerIndex){
    classes = "";

    if(answer.correct){
      classes += " correct";
    }
    else{
      classes += " wrong";
    }
    if(answer.selected){
      classes += " selected"
    }

    answersHTML = `<div class="answer`+classes+`">`+answer.text+`</div>`;
    $('#'+elementID + ' .answers').append(answersHTML);
  });


  $('#'+elementID + ' .next').click(function(){
    nextResult(id, elementID, questionIndex, totalQuestions);
  });
}

export function nextResult(id, elementID, questionIndex, totalQuestions){
  if(questionIndex+1 < totalQuestions){
    startResults(id, elementID, questionIndex+1);
  }
  else{
    endGame(id, elementID);
  }
}

export function calculateQuestions(id){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var game = courseData.gameData.games[id];
  var totalCorrect = 0;
  var questionCorrect = true;

  for(let i = 0; i < game.questions.length; i++){
    questionCorrect = true;
    for(let j = 0; j < game.questions[i].answers.length; j++){
      var selected = game.questions[i].answers[j].selected;
      var correct = game.questions[i].answers[j].correct;
      if(selected != correct){
        questionCorrect = false;
        break;
      }
    }

    if(questionCorrect){
      totalCorrect += 1;
    }
  }

  return totalCorrect;
}
