var startBtn;

function initAssessments(assessmentsContentXML) {
  /* ran into a case where localStorage wasn't available, throwing an error on startup. couldn't track down exact bug (possibly a race condition somewhere) so reloading page if localStorage isn't found. */
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  /* if course is loaded for first time, or assessment content xml was updated, initialize assessment data. otherwise do nothing. */
  if(courseData.assessmentData.VERSION === undefined || courseData.assessmentData.VERSION !== $(assessmentsContentXML).find("version").text()) {


    courseData.assessmentData.VERSION = $(assessmentsContentXML).find("version").text();
    courseData.assessmentData.TOTAL_QUESTIONS = $(assessmentsContentXML).find("question").length;
    courseData.assessmentData.QUESTIONS_GIVEN = $(assessmentsContentXML).find("assessments").attr("questionsGiven");


    courseData.assessmentData.assessments = [];


    for(var i = 0; i < $(assessmentsContentXML).find("assessment").length; i++) {
      var currentAssessment = $(assessmentsContentXML).find("assessment")[i];

      var assessmentObj = {
        id: parseInt($(currentAssessment).attr("id")),
        completed: $(currentAssessment).attr("completed"),
        title: $(currentAssessment).attr("title"),
        introText: $(currentAssessment).find("introText").text(),
        questionsAnswers: {
          questions: [],
          answers: [],
          answersFiltered: [],
          feedback: {}
        },
        currentQuestionIndex: 0,
        score: 0
      };


      if(assessmentObj.title.indexOf("Buick") !== -1) {
        assessmentObj.style = "buick";

      } else if(assessmentObj.title.indexOf("Chevrolet") !== -1) {
        assessmentObj.style = "chevy";
      } else if(assessmentObj.title.indexOf("GMC") !== -1) {
        assessmentObj.style = "gmc";
      }


      assessmentObj.questionsAnswers.feedback.correct = $(currentAssessment).find("correct").text();
      assessmentObj.questionsAnswers.feedback.incorrect = $(currentAssessment).find("incorrect").text();

      $(currentAssessment).find("question").each(function() {
        var currentQuestion = $(this);

        var question = {
          TYPE: currentQuestion.attr("type"),
          REQUIRED: currentQuestion.attr("required"),
          ANSWERED: currentQuestion.attr("answered"),
          PASSED: currentQuestion.attr("passed"),
          SCORE: 0,
          IMAGE: currentQuestion.find("imgSrc").text(),
          CRITERION: currentQuestion.find('criterion').text(),
          FILTER: currentQuestion.find('filter').text(),
          FILTERNUM: currentQuestion.find('filterNum').text(),
          question: {
            questionTitle: currentQuestion.find("questionTitle").text(),
            questionBody: currentQuestion.find("questionBody").text()
          }
        };

        assessmentObj.questionsAnswers.questions.push(question);
      });


      $(currentAssessment).find("answer").each(function() {
        var currentAnswer = $(this);

        var answer = {
          correct: currentAnswer.attr("correct"),
          img: currentAnswer.find("modelImgSrc").text(),
          brand: currentAnswer.find("brand").text(),
          model: currentAnswer.find("model").text(),
          attributes: currentAnswer.find("attributes").text(),
          mpg: (parseInt(currentAnswer.find("mpgCity").text()) + parseInt(currentAnswer.find("mpgHighway").text()))/2,
          rearLegRoom: currentAnswer.find("rearLegRoom").text(),
          cargoVol: currentAnswer.find("cargoVol").text(),
          basePrice: currentAnswer.find("basePrice").text(),
          horsePower: currentAnswer.find("horsePower").text()
        };

        assessmentObj.questionsAnswers.answers.push(answer);
        assessmentObj.questionsAnswers.answersFiltered.push(answer);
      });

      courseData.assessmentData.assessments.push(assessmentObj);
    }

    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  }

}


