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
        id: parseFloat($(currentAssessment).attr("id")),
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
          CHARACTERISTIC: currentQuestion.find("characteristic").text(),
          REQUIRED: currentQuestion.attr("required"),
          ANSWERED: currentQuestion.attr("answered"),
          PASSED: currentQuestion.attr("passed"),
          SCORE: 0,
          IMAGE: currentQuestion.find("imgSrc").text(),
          CRITERION: currentQuestion.find('criterion').text(),
          HASFILTERS: currentQuestion.find('filters').attr("hasFilters"),
          filters: [],
          question: {
            questionTitle: currentQuestion.find("questionTitle").text(),
            questionBody: currentQuestion.find("questionBody").text()
          }
        };

        $(this).find("filter").each(function() {

          var currentFilter = $(this);

          var filter = {
            type: currentFilter.attr('type'),
            filter: currentFilter.text(),
            compare: currentFilter.attr('compare'),
            value: currentFilter.attr('value')
          };

          question.filters.push(filter);
        });

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
          mpg: (parseFloat(currentAnswer.find("mpgCity").text()) + parseFloat(currentAnswer.find("mpgHighway").text()))/2,
          rearLegRoom: currentAnswer.find("rearLegRoom").text(),
          cargoVol: currentAnswer.find("cargoVol").text(),
          basePrice: currentAnswer.find("basePrice").text(),
          horsePower: currentAnswer.find("horsePower").text(),
          driveLine: currentAnswer.find("driveLine").text(),
          interiorHeadRoom: currentAnswer.find("interiorHeadRoom").text(),
          doors: currentAnswer.find("doors").text(),
          color: currentAnswer.find("color").text(),
          engineType: currentAnswer.find("engineType").text(),
          heatedSeats: currentAnswer.find("heatedSeats").text(),
          sunroof: currentAnswer.find("sunroof").text(),
          heatedWheel: currentAnswer.find("heatedWheel").text(),
          remoteStart: currentAnswer.find("remoteStart").text(),
          connectedNavigation: currentAnswer.find("connectedNavigation").text(),
          thirdRowSeating: currentAnswer.find("thirdRowSeating").text(),
        };
        assessmentObj.questionsAnswers.answers.push(answer);
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
  return; else {*/

  if(activeAssessment === 0) {
    $("#modalContainer .assessment-container").append("<div class='selection-screen row'></div>");
    $("#modalContainer .selection-screen").append("<div class='col-md-12'><p>Think you know your lineup? Let's see if you can find the best vehicle for the customer. First select the brand you want to view. We'll give you a question regarding a customer's particular interest. You'll be given a choice between two different vehicles. Select the one that best suits your customer's needs. In some cases, BOTH vehicles could meet your customer's needs.</p><p>When you're done, see how you did. And feel free to come back to play again and again. You can use this game to bring you up to speed on the models you sell or as a quick refresher.</p><p>When you're ready, click the <span class='bolded'>brand button</span> and get started.</p></div>");

    $("#modalContainer .selection-screen").append("<div class='col-md-4'><button class='d-block mx-auto btn-game buick'><img class='img-fluid' src='dir/media/img/assets/game/game_branch_buick.jpg' alt=''></button></div>");

    $("#modalContainer .selection-screen").append("<div class='col-md-4'><button class='d-block mx-auto  btn-game gmc'><img class='img-fluid' src='dir/media/img/assets/game/game_branch_gmc.jpg' alt=''></button></div>");

    $("#modalContainer .selection-screen").append("<div class='col-md-4'><button class='d-block mx-auto  btn-game chevy'><img class='img-fluid' src='dir/media/img/assets/game/game_branch_chevy.jpg' alt=''></button></div>");

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
  //LocalStorage - Assessment ID - Style
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var activeAssessment = id;
  var style = courseData.assessmentData.assessments[activeAssessment].style;

  //Number of Questions Given - Index of Current Question -
  var questionsNum = courseData.assessmentData.QUESTIONS_GIVEN;
  var questionIndex = courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex;
  var questionCount = questionIndex + 1;

  //Shuffle Questions Everytime (to get same question multiple times)
  courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions = shuffle(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions);

  //Question Information for Dispaly
  var questionTitle = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].question.questionTitle;
  var questionBody = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].question.questionBody;

  //Question Filter (may not have one) and its Numerical Value
  var hasFilters = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].HASFILTERS;
  var filters = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].filters;



  //Initialize answersFiltered to be the same as answers (prior to filter being applied)
  var answersArr = shuffle(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answers);
  var answersFiltered = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answers;

  if(hasFilters == "true"){
    //If a filter exists, apply it
    console.log(filters.length);
    for(var i = 0; i < filters.length; i++){
      var filterType = filters[i].type;
      if(filterType == "attribute"){
        answersFiltered = filterAnswersAttribute(activeAssessment, filters[i], answersFiltered);
      }else if(filterType == "characteristic"){
        answersFiltered = filterAnswersCharacteristic(activeAssessment, filters[i], answersFiltered);
      }
    }
  }

  //Update LocalStorage AnswersFiltered array
  courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered = answersFiltered;

  //Overall Score and Time for Each Question
  var score = courseData.assessmentData.assessments[activeAssessment].score;
  var time = 0;
  var qIndex;
  var aIndex;

  var criterion = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].CRITERION;
  var type = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].TYPE;


  if(type == 'attribute'){
    sameAnswerCheck(activeAssessment, answersFiltered, criterion);
  }
  else if(type == 'characteristic'){
    var value = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[questionIndex].CHARACTERISTIC;
    orderAnswers(activeAssessment, answersFiltered, criterion, value);

  }
  var answerTries = 0;

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
      var type = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].TYPE;


      courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].ANSWERED = "true";

      var correctlyAnswered = false;
      var bothCorrect = false;
      var selectedAnswersData = [];
      var unselectedAnswerData;
      var selectedAnswers = [];
      var unselectedAnswer;
      var phrasedCriterion;


      for(var i = 0; i < $("#modalContainer .answer-container").length; i++) {
        if($($("#modalContainer .answer-container")[i]).hasClass("selected")) {
          selectedAnswersData.push(courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered[i]);
          selectedAnswers.push($("#modalContainer .answer-container")[i]);

        } else if ($($("#modalContainer .answer-container")[i]).hasClass("unselected")) {
          unselectedAnswerData = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered[i];
          unselectedAnswer = $("#modalContainer .answer-container")[i];
        }
      }

      //CHECK WHAT TYPE OF QUESTION IT IS
      //ATTRIBUTE: NUMBERS (MPG, CARGO, PRICE)
      //CHARACTERISTIC: WORDS (COLOR, SUNROOF, AC)

      if(type == "attribute"){

        //CALCULATE CORRECTNESS OF ATTRIBUTE QUESTIONS WITH THIS FUNCTIONALITY
        if(criterion === "cargoVol") {
          phrasedCriterion = "Cargo Room";
          if(selectedAnswersData.length > 1) {
            if(selectedAnswersData[0].cargoVol === selectedAnswersData[1].cargoVol) {
              correctlyAnswered = true;
              bothCorrect = true;
            }
          }

          else {
            if(parseFloat(selectedAnswersData[0].cargoVol) > parseFloat(unselectedAnswerData.cargoVol)) {
              correctlyAnswered = true;
            }
          }
        }

        else if(criterion === "mpg") {
          phrasedCriterion = "MPG";
          if(selectedAnswersData.length > 1) {
            if(selectedAnswersData[0].mpg === selectedAnswersData[1].mpg) {
              correctlyAnswered = true;
              bothCorrect = true;
            }

          } else {
            if(parseFloat(selectedAnswersData[0].mpg) > unselectedAnswerData.mpg) {
              correctlyAnswered = true;
            }
          }
        }

        else if(criterion === "rearLegRoom") {
          phrasedCriterion = "Leg Room";

          if(selectedAnswersData.length > 1) {
            if(selectedAnswersData[0].rearLegRoom === selectedAnswersData[1].rearLegRoom) {
              correctlyAnswered = true;
              bothCorrect = true;
            }
          } else {
            if(parseFloat(selectedAnswersData[0].rearLegRoom) > unselectedAnswerData.rearLegRoom) {
              correctlyAnswered = true;
            }
          }
        }

        else if(criterion === "horsePower") {
          phrasedCriterion = "Horse Power";
          if(selectedAnswersData.length > 1) {
            if(selectedAnswersData[0].horsePower === selectedAnswersData[1].horsePower) {
              correctlyAnswered = true;
              bothCorrect = true;
            }
          } else {
            if(parseFloat(selectedAnswersData[0].horsePower) > unselectedAnswerData.horsePower) {
              correctlyAnswered = true;
            }
          }
        }

        else if(criterion === "basePrice") {
          phrasedCriterion = "Base Price";
          if(selectedAnswersData.length > 1) {
            if(selectedAnswersData[0].basePrice === selectedAnswersData[1].basePrice) {
              correctlyAnswered = true;
              bothCorrect = true;
            }
          } else {
            if(parseFloat(selectedAnswersData[0].basePrice) < parseFloat(unselectedAnswerData.basePrice)) {
              correctlyAnswered = true;
            }
          }
        }
      }
      else if(type == "characteristic") {
        var correctCharacteristic = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].CHARACTERISTIC;

        if(criterion === "brand") {
          phrasedCriterion = "Brand";

          if(selectedAnswersData[0].brand == correctCharacteristic) {
            correctlyAnswered = true;
          }
        }
        else if(criterion === "color") {
          phrasedCriterion = "Color";

          if(selectedAnswersData[0].color == correctCharacteristic) {
            correctlyAnswered = true;

          }
        }
        else if(criterion === "sunroof") {
          phrasedCriterion = "Sunroof";

          if(selectedAnswersData[0].sunroof == correctCharacteristic) {
            correctlyAnswered = true;
          }
        }
        else if(criterion === "heatedSeats") {
          phrasedCriterion = "Heated Seats";

          if(selectedAnswersData[0].heatedSeats == correctCharacteristic) {
            correctlyAnswered = true;
          }
        }
      }

      var feedbackDetails = "The <span class='bolded'>"+unselectedAnswerData.model+"'s</span> listed <span>"+phrasedCriterion+":</span>  <span class='bolded'>"+unselectedAnswerData[criterion]+"</span>"

      if(correctlyAnswered) {
        var feedback = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.feedback.correct;

        courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].PASSED = "true";
        localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

        var tempScore = 10;
        if(time <= 10){
          tempScore = Math.round(10 + ((10 - time) * 10));
        }
        courseData.assessmentData.assessments[activeAssessment].questionsAnswers.questions[qIndex].SCORE = tempScore;
        courseData.assessmentData.assessments[activeAssessment].score += tempScore

        for(var i = 0; i < selectedAnswers.length; i++) {
          $(selectedAnswers[i]).append("<div class='viewed-overlay'><img src='dir/media/img/icon_viewed.png'></div>");
        }


        $("#modalContainer .assessment-content").append("<div class='feedback-container'><p class='feedback-details'>"+feedbackDetails+"</p><p class='feedback-details'>The <span class='bolded'>"+selectedAnswersData[0].model+"'s</span> listed <span>"+phrasedCriterion+":</span> <span class='bolded'>"+selectedAnswersData[0][criterion]+"</span></p><p>"+feedback+" +"+tempScore+" points</p><button class='btn-ok'>GO</button></div>");

        $("#modalContainer .btn-ok").click(function() {
          courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex += 1;
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
          $("#modalContainer .assessment-content").remove();

          if(questionIndex === (questionsNum - 1)) {
            courseData.assessmentData.assessments[activeAssessment].completed = "true";
            localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
            endAssessment(activeAssessment);
          }
          else {
            startAssessment(activeAssessment);
          }
        });
      }
      else {

        $(unselectedAnswer).append("<div class='viewed-overlay'><img src='dir/media/img/icon_viewed.png'></div>");

        var feedback = courseData.assessmentData.assessments[activeAssessment].questionsAnswers.feedback.incorrect;

        qIndex = undefined;
        aIndex = undefined;

        /* TODO: make this modular so answerTries is a setting and triggers the "try again" prompt only if answerTris > 1 */
        /*if(answerTries === 2) {*/
        $("#modalContainer .assessment-content").append("<div class='feedback-container'><p class='feedback-details'>The <span class='bolded'>"+unselectedAnswerData.model+"'s</span> listed <span>"+phrasedCriterion+":</span> <span class='bolded'>"+unselectedAnswerData[criterion]+"</span></p><p class='feedback-details'>The <span class='bolded'>"+selectedAnswersData[0].model+"'s</span> listed <span>"+phrasedCriterion+":</span> <span class='bolded'>"+selectedAnswersData[0][criterion]+"</span></p><p>"+feedback+" +0 points</p><button class='btn-ok'>GO</button></div>");

        $("#modalContainer .btn-ok").click(function() {
          courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex += 1;
          localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
          $("#modalContainer .assessment-content").remove();

          if(questionIndex === (questionsNum - 1)) {
            courseData.assessmentData.assessments[activeAssessment].completed = "true";
            localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
            endAssessment(activeAssessment);
          }
          else {
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

//Timer used in countdown and scoring
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
    startBtn.append("<div class='viewed-overlay'><img src='../../../dir/media/img/icon_viewed.png'></div>");
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

  //Find the percentage correct, that way the Feedback is based on how well the user did, not how many they got right
  //Number of questions changes, so use percentage
  correctPercentage = 10 * correctAnswerCount / courseData.assessmentData.QUESTIONS_GIVEN;
  correctPercentage = parseFloat(correctPercentage.toFixed(0));

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

function filterAnswersAttribute(activeAssessment, filterParam, answersFilteredParam){
  var filter = filterParam.filter;
  var value = filterParam.value;
  var comparison = filterParam.compare;
  var operator = "";
  var answersFiltered = [];

  if(comparison == 'minimum'){
    operator = ">";
  }else if(comparison == 'maximum'){
    operator = "<";
  }else if(comparison == 'equals'){
    operator = "==";
  }

  for(var i = 0; i < answersFilteredParam.length; i++){
    //Iterate through the answers and check if the given criteria (filter) is greater than the num given

    if(eval(answersFilteredParam[i][filter] + operator + value)){
      //If so, then add it to the answersFiltered array to be used in the assessment
      answersFiltered.push(answersFilteredParam[i]);
    }
  }

  return answersFiltered;
}

function filterAnswersCharacteristic(activeAssessment, filterParam, answersFilteredParam){
  var vehiclePassedFilter = true;
  var filter = filterParam.filter;
  var value = filterParam.value;
  var answersFiltered = [];


  for(var i = 0; i < answersFilteredParam.length; i++){
    console.log(answersFilteredParam[i].model);
    console.log(answersFilteredParam[i].heatedSeats);

    vehiclePassedFilter = true;
    //Iterate through the answers and check if the given criteria (filter) is greater than the num given
    if(answersFilteredParam[i][filter] != value){
      vehiclePassedFilter = false;
    }

    if(vehiclePassedFilter){
      answersFiltered.push(answersFilteredParam[i]);
    }
  }

  return answersFiltered;
}

function sameAnswerCheck(activeAssessment, answersFiltered, criterion){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var questionIndex = courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex;

  //Check to see if the two chosen answers criteria are equal
  var answer1 = answersFiltered[0][criterion];
  var answer2 = answersFiltered[1][criterion];

  if(answer1 == answer2){
    //If so, they shuffle the answers and check again
    answersFiltered = shuffle(answersFiltered);
    courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered = answersFiltered;

    sameAnswerCheck(activeAssessment, answersFiltered, criterion);
  }
  else{
    //If not, then return with the updated answersFiltered
    return;
  }
}

function orderAnswers(activeAssessment, answersFiltered, criterion, value){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var questionsIndex = courseData.assessmentData.assessments[activeAssessment].currentQuestionIndex;

  //Check to see if the two chosen answers criteria are equal
  var answer1 = answersFiltered[0][criterion];
  var answer2 = answersFiltered[1][criterion];

  if((answer1 == value || answer2 == value) && answer1 != answer2){
    //Answers already ordered
  }else if(answer1 == value) {
    //Both answers have the characteristic
    for(var i = 0; i < 1000; i++){
      var replacement = answersFiltered[i][criterion];

      if(replacement != value){
        var swap = answersFiltered[0];
        answersFiltered[0] = answersFiltered[i];
        answersFiltered[i] = swap;
        break;
      }
    }
  }else{
    //Neither answers have the characteristic
    for(var i = 0; i < 1000; i++){
      var replacement = answersFiltered[i][criterion];

      if(replacement == value){
        var swap = answersFiltered[1];
        answersFiltered[1] = answersFiltered[i];
        answersFiltered[i] = swap;
        break;
      }
    }
  }

  courseData.assessmentData.assessments[activeAssessment].questionsAnswers.answersFiltered = answersFiltered;
}
