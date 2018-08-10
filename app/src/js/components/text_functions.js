var LOCAL_COURSE_DATA_ID;

export function initText(textComponentXML, elementID, localStorageID){
  LOCAL_COURSE_DATA_ID = localStorageID;

  var currentText = $(textComponentXML).find('Text[id="'+elementID+'"]');
  $("#"+elementID).append(currentText.text());
}
