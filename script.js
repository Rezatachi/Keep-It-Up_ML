// CSSI Day 13/14: CYOA, ML Final Project

//Members: Abraham, Daven, Emilio

/*
global createCanvas, background, image, createCapture, VIDEO, createButton, mouseX, mouseY, pmouseX, pmouseY
mouseIsPressed, strokeWeight, line, ml5, createDiv, nf, canvas, width, height, loadSound, createSlider, stroke, noFill, rect, clear, noStroke, text, random, loadImage, frameRate, fill, ellipse,collideRectCircle, createButton, filter, BLUR
*/

let video;
let detections = [];
let faceapi;
let canvas;
let soundtrack;
let slider;
let timer;
let score;
let hitSound;
let hit;
let img;
let ballX;
let ballY;
let hitCheck;
let winImg;

let winText;

//sound effects when the ball gets hit
function preload() {
  hitSound = loadSound(
    "https://cdn.glitch.com/5ec485fe-45d1-4dfd-af9b-d78076957ab8%2FSoccer%20Player%20Hits%20Ball%20with%20Head.mp3?v=1628001720920"
  );
  img = loadImage(
    "https://cdn.glitch.com/23bc149f-4671-42e2-b715-b7e2d38098e2%2Fball1.png?v=1628001700503"
  );
  winImg = loadImage(
    "https://cdn.glitch.com/22942813-df86-44d6-a89b-71ebff6b1be6%2F360_F_312815843_CdVm05kiBenU3YmChP1KRIzcblRgTQFV.jpg?v=1628170069097"
  );
}

function setup() {
  hit = false;
  frameRate(60);
  //   Store the canvas in a canvas variable
  canvas = createCanvas(600, 500);
  video = createCapture(VIDEO);
  //soundtrack testing.Shakira - Waka Waka (This Time for Africa) (The Official 2010 FIFA World Cup™ Song)
 // Have no legal rights for this soundtrack.
  soundtrack = loadSound(
    "https://cdn.glitch.com/5ec485fe-45d1-4dfd-af9b-d78076957ab8%2FWaka%20Waka%20(This%20Time%20for%20Africa)%20-%20Shakira%20(Lyrics).mp3?v=1627919350175",
    loaded
  );
  slider = createSlider(0, 1, 0.05, 0.1);
  slider.hide();
  ballX = random(50, 500);
  ballY = 0;
  hitCheck = "no";

  //   Give video dimension size
  video.size(width, height);
  //   Give ids to the canvas and video so we can edit them in styles.css
  canvas.id("canvas");
  video.id("video");
  //   Some options for the face-api to check before detecting the face
  const faceOptions = {
    withLandmarks: true,
    withFaceExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };
  timer = 8000; 

  score = 0;
  //   These function requires 3 arguements. First is the input, then config. the last on is callback. When the model is ready, the callback function is executed
  faceapi = ml5.faceApi(video, faceOptions, faceDisplay);
  winText = createButton(`Congrats! you had a score of ${score}`);
  winText.hide();
}

//soundtrack testing
function loaded() {
    soundtrack.play();
  
 //  //if (timer == 0) {
 //    soundtrack.stop();
 // // }
  //hitSound.play();
}

// Face-API detection code
function faceDisplay() {
  //   This function has a callback function aswell
  faceapi.detect(getResults);
}

// Display results in console
function getResults(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  console.log(result);
  detections = result;
  faceDisplay();
  clear();
  stroke("black");
  strokeWeight(1);
  text("Timer: ", 100, 100);
  text(timer, 140, 100);
  text("Score: ", 100, 130);
  text(score, 140, 130);
  drawBox(detections);
  timeHandler();
//   Sound logic
  if (timer == 0){
    soundtrack.stop()
  }
}

function drawBox(detections) {
  //   This box is mainly for the testing-phase. I iterate through the detections array and grab propserties out of the JSON to then create a rectangle that tracks the user's face.
  let Ball = {
    fallSpeed: 10
  };

  soundtrack.setVolume(slider.value());

  if (hitCheck == "no") {
    ballY += Ball.fallSpeed;
  } else if (hitCheck == "yes") {
    ballY -= Ball.fallSpeed;
    score + 1;
  }

  if (ballY > height) {
    ballY = 0;
    ballX = random(width);
  } else if (ballY < 0) {
    hitCheck = "no";
  }

  image(img, ballX, ballY, 40, 40);
  if (detections.length > 0) {
    let { _x, _y, _width, _height } = detections[0].alignedRect._box;
    // noStroke(); <--- this will be used after we finish making the rest of the game
    noFill();
    rect(_x - 50, _y - 75, _width + 50, _height + 50);
    let hit = collideRectCircle(
      _x - 50,
      _y - 75,
      _width + 50,
      _height + 50,
      ballX +20,
      ballY+20,
      40,
      40,
    );
    if (hit) {
      hitCheck = "yes";
      hitSound.play();
      console.log(ballY);
      console.log("true!");
    }
  }
}

function timeHandler() {
  if (timer > 0) {
    timer -= 30;
  } else {
    timer = 0;
    winText.show();
  }
}


