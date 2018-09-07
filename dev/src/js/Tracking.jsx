//////////////////////////////////////////////////////////////////////
//
//     Tracking JS
//      - Communication with LMS
//      - Responsible for Bookmarking
//
//////////////////////////////////////////////////////////////////////

var TRACKING = "SCORM";
var SCORM = "1.2";
var setScore = -1;
var mtmOpened = false;
var cookieName;

export function SetCookieName(c){
  cookieName = c;
}

export function SetBookmark(c, p) {
  if(TRACKING == "SCORM") {
    if(getAPIHandle() == null) {
      return;
    }

    if(SCORM=="2004") {
      doLMSSetValue("cmi.location", c+"_"+p);

    } else if(SCORM=="1.2") {
      doLMSSetValue("cmi.core.lesson_location", c+"_"+p);
    }

    doLMSCommit();

  } else if(TRACKING=="COOKIES") {
    setCookie(cookieName+"bm",c+"_"+p);
  }
}

export function GetBookmark() {
  if(TRACKING=="SCORM") {
    if(getAPIHandle() == null){return;}

    if(SCORM=="2004") {
      return doLMSGetValue("cmi.location");

    } else if(SCORM=="1.2") {
      return doLMSGetValue("cmi.core.lesson_location");
    }

  } else if(TRACKING=="COOKIES") {
    return GetCookie(cookieName + "bm");
  }
}

export function CreatePathmarks() {
  var s = "";

  for(var i = 0; i < courseData.chapters.length; i++) {
    var active=0;
    if(courseData.chapters[i].isActive == "true") {
      active=1;
    }

    s = s + active + "]" + courseData.chapters[i].titleIndex + "}";

    for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
      if(j ==  courseData.chapters[i].pages.length-1) {
        s = s + courseData.chapters[i].pages[j].locks.toString();
      } else {
        s = s + courseData.chapters[i].pages[j].locks.toString()+";";
      }
    }

    if(i < courseData.chapters.length-1) {
      s = s+":";
    }
  }

  if(TRACKING=="SCORM") {
    if(getAPIHandle() == null){return;}
    doLMSSetValue("cmi.suspend_data",s);
    doLMSCommit();

  } else if(TRACKING=="COOKIES") {
    setCookie(cookieName+"pm",s);
  }

  var isComplete = true;
  var noActive = true;

  for(var i = 1; i < courseData.chapters.length; i++) {
    for(var j = 0; j < courseData.chapters[i].pages.length; j++) {
      if(courseData.chapters[i].isActive == "true") {
        noActive = false;
      }

      if(courseData.chapters[i].pages[j].locks.toString().indexOf("0") != -1 && courseData.chapters[i].isActive == "true") {
        isComplete=false;
        break;
      }

    }
  }

  if((courseData.COMPLETION_METHOD == "page_view" && isComplete && !noActive) || courseData.COMPLETION_METHOD == "immediate")	{
    SetComplete();
  }

}

export function GetPathmark() {
  if(TRACKING=="SCORM") {
    if(getAPIHandle() == null) {return;}

    return doLMSGetValue("cmi.suspend_data");

  } else if(TRACKING=="COOKIES") {
    return GetCookie(cookieName+"pm");
  }

  return "";
}

export function SetComplete() {
  console.log("Course Completed");
  if(TRACKING=="SCORM") {
    if(getAPIHandle()==null){return;}

    if(SCORM=="1.2") {
      doLMSSetValue( "cmi.core.lesson_status", "passed" );

    } else if(SCORM=="2004") {
      doLMSSetValue( "cmi.completion_status", "completed" );
      doLMSSetValue( "cmi.success_status", "passed" );
      if(setScore!=-1) {
        doLMSSetValue( "cmi.score.raw", setScore );
        doLMSSetValue( "cmi.score.scaled", setScore/100 );
      }
    }
    doLMSCommit();
  }
}

