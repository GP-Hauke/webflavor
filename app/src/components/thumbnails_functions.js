//INITIALIZE AND RENDER CARDS
function initThumbnails(thumbnailContentXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentThumbnailComponent = $(thumbnailContentXML).find("thumbnails");

  courseData.thumbnailsData = {
    completed: false,
    completion: {},
    score: 0,
    class: $(currentThumbnailComponent).attr("class"),
    thumbnails: []
  };

  if(currentThumbnailComponent.find("completion").attr("gated") == "true"){
    courseData.thumbnailsData.completion = {
      gate : {
        chapter: currentThumbnailComponent.find("chapter").text(),
        page: currentThumbnailComponent.find("page").text(),
        lock: currentThumbnailComponent.find("lock").text()
      }
    };
  }

  $(currentThumbnailComponent).find("thumbnail").each(function() {
    var currentThumbnail = $(this);

    var thumbnail = {
      img: currentThumbnail.find("img").text(),
      url: currentThumbnail.find("url").text(),
      onclickFunction: currentThumbnail.find("url").attr("onclickFunction"),
      heading: currentThumbnail.find("heading").text(),
      caption: currentThumbnail.find("caption").text(),
      completed: false
    };
    courseData.thumbnailsData.thumbnails.push(thumbnail);
  });

  localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  setupThumbnails();
}

function setupThumbnails(){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var thumbnailNum = courseData.thumbnailsData.thumbnails.length;

  var html = '<div class="row">';

  var size = 12/thumbnailNum;

  for(var i = 0; i < thumbnailNum; i ++){
    var img = courseData.thumbnailsData.thumbnails[i].img;
    var url = courseData.thumbnailsData.thumbnails[i].url;
    var heading = courseData.thumbnailsData.thumbnails[i].heading;
    var caption = courseData.thumbnailsData.thumbnails[i].caption;

    var thumnailWidth = "col-md-"+size;
    if(courseData.thumbnailsData.class != null){
      thumbnailWidth = courseData.thumbnailsData.class;
    }

    var href = "href";
    if(courseData.thumbnailsData.thumbnails[i].onclickFunction == "true"){
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
  $('#pageContent').append(html);

}

function checkThumbCompletion(evt){
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));

  var id = $(evt).attr("id");
  id = id.substr($(evt).attr("id").length - 1);
  var thumbID = id;
  if(courseData.thumbnailsData.thumbnails[thumbID].completed == false){
    courseData.thumbnailsData.thumbnails[thumbID].completed = true;
    courseData.thumbnailsData.score += 1;
    localStorage.setItem(LOCAL_COURSE_DATA_ID, JSON.stringify(courseData));
  }

  if(courseData.thumbnailsData.score >= courseData.thumbnailsData.thumbnails.length){
    courseData.thumbnailsData.completed = true;
    if(courseData.thumbnailsData.completion.gate != null) {
      var chapter = courseData.thumbnailsData.completion.gate.chapter;
      var page = courseData.thumbnailsData.completion.gate.page;
      var lock = courseData.thumbnailsData.completion.gate.lock;
      openLock(chapter, page, lock);
    }
  }
}