function launchAssessment(id, clickTarget) {
  startBtn = clickTarget;
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var activeAssessment = id;
  var questionsNum = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions.length;
  var questionIndex = courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex;
  var completed = courseData.assessmentData.assessments[activeAssessment].completed;

  courseData.assessmentData.assessments[activeAssessment].score = 0;


  //  if(questionIndex === questionsNum) {
  /*if(completed === "true") {
  retryChoice(activeAssessment);
  return;

} else {*/

if(activeAssessment === 0) {
  $("#modalContainer .assessment-container").append("<div class='selection-screen row'></div>");
  $("#modalContainer .selection-screen").append("<div class='col-md-12'><p>Think you know your lineup? Let's see if you can find the best vehicle for the customer. First select the brand you want to view. We'll give you a question regarding a customer's particular interest. You'll be given a choice between two different vehicles. Select the one that best suits your customer's needs. In some cases, BOTH vehicles could meet your customer's needs.</p><p>When you're done, see how you did. And feel free to come back to play again and again. You can use this game to bring you up to speed on the models you sell or as a quick refresher.</p><p>When you're ready, click the <span class='bolded'>brand button</span> and get started.</p></div>");

  $("#modalContainer .selection-screen").append("<div class='col-md-4'><button class='d-block mx-auto btn-game buick'><img class='img-fluid' src='../../../dir/media/img/assets/game/game_branch_buick.jpg' alt=''></button></div>");

  $("#modalContainer .selection-screen").append("<div class='col-md-4'><button class='d-block mx-auto  btn-game gmc'><img class='img-fluid' src='../../../dir/media/img/assets/game/game_branch_gmc.jpg' alt=''></button></div>");

  $("#modalContainer .selection-screen").append("<div class='col-md-4'><button class='d-block mx-auto  btn-game chevy'><img class='img-fluid' src='../../../dir/media/img/assets/game/game_branch_chevy.jpg' alt=''></button></div>");

  $("#modalContainer .btn-game.buick").click(function() {
    $(".selection-screen").remove();
    openIntroScreen(0);
  });
  $("#modalContainer .btn-game.gmc").click(function() {
    $(".selection-screen").remove();
    openIntroScreen(1);
  });
  $("#modalContainer .btn-game.chevy").click(function() {
    $(".selection-screen").remove();
    openIntroScreen(2);
  });

} else {
  openIntroScreen(3);
}
//  }
}

function openIntroScreen(id) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var activeAssessment = id;
  var style = courseData.assessmentData.assessments[activeAssessment].style;
  var completed = courseData.assessmentData.assessments[activeAssessment].completed;

  if(completed === "true") {
    retryChoice(activeAssessment);
    return;
  }

  courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions = shuffle(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions);
  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

  $("#modalContainer .assessment-container").append("<div class='intro-screen "+style+"'></div>");
  $("#modalContainer .intro-screen").append(courseData.assessmentData.assessments[activeAssessment].introText);
  $("#modalContainer .intro-screen").append("<button class='btn-start'>NEXT</button>");

  $("#modalContainer .btn-start").click(function() {
    $(".intro-screen").remove();
    startAssessment(activeAssessment);
  });
}

