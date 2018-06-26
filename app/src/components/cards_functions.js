//INITIALIZE AND RENDER CARDS
function initCards(dragDropContentXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentCardComponent = $(dragDropContentXML).find("cards");

  courseData.cardsData = {
    completed: $(currentCardComponent).attr("completed"),
    class: $(currentCardComponent).attr("class"),
    cards: []
  };

  $(currentCardComponent).find("card").each(function() {
    var currentCard = $(this);

    var card = {
      front: currentCard.find("front").text(),
      back: currentCard.find("back").text()
    };
    courseData.cardsData.cards.push(card);
  });

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
  setupCards();
}



function setupCards(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var cardNum = courseData.cardsData.cards.length;

  var html = '<div class="row">';

  var size = 12/cardNum;

  for(var i = 0; i < cardNum; i ++){
    var back = courseData.cardsData.cards[i].back;
    var front = courseData.cardsData.cards[i].front;

    var cardWidth = "col-md-"+size+" col-sm-6";
    if(courseData.cardsData.class != null){
      cardWidth = courseData.cardsData.class;
    }
    var cardHTML = '<div class="'+cardWidth+' margin-below"><div class="cardCont"><div class="cardBack">'+back+'</div><div class="cardFront">'+front+'</div></div></div>';

    html += cardHTML;
  }

  html += '</div>';
  $('#pageContent').append(html);


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

  });

  $(".cardCont").hover(elOver, elOut);

  function elOver() {
      this.animation.play();
  }

  function elOut() {
      this.animation.reverse();
  }

}