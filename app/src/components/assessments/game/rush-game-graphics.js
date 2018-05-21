(function (cjs, an) {

  var p; // shortcut to reference prototypes
  var lib={};var ss={};var img={};
  lib.webFontTxtInst = {};
  var loadedTypekitCount = 0;
  var loadedGoogleCount = 0;
  var gFontsUpdateCacheList = [];
  var tFontsUpdateCacheList = [];
  lib.ssMetadata = [
    {name:"rush_game_graphics_atlas_", frames: [[0,0,600,320],[48,336,10,10],[36,336,10,10],[60,336,9,10],[12,336,10,14],[24,336,10,14],[0,336,10,14],[164,322,10,14],[143,322,19,10],[122,322,19,10],[0,322,120,12]]}
  ];



  lib.updateListCache = function (cacheList) {
    for(var i = 0; i < cacheList.length; i++) {
      if(cacheList[i].cacheCanvas)
        cacheList[i].updateCache();
    }
  };

  lib.addElementsToCache = function (textInst, cacheList) {
    var cur = textInst;
    while(cur != null && cur != exportRoot) {
      if(cacheList.indexOf(cur) != -1)
        break;
      cur = cur.parent;
    }
    if(cur != exportRoot) {
      var cur2 = textInst;
      var index = cacheList.indexOf(cur);
      while(cur2 != null && cur2 != cur) {
        cacheList.splice(index, 0, cur2);
        cur2 = cur2.parent;
        index++;
      }
    }
    else {
      cur = textInst;
      while(cur != null && cur != exportRoot) {
        cacheList.push(cur);
        cur = cur.parent;
      }
    }
  };

  lib.gfontAvailable = function(family, totalGoogleCount) {
    lib.properties.webfonts[family] = true;
    var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
    for(var f = 0; f < txtInst.length; ++f)
      lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);

    loadedGoogleCount++;
    if(loadedGoogleCount == totalGoogleCount) {
      lib.updateListCache(gFontsUpdateCacheList);
    }
  };

  lib.tfontAvailable = function(family, totalTypekitCount) {
    lib.properties.webfonts[family] = true;
    var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
    for(var f = 0; f < txtInst.length; ++f)
      lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);

    loadedTypekitCount++;
    if(loadedTypekitCount == totalTypekitCount) {
      lib.updateListCache(tFontsUpdateCacheList);
    }
  };
  // symbols:



  (lib.background = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(0);
  }).prototype = p = new cjs.Sprite();



  (lib.coin1 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(1);
  }).prototype = p = new cjs.Sprite();



  (lib.coin2 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(2);
  }).prototype = p = new cjs.Sprite();



  (lib.coin3 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(3);
  }).prototype = p = new cjs.Sprite();



  (lib.hero1 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(4);
  }).prototype = p = new cjs.Sprite();



  (lib.hero2 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(5);
  }).prototype = p = new cjs.Sprite();



  (lib.hero3 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(6);
  }).prototype = p = new cjs.Sprite();



  (lib.hero4 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(7);
  }).prototype = p = new cjs.Sprite();



  (lib.obstacle1 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(8);
  }).prototype = p = new cjs.Sprite();



  (lib.obstacle2 = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(9);
  }).prototype = p = new cjs.Sprite();



  (lib.platform = function() {
    this.spriteSheet = ss["rush_game_graphics_atlas_"];
    this.gotoAndStop(10);
  }).prototype = p = new cjs.Sprite();
  // helper functions:

  function mc_symbol_clone() {
    var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
    clone.gotoAndStop(this.currentFrame);
    clone.paused = this.paused;
    clone.framerate = this.framerate;
    return clone;
  }

  function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
    var prototype = cjs.extend(symbol, cjs.MovieClip);
    prototype.clone = mc_symbol_clone;
    prototype.nominalBounds = nominalBounds;
    prototype.frameBounds = frameBounds;
    return prototype;
  }


  (lib.PlatformGraphic = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{});

    // Layer 1
    this.instance = new lib.platform();
    this.instance.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = getMCSymbolPrototype(lib.PlatformGraphic, new cjs.Rectangle(0,0,120,12), null);


  (lib.ObstacleGraphic = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{});

    // Layer 1
    this.instance = new lib.obstacle1();
    this.instance.parent = this;

    this.instance_1 = new lib.obstacle2();
    this.instance_1.parent = this;

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0,0,19,10);


  (lib.HeroGraphic = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{run:0,jump:8});

    // timeline functions:
    this.frame_6 = function() {
      this.gotoAndPlay("run");
    }
    this.frame_9 = function() {
      this.gotoAndPlay("jump");
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).wait(6).call(this.frame_6).wait(3).call(this.frame_9).wait(1));

    // Layer 1
    this.instance = new lib.hero1();
    this.instance.parent = this;

    this.instance_1 = new lib.hero2();
    this.instance_1.parent = this;

    this.instance_2 = new lib.hero3();
    this.instance_2.parent = this;

    this.instance_3 = new lib.hero4();
    this.instance_3.parent = this;

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_3}]},2).wait(2));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0,0,10,14);


  (lib.CoinGraphic = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{});

    // Layer 1
    this.instance = new lib.coin1();
    this.instance.parent = this;

    this.instance_1 = new lib.coin2();
    this.instance_1.parent = this;

    this.instance_2 = new lib.coin3();
    this.instance_2.parent = this;

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_2},{t:this.instance_1}]},2).wait(2));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0,0,10,10);


  (lib.BackgroundGraphic = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{});

    // Layer 1
    this.instance = new lib.background();
    this.instance.parent = this;

    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#FFFFFF").ss(1,1,1).p("AlipSILFAAIAASlIrFAAg");
    this.shape.setTransform(743.5,192.6);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:743.5}},{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:738.5}},{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:733.5}},{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:728.5}},{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:723.5}},{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:718.5}},{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:713.5}},{t:this.instance}]},1).to({state:[{t:this.shape,p:{x:708.5}},{t:this.instance}]},1).wait(1));
    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:-5},0).wait(1).to({x:-10},0).wait(1).to({x:-15},0).wait(1).to({x:-20},0).wait(1).to({x:-25},0).wait(1).to({x:-30},0).wait(1).to({x:-35},0).wait(1).to({x:-40},0).wait(1).to({x:-45},0).wait(1).to({x:-50},0).wait(1).to({x:-55},0).wait(1).to({x:-60},0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0,0,600,320);


  // stage content:
  (lib.graphics = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{});

    // Layer 1
    this.instance = new lib.CoinGraphic();
    this.instance.parent = this;
    this.instance.setTransform(154,110.1,1,1,0,0,0,5,5);

    this.instance_1 = new lib.ObstacleGraphic();
    this.instance_1.parent = this;
    this.instance_1.setTransform(229,110.1,1,1,0,0,0,9.5,5);

    this.instance_2 = new lib.HeroGraphic();
    this.instance_2.parent = this;
    this.instance_2.setTransform(193,106.1,1,1,0,0,0,5,7);

    this.instance_3 = new lib.PlatformGraphic();
    this.instance_3.parent = this;
    this.instance_3.setTransform(190,122.1,1,1,0,0,0,60,6);

    this.instance_4 = new lib.BackgroundGraphic();
    this.instance_4.parent = this;
    this.instance_4.setTransform(300,160,1,1,0,0,0,300,160);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(240,160,600,320);
  // library properties:
  lib.properties = {
    id: 'D6A80680FDEBF842AA4AF7DCC3CE9540',
    width: 480,
    height: 320,
    fps: 24,
    color: "#FFFFFF",
    opacity: 1.00,
    webfonts: {},
    manifest: [
      {src:"images/rush_game_graphics_atlas_.png", id:"rush_game_graphics_atlas_"}
    ],
    preloads: []
  };



  // bootstrap callback support:

  (lib.Stage = function(canvas) {
    createjs.Stage.call(this, canvas);
  }).prototype = p = new createjs.Stage();

  p.setAutoPlay = function(autoPlay) {
    this.tickEnabled = autoPlay;
  }
  p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
  p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
  p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
  p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

  p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

  an.bootcompsLoaded = an.bootcompsLoaded || [];
  if(!an.bootstrapListeners) {
    an.bootstrapListeners=[];
  }

  an.bootstrapCallback=function(fnCallback) {
    an.bootstrapListeners.push(fnCallback);
    if(an.bootcompsLoaded.length > 0) {
      for(var i=0; i<an.bootcompsLoaded.length; ++i) {
        fnCallback(an.bootcompsLoaded[i]);
      }
    }
  };

  an.compositions = an.compositions || {};
  an.compositions['D6A80680FDEBF842AA4AF7DCC3CE9540'] = {
    getStage: function() { return exportRoot.getStage(); },
    getLibrary: function() { return lib; },
    getSpriteSheet: function() { return ss; },
    getImages: function() { return img; }
  };

  an.compositionLoaded = function(id) {
    an.bootcompsLoaded.push(id);
    for(var j=0; j<an.bootstrapListeners.length; j++) {
      an.bootstrapListeners[j](id);
    }
  }

  an.getComposition = function(id) {
    return an.compositions[id];
  }



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;
