function initText(textComponentXML, elementID){
  var currentText = $(textComponentXML).find('Text[id="'+elementID+'"]');
  $("#"+elementID).append(currentText.text());
}
