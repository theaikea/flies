let flyImage;
let backgroundImage;
let displayedImages = [];
const minScale = 0.08, maxScale = 0.45;
let soundFiles = [];
const maxFlies = 50;
let canvas;
let isMobile;
let isLoading = true;
let loadingStartTime;

function preload() {
  flyImage = loadImage('images/fly.png');
  backgroundImage = loadImage('images/background.jpg');
  soundFormats('mp3', 'wav');
  soundFiles = [
    loadSound('audio/flynoise1.mp3'),
    loadSound('audio/flynoise2.mp3'),
    loadSound('audio/flynoise3.mp3'),
    loadSound('audio/flynoise4.mp3'),
  ];
}

function setup() {
  canvas = createCanvas(1024, 1024); // Fixed canvas size
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  setInterval(addNewImage, 500);
  loadingStartTime = millis(); // Set the start time for the loading screen
  canvas.elt.addEventListener('touchstart', function(e) {
    e.preventDefault();
  }, { passive: false });
  canvas.elt.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
}

function draw() {
  // Fixed dimensions for the background and loading screen
  let bgWidth = 1024;
  let bgHeight = 1024;

  // Handle the loading screen for 2 seconds
  if (millis() - loadingStartTime < 2000) {
    // Draw black background for loading screen
    fill(0);
    rect(0, 0, bgWidth, bgHeight);

    // Loading text
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("klik på fluerne...", width / 2, height / 2);
    return;
  }

  // Draw the main scene
  image(backgroundImage, 0, 0, bgWidth, bgHeight);

  // Draw flies
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
      x: random(1024 - flyImage.width * maxScale),
      y: random(1024 - flyImage.height * maxScale),
      scale: random(minScale, maxScale),
      rotation: random(TWO_PI),
    });
  }
}

function handleInteraction(x, y) {
  if (!x || !y) return;
  for (let i = displayedImages.length - 1; i >= 0; i--) {
    let img = displayedImages[i];
    let imgWidth = flyImage.width * img.scale;
    let imgHeight = flyImage.height * img.scale;
    let dx = x - (img.x + imgWidth / 2);
    let dy = y - (img.y + imgHeight / 2);
    let distance = sqrt(dx * dx + dy * dy);
    let hitArea = isMobile ? imgWidth : imgWidth / 2;
    if (distance < hitArea) {
      displayedImages.splice(i, 1);
      let sound = soundFiles[floor(random(soundFiles.length))];
      if (sound && sound.isLoaded()) {
        sound.play();
      }
      return;
    }
  }
}

function mousePressed() {
  handleInteraction(mouseX, mouseY);
  return false;
}

function touchStarted() {
  if (touches.length > 0) {
    handleInteraction(touches[0].x, touches[0].y);
  }
  return false;
}
