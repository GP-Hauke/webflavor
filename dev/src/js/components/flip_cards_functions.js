//INITIALIZE AND RENDER CARDS
var LOCAL_COURSE_DATA_ID;
export function initFlipCard(flipCardContentXML, elementID, localStorageID) {
  LOCAL_COURSE_DATA_ID = localStorageID;

  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var currentFlipCardComponent = $(flipCardContentXML).find('FlipCard[id="'+elementID+'"]');
  if(currentFlipCardComponent.length == 0){
    var currentFlipCardComponent = $(flipCardContentXML).find('FlipCard');
  }
  var currentID = $(currentFlipCardComponent).attr("id")

  if(courseData.flipCardData.flipCards != null){
    for(var i=0; i < courseData.flipCardData.flipCards.length; i++){
      if(courseData.flipCardData.flipCards[i].id == currentID){
        var id = getFlipCardIndex(currentID);
        console.log("FlipCard Loaded Previously");
        setupFlipCards(id, elementID);
        return;
      }
    }
  }

  else{
    console.log("FlipCard Initialized");
    courseData.flipCardData.id = $(currentFlipCardComponent).attr("id");
    courseData.flipCardData.completed = 0;
    courseData.flipCardData.flipCards =  [];
  }

  var flipCard = {
    id: $(currentFlipCardComponent).attr("id"),
    completed: false,
    completion: {},
    score: 0,
    hasButton: $(currentFlipCardComponent).attr("hasButton"),
    class: $(currentFlipCardComponent).attr("class"),
    cards: []
  };

  if(currentFlipCardComponent.find("completion").attr("gated") == "true"){
    flipCard.completion = {
      gate : {
        chapter: currentFlipCardComponent.find("chapter").text(),
        page: currentFlipCardComponent.find("page").text(),
        lock: currentFlipCardComponent.find("lock").text()
      }
    };
  }

  $(currentFlipCardComponent).find("card").each(function() {
    var currentCard = $(this);

    var card = {
      front: currentCard.find("front").text(),
      back: currentCard.find("back").text(),
      completed: false
    };
    flipCard.cards.push(card);
  });

  courseData.flipCardData.flipCards.push(flipCard);
  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
  var id = getFlipCardIndex(currentID);
  setupFlipCards(id, elementID);
}

export function setupFlipCards(id, elementID){

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var cardNum = courseData.flipCardData.flipCards[id].cards.length;

  var html = '<div class="row"></div>';
  $("#"+elementID).empty();
  $("#"+elementID).html(html);

  var size = 12/cardNum;

  for(var i = 0; i < cardNum; i ++){
    var back = courseData.flipCardData.flipCards[id].cards[i].back;
    var front = courseData.flipCardData.flipCards[id].cards[i].front;

    var cardWidth = "col-12 col-sm-12 mx-auto col-md-"+size;

    if(courseData.flipCardData.flipCards[id].hasButton == "true"){
      var cardHTML = '<div class="'+cardWidth+' margin-below"><div class="cardCont" id="card'+i+'"><div class="cardBack">'+back+'<a class="showMore back" href="#">Back</a></div><div class="cardFront">'+front+'<a class="showMore front" href="#">Show More</a></div></div></div>';
    }
    else{
      var cardHTML = '<div class="'+cardWidth+' margin-below"><div class="cardCont" id="card'+i+'"><div class="cardBack">'+back+'</div><div class="cardFront">'+front+'</div></div></div>';
    }

    $("#"+elementID + " .row").append(cardHTML);

    CSSPlugin.defaultTransformPerspective = 1000;

    //we set the backface
    TweenMax.set($(".cardBack"), {rotationY:-180});

    $.each($(".cardCont"), function(i,element) {

      var frontCard = $(this).children(".cardFront"),
          backCard = $(this).children(".cardBack"),
          tl = new TimelineMax({paused:true});

      tl
        .to(frontCard, 1, {rotationY:180})
        .to(backCard, 1, {rotationY:0},0)
        .to(element, .5, {z:50},0)
        .to(element, .5, {z:0},.5);

      element.animation = tl;

      //$(element).click({thisCard: element}, showBack);

    });

    if(courseData.flipCardData.flipCards[id].hasButton == "true"){
      $("#"+elementID+ " .front").click(function() {
        var cardID = $(this).closest('.cardCont').attr("id");
        cardID = cardID.substr($("#"+cardID).attr("id").length - 1);
        checkCardsCompletion(id, cardID);
        $(this).closest(".cardCont")[0].animation.play();
      });

      $("#"+elementID+ " .back").click(function() {
          $(this).closest(".cardCont")[0].animation.reverse();
      });
    }
    else if(courseData.flipCardData.flipCards[id].hasButton == "false") {
      $("#"+elementID+ " .cardFront").hover(function(){
        $(this).css('cursor','pointer');
      });

      $("#"+elementID+ " .cardBack").hover(function(){
        $(this).css('cursor','pointer');
      });

      $("#"+elementID+ " .cardFront").click(function() {
        var cardID = $(this).closest('.cardCont').attr("id");
        cardID = cardID.substr($("#"+cardID).attr("id").length - 1);
        checkCardsCompletion(id, cardID);
        $(this).closest(".cardCont")[0].animation.play();
      });

      $("#"+elementID+ " .cardBack").click(function() {
          $(this).closest(".cardCont")[0].animation.reverse();
      });
    }
  }
}

export function getFlipCardIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  for(var i = 0; i < courseData.flipCardData.flipCards.length; i++){
    if(courseData.flipCardData.flipCards[i].id == currentID){
      return i;
    }
  }
}

export function showBack(evt) {
  var card = evt.data.thisCard;
  card.animation.play();
  $(card).unbind("click", showBack);
  $(card).click({thisCard: card}, showFront);
}

export function showFront(evt) {
  var card = evt.data.thisCard;
  card.animation.reverse();
  $(card).unbind("click", showFront);
  $(card).click({thisCard: card}, showBack);
}

export function checkCardsCompletion(id, cardsID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  if(courseData.flipCardData.flipCards[id].cards[cardsID].completed == false){
    courseData.flipCardData.flipCards[id].cards[cardsID].completed = true;
    courseData.flipCardData.flipCards[id].score += 1;
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

    if(courseData.flipCardData.flipCards[id].score >= courseData.flipCardData.flipCards[id].cards.length){
      courseData.flipCardData.flipCards[id].completed = true;
      courseData.flipCardData.completed += 1;
      courseData.INTERACTIVES_COMPLETED += 1;
      localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
      console.log("FlipCard Completed");
      if(courseData.flipCardData.flipCards[id].completion.gate != null) {
        var chapter = courseData.flipCardData.flipCards[id].completion.gate.chapter;
        var page = courseData.flipCardData.flipCards[id].completion.gate.page;
        var lock = courseData.flipCardData.flipCards[id].completion.gate.lock;
        openLock(chapter, page, lock);
      }
    }
  }
}