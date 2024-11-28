let flyImage;
let backgroundVideo; // Declare a variable for the background video

// Array til at holde styr på de aktuelt viste fluebilleder
let displayedImages = [];

const minScale = 0.01, maxScale = 0.4;

// Array til at gemme lydfiler
let soundFiles = [];

function preload() {
  flyImage = loadImage('images/fly.png');

  // Angiv lydfilformater
  soundFormats('mp3', 'wav');
  
  soundFiles = [
    loadSound('audio/flynoise1.mp3'),
    loadSound('audio/flynoise2.mp3'),
    loadSound('audio/flynoise3.mp3'),
    loadSound('audio/flynoise4.mp3'),
  ];
}

function setup() {
  createCanvas(1024,1024);

  // Load the background video
  backgroundVideo = createVideo('images/background.mp4', videoLoaded);
  backgroundVideo.hide(); // Hide the default video element

  // Sæt et interval til at tilføje nye fluebilleder
  setInterval(addNewImage, 1000);
}

function videoLoaded() {
  backgroundVideo.loop(); // Set the video to loop
  backgroundVideo.volume(0); // Mute the video
}

function draw() {
  // Draw the video as the background
  image(backgroundVideo, 0, 0, width, height);

  // Iterer gennem alle fluebillederne og tegn dem
  displayedImages.forEach(img => {
    // Beregn billedets aktuelle bredde og højde baseret på skala
    let imgWidth = flyImage.width * img.scale;
    let imgHeight = flyImage.height * img.scale;

    push();
    translate(img.x + imgWidth / 2, img.y + imgHeight / 2); // Flyt til billedets midte
    rotate(img.rotation); // Roter billedet
    imageMode(CENTER); // Centrer billedet omkring (0, 0)
    image(flyImage, 0, 0, imgWidth, imgHeight); // Tegn billedet
    pop();
  });
}

// Funktion til at tilføje et nyt fluebillede med tilfældige egenskaber
function addNewImage() {
  displayedImages.push({
    x: random(width - flyImage.width * maxScale), // Tilfældig x-position
    y: random(height - flyImage.height * maxScale), // Tilfældig y-position
    scale: random(minScale, maxScale), // Tilfældig skalering
    rotation: random(TWO_PI) // Tilfældig rotation (0 til 2π radianer)
  });
}

// Funktion til at håndtere brugerinteraktion (klik/touch)
function handleInteraction() {
  // Gå baglæns gennem listen for at kunne fjerne billeder
  for (let i = displayedImages.length - 1; i >= 0; i--) {
    let img = displayedImages[i];

    // Beregn billedets aktuelle bredde og højde
    let imgWidth = flyImage.width * img.scale;
    let imgHeight = flyImage.height * img.scale;

    // Beregn forskellen mellem musens position og billedets midte
    let dx = mouseX - (img.x + imgWidth / 2);
    let dy = mouseY - (img.y + imgHeight / 2);

    // Juster for billedets rotation
    let angle = atan2(dy, dx) - img.rotation;
    let xLocal = sqrt(dx * dx + dy * dy) * cos(angle);
    let yLocal = sqrt(dx * dx + dy * dy) * sin(angle);

    // Tjek om musens position er inden for billedets grænser
    if (abs(xLocal) < imgWidth / 2 && abs(yLocal) < imgHeight / 2) {
      // Fjern billedet fra listen
      displayedImages.splice(i, 1);

      // Afspil en tilfældig lyd
      soundFiles[floor(random(soundFiles.length))].play();

      break; // Stop loopet efter at have fjernet et billede
    }
  }
}

// Håndter museklik og kald interaktionsfunktionen
function mousePressed() {
  handleInteraction();
}

// Håndter touch-begivenheder og kald interaktionsfunktionen
function touchStarted() {
  handleInteraction();
}