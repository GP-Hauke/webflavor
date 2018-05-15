function initCardContent(cardContentXML) {
  /* ran into a case where localStorage wasn't available, throwing an error on startup. couldn't track down exact bug (possibly a race condition somewhere) so reloading page if localStorage isn't found. */
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  /* if course is loaded for first time, or card content xml was updated, initialize card data. otherwise do nothing. */
  if(courseData.cardData.VERSION === undefined || courseData.cardData.VERSION !== $(cardContentXML).find("version").text()) {
    courseData.cardData.VERSION = $(cardContentXML).find("version").text();
    courseData.cardData.TOTAL_ACTIONS = $(cardContentXML).find("action").length;
    courseData.cardData.cardContent = [];

    /* set all card data that all cards have in common from the xml file first, then set the card type, then set additional properties based on type*/
    $(cardContentXML).find("cards card").each(function() {
      var currentCard = $(this);

      var cardContentObject = {
        TYPE: currentCard.attr("type"),
        cardHeading: currentCard.find("cardHeading").text(),
        blurb: currentCard.find("cardBlurb").text(),
      };

      if(cardContentObject.TYPE === "popup") {
        cardContentObject.popupContent = currentCard.find("popupContent").text();
        cardContentObject.imgStr = currentCard.find("imgSrc").text();

        var popupsArr = [];
        for(var count = 0; count < currentCard.find("action").length; count++) {
          var popupObj = {
            required: $(this).find("action required")[count].firstChild.data,
            label: $(this).find("action label")[count].firstChild.data,
            executed: "false"
          };
          popupsArr.push(popupObj);
        }
        cardContentObject.actions = popupsArr;

      } else if(cardContentObject.TYPE === "text") {
        cardContentObject.popupContent = currentCard.find("popupContent").text();
        cardContentObject.imgStr = currentCard.find("imgSrc").text();

        var popupsArr = [];
        for(var count = 0; count < currentCard.find("action").length; count++) {
          var popupObj = {
            required: $(this).find("action required")[count].firstChild.data,
            label: $(this).find("action label")[count].firstChild.data,
            executed: "false"
          };
          popupsArr.push(popupObj);
        }
        cardContentObject.actions = popupsArr;

      } else if (cardContentObject.TYPE === "links") {
        cardContentObject.imgStr = currentCard.find("imgSrc").text();

        var linksArr = [];
        for(var count = 0; count < currentCard.find("action").length; count++) {

          var linkObj = {
            urlstr: $(this).find("action link link-url")[count].firstChild.data,
            label: $(this).find("action label")[count].firstChild.data,
            executed: "false"
          };
          linksArr.push(linkObj);
        }
        cardContentObject.actions = linksArr;

      } else if(cardContentObject.TYPE === "video") {
        cardContentObject.vidSrc = currentCard.find("vidSrc").text();
        cardContentObject.imgStr = currentCard.find("imgSrc").text();
        cardContentObject.posterSrc = currentCard.find("posterSrc").text();

        var vidClicksArr = [];
        for(var count = 0; count < currentCard.find("action").length; count++) {
          var vidClicksObj = {
            required: $(this).find("action required")[count].firstChild.data,
            label: $(this).find("action label")[count].firstChild.data,
            executed: "false"
          };
          vidClicksArr.push(vidClicksObj);
        }
        cardContentObject.actions = vidClicksArr;

      } else if(cardContentObject.TYPE === "plain") {


      } else if(cardContentObject.TYPE === "page-content") {
        cardContentObject.popupContent = currentCard.find("popupContent").text();
        cardContentObject.imgStr = currentCard.find("imgSrc").text();

        var popupsArr = [];
        for(var count = 0; count < currentCard.find("action").length; count++) {
          var popupObj = {
            required: $(this).find("action required")[count].firstChild.data,
            label: $(this).find("action label")[count].firstChild.data,
            executed: "false"
          };
          popupsArr.push(popupObj);
        }
        cardContentObject.actions = popupsArr;

      }

      courseData.cardData.cardContent.push(cardContentObject);
    });

    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  }
}
