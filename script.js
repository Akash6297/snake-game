document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const context = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const endScreen = document.getElementById('end-screen');
    const endScoreElement = document.getElementById('end-score');
    const restartButton = document.getElementById('restart-btn');

    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;

    let snake = [{x: 10, y: 10}];
    let apple = {x: 5, y: 5};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let isGameRunning = false;

    function drawSnake() {
        context.fillStyle = '#00FF00';
        snake.forEach(segment => {
            context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    function drawApple() {
        context.fillStyle = '#FF0000';
        context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        if (head.x === apple.x && head.y === apple.y) {
            score++;
            scoreElement.textContent = 'Score: ' + score;
            generateApple();
        } else {
            snake.pop();
        }
    }

    function generateApple() {
        apple = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };

        if (isAppleOnSnake()) {
            generateApple();
        }
    }

    function isAppleOnSnake() {
        return snake.some(segment => {
            return segment.x === apple.x && segment.y === apple.y;
        });
    }

    function checkCollision() {
        const head = snake[0];

        if (
            head.x < 0 ||
            head.x >= gridWidth ||
            head.y < 0 ||
            head.y >= gridHeight ||
            isSnakeColliding()
        ) {
            endGame();
        }
    }

    function isSnakeColliding() {
        const head = snake[0];
        return snake.slice(1).some(segment => {
            return segment.x === head.x && segment.y === head.y;
        });
    }

    function update() {
        if (!isGameRunning) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        drawSnake();
        drawApple();
        moveSnake();
        checkCollision();

        setTimeout(update, 100);
    }

    function startGame() {
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        scoreElement.textContent = 'Score: 0';
        generateApple();
        isGameRunning = true;
        endScreen.style.display = 'none';
        update();
    }

    function endGame() {
        isGameRunning = false;
        endScoreElement.textContent = 'Final Score: ' + score;
        endScreen.style.display = 'flex';
    }

    function handleKeyDown(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = event.keyCode;

        if (keyPressed === LEFT_KEY && dx !== 1) {
            dx = -1;
            dy = 0;
        }

        if (keyPressed === RIGHT_KEY && dx !== -1) {
            dx = 1;
            dy = 0;
        }

        if (keyPressed === UP_KEY && dy !== 1) {
            dx = 0;
            dy = -1;
        }

        if (keyPressed === DOWN_KEY && dy !== -1) {
            dx = 0;
            dy = 1;
        }
    }

    restartButton.addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyDown);
    document.getElementById('start-btn').addEventListener('click', startGame);
});
