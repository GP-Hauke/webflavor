//INITIALIZE AND RENDER CARDS
function initThumbnails(thumbnailContentXML, elementID) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentThumbnailComponent = $(thumbnailContentXML).find('thumbnails[id="'+elementID+'"]');
  if(currentThumbnailComponent.length == 0){
    currentThumbnailComponent = $(thumbnailContentXML).find('thumbnails');
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
    courseData.thumbnailData = {
      completed: false,
      thumbnails: []
    };
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
      onclickFunction: currentThumbnail.find("url").attr("onclickFunction"),
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

function setupThumbnails(id, elementID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var thumbnailNum = courseData.thumbnailData.thumbnails[id].thumbs.length;

  var html = '<div class="row">';

  var size = 12/thumbnailNum;

  for(var i = 0; i < thumbnailNum; i ++){
    var img = courseData.thumbnailData.thumbnails[id].thumbs[i].img;
    var url = courseData.thumbnailData.thumbnails[id].thumbs[i].url;
    var heading = courseData.thumbnailData.thumbnails[id].thumbs[i].heading;
    var caption = courseData.thumbnailData.thumbnails[id].thumbs[i].caption;

    var thumbnailWidth = "col-md-"+size;

    var href = "href";
    if(courseData.thumbnailData.thumbnails[id].thumbs[i].onclickFunction == "true"){
      href = "onclick";

      var thumbnailHTML = '<div class="'+thumbnailWidth+'"><div class="thumbnail" id=""><a id="thumb'+i+'" target="_blank" '+href+'="'+url+'" class="top-paragraph link"><div class="img-container"><img class="img-zoom" src="'+img+'" alt=""></div><div class="caption"><div class="caption-title"><span>'+
      heading+'</span></div><p>'+caption+'</p></div></a></div></div>';
    }

    else {
      var thumbnailHTML = '<div class="'+thumbnailWidth+'"><div class="thumbnail" id=""><a id="thumb'+i+'" onclick="checkThumbCompletion(this);" target="_blank" '+href+'="'+url+'" class="top-paragraph link"><div class="img-container"><img class="img-zoom" src="'+img+'" alt=""></div><div class="caption"><div class="caption-title"><span>'+
      heading+'</span></div><p>'+caption+'</p></div></a></div></div>';
    }

    html += thumbnailHTML;
  }

  html += '</div>';

  if(elementID != null){
    $("#"+elementID).empty();
    $("#"+elementID).html(html);
  }
  else{
    $('#pageContent').append(html);
  }
}

function checkThumbCompletion(evt){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var id = $(evt).attr("id");
  id = id.substr($(evt).attr("id").length - 1);
  var thumbID = id;
  if(courseData.thumbnailData.thumbnails[thumbID].completed == false){
    courseData.thumbnailData.thumbnails[thumbID].completed = true;
    courseData.thumbnailData.score += 1;
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  }

  if(courseData.thumbnailData.score >= courseData.thumbnailData.thumbnails.length){
    courseData.thumbnailData.completed = true;
    if(courseData.thumbnailData.completion.gate != null) {
      var chapter = courseData.thumbnailData.completion.gate.chapter;
      var page = courseData.thumbnailData.completion.gate.page;
      var lock = courseData.thumbnailData.completion.gate.lock;
      openLock(chapter, page, lock);
    }
  }
}

function getThumbnailIndex(currentID){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  console.log(courseData.thumbnailData);
  for(var i = 0; i < courseData.thumbnailData.thumbnails.length; i++){
    if(courseData.thumbnailData.thumbnails[i].id == currentID){
      return i;
    }
  }
}
