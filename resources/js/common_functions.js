function initCommonFunctions() {

  $("body").keydown(function( event ) {

    if (event.which==39) {
      window.parent.nextPage();

    } else if(event.which==37) {
      window.parent.prevPage();
    }
  });

  //$('#btnGlossary').click(window.parent.openGlossary);
}

function openGlossary() {
  $('#glossaryModal').on('shown.bs.modal', function (e) {
    $('#glossaryModal .modal-body').css({height : $('#glossaryModal').height()});
  });

  $('#glossaryModal').modal();
}
