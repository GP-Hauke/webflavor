//INITIALIZE AND RENDER CARDS
var LOCAL_COURSE_DATA_ID;

export function initThumbnails(thumbnailContentXML, elementID, localStorageID) {
  LOCAL_COURSE_DATA_ID = localStorageID;
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentThumbnailComponent = $(thumbnailContentXML).find('Thumbnails[id="'+elementID+'"]');
  if(currentThumbnailComponent.length == 0){
    currentThumbnailComponent = $(thumbnailContentXML).find('Thumbnails');
  }
  var currentID = $(currentThumbnailComponent).attr("id");


  if(courseData.thumbnailData.thumbnails != null){
    for(var i=0; i < courseData.thumbnailData.thumbnails.length; i++){
      if(courseData.thumbnailData.thumbnails[i].id == currentID){
        var id = getThumbnailIndex(currentID);
        console.log("Hotspot Loaded Previously");
        setupThumbnails(id,elementID);
        return;
      }
    }
  }

  else{
    console.log("Thumbnail Initialized");
    courseData.thumbnailData.completed = 0;
    courseData.thumbnailData.thumbnails = [];
  }

  var thumbnail = {
    id: $(currentThumbnailComponent).attr("id"),
    completed: false,
    completion: {},
    score: 0,
    class: $(currentThumbnailComponent).attr("class"),
    thumbs: []
  }

  if(currentThumbnailComponent.find("completion").attr("gated") == "true"){
    thumbnail.completion = {
      gate : {
        chapter: currentThumbnailComponent.find("chapter").text(),
        page: currentThumbnailComponent.find("page").text(),
        lock: currentThumbnailComponent.find("lock").text()
      }
    };
  }

  $(currentThumbnailComponent).find("thumbnail").each(function() {
    var currentThumbnail = $(this);

    var thumb = {
      img: currentThumbnail.find("img").text(),
      url: currentThumbnail.find("url").text(),
      onClickFunction: currentThumbnail.find("onClickFunction").text(),
      heading: currentThumbnail.find("heading").text(),
      caption: currentThumbnail.find("caption").text(),
      completed: false
    };
    thumbnail.thumbs.push(thumb);
  });

  courseData.thumbnailData.thumbnails.push(thumbnail);


  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  var id = getThumbnailIndex(currentID);
  setupThumbnails(id, elementID);
}

export function setupThumbnails(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var thumbnailNum = courseData.thumbnailData.thumbnails[id].thumbs.length;

  var html = '<div class="row"></div>';
  $("#"+elementID).html(html);


  var size = 12/thumbnailNum;

  for(var i = 0; i < thumbnailNum; i ++){
    var img = courseData.thumbnailData.thumbnails[id].thumbs[i].img;
    var url = courseData.thumbnailData.thumbnails[id].thumbs[i].url;
    var heading = courseData.thumbnailData.thumbnails[id].thumbs[i].heading;
    var caption = courseData.thumbnailData.thumbnails[id].thumbs[i].caption;

    var thumbnailWidth = "col-12 col-sm-"+size;

    var href = "href";
    if(courseData.thumbnailData.thumbnails[id].thumbs[i].onClickFunction == "true"){
      href = "onclick";

      var thumbnailHTML = `
      <div class="`+thumbnailWidth+`">
         <div class="thumbnail" id="">
          <a id="thumb`+i+`" target="_blank" `+href+`=`+url+` class="top-paragraph link">
          <div class="img-container">
            <img class="img-zoom" src="`+img+`" alt="">
          </div>
          <div class="caption">
            <div class="caption-title">
              <span>`+
              heading+`
              </span>
            </div>
          <p>`+caption+`
          </p>
         </div>
         </a>
        </div>
      </div>`;
    }

    else {

      if(url.length == ""){
        var thumbnailHTML = `
        <div class="`+thumbnailWidth+`">
          <div class="thumbnail" id="">
            <div style="cursor: default" id="`+elementID+`-thumb-`+i+`" class="top-paragraph link">
            <div class="img-container">
              <img class="img-zoom" src="`+img+`" alt="">
            </div>
            <div class="caption">
              <div class="caption-title">
                <span>`+
                  heading+`
                </span>
              </div>
            <p>`+caption+`
            </p>
            </div>
           </div>
          </div>
        </div>`;
      }

      else{
        var thumbnailHTML = `
        <div class="`+thumbnailWidth+`">
        <div class="thumbnail" id="">
        <a id="`+elementID+`-thumb-`+i+`" target="_blank" `+href+`="`+url+`" class="top-paragraph link">
        <div class="img-container">
        <img class="img-zoom" src="`+img+`" alt="">
        </div>
        <div class="caption">
        <div class="caption-title">
        <span>`+
        heading+`
        </span>
        </div>
        <p>`+caption+`
        </p>
        </div>
        </a>
        </div>
        </div>`;
      }
    }

    $("#"+elementID+ ' .row').append(thumbnailHTML);
    $('#'+elementID+'-thumb-'+i).click(function(){

      checkThumbCompletion(this, getThumbnailIndex(elementID));
    });
  }



}

export function checkThumbCompletion(evt, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var id = $(evt).attr("id");
  id = id.substr($(evt).attr("id").length - 1);
  var thumbID = id;
  if(courseData.thumbnailData.thumbnails[elementID].thumbs[thumbID].completed == false){
    courseData.thumbnailData.thumbnails[elementID].thumbs[thumbID].completed = true;
    courseData.thumbnailData.thumbnails[elementID].score += 1;

    if(courseData.thumbnailData.thumbnails[elementID].score >= courseData.thumbnailData.thumbnails[elementID].thumbs.length){
      courseData.thumbnailData.thumbnails[elementID].completed = true;
      courseData.thumbnailData.completed += 1;
      courseData.INTERACTIVES_COMPLETED += 1;
      if(courseData.thumbnailData.thumbnails[elementID].completion.gate != null) {
        var chapter = courseData.thumbnailData.thumbnails[elementID].completion.gate.chapter;
        var page = courseData.thumbnailData.thumbnails[elementID].completion.gate.page;
        var lock = courseData.thumbnailData.thumbnails[elementID].completion.gate.lock;
        openLock(chapter, page, lock);
      }
    }
  }

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));

}

export function getThumbnailIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  for(var i = 0; i < courseData.thumbnailData.thumbnails.length; i++){
    if(courseData.thumbnailData.thumbnails[i].id == currentID){
      return i;
    }
  }
}
