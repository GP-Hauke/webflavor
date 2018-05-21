var stage;
var paddle;
var ball;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 30;
var queue = new createjs.LoadQueue();

function initGame() {
  console.log("let's try this again");

//  queue.on("progress", handleLoadProgress);
//  queue.on("fileload", handleFileLoad);
//  queue.on("complete", handleComplete);
//  queue.loadManifest([
//    {id: "bg", src: "../resources/components/game/assets/img/background.png"},
//    {id: "coin1", src: "../resources/components/game/assets/img/coin1.png"},
//    {id: "coin2", src: "../resources/components/game/assets/img/coin2.png"},
//    {id: "coin3", src: "../resources/components/game/assets/img/coin3.png"},
//    {id: "hero1", src: "../resources/components/game/assets/img/hero1.png"},
//    {id: "hero2", src: "../resources/components/game/assets/img/hero2.png"},
//    {id: "hero3", src: "../resources/components/game/assets/img/hero3.png"},
//    {id: "hero4", src: "../resources/components/game/assets/img/hero4.png"},
//    {id: "obs1", src: "../resources/components/game/assets/img/obstacle1.png"},
//    {id: "obs2", src: "../resources/components/game/assets/img/obstacle2.png"},
//    {id: "platform", src: "../resources/components/game/assets/img/platform.png"}
//  ]);

  stage = new createjs.Stage("gameCanvas");
  //  var circle = new createjs.Shape();
  //  circle.graphics.beginFill("Red").drawCircle(0,0,100);
  //  circle.x = 150;
  //  circle.y = 150;
  //  stage.addChild(circle);
  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener("tick", stage);
  //  createjs.Tween.get(circle, {loop:true}).to({alpha:0, x:400},3000, createjs.Ease.elasticIn);
  //
  //  loadSound();
  //
  //  circle.addEventListener("click", playSound);

  createBrickGrid();
  createBall();
  createPaddle();
}

function createBrickGrid() {
  for(var i = 0; i < 14; i++) {
    for(var j = 0; j < 5; j++) {
      createBrick(i*(BRICK_WIDTH + 10) + 40, j * (BRICK_HEIGHT + 5) + 20);
    }
  }
}

function createBrick(x,y) {
  var brick = new createjs.Shape();
  brick.graphics.beginFill("blue").drawRect(0,0,BRICK_WIDTH,BRICK_HEIGHT);
  stage.addChild(brick);

  brick.regX = BRICK_WIDTH/2;
  brick.regY = BRICK_HEIGHT/2;

  brick.x = x;
  brick.y = y;
}

function createBall() {
  var ball = new createjs.Shape();
  ball.graphics.beginFill("Red").drawCircle(0,0,8);
  ball.x = stage.canvas.width / 2;
  ball.y = stage.canvas.height / 2;
  stage.addChild(ball);
}

function createPaddle() {
  paddle = new createjs.Shape();
  paddle.graphics.beginFill("#000").drawRect(0,0,PADDLE_WIDTH,PADDLE_HEIGHT);
  paddle.x = stage.canvas.width / 2 - PADDLE_WIDTH / 2;
  paddle.y = stage.canvas.height * .9;
  stage.addChild(paddle);
}

function destroyBrick(brick) {
  createjs.Tween.get(brick,{}).to({scaleX:0,scaleY:0}, 500)
}

function handleLoadProgress(event) {
  console.log("progress: ", queue.progress*100, "%");
}

function handleFileLoad(event) {
  var image = queue.getResult(event.item.id);
  document.body.appendChild(image);
}

function handleComplete(event) {
  console.log("loading done");
}

function loadSound() {
  console.log("loading sound");
  createjs.Sound.registerSound("../resources/components/game/assets/audio/the-drybear.mp3","music");
}

function playSound() {
  console.log("playing sound");
  createjs.Sound.play("music");
}
