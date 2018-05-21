var ctrTracker = [];

function initCTR() {
  $("div.caption div").css("display","none");

  var ctrs = $('.thumbnail');
  for(var i = 0; i < ctrs.length; i++) {
    ctrNum = parseInt(ctrs[i].id);

    $('#'+ctrNum).click(function(evt) {
      $(this).find("div.caption h3").addClass("clicked");
      $(this).find(".loading-cover").addClass("hidden");
      $(this).find("div.caption div").show(300);

      var lockCheck = window.parent.chapters[window.parent.currentChapter].pages[window.parent.currentPage].locks;
      var lockNum = ctrTracker.length;
      if(lockNum >= 0 && lockCheck.indexOf(0) !== -1) {
        window.parent.openLock(window.parent.currentChapter,window.parent.currentPage,lockNum);
        ctrTracker.pop();
      }
    });

    ctrTracker[i] = i;
  }
}