function startAssessment(id) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var activeAssessment = id;
  var style = courseData.assessmentData.assessments[activeAssessment].style;
  var questionsNum = courseData.assessmentData.QUESTIONS_GIVEN;
  var questionIndex = courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex;
  var questionCount = questionIndex + 1;
  var time = 0;
  courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions = shuffle(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions);

  var questionTitle = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].question.questionTitle;
  var questionBody = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].question.questionBody;

  var questionFilter = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].FILTER;
  var filterNum = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].FILTERNUM;

  var qIndex;
  var aIndex;

  var answersArr = shuffle(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answers);
  var answersFiltered = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answers;

  var score = courseData.assessmentData.assessments[activeAssessment].score;

  if(questionFilter.length > 0){
    answersFiltered = filterAnswers(activeAssessment, questionFilter, filterNum);
  }

  courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered = answersFiltered;

  //sameAnswerCheck(activeAssessment);

  //  var answerTries = 0;

  $("#modalContainer .assessment-container").append("<div class='assessment-content "+style+" row'></div>");
  $("#modalContainer .assessment-content").append("<h3 class='assessment-total'>"+score+" Total Points");
  $("#modalContainer .assessment-content").append("<h3>Question "+questionCount+" of "+questionsNum+"<span> 10 seconds</span>");
  $("#modalContainer .assessment-content").append("<p>"+questionBody+"</p>");
  $("#modalContainer .assessment-content").append("<div class='row mx-auto answers clearfix'></div>");

  for(var i = 0; i < 2; i++) {

    $("#modalContainer .answers").append("<div class='col-md-6 answer-container initial btn"+i+"'><div class='unselected-box'></div><div class='border-box'><img class='img-fluid' src='"+answersFiltered[i].img+"'/><div class='brand-model-attr clearfix'><p class='brand'>"+answersFiltered[i].brand+"</p><p class='model'>"+answersFiltered[i].model+"</p><p class='attr'>"+answersFiltered[i].attributes+"</p></div><div class='selected-bar'></div></div></div>");

  }

  $("#modalContainer .assessment-content").append("<button class='btn-submit-answer'>SUBMIT</button>");

  for(var i = 0; i < $("#modalContainer .answer-container").length; i++) {
    $($("#modalContainer .answer-container")[i]).click({questionIndex: questionIndex, answerIndex: i}, selectAnswer);
  }

  function selectAnswer(event) {
    qIndex = event.data.questionIndex;
    aIndex = event.data.answerIndex;

    $("#modalContainer .answer-container").each(function(){
      if($(this).hasClass("initial")) {
        $(this).removeClass("initial");
        $(this).addClass("unselected");
      }
    });

    if($(this).hasClass("selected")) {
      $(this).removeClass("selected");
      $(this).addClass("unselected");

    } else {
      $(this).addClass("selected");
      $(this).removeClass("unselected");
      $(this).siblings().removeClass("selected");
      $(this).siblings().addClass("unselected");
    }
  }

  $("#modalContainer .btn-submit-answer").click(submitAnswer);

  function submitAnswer() {
    var answerSelected = false;

    $("#modalContainer .answer-container").each(function(){
      if($(this).hasClass("selected")) {
        answerSelected = true;
      }
    });

    if(answerSelected === false) {
      $("#modalContainer .btn-submit-answer").addClass("d-none");

      $("#modalContainer .assessment-content").append("<div class='feedback-container'><p>Please select an answer.</p><div class=''><button class='btn-ok'>OK</button></div></div>");

      $("#modalContainer .btn-ok").click(returnToQuestion);

      function returnToQuestion() {
        $("#modalContainer .btn-submit-answer").removeClass("d-none");
        $("#modalContainer .feedback-container").remove();
      }

    }

    else {
      clearInterval(timingInterval);

      $("#modalContainer .answer-container").off();
      $("#modalContainer .btn-submit-answer").addClass("d-none");

      var criterion = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].CRITERION;
      courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].ANSWERED = "true";

      var correctlyAnswered = false;
      var bothCorrect = false;
      var selectedAnswersData = [];
      var unselectedAnswerData;
      var selectedAnswers = [];
      var unselectedAnswer;

      for(var i = 0; i < $("#modalContainer .answer-container").length; i++) {

        if($($("#modalContainer .answer-container")[i]).hasClass("selected")) {
          selectedAnswersData.push(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered[i]);
          selectedAnswers.push($("#modalContainer .answer-container")[i]);

        } else if ($($("#modalContainer .answer-container")[i]).hasClass("unselected")) {
          unselectedAnswerData = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered[i];
          unselectedAnswer = $("#modalContainer .answer-container")[i];
        }
      }

      if(criterion === "cargoVol") {
        if(selectedAnswersData.length > 1) {
          if(selectedAnswersData[0].cargoVol === selectedAnswersData[1].cargoVol) {
            correctlyAnswered = true;
            bothCorrect = true;
          }

        } else {
          if(parseInt(selectedAnswersData[0].cargoVol) > unselectedAnswerData.cargoVol) {
            correctlyAnswered = true;
          }
        }

      }
      else if(criterion === "mpg") {
        if(selectedAnswersData.length > 1) {
          if(selectedAnswersData[0].mpg === selectedAnswersData[1].mpg) {
            correctlyAnswered = true;
            bothCorrect = true;
          }

        } else {
          if(parseInt(selectedAnswersData[0].mpg) > unselectedAnswerData.mpg) {
            correctlyAnswered = true;
          }
        }

      }

      else if(criterion === "rearLegRoom") {
        if(selectedAnswersData.length > 1) {
          if(selectedAnswersData[0].rearLegRoom === selectedAnswersData[1].rearLegRoom) {
            correctlyAnswered = true;
            bothCorrect = true;
          }

        } else {
          if(parseInt(selectedAnswersData[0].rearLegRoom) > unselectedAnswerData.rearLegRoom) {
            correctlyAnswered = true;
          }
        }

      }

      else if(criterion === "horsePower") {

        if(selectedAnswersData.length > 1) {
          if(selectedAnswersData[0].horsePower === selectedAnswersData[1].horsePower) {
            correctlyAnswered = true;
            bothCorrect = true;
          }

        } else {
          if(parseInt(selectedAnswersData[0].horsePower) > unselectedAnswerData.horsePower) {
            correctlyAnswered = true;
          }
        }

      }

      else if(criterion === "basePrice") {
        if(selectedAnswersData.length > 1) {
          if(selectedAnswersData[0].basePrice === selectedAnswersData[1].basePrice) {
            correctlyAnswered = true;
            bothCorrect = true;
          }

        } else {
          if(parseInt(selectedAnswersData[0].basePrice) < parseInt(unselectedAnswerData.basePrice)) {
            correctlyAnswered = true;
          }

        }
      }

      if(correctlyAnswered) {
        var feedback = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.feedback.correct;
        //var car1 =
        //var characteristic1 =
        //var value1

        courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].PASSED = "true";
        localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

        var tempScore = Math.round(10 + ((10 - time) * 10));
        courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].SCORE = tempScore;
        courseData.assessmentData.assessments[activeAssessment].score += tempScore

        for(var i = 0; i < selectedAnswers.length; i++) {
          $(selectedAnswers[i]).append("<div class='viewed-overlay'><img src='../../dir/media/img/icon_viewed.png'></div>");
        }

        $("#modalContainer .assessment-content").append("<div class='feedback-container'><p class='feedback-details'>The <span>"+unselectedAnswerData.model+"</span> has "+criterion+" of <span>"+unselectedAnswerData[criterion]+"</span></p><p class='feedback-details'>The <span>"+selectedAnswersData[0].model+"</span> has "+criterion+" of <span>"+selectedAnswersData[0][criterion]+"</span></p><p>"+feedback+" +"+tempScore+" points</p><button class='btn-ok'>GO</button></div>");

        $("#modalContainer .btn-ok").click(function() {
          courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex += 1;
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
          $("#modalContainer .assessment-content").remove();

          if(questionIndex === (questionsNum - 1)) {
            courseData.assessmentData.assessments[activeAssessment].completed = "true";
            localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
            endAssessment(activeAssessment);

          } else {
            startAssessment(activeAssessment);
          }
        });

      } else {
        //        answerTries++;

        $(unselectedAnswer).append("<div class='viewed-overlay'><img src='../../dir/media/img/icon_viewed.png'></div>");

        var feedback = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.feedback.incorrect;

        qIndex = undefined;
        aIndex = undefined;

        /* TODO: make this modular so answerTries is a setting and triggers the "try again" prompt only if answerTris > 1 */
        /*if(answerTries === 2) {*/
        $("#modalContainer .assessment-content").append("<div class='feedback-container'><p class='feedback-details'>The <span>"+unselectedAnswerData.model+"</span> has "+criterion+" of <span>"+unselectedAnswerData[criterion]+"</span></p><p class='feedback-details'>The <span>"+selectedAnswersData[0].model+"</span> has "+criterion+" of <span>"+selectedAnswersData[0][criterion]+"</span></p><p>"+feedback+" +0 points</p><button class='btn-ok'>GO</button></div>");

        $("#modalContainer .btn-ok").click(function() {
          courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex += 1;
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
          $("#modalContainer .assessment-content").remove();

          if(questionIndex === (questionsNum - 1)) {
            courseData.assessmentData.assessments[activeAssessment].completed = "true";
            localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
            endAssessment(activeAssessment);

          } else {
            startAssessment(activeAssessment);
          }
        });

        /*} else {

        $("#modalContainer .assessment-content").append("<div class='feedback incorrect'><p>That is not correct. Click here to try again.</p></div>");

        $("#modalContainer .feedback.incorrect").click(function() {
        $("#modalContainer .assessment-content .feedback.incorrect").remove();
        $("#modalContainer .assessment-content .btn-try-again").remove();

        for(var i = 0; i < $("#modalContainer .answer-container").length; i++) {
        $($("#modalContainer .answer-container")[i]).click({questionIndex: questionIndex, answerIndex: i}, selectAnswer).removeClass("selected").addClass("initial");
      }

      $("#modalContainer .btn-submit-answer").removeClass("hide");
    });
  }*/
}

}

}

