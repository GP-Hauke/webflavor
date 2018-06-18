function initCards(){
  $('.card').click(function(){
    var frontIndex = $(this).find('.card__side--front').css('z-index');
    var backIndex = $(this).find('.card__side--back').css('z-index');

    frontIndex *= -1;
    backIndex *= -1;

    $(this).find('.card__side--front').css('z-index', frontIndex);
    $(this).find('.card__side--back').css('z-index', backIndex);
  });
}
