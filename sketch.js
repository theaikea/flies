let flyImage;
let backgroundVideo;
let displayedImages = [];
const minScale = 0.01, maxScale = 0.4;
let soundFiles = [];
const maxFlies = 50;
let canvas;
let isMobile;

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
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  canvas = createCanvas(windowWidth, windowHeight);
  
  backgroundVideo = createVideo(['images/background.mp4'], videoLoaded);
  backgroundVideo.hide();
  
  document.addEventListener('touchstart', function() {
    if (backgroundVideo) backgroundVideo.play();
  });
  
  setInterval(addNewImage, 2000);
  
  canvas.elt.addEventListener('touchstart', function(e) {
    e.preventDefault();
  }, { passive: false });
  
  canvas.elt.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
}

function videoLoaded() {
  backgroundVideo.size(width, height);
  backgroundVideo.loop();
  backgroundVideo.volume(0);
  backgroundVideo.attribute('playsinline', '');
  backgroundVideo.attribute('webkit-playsinline', '');
  backgroundVideo.play().catch(function(error) {
    console.log("Video play failed:", error);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (backgroundVideo) {
    backgroundVideo.size(width, height);
  }
}

function draw() {
  if (backgroundVideo && backgroundVideo.loadedmetadata) {
    image(backgroundVideo, 0, 0, width, height);
  } else {
    background(220);
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