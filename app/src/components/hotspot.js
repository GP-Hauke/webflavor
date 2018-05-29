function setupHotSpot(){
  var html ='<div class="row margin-below"><div class="col-md-12"><div id="hotSpot"><img class="hotSpot-img" src="../../../dir/media/img/assets/City-Map.jpg"><div class="hotSpot-spot circle-1">1</div><div class="hotSpot-spot circle-2">2</div><div class="hotSpot-spot circle-3">3</div><div class="hotSpot-popup"></div></div></div>';

  $("#pageContent").append(html);

  var popup_1 = "<ul><li>Ask your Sales Manager about recommended routes.</li><li>Include a variety of speed zones. Make sure there are stretches that allow the customer to drive more than 45 mph.</li><li>Alternate your route as needed.</li></ul>";

  var popup_2 = "<ul><li>Be flexible on the drive. Your customer may want a longer or shorter drive than planned.</li><li>Ask your manager how to handle these situations.</li><li>If the customer wants a shorter drive,, know how to return to the dealership quuickly using streets with varied speeds that will still enhance the drive.</li></ul>";

  var popup_3 = "<ul><li>Know your drive.</li><li>Shadow a live demo drive with an experienced consultant and a customer.</li><li>Play the role of a customer and let an experienced consultant show you how he or she conducts a demo drive.</li></ul>";


  $('#hotSpot .hotSpot-spot').click(function(){

    var popupHTML = 'popup_'+$(this).html();

    $('#hotSpot .hotSpot-popup').empty();
    $('#hotSpot .hotSpot-popup').append('<a class="hotSpot-close">x</a>' + eval(popupHTML));
    $('#hotSpot .hotSpot-popup').css('display','block');

    $('#hotSpot .hotSpot-popup .hotSpot-close').click(function(){
      $('#hotSpot .hotSpot-popup').css('display','none');
    });
  });
}