export function SendScore(percent,REQUIRED_PERCENT) {
  if(percent >= REQUIRED_PERCENT) {
    openLock(currentChapter,currentPage,1)
  }

  if(TRACKING=="SCORM") {
    if(getAPIHandle() == null){ return; }

    if(SCORM=="1.2") {
      doLMSSetValue( "cmi.core.score.raw", percent );
      if(percent>=REQUIRED_PERCENT) {
        doLMSSetValue( "cmi.core.lesson_status", "passed" );
      }

    } else if(SCORM=="2004") {
      doLMSSetValue( "cmi.score.raw", percent );
      doLMSSetValue( "cmi.score.scaled", percent/100 );
      setScore=percent;
      if(percent >= REQUIRED_PERCENT && courseData.COMPLETION_METHOD == "assessment") {
        doLMSSetValue( "cmi.completion_status", "completed" );
        doLMSSetValue( "cmi.success_status", "passed" );
      }
    }
    doLMSCommit();
  }
}

export function setInteraction(id,correctResponse,learnerResponse,result,description,type) {
  if(TRACKING=="SCORM" && SCORM=="2004") {
    doLMSSetValue("cmi.interactions."+id+".id",id);
    doLMSSetValue("cmi.interactions."+id+".type",type);
    doLMSSetValue("cmi.interactions."+id+".timestamp",ISODateString(new Date()));
    doLMSSetValue("cmi.interactions."+id+".correct_responses.0.pattern",correctResponse);
    doLMSSetValue("cmi.interactions."+id+".learner_response",learnerResponse);
    doLMSSetValue("cmi.interactions."+id+".result",result);
    if(description.length>250)
      description=description.substr(0,249);
    doLMSSetValue("cmi.interactions."+id+".description",description);
    doLMSCommit();
  }
}

export function ISODateString(d) {
  function pad(n){return n<10 ? '0'+n : n}
  return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())
}

export function StartLMS() {
  try {
    if(getAPIHandle() == null) {
      TRACKING = "COOKIES";
      return;
    }

    doLMSInitialize();
    startTimer();

    if(SCORM=="2004") {
      var status = doLMSGetValue( "cmi.completion_status" );
      if (status != "incomplete" && status!="completed") {
        doLMSSetValue( "cmi.completion_status", "incomplete" );
        doLMSSetValue( "cmi.success_status", "unknown" );
        doLMSSetValue( "cmi.location", "" );
        doLMSSetValue( "cmi.suspend_data","" );
      }

      doLMSSetValue("cmi.exit","suspend");
      doLMSCommit();

    } else if(SCORM=="1.2") {
      var status = doLMSGetValue( "cmi.core.lesson_status" );
      if (status == "not attempted") {
        doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
        doLMSSetValue( "cmi.core.lesson_location", "" );
        doLMSSetValue( "cmi.suspend_data","" );
        doLMSSetValue("cmi.core.exit","suspend");
        doLMSCommit();
      }
    }
  } catch(e){TRACKING="COOKIES"}
}

export function QuitLMS() {
  if(TRACKING=="SCORM") {
    if(SCORM=="2004") {
      doLMSSetValue("cmi.exit","suspend");

    } else if(SCORM=="1.2") {
      doLMSSetValue("cmi.core.exit","suspend");
    }

    computeTime();
    doLMSFinish();
  }
}

export function GetCookie(cookieName) {
  var search = cookieName + "="
  if (document.cookie.length > 0) {
    var offset = document.cookie.indexOf(search)

    if (offset != -1) {
      offset += search.length;
      var end = document.cookie.indexOf(";", offset);

      if (end == -1) {
        end = document.cookie.length;
      }

      var cookieValue = unescape(document.cookie.substring(offset, end))

      return cookieValue
    }
    else { return ""; }
  }
}

export function setCookie(cookieName, cookieValue, cookieLife) {
  var expirationDate = new Date();

  if(cookieLife == null || cookieLife != -1) {
    cookieLife = 365*86400000;
    expirationDate.setTime(expirationDate.getTime() + cookieLife);
    document.cookie = escape(cookieName) + "=" + escape(cookieValue) + ";expires=" + expirationDate.toGMTString() + ";path=/";

  } else {
    document.cookie = escape(cookieName) + "=" + escape(cookieValue) + ";path=/";
  }
}