var timingInterval = setInterval(function(){
  time += .1;
  var timeLeft = (10 - time).toFixed(1);

  if(timeLeft >= 0){
    var timeLeft = Math.abs(timeLeft);
    $("#modalContainer .assessment-content h3 span").html("<span> " +timeLeft+ " seconds</span>");

  }
}, 100)

}

function endAssessment(activeAssessment) {
  if(startBtn !== undefined) {
    startBtn.append("<div class='viewed-overlay'><img src='../../../../dir/media/img/icon_viewed.png'></div>");
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var style = courseData.assessmentData.assessments[activeAssessment].style;
  var correctAnswerCount = 0;
  var correctPercentage = 0;
  var totalScore = courseData.assessmentData.assessments[activeAssessment].score
  var gameFeedback = "";
  for(var i = 0; i < courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions.length; i ++) {
    if(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[i].PASSED === "true") {
      correctAnswerCount += 1;
    }
    courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[i].PASSED = "false";
  }

  //totalScore = totalScore.toFixed(0);
  correctPercentage = 10 * correctAnswerCount / courseData.assessmentData.QUESTIONS_GIVEN;
  correctPercentage = parseInt(correctPercentage.toFixed(0));

  $("#modalContainer .assessment-container").append("<div class='finish-screen "+style+"'></div>");
  $("#modalContainer .finish-screen").append("<h3>Congratulations!</h3>");

  gameFeedback = "You answered <span class='bolded'>";
  gameFeedback += correctAnswerCount;
  gameFeedback += "</span> questions correctly. ";
  gameFeedback += "For a score of <span class='bolded'>";
  gameFeedback += totalScore;
  gameFeedback += "</span> points. ";

  switch(correctPercentage) {
    case 0: case 1: case 2: case 3: case 4: case 5:
    gameFeedback += "You probably should go review your product training and then try again.";
    break;
    case 6: case 7: case 8:
    gameFeedback += "You’re on the right track. Keep practicing.";
    break;
    case 9: case 10:
    gameFeedback += "You’re a rock star! You really know the basic differences in the vehicles in your product line. Nice job!";
    break;
  }
  $("#modalContainer .finish-screen").append("<p>Let’s find out how well you did.</p>");

  $("#modalContainer .finish-screen").append("<p>"+gameFeedback+"</p>");

  $("#modalContainer .finish-screen").append("<p>Remember, you can come back and play as much as you want. Whether you need a quick refresher or are still learning all the vehicles in your lineup, this game can provide insight into the variety of quality vehicles offered in your inventory.</p>");

  $("#modalContainer .finish-screen").append("<p>Click <span class='bolded'>PLAY AGAIN</span> if you want to play again, or <span class='bolded'>CLOSE</span> to exit.</p>");

  $("#modalContainer .finish-screen").append("<button class='btn-play-again'>PLAY AGAIN</button>");

  $("#modalContainer .finish-screen").append("<button class='btn-close'>CLOSE</button>");

  $("#modalContainer .btn-close").click(function() {
    $('.modal').modal('hide');
  });

  $("#modalContainer .btn-play-again").click(function() {
    $("#modalContainer .finish-screen").remove();
    courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex = 0;
    courseData.assessmentData.assessments[activeAssessment].score = 0;

    for(var i = 0; i < courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions.length; i++){
      courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[i].ANSWERED = false;
      courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[i].SCORE = 0;
    }

    //    courseData.assessmentData.assessments[activeAssessment].completed = "false";
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
    launchAssessment(0, undefined);
  });

}

function retryChoice(id) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var activeAssessment = id;
  var style = courseData.assessmentData.assessments[activeAssessment].style;
  $("#modalContainer .assessment-container").append("<div class='retry-container "+style+"'></div>");
  $("#modalContainer .retry-container").append("<h3>Try again?</h3>");
  $("#modalContainer .retry-container").append("<p>You have already completed the game. Would you like to play it again?</p>");

  $("#modalContainer .retry-container").append("<button class='btn-try-again'>PLAY AGAIN</button>");
  $("#modalContainer .retry-container").append("<button class='btn-close'>CLOSE</button>");

  $("#modalContainer .btn-close").click(function() {
    $('.modal').modal('hide');
  });

  $("#modalContainer .btn-try-again").click(function() {
    $("#modalContainer .retry-container").remove();
    courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex = 0;
    courseData.assessmentData.assessments[activeAssessment].score = 0;
    for(var i = 0; i < courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions.length; i++){
      courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[i].ANSWERED = false;
      courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[i].SCORE = 0;
    }

    courseData.assessmentData.assessments[activeAssessment].completed = "false";
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
    //    launchAssessment(0, undefined);
    openIntroScreen(activeAssessment);
  });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function filterAnswers(activeAssessment, filter, num){
  var answers = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answers;
  var answersFiltered = [];

  for(var i = 0; i < answers.length; i++){
    if(answers[i][filter] > num){
      answersFiltered.push(answers[i]);
    }
  }

  return answersFiltered;
}

function sameAnswerCheck(activeAssessment){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var questionIndex = courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex;
  var criterion = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].CRITERION;
  var answersFiltered = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered;

  var answer1 = answersFiltered[0][criterion];
  var answer2 = answersFiltered[1][criterion];

  console.log(answer1 + ": " + answersFiltered[0].model);
  console.log(answer2 + ": " + answersFiltered[1].model);

  if(answer1 == answer2){
    shuffle(answersFiltered);
    console.log("^^^^SHUFFLED");
    //sameAnswerCheck(activeAssessment);
  }
  else{
    return;
  }
}
