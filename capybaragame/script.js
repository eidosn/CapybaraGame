let capybara;
let obstacles = [];
let score = 0;
let isJumping = false;
let jumpHeight = 22;
let gravity = 1;
let jumpVelocity = 0;
let groundY; 
let spawnTimer = 0;
let spawnInterval;
let capybaraimg, candyimg, skyimg;
let restart;



function preload() {
  capybaraimg = loadImage('img/Capybara.png');
  appleimg = loadImage('img/obstacle.png'); 
  skyimg = loadImage('img/sky.jpg');
  // jumpsound = loadSound('sound/jump.mp3');
  // byebyesound = loadSound('sound/byebye.mp3');
}

function setup() {
  createCanvas(800, 400);
  groundY = height - 50; // Set the ground level
  capybara = new Capybara(capybaraimg, 200, groundY - 90, 100, 100); 
  spawnInterval = random(40, 120);

  restart = createButton("Restart");
  restart.mousePressed(restartGame); // Pass the function itself, no quotes
  restart.position(385, 250);
  restart.style('background-color', 'gray');
  restart.hide(); // Initially hide the button
}

function draw() {
  image(skyimg, 0, 0, width, height);

  restart.hide();
  
  // Draw the ground
  fill(90, 155, 100); 
  rect(0, groundY, width, height - groundY); 

  // Update and display the capybara
  capybara.update();
  capybara.display();
  
  spawnTimer++;
  
  // Handle obstacles
  if (spawnTimer >= spawnInterval) {
    obstacles.push(new Obstacle(appleimg)); 
    spawnTimer = 0; 
    spawnInterval = random(40, 120); 
  }
  
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();
    
    // Check for collision
    if (obstacles[i].hits(capybara)) {
      noLoop(); // Stop the game on collision
      textSize(32);
      fill(255, 0, 0);
      text('Game Over', width / 2 - 80, height / 2);
      // byebyesound.play();
      restart.show(); // Show the restart button
    }
    
    // Remove obstacles that are off-screen
    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
      score++; 
    }
  }
  
  // Display score
  textSize(20);
  fill(0);
  text('Score: ' + score, 10, 30);
}

function keyPressed() {
  if (key === ' ' && !isJumping) { 
    isJumping = true;
    jumpVelocity = -jumpHeight;
    // jumpsound.play();
  }
}

// Define the restart function outside of the Obstacle class
function restartGame() {
  // Reset game state variables
  score = 0;
  obstacles = [];
  isJumping = false;
  jumpVelocity = 0;
  spawnTimer = 0;
  spawnInterval = random(40, 120);

  // Hide the restart button again
  restart.hide();

  // Restart the game loop
  loop();
}

class Capybara {
  constructor(img, x, y, width, height) {
    this.image = img; 
    this.x = 30;
    this.y = y - 5;
    this.width = width;
    this.height = height;
    this.hitboxWidth = 30;  // Adjust as needed
    this.hitboxHeight = 90;
  }
  
  update() {
    // Simple gravity
    if (isJumping) {
      this.y += jumpVelocity; 
      jumpVelocity += gravity; 
      
      // Stop jumping when reaching the ground
      if (this.y >= groundY - this.height + 5) { 
        this.y = groundY - this.height + 5; 
        isJumping = false; 
      }
    }
  }
  
  display() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor(img) {
    this.image = img; 
    this.x = width;
    this.y = groundY - 60; 
    this.width = 70; 
    this.height = 65; 
    this.hitboxWidth = 20;
    this.hitboxHeight = 50;
  }
  
  update() {
    this.x -= 5; 
  }
  
  display() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
  
  offscreen() {
    return this.x < -this.width;
  }
  
  hits(capy) {
    return (capy.x < this.x + (this.width - this.hitboxWidth) / 2 + this.hitboxWidth &&
            capy.x + capy.width > this.x + (this.width - this.hitboxWidth) / 2 &&
            capy.y < this.y + (this.height - this.hitboxHeight) / 2 + this.hitboxHeight &&
            capy.y + capy.height > this.y + (this.height - this.hitboxHeight) / 2);
  }
}
