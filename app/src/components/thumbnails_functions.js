//INITIALIZE AND RENDER CARDS
function initThumbnails(dragDropContentXML) {
  if(localStorage === "undefined") {
    location.reload();
  }

  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var currentThumbnailComponent = $(dragDropContentXML).find("thumbnails");

  courseData.thumbnailsData = {
    completed: $(currentThumbnailComponent).attr("completed"),
    class: $(currentThumbnailComponent).attr("class"),
    thumbnails: []
  };

  $(currentThumbnailComponent).find("thumbnail").each(function() {
    var currentThumbnail = $(this);

    var thumbnail = {
      img: currentThumbnail.find("img").text(),
      url: currentThumbnail.find("url").text(),
      onclickFunction: currentThumbnail.find("url").attr("onclickFunction"),
      heading: currentThumbnail.find("heading").text(),
      caption: currentThumbnail.find("caption").text()
    };
    courseData.thumbnailsData.thumbnails.push(thumbnail);
  });

  localStorage.setItem(LOCAL_COURSE_DATA_ID,  JSON.stringify(courseData));
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
    }

    var thumbnailHTML = '<div class="'+thumbnailWidth+'"><div class="thumbnail" id=""><a target="_blank" '+href+'="'+url+'" class="top-paragraph link"><div class="img-container"><img class="img-zoom" src="'+img+'" alt=""></div><div class="caption"><div class="caption-title"><span>'+
    heading+'</span></div><p>'+caption+'</p></div></a></div></div>';

    html += thumbnailHTML;
  }

  html += '</div>';
  $('#pageContent').append(html);

}
