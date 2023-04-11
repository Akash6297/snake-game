const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const canvasContainer = document.getElementById("canvas-container");

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 15;

let snake = [{ x: 10, y: 10 }];
let direction = "right";
let food = null;
let score = 0;
let intervalId = null;

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake() {
  snake.forEach((segment) => drawCell(segment.x, segment.y, "green"));
}

function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  let foodX = Math.floor(Math.random() * COLS);
  let foodY = Math.floor(Math.random() * ROWS);
  food = { x: foodX, y: foodY };
}

function drawFood() {
  drawCell(food.x, food.y, "red");
}

function handleKeydown(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
  }
}

function drawScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = `Score: ${score}`;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  clearCanvas();
  drawSnake();
  drawFood();
  moveSnake();
  drawScore();
  if (isGameOver()) {
    clearInterval(intervalId);
    alert(`Game over! Final score: ${score}`);
    startScreen.style.display = "block";
    canvasContainer.style.display = "none";
  }
}

function isGameOver() {
  const head = snake[0];
  const rest = snake.slice(1);
  return (
    head.x < 0 ||
    head.x >= COLS ||
    head.y < 0 ||
    head.y >= ROWS ||
    rest.some((segment) => segment.x === head.x && segment.y === head.y)
  );
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = "right";
  score = 0;
  generateFood();
  intervalId = setInterval(gameLoop, 100);
}

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  canvasContainer.style.display = "block";
  startGame();
});

document.addEventListener("keydown", handleKeydown);

gameLoop();