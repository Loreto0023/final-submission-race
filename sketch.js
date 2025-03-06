let cars = [];
let traffic = [];
let obstacles = [];
let difficulty = 1;
let lastObstacleTime = 0;
let track;
let gameOver = false;
let winner = null;
let roadOffset = 0;
let particles = [];
let gameStarted = false;
let countdown = 3;

function setup() {
 createCanvas (windowWidth, windowHeight);
  track = new Track();
  cars.push(new Car(2 * width / 3, height - 100, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, 'Rojo', color(255, 0, 0)));
  cars.push(new Car(width / 3, height - 100, 87, 65, 68, 'Azul', color(0, 0, 255))); // W, A, D
  startCountdown();
}

function startCountdown() {
  let interval = setInterval(() => {
    countdown--;
    if (countdown < 0) {
      gameStarted = true;
      clearInterval(interval);
    }
  }, 1000);
}

function draw() {
  background(50);
  
  if (!gameStarted) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Jugador Rojo: Flechas", width / 2, height / 2 - 40);
    text("Jugador Azul: W A D", width / 2, height / 2);
    textSize(48);
    text(countdown > 0 ? countdown : "¡GO!", width / 2, height / 2 + 80);
    return;
  }
  
  if (gameOver) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Gana el coche " + winner + "!", width / 2, height / 2);
    return;
  }
  
  roadOffset += 5;
  if (roadOffset > 40) roadOffset = 0;
  
  track.update();
  track.display();
  
  for (let car of cars) {
    car.update();
    car.display();
    
    for (let obs of obstacles) {
      if (car.collidesWith(obs)) {
        gameOver = true;
        winner = car.name === 'Rojo' ? 'Azul' : 'Rojo';
      }
    }
  }
  
  for (let t of traffic) {
    t.update();
    t.display();
  }
  
  for (let obs of obstacles) {
    obs.update();
    obs.display();
  }
  
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  if (millis() - lastObstacleTime > 3000 / difficulty) {
    obstacles.push(new Obstacle(random(120, width - 160), -20, color(random(255), random(255), random(255))));
    lastObstacleTime = millis();
  }
  
  fill(255);
  textSize(20);
  text("Dificultad: " + difficulty, 20, 30);
  
  if (frameCount % 300 === 0) difficulty++;
}

class Track {
  constructor() {}
  update() {}
  display() {
    stroke(255);
    strokeWeight(4);
    for (let y = roadOffset; y < height; y += 40) {
      line(width / 2, y, width / 2, y + 20);
    }
  }
}

class Car {
  constructor(x, y, upKey, leftKey, rightKey, name, color) {
    this.x = x;
    this.y = y;
    this.upKey = upKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.name = name;
    this.color = color;
    this.width = 50;
    this.height = 80;
  }
  
  update() {
    if (keyIsDown(this.leftKey) && this.x > 100) this.x -= 5;
    if (keyIsDown(this.rightKey) && this.x < width - 100) this.x += 5;
  }
  
  display() {
    fill(this.color);
    stroke(0);
    strokeWeight(2);
    rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 10);
    
    fill(0);
    rect(this.x - 15, this.y - 35, 10, 15);
    rect(this.x + 5, this.y - 35, 10, 15);
    rect(this.x - 15, this.y + 20, 10, 15);
    rect(this.x + 5, this.y + 20, 10, 15);
  }
  
  collidesWith(obstacle) {
    return (
      this.x - this.width / 2 < obstacle.x + obstacle.width &&
      this.x + this.width / 2 > obstacle.x &&
      this.y - this.height / 2 < obstacle.y + obstacle.height &&
      this.y + this.height / 2 > obstacle.y
    );
  }
}

class Obstacle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.color = color;
  }
  
  update() {
    this.y += 5;
    if (this.y > height) {
      let index = obstacles.indexOf(this);
      if (index > -1) obstacles.splice(index, 1);
    }
  }
  
  display() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }
}
