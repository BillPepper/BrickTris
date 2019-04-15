const resolution = {width: 400, height: 400}
const barSize = {width: 50, height: 10, padding: 5}

let bars = [
  {x: 5, y: 5, width: 50, height: 10, active: true},
  {x: 60, y: 15, width: 50, height: 10, active: false},
  {x: 115, y: 5, width: 50, height: 10, active: true},
  {x: 170, y: 15, width: 50, height: 10, active: true},
  {x: 225, y: 5, width: 50, height: 10, active: true},
  {x: 280, y: 15, width: 50, height: 10, active: true},
  {x: 335, y: 5, width: 50, height: 10, active: true}
]
let bar = {x: 100, y: 345, width: 50, height: 10}
let ball = {x: bar.x + bar.width / 2, y: 345 - 6, speed: 4, speedX: 0, speedY: 0, size: 10}

let settings = {
  bottomBounce: false,
  barFrozen: false,
  barsFrozen: false,
  debug: true
}

let gameState = {
  started: false,
  won: false,
  lost: false,
  paused: false
}

function setup() {
  createCanvas(resolution.width, resolution.height);
  frameRate(60)
}

function draw() {
  background(60);
  
  updateDebug()
  updateBars()
  updateBar()
  updateBall()
  updateCollisions()
  updateGameState()
  updateGfx()
}

function updateBall(){
  if (!gameState.started && !settings.barFrozen){
    ellipse(mouseX, 345 - ball.size / 2, ball.size, ball.size)
  } else {
    ellipse(ball.x, ball.y, ball.size, ball.size)
    
    if (ball.y < ball.size / 2){
      ball.speedY = ball.speedY * -1
    }
    
    // dont forget to freeze all entities when game is over
    if (checkCollision(ball, bar)){
      ball.speedY = ball.speedY * -1
      const ballHitPos = ball.x - bar.x
      
      if (ballHitPos > 25){
        ball.speedX = 1.5
      }
      
      if (ballHitPos < 25){
        ball.speedX = -1.5
      }
    }
    
    if (settings.bottomBounce){
      if (ball.y > resolution.height - ball.size / 2){
        ball.speedY = ball.speedY * -1
      } 
    }
    
    if (ball.x < ball.size / 2 || ball.x > resolution.width - ball.size / 2){
      ball.speedX = ball.speedX * -1
    }
    
    ball.y += ball.speedY
    ball.x += ball.speedX
  }
}

function updateBar(){
  if (!settings.barFrozen){
    bar.x = mouseX - 25
  }
  rect(bar.x, bar.y, bar.width, bar.height)
}

function updateBars(){
  for (let i = 0; i < bars.length; i++){
    if (bars[i].active) {
      rect(bars[i].x, bars[i].y, bars[i].width, bars[i].height)
    }
  }
}

function updateGameState(){
  if (ball.y > resolution.height + ball.size){
    gameState.lost = true
  }
}

function updateGfx(){
  if (gameState.lost) {
    text('Game Over', resolution.width / 2 -50, resolution.height / 2)
  }
}

function updateCollisions(){
  for (let i = 0; i < bars.length;i++){
    if (bars[i].active){
      if (checkCollision(ball, bars[i])){
        ball.speedY = ball.speedY * -1
        if (!settings.barsFrozen){
          bars[i].active = false
        }
      }
    }
  }
}

function checkCollision(objOne, objTwo){
  if ((objOne.x >= objTwo.x - ball.size / 2 && objOne.x <= objTwo.x + objTwo.width + ball.size / 2) && 
      (objOne.y >= objTwo.y - ball.size / 2 && objOne.y <= objTwo.y + objTwo.height + ball.size / 2)){
    
    
    console.log('smack!')
    
    return true
  }
}

function restartGame(){
  gameState.started = false
  gameState.lost = false
}



function renderDebug(){
  text('speedX: ' + ball.speedX, 5, 50)
  text('speedY: ' + ball.speedY, 5, 60)
  text('ball.x: ' + ball.x, 5, 70)
  text('ball.y: ' + ball.y, 5, 80)
  text('bar.x: ' + bar.x, 5, 90)
  text('bar.y: ' + bar.y, 5, 100)
  text('state.started: ' + gameState.started, 5, 120)
  text('state.lost: ' + gameState.lost, 5, 130)
}

function updateDebug(){
  if (settings.debug){
    renderDebug()
  }
  
  if (keyIsDown(ENTER)) {
    ball.speedX = 0
    ball.speedY = 0
  }
  if (keyIsDown(DOWN_ARROW)) {
    ball.y += 1
  }
  if (keyIsDown(UP_ARROW)) {
    ball.y -= 1
  }
  if (keyIsDown(LEFT_ARROW)) {
    ball.x -= 1
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ball.x += 1
  }
}

function mouseReleased() {
  if (!gameState.started){
    ball.x = mouseX
    ball.speedY = ball.speed * -1
  }
  
  gameState.started = true
  
}


