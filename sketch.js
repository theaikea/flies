let flyImage;
let backgroundVideo;
let displayedImages = [];
const minScale = 0.01, maxScale = 0.4;
let soundFiles = [];
const maxFlies = 50;
let canvas;

function preload() {
  flyImage = loadImage('images/fly.png');
  soundFormats('mp3', 'wav');
  soundFiles = [
    loadSound('audio/flynoise1.mp3'),
    loadSound('audio/flynoise2.mp3'),
    loadSound('audio/flynoise3.mp3'),
    loadSound('audio/flynoise4.mp3'),
  ];
}

function setup() {
  canvas = createCanvas(1024, 1024);
  backgroundVideo = createVideo('images/background.mp4', videoLoaded);
  backgroundVideo.hide();
  setInterval(addNewImage, 2000);
  
  canvas.elt.addEventListener('touchstart', function(e) {
    e.preventDefault();
  }, false);
}

function videoLoaded() {
  backgroundVideo.size(320, 240);
  backgroundVideo.loop();
  backgroundVideo.volume(0);
  backgroundVideo.attribute('playsinline', '');
  backgroundVideo.play();
}

function draw() {
  if (backgroundVideo.loadedmetadata) {
    image(backgroundVideo, 0, 0, width, height);
  }
  
  displayedImages.forEach(img => {
    let imgWidth = flyImage.width * img.scale;
    let imgHeight = flyImage.height * img.scale;
    push();
    translate(img.x + imgWidth / 2, img.y + imgHeight / 2);
    rotate(img.rotation);
    imageMode(CENTER);
    image(flyImage, 0, 0, imgWidth, imgHeight);
    pop();
  });
}

function addNewImage() {
  if (displayedImages.length < maxFlies) {
    displayedImages.push({
      x: random(width - flyImage.width * maxScale),
      y: random(height - flyImage.height * maxScale),
      scale: random(minScale, maxScale),
      rotation: random(TWO_PI),
    });
  }
}

function handleInteraction() {
  for (let i = displayedImages.length - 1; i >= 0; i--) {
    let img = displayedImages[i];
    let imgWidth = flyImage.width * img.scale;
    let imgHeight = flyImage.height * img.scale;
    let dx = mouseX - (img.x + imgWidth / 2);
    let dy = mouseY - (img.y + imgHeight / 2);
    let angle = atan2(dy, dx) - img.rotation;
    let xLocal = sqrt(dx * dx + dy * dy) * cos(angle);
    let yLocal = sqrt(dx * dx + dy * dy) * sin(angle);
    if (abs(xLocal) < imgWidth / 2 && abs(yLocal) < imgHeight / 2) {
      displayedImages.splice(i, 1);
      soundFiles[floor(random(soundFiles.length))].play();
      break;
    }
  }
}

function mousePressed() {
  handleInteraction();
  return false;
}

function touchStarted() {
  let touch = touches[0];
  mouseX = touch.x;
  mouseY = touch.y;
  handleInteraction();
  return false;
}