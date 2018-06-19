function initCards(){

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
