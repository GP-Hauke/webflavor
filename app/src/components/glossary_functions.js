function Glossary(xml) {
  this.items = [];

  this.notFound = new item(xml.getElementsByTagName("notFound")[0])
  for(var i = 0; i < xml.getElementsByTagName("item").length; i++) {
    this.items.push(new item(xml.getElementsByTagName("item")[i]));
  }

  this.items.sort(function(a,b){return a.term.localeCompare(b.term)});

  this.getItemById=function(args) {
    for(var i = 0; i < this.items.length; i++) {
      if(this.items[i].id == args)
        return this.items[i];
    }
    return this.notFound;
  }

  this.populateGlossary = function() {
    var letter="";
    for(var i = 0; i < this.items.length; i++) {
      if(letter != this.items[i].term.charAt(0).toUpperCase()) {
        letter = this.items[i].term.charAt(0).toUpperCase();

        $("#glossaryLetters").append('<div id="glossButton_'+letter+'" class="glossaryLetter" onclick="scrollGloss(\''+letter+'\')">'+letter+'</div>');

        $("#glossaryHolder").append('<div id="gloss_'+letter+'"></div>');
      }

      if(this.items[i].audio != "") {
        $("#glossaryHolder").append('<div data-role="collapsible" class="glossaryDefinition"><h3 class="glossaryTerm">'+this.items[i].term+'</h3><p>'+this.items[i].definition+'</p><a class="glossaryPlayIcon" href="javascript:void(0)" onclick="glossary.playTerm(\''+this.items[i].audio+'\')"><img src="includes/css/images/audio_icon.jpg"/></a></div>');
      } else {
        $("#glossaryHolder").append('<div data-role="collapsible" class="glossaryDefinition"><h3 class="glossaryTerm">'+this.items[i].term+'</h3><p>'+this.items[i].definition+'</p></div>');
      }

    }
  }

  this.playTerm = function(src) {
    document.getElementById("glossaryPlayer").src = "media/glossaryAudio/"+src;
    document.getElementById("glossaryPlayer").play();
  }
}

function item(xml) {
  this.term = xml.getElementsByTagName("term")[0].childNodes[0].nodeValue;
  this.definition = xml.getElementsByTagName("definition")[0].childNodes[0].nodeValue;
  this.id = xml.getAttribute("id");
  this.audio = xml.getAttribute("audio");
}
