// canvas & context
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
// ball direction
let dx = 2;
let dy = -2;
// ball
let ballRadius = 10;
let randomColor = getHexDecRandomColor();
// paddle
let paddleHeight = 10;
let paddleWidth = 57;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
//score
let score = 0;

// bricks
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
// sounds
let impact= new Audio('./assets/impact.mp3');
let bounce = new Audio('./assets/bounce.mp3');
let bounce2 = new Audio('./assets/bounce2.mp3');

// keys eventListners 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function getHexDecRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = randomColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

// get the keys on keydown 
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}
// get the keys on keyup
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// handle the collision with the bricks
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          impact.play();
          randomColor = getHexDecRandomColor();
          if(score == brickRowCount*brickColumnCount) {
            setTimeout(() => {
              alert("C'est gagné, Bravo!"); 
            document.location.reload();
            clearInterval(interval);
            }, 1000);
          }
        }
      }
    }
  }
}

// clear the canvas on each iteration an re-draw elements
// handle collision
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  collisionDetection();
  drawScore();


  // change directon on right/left collision event and change the ball's color
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    randomColor = getHexDecRandomColor();
    bounce2.play();
  }

  // change direction on top/paddle collision and stop if loose
  if (y + dy < ballRadius) {
    dy = -dy;
    bounce2.play();
    randomColor = getHexDecRandomColor();
    // bounce.play();
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      bounce.play();
    }
    else {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  }
  // move paddle if key is pressed and block at the end of canvas
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}


let interval = setInterval(draw, 17);



